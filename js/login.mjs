import {} from '/js/api.mjs'
import {
    img,
    div,
    inputCont,
    button,
    h3,
    h1,
    a,
    p,
    span,
    br,
    Result
} from '/js/ferramentas.mjs'

const USER_URI = '/html/user.html'
const EMAIL_RE = /^[\w\d_"]+(([".+-\s][\w\d_"\s]+)+)?@([\w\d[][\w\d-_[\]<>()]*\.[\w\d-_[\]<>()]+)+$/

class User {
    email;
    passsword;
    constructor(email = '', senha = '') {
        this.email = email
        this.password = senha
    }
    setEmail = email => { this.email = email }
    setPassword = pass => { this.password = pass }
    getEmail = () => this.email

    _cmpPass = pw => Result.fromBool(this.password === pw, this, { senha: 'Incorrect Password' })
    cmpPass = user => user._cmpPass(this.password)

    isEmailValid = () =>
        Result.fromBool(this.email.search(EMAIL_RE) != -1, this, { email: `${this.email} is not a valid Email.` })

    isSenhaValid = () =>
        Result.fromBool(this.password.length >= 8, this, { senha: 'Password is too short' })
        .and_thenB(this.password.length <= 64, this, { senha: 'Password is too long' })

    show = () => console.log(`Email: ${this.email} | Senha: ${this.password}`)
    copy = () => new User(this.email, this.password)
}
const getEmail = u => u.getEmail()


class LoginView {
    root;
    divTexto
    container;
    form;
    logo;
    errors;
    dyn;
    auxiliar;
    constructor() {
        this.root = document.querySelector('#root')
        this.container = document.querySelector('#container1')
        this.initialize();
    }
    initialize() {
        this.root.getElement('#show-login')
            .addEventListener('click', this.showLogin)
        this.root.getElement('#show-signup')
            .addEventListener('click', this.showSignup)

        this.divTexto = div().class("main-text").add(
            h1("MarmiCraft", {
                id: 'headline'
            }),
            h3("Sua marmita do seu jeito!", {
                id: 'subheadline'
            })
        )

        this.container.add(this.divTexto)
        console.log(this.slogan)
        this.logo = img({
            id: 'logo'
        })
        this.container.add(this.logo)
        this.container.getElement("#logo").src = "../resources/marmita.png";




        this.form = div().class('loginform')
            .add(
                //button('Fechar', { id: 'closeform' }).onclick_(this.hideBoth),
                a('', { id: 'closeform' }).onclick_(this.hideBoth),
                h3('Faça seu Login'),
                inputCont('Email', 'email'),
                a('', { id: 'emailerr' }).hide(),
                inputCont('Senha', 'password'),
                a('', { id: 'senhaerr' }).hide(),
                br(),
                button('Cadastrar-se', { id: 'submitsignup' }).hide(),
                button('Entrar', { id: 'submitlogin' }).hide(),
            ).hide();


        this.container.add(this.form)

        this.container.getElement('#senha').maxlength = 64;
        this.container.getElement('#email').placeholder = 'email';
        this.container.getElement('#senha').placeholder = 'senha';

        //criar o botão closeform
        close = this.container.getElement('#closeform')
        let p = document.createElement("i")
        p.classList.add("fas")
        p.classList.add("fa-times")
        close.append(p)

        this.dyn = {
            email: this.container.getElement('#email'),
            senha: this.container.getElement('#senha'),
            submitLogin: this.container.getElement('#submitlogin'),
            submitSignup: this.container.getElement('#submitsignup'),
            closeform: this.container.getElement('#closeform'),
            emailErr: this.container.getElement('#emailerr'),
            senhaErr: this.container.getElement('#senhaerr')
        }
        this.dyn.email.addEventListener('focus', () => this.dyn.emailErr.text_(''))
        this.dyn.senha.addEventListener('focus', () => this.dyn.senhaErr.text_(''))
    }

    showLogin = () => {
        this.form.rmClass('signupform').class('loginform').show()
        this.dyn.submitSignup.hide()
        this.dyn.submitLogin.show()
    }
    showSignup = () => {
        this.form.rmClass('loginform').class('signupform').show()
        this.dyn.submitLogin.hide()
        this.dyn.submitSignup.show()
    }
    hideBoth = () => this.form.hide()

    bindEmailChange = handle => {
        this.dyn.email.addEventListener('input', e => handle(e.target.value))
        this.dyn.email.addEventListener('focus', e => handle(e.target.value))
        this.dyn.email.addEventListener('change', e => handle(e.target.value))
        return this
    }

    bindPasswordChange = handle => {
        this.dyn.senha.addEventListener('input', e => handle(e.target.value))
        return this
    }

    bindSubmitLogin = handle => {
        this.dyn.submitLogin.addEventListener('click', handle)
        return this
    }
    bindSubmitSignup = handle => {
        this.dyn.submitSignup.addEventListener('click', handle)
        return this
    }
    handleErrors = ({ email = '', senha = '' }) => {
        this.dyn.emailErr.text_(email)
        this.dyn.senhaErr.text_(senha)
        return this
    }
}

class Controller {
    goto = url => window.location.href = url
}

class LoginController extends Controller {
    view;
    user;
    constructor() {
        super();
        this.view = new LoginView()
        this.user = new User()
        this.view
            .bindEmailChange(this.handle.emailChange)
            .bindPasswordChange(this.handle.passwordChange)
            .bindSubmitLogin(this.handle.submitLogin)
            .bindSubmitSignup(this.handle.submitSignup)
    }

    handle = {
        emailChange: email => this.user.setEmail(email),
        passwordChange: password => this.user.setPassword(password),
        submitLogin: () =>
            this.user.isEmailValid()
            .and_thenM(u => u.isSenhaValid())
            .and_thenM(u => DDB.getUser(u)) // Container passa a ter o usuario do BD
            .and_thenM(dbuser => dbuser.cmpPass(this.user))
            .onErr(this.view.handleErrors)
            .onOk(this.doLogin),
        // TODO : Implementar um traverse
        submitSignup: () =>
            this.user.isEmailValid()
            .and_thenM(u => u.isSenhaValid())
            .and_thenM(DDB.addUser)
            .onErr(this.view.handleErrors)
            .onOk(this.doLogin),
    }
    doLogin = user => this.goto(USER_URI)
}

class DDB {
    static Users = [
        new User('will@host.com', '12345678'),
        new User('joao@host.com', '87654321')
    ]
    static getUser = user =>
        Result.fromNullable(DDB.Users.find(u => u.getEmail() === user.getEmail()), { email: 'Email not registered' })

    static addUser = user =>
        Result.fromBool(!DDB.Users.some(u => u.getEmail() === user.getEmail()),
            'User successfully added.', { email: 'Email já cadastrado' })
        .onOk(() => DDB.Users.push(user.copy()))
}

let main = new LoginController()