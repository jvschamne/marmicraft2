import {} from '/Marmicraft/api.mjs'
import 
{   form, 
    div,
    inputCont, 
    button,
    h3
} from '/Marmicraft/ferramentas.mjs'

class User {
    #email; #password;
    constructor() {
        this.#email= ''
        this.#password = ''
    }
    setEmail = email => {this.#email = email}
    setPassword = pass => {this.#password = pass}
}

class UserUpdate {
    constructor(onChangeEmail, onChangeSenha, onSubmitSignin, onSubmitSignup ) {
        this.onChangeEmail = onChangeEmail
        this.onChangeSenha = onChangeSenha
        this.onSubmitSignin = onSubmitSignin
        this.onSubmitSignup = onSubmitSignup 
    }
}

class LoginView {
    #root; #signupForm; #signinForm;
    constructor() {
        this.#root = document.querySelector('#root')

        this.#root.getElement('#show-login')
                    .addEventListener('click', this.showLogin)
        this.#root.getElement('#show-signup')
                    .addEventListener('click', this.showSignup)

        this.#signupForm = div()
                            .add(
                                h3('Entrar'),
                                inputCont('Email', 'text', 'emailsignup'),
                                inputCont('Senha', 'password', 'senhasignup'),
                                button('Cadastrar-se', { id : 'submitsignup'})
                            ).hide()
        this.#signinForm = div()
                            .add(
                                h3('Cadastrar-se'),
                                inputCont('Email', 'email', 'emaillogin'),
                                inputCont('Senha', 'password', 'senhalogin'),
                                button('Entrar', { id : 'submitlogin'})
                            ).hide()
        this.#root.add(
            this.#signinForm,
            this.#signupForm
        )
    }
    showLogin = () => {
        this.#signupForm.hide()
        this.#signinForm.show()
    }
    showSignup = () => {
        this.#signinForm.hide()
        this.#signupForm.show()
    }
    hideBoth = () => {
        this.#signupForm.hide()
        this.#signinForm.hide()
    }

    // TODO: Separar o que vai fazer, de como vai fazer em um padrão para que
    //       insira todos os eventos uniformemente
    bindFormActions = userupdate => {
        let handleInput = f => e => f(e.target.value)
        let h_email = handleInput(userupdate.onChangeEmail)
        let h_senha = handleInput(userupdate.onChangeSenha)
        let h_signup = handleInput(userupdate.onSubmitSignup)
        let h_signin = handleInput(userupdate.onSubmitSignin)

        this.#root.getElement('#emaillogin').addEventListener('input', h_email)
        this.#root.getElement('#emailsignup').addEventListener('input', h_email)

        this.#root.getElement('#senhalogin').addEventListener('input', h_senha)
        this.#root.getElement('#senhasignup').addEventListener('input', h_senha)
        
        this.#root.getElement('#submitlogin').addEventListener('click', h_signin)
        this.#root.getElement('#submitsignup').addEventListener('click', h_signup)
    }

}

class LoginController {
    #view; #user;
    constructor() {
        this.#view = new LoginView()
        this.#user = new User()
        
        let formsHandlers = 
            new UserUpdate( this.handleEmailChange,
                            this.handlePasswordInput,
                            this.handleSubmitLogin,
                            this.handleSubmitSignup)
        this.#view.bindFormActions(formsHandlers)
    }
    handleEmailChange = str => {
        if (str.match(/^[\w\d_"]+(([".+-\s][\w\d_"\s]+)+)?@([\w\d[][\w\d-_[\]<>()]*\.[\w\d-_[\]<>()]+)+$/)) {
            this.#user.setEmail(str)
            return new Ok()
        }
        else {
            return new Err('Invalid email.')
        }
    }
    handlePasswordInput = () => pw => this.#user.setPassword(pw)
    handleSubmitLogin = () => [console.log('Login'), console.log(this.#user)]
    handleSubmitSignup = () => console.log('Signup')
}


const Check = function() {
    this.map;
}
const Ok = function() {
    Check.call()
    this.__type = 'Ok'
    this.map = f => this
}
const Err = function(err) {
    Check.call()
    this.err = err
    this.__type = 'Err'
    this.map = f => {this.err = f(this.err); return this}
}


// :: TODO ~
//   Separar o que vai fazer, de como vai fazer em um padrão para que
// insira todos os eventos uniformemente

// Handler : String -> Char -> Result<
// Handler texto c 

let main = new LoginController()
// export {
//     User,
//     UserUpdate,
//     LoginController,
//     LoginView
// }