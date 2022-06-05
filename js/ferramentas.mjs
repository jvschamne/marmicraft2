export const el = (tipo, attr = {}) => {
    let el = document.createElement(tipo, attr)
    Object.keys(attr).forEach(key => el[key] = attr[key])
    return el
}
export const a_button = (text = '', attr = {}) => el('a', {...attr, innerText: text })
export const text_i = (attr = {}) => input({...attr, type: 'text' })
export const br = () => el('br')
export const date_i = (attr = {}) => input({...attr, type: 'date' })
export const input = (attr = {}) => el('input', attr)
export const img = (attr = {}) => el('img', attr)
export const a = (text = '', attr = {}) => el('a', {...attr, innerText: text })
export const p = (text = '', attr = {}) => el('p', {...attr, innerText: text })
export const label = (text, attr = {}) => el('label', attr).text_(text)
export const div = (attr = {}) => el('div')
export const button = (text, attr = {}) => el('button', attr).text_(text)
export const h3 = (text, attr = {}) => el('h3', attr).text_(text)
export const h1 = (text, attr = {}) => el('h1', attr).text_(text)
export const symbol = (classes, attr = {}) => el('i', attr).class(classes)
export const span = (text, attr = {}) => el('span', attr).text_(text)
export const form = (attr = {}) => el('form', attr)


export const inputCont =
    (nome, tipo = 'text', id = '') =>
    pipe(
        id ? id : nome.toLocaleLowerCase(),
        id => div().add(input({ type: tipo, id: id }), span('', { id: 'input-border' })).class("campo")
    )



export const filterDo = (predicate, onTrue, onFalse, arr) =>
    arr.forEach(x => predicate(x) ? onTrue(x) : onFalse(x))

export const donothing = () => {}

export const getEl = query => document.querySelector(query)

export const pipe = (x, ...fns) => fns.reduce((y, f) => f(y), x)
export const runAll = (...fns) => fns.forEach(f => f())



export class Option {
    static fromBool = (x, def = true) => x ? new Some(def) : new None();
    static fromNullable = x => x == undefined ? new None() : new Some(x);
}
export class Some extends Option {
    val;
    constructor(val) {
        super()
        this.val = val
    }
    unwrap = () => this.val
    and_thenM = f => f(this.val)
    or_else = () => this
    or_elseM = () => this
    and = opt => opt
    or = opt => this
    xor = opt => opt.reverse(this.val)
    reverse = () => new None()
    map = f => { this.val = f(this.val); return this }
}
export class None extends Option {
    unwrap = () => { throw "Error, unwrapping a Option::None" };
    and_thenM = () => this
    or_else = f => new Some(f())
    or_elseM = f => f()
    and = opt => this
    or = opt => opt
    xor = opt => opt
    reverse = v => new Some(v)
    map = () => this
}

/** Result */
export class Result {
    static fromBool = (x, ontrue = true, onfalse = false) => x === true ? new Ok(ontrue) : new Err(onfalse);
    static fromNullable = (x, onnull) => x == undefined ? new Err(onnull) : new Ok(x)
}
export class Ok extends Result {
    val;
    constructor(val) {
        super()
        this.val = val
    }
    unwrap = () => this.val
    and_thenB = (x, ontrue, onfalse) => {
        if (x) {
            this.val = ontrue
            return this
        } else
            return new Err(onfalse)
    }
    and_then = f => {
        this.val = f(this.val);
        this
    }
    and_thenM = f => f(this.val)
    or_else = () => this
    or_elseM = () => this

    and = opt => opt
    or = opt => this
    xor = opt => opt.reverse(this.val)
    reverse = () => new None()

    mapErr = () => this
    mapOk = f => { this.val = f(this.val); return this }

    onErr = () => this
    onOk = f => { f(this.val); return this }
    anyway = f => { f(this.val); return this }
}
export class Err extends Result {
    err;
    constructor(e) {
        super()
        this.err = e
    }
    unwrap = () => { throw "Error, unwrapping a Result::Err" };
    and_thenB = (x, ontrue, onfalse) => this
    and_then = () => this
    and_thenM = () => this
    or_else = f => new Ok(f())
    or_elseM = f => f()

    and = opt => this
    or = opt => opt
    xor = opt => opt
    reverse = v => new Some(v)

    mapErr = f => { this.err = f(this.err); return this }
    mapOk = () => this

    onErr = f => { f(this.err); return this }
    onOk = () => this
    anyway = f => { f(this.err); return this }
}


export class Check {
    static fromBool = (x, def = false) => x ? new Alright() : new Problem(def);
}
export class Problem extends Check {
    err;
    constructor(err) {
        super()
        this.err = err
    }
    and_thenB = (f, def) => this
    and_thenM = () => this
    and_then = () => this
    or_elseB = (f, def = false) => {
        if (f()) return new Alright();
        else {
            this.err = def;
            return this
        }
    }
    or_elseM = f => f(this.err)

    and = opt => this
    or = opt => opt
    xor = opt => opt
    reverse = () => new Alright()
    mapErr = f => { this.err = f(this.err); return this }
    onErr = f => { f(this.err); return this }
    onOk = () => this

    toResult = ifok => new Err(this.err)
    toOption = ifsome => new None()
    toOptionM = () => new None()
}
export class Alright extends Check {
    and_thenB = (f, def = false) => { f() ? this : new Problem(def) }
    and_thenM = f => f()
    and_then = f => { f(); return this }
    or_elseB = () => this
    or_elseM = () => this

    and = opt => opt
    or = opt => this
    xor = opt => opt.reverse()
    reverse = e => new Problem(e)

    mapErr = () => this
    onErr = () => this
    onOk = f => { f(); return this }

    toResult = ifok => new Ok(ifok)
    toOption = ifsome => new Some(ifsome)
    toOptionM = f => f()
}