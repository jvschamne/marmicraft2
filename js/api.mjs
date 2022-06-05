HTMLElement.prototype.class = function(classes) {
    for (let c of classes.split(' '))
        this.classList.add(c)
    return this;
}
HTMLElement.prototype.rmClass = function(classes) {
    for (let c of classes.split(' '))
        this.classList.remove(c)
    return this;
}
HTMLElement.prototype.toggleClasses = function(classes) {
    for (let c of classes.split(' '))
        this.classList.toggle(c)
    return this;
}
HTMLElement.prototype.add = function(...els) {
    els.forEach(el => this.appendChild(el));
    return this
}
HTMLElement.prototype.addAtts = function(...attributes) {
    Object.keys(attributes).forEach(k => this[k] = attributes[k])
    return this
}
HTMLElement.prototype.text_ = function(text) {
    this.innerText = text;
    return this;
}
HTMLLabelElement.prototype.for_ = function(for__) {
    this.for = for__;
    return this;
}
HTMLElement.prototype.id_ = function(id) {
    this.id = id;
    return this;
}
HTMLAnchorElement.prototype.hide = function() {
    this.innerText_ = this.innerText
    this.innerText = ''
    return this
}
HTMLAnchorElement.prototype.show = function() {
    this.innerText = this.innerText_ || this.innerText
    return this
}
HTMLElement.prototype.onclick_ = function(action) {
    this.addEventListener('click', action);
    return this;
}
HTMLElement.prototype.run = function() {
    if (this.els) {
        this.els.forEach(x => x.run())
        this.add(...Object.values(this.els))
    }
}
HTMLElement.prototype.clear = function() {
    for (let c of this.children)
        c.remove()
    return this;
}
HTMLElement.prototype.hide = function() {
    this.class('hidden')
    return this
}
HTMLElement.prototype.show = function() {
    this.rmClass('hidden')
    return this
}
HTMLElement.prototype.getElement = function(selector) {
    return this.querySelector(selector)
}
HTMLElement.prototype.getElements = function(selector) {
    return this.querySelectorAll(selector)
}


Object.prototype.forEach = function(fn) {
        Object.values(this).forEach(fn)
    }
    // {k : v}.map : (v -> t) -> { k : t }
Object.prototype.map = function(fn) {
        return Object
            .keys(this)
            .reduce((step, k) => {
                step[k] = fn(this[k])
                return step
            }, {})
    }
    // {k : v}.mapVal : (v -> t) -> [t]
Object.prototype.mapVal = function(fn) {
        return Object.values(this).map(fn)
    }
    // {k : v}.mapKey : (k -> t) -> [t]
Object.prototype.mapKey = function(fn) {
        return Object.keys(this).map(fn)
    }
    // {k : v}.mapPair : ((k, v) -> t) -> [t]
Object.prototype.mapPair = function(fn) {
    return Object.keys(this).map(k => fn(k, this[k]));
}