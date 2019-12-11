if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }
            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);
                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        enumerable: false,
        value: function (obj, start = -1) {
            var newArr = this.filter(function (el, index) {
                return el == obj && index > start;
            });
            return newArr.length > 0;
        }
    });
}
if (!Array.prototype.fill)
    Object.defineProperty(Array.prototype, 'fill', {
        value: function (value) {
            let res = [];
            for (let i = 0; i < this.value; i++) {
                res.push(value);
            }
            return res;
        }
    });

if (!Symbol$1) {
    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321!@#$%^&*()';
    var Symbol$1 = function (desc) {
        let arr = [];
        for (let i = 0; i < 128; i++) {
            arr.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        }
        return 'IESymbol(' + arr.join(``) + (desc || '') + ')';
    };
}
function $Symbol(description) {
    return Symbol$1(description);
}
$Symbol.$Symbol = function () {
    return Symbol$1;
}.bind(window)();

const isState = $Symbol();
class OStatefulData {
    constructor(value) {
        this._relientObjects = [];
        this.relatedNodes = [];
        this._value = value;
    }
    hasRelatedNodes() {
        return this.relatedNodes.length > 0;
    }
    addRelient(obj) {
        this._relientObjects.push(obj);
    }
    get value() {
        return this._value;
    }
    set value(new_value) {
        this._value = new_value;
        if (new_value && new_value.constructor === Array) {
            this.relatedNodes = [];
            new_value.forEach((item) => {
                if (item.isVElement) {
                    this.relatedNodes.push(item);
                }
            });
        }
        else if (new_value && new_value.isVElement) {
            this.relatedNodes = [new_value];
        }
        for (let i = 0; i < this._relientObjects.length; i++) {
            this._relientObjects[i].setRelientStateDirty(this);
        }
    }
    get [isState]() {
        return true;
    }
    [$Symbol.$Symbol.iterator]() {
        return (function* (value) {
            yield value;
        })(this._value);
    }
}
function StatefulData(data) {
    return new OStatefulData(data);
}
function stateJoin(...parts) {
    let relience = [];
    let stateObj = {
        get value() {
            let res = '';
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] && parts[i][isState]) {
                    res += parts[i].value;
                }
                else if (parts[i]) {
                    res += parts[i];
                }
            }
            return res;
        },
        addRelient(o) {
            relience.push(o);
        },
        setRelientStateDirty() {
            relience.forEach(function (o) {
                if (o.setRelientStateDirty) {
                    o.setRelientStateDirty(stateObj);
                }
            });
        },
        [isState]: true
    };
    for (let i = 0; i < parts.length; i++) {
        if (parts[i] && parts[i][isState]) {
            parts[i].addRelient(stateObj);
        }
    }
    return stateObj;
}

var requestIdleCallback;
if (!requestIdleCallback)
    requestIdleCallback = requestAnimationFrame;
const rerender_queue = [];
const rerenderCallbackOptions = { timeout: 500 };
const rerenderCallbackHandler = requestIdleCallback || requestAnimationFrame;
function rerenderHandler() {
    let item = rerender_queue.shift();
    if (item) {
        item.rerender();
        while (rerender_queue[0]) {
            item = rerender_queue.shift();
            item.rerender();
        }
    }
}
const isComponentConstructor = $Symbol();
class Component {
    constructor(props) {
        this.WARNIFINRENDER = 0;
        this._initialized = false;
        this._relient = [];
        this.isSvg = false;
        this.props = props;
        if (!this.renderFunctionExists()) {
            throw new Error('Components must define a render function');
        }
    }
    renderFunctionExists() {
        return this.render instanceof Function;
    }
    renderInternal() {
        if (!this._initialized) {
            let keys = Object.keys(this);
            for (let i = 0; i < keys.length; i++) {
                if (this[keys[i]] && this[keys[i]][isState]) {
                    this[keys[i]].addRelient(this);
                }
            }
            this._initialized = true;
        }
        this.WARNIFINRENDER++;
        let next = this.render();
        this.WARNIFINRENDER--;
        if (this._element) {
            this._element.diff(next, true);
        }
        else {
            this._element = next;
        }
        return this._element.element(this.isSvg);
    }
    element() {
        if (this._element)
            return this._element.element(this.isSvg);
        return this.renderInternal();
    }
    render() { }
    rerender() {
        if (this.WARNIFINRENDER)
            console.warn('rerender initiated from within the render call, this should be avoided if posible');
        if (this.WARNIFINRENDER > 10) {
            console.error('rerender error: rerender is being called within render several times in a row, this most likeally means that there is an issue.');
            return null;
        }
        return this.renderInternal();
    }
    addRelient(other) {
        if (!this._relient.includes(other))
            this._relient.push(other);
    }
    setRelientStateDirty(state) {
        if (!rerender_queue.includes(this))
            rerender_queue.push(this);
        rerenderCallbackHandler(rerenderHandler, rerenderCallbackOptions);
    }
    get [isState]() {
        return true;
    }
    setIsSvg(value) {
        this.isSvg = value;
    }
}
Component.prototype[isComponentConstructor] = true;

const instances = [];
class verboseConstructor {
    constructor() {
        this.funcs = {
            log: console.log.bind(console, `%c ians-fw %c log %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: gray; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent'),
            error: console.log.bind(console, `%c ians-fw %c error %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: rgb(190, 0, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent'),
            warn: console.log.bind(console, `%c ians-fw %c warn %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: rgb(207, 162, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent')
        };
        this._enabled = false;
        instances.push(this);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        this._enabled = value;
        instances.forEach(_ => (_._enabled = value));
    }
    log(...content) {
        if (this._enabled)
            this.funcs.log(...content);
    }
    error(...content) {
        if (this._enabled)
            this.funcs.error(...content);
    }
    warn(...content) {
        if (this._enabled)
            this.funcs.warn(...content);
    }
    createInternalInstance() {
        return this.createInstance('fw2gulp INTERNAL ');
    }
    createInstance(type) {
        let vc = new verboseConstructor();
        vc.funcs = {
            log: console.log.bind(console, `%c ${type} %c log %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: gray; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent'),
            error: console.log.bind(console, `%c ${type} %c error %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: rgb(190, 0, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent'),
            warn: console.log.bind(console, `%c ${type} %c warn %c `, 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', `background: rgb(207, 162, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`, 'background:transparent')
        };
        return vc;
    }
}
let verbose;
var verbose$1 = (verbose = new verboseConstructor());
Object.defineProperty(window || globalThis || new Function('this')(), 'FW2VERBOSE', { value: verbose });

const production = false;

function findStateDeep(o) {
    let res = [];
    const keys = Object.keys(o);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (o[key] && o[key][isState]) {
            res.push(o[key]);
        }
        else if (typeof o[key] === 'object') {
            res.push(...findStateDeep(o[key]));
        }
    }
    return res;
}

const hooks = new Map();
function getHooks(target) {
    return hooks.get(target).hooks;
}
function registerHook(target, callback) {
    if (callback) {
        hooks.set(target, { hooks: [] });
    }
    else {
        hooks.set(target, { hooks: [] });
    }
}
function executeHook(target, data) {
    const hook = hooks.get(target);
    hook.hooks.forEach(hookcb => {
        hookcb(data);
    });
}
function subscribeToHook(target, callback) {
    const hook = hooks.get(target);
    if (hook) {
        hook.hooks.push(callback);
    }
    else {
        throw new Error("unable to subscribe to hook, hook '" + target + "' does not exist");
    }
}

const isRef = Symbol("is-ref");
class Ref {
    constructor() {
        this._onupdatecbs = [];
    }
    get dom() {
        return this._element._element;
    }
    get virtual() {
        return this._element;
    }
    setRef(new_item) {
        this._element = new_item;
        if (this._element._element)
            this._onupdatecbs.forEach(updatedcb => updatedcb(this));
    }
    watch(cb) {
        this._onupdatecbs.push(cb);
        return () => {
            this._onupdatecbs.splice(this._onupdatecbs.indexOf(cb), 1);
        };
    }
    get [isRef]() { return true; }
}

registerHook('domrenderstart', false);
registerHook('domrenderend', false);
registerHook('vdomcreate', false);
const FWINTERNALVERBOSE = verbose$1.createInternalInstance();
FWINTERNALVERBOSE.enabled = !production;
function deferAssignment(object, props) {
    const keys = Object.keys(props);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = props[key];
        if (value && value[isState]) {
            object[key] = value.value;
        }
        else {
            if (Object.isSealed(object) || Object.isFrozen(object)) {
                object[key] = value;
            }
        }
    }
}
class VChildRegion {
    constructor(initializer) {
        this.references = new Map();
        this.initializer = initializer;
        this._elements = [];
        if (!(this._elements instanceof Array))
            this._elements = [this._elements];
        this.render();
    }
    render() {
        for (let i = 0; i < this._elements.length; i++) {
            const element = this._elements[i]._element;
            element.parentElement.removeChild(element);
        }
        this._elements = this.initializer();
        for (let i = 0; i < this._elements.length; i++) {
            const states = [...this._elements[i].references.keys()];
            for (let j = 0; j < states.length; j++) {
                if (!this.references.has(states[j])) {
                    this.references.set(states[j], []);
                }
                this.references.get(states[j]).push(this._elements[i]);
                states[j].addRelient(this);
            }
        }
    }
    setRelientStateDirty(state) {
        return null;
    }
}
function flat(arr, res = []) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] instanceof Array) {
            flat(arr[i], res);
        }
        else {
            res.push(arr[i]);
        }
    }
    return res;
}
class VElement {
    constructor(type, props, _children) {
        this.childrefs = [];
        this.references = new Map();
        const children = flat(_children);
        this.type = type;
        this.props = props || {};
        this.children = children;
        this.states = [];
        this.isSvg = this.type === 'svg';
    }
    element(COM_isSvg) {
        if (!this._element) {
            this.render(COM_isSvg || this.isSvg);
        }
        return this._element;
    }
    setIsSvg(value = true) {
        if (this.isSvg || value) {
            this.isSvg = value;
            this.children.forEach(_ => {
                if (_.setIsSvg && _.isSvg === !value) {
                    _.setIsSvg(this.isSvg);
                }
                else if (typeof _ === 'object' && Object.getPrototypeOf(_) === Component) {
                    _.setIsSvg(this.isSvg);
                }
            });
            return this.isSvg;
        }
        return value;
    }
    render(isSvg) {
        executeHook('domrenderstart', this);
        isSvg = this.setIsSvg(isSvg || this.isSvg);
        if (isSvg) {
            this._element = document.createElementNS('http://www.w3.org/2000/svg', this.type);
        }
        else {
            this._element = document.createElement(this.type);
        }
        for (let i = 0; i < this.children.length; i++) {
            let el = VElement.resolve(this.children[i]);
            if (this.children[i] && this.children[i][isState]) {
                this.states.push(this.children[i]);
                if (!this.references.has(this.children[i])) {
                    this.references.set(this.children[i], []);
                }
                this.references.get(this.children[i]).push(el);
                this._element.appendChild(el);
            }
            else if (this.children[i] instanceof Function) {
                this.childrefs[i] = new VChildRegion(this.children[i]);
                let elements = this.childrefs[i]._elements;
                for (let j = 0; j < elements.length; j++) {
                    this._element.appendChild(elements[j]._element);
                }
            }
            else if (el) {
                this._element.appendChild(el);
            }
        }
        const keys = Object.keys(this.props);
        if (this.props) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (this.props[key] && this.props[key][isState]) {
                    this.states.push(this.props[key]);
                    if (!this.references.has(this.props[key])) {
                        this.references.set(this.props[key], []);
                    }
                    this.references.get(this.props[key]).push(key);
                }
                else if (typeof this.props[key] === 'object') {
                    const deep_states = findStateDeep(this.props[key]);
                    for (let i = 0; i < deep_states.length; i++) {
                        deep_states[i].addRelient(this);
                        this.states.push(deep_states[i]);
                        if (!this.references.has(deep_states[i])) {
                            this.references.set(deep_states[i], []);
                        }
                        this.references.get(deep_states[i]).push(key);
                    }
                }
            }
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key != "ref") {
                if (this.props[key] && this.props[key][isState]) {
                    this._element[key] = this.props[key].value;
                }
                else if (typeof this.props[key] == 'object') {
                    if (key != 'children')
                        deferAssignment(this._element[key], this.props[key]);
                }
                else {
                    try {
                        if (key.substr(0, 2) == 'on') {
                            this._element.addEventListener(key.substr(2), this.props[key]);
                        }
                        else {
                            this._element[key] = this.props[key];
                            if (isSvg)
                                this._element.setAttribute(key, this.props[key]);
                        }
                    }
                    catch (e) {
                        this._element.setAttribute(key, this.props[key]);
                    }
                }
            }
        }
        for (let i = 0; i < this.states.length; i++) {
            this.states[i].addRelient(this);
        }
        if (this.props.ref && this.props.ref[isRef]) {
            this.props.ref.setRef(this);
        }
    }
    setRelientStateDirty(state) {
        const effected = this.references.get(state);
        for (let i = 0; i < effected.length; i++) {
            const item = effected[i];
            if (item instanceof Text) {
                item.textContent = state.value;
            }
            else if (item instanceof HTMLSpanElement && item.hasAttribute('is-state-wrapper')) {
                if (state.hasRelatedNodes()) {
                    state.relatedNodes.forEach((el) => {
                        if (!state.relatedNodes.includes(el))
                            el.element().remove();
                    });
                }
                state.value.forEach((el) => {
                    item.appendChild(el.element());
                });
            }
            else if (typeof item === 'string') {
                if (this.props[item] && this.props[item][isState]) {
                    this.element()[item] = this.props[item].value;
                }
                else if (this.props[item] instanceof Object) {
                    deferAssignment(this.element()[item], this.props[item]);
                }
            }
        }
        executeHook('domrenderend', this);
    }
    static resolve(value) {
        if (value instanceof VElement) {
            return value.element();
        }
        else if (value != undefined && value[isState]) {
            if (value.value && value.value.constructor === Array) {
                let span = document.createElement('span');
                span.setAttribute('is-state-wrapper', 'true');
                for (let i = 0; i < value.value.length; i++) {
                    span.appendChild(VElement.resolve(value.value[i]));
                }
                return span;
            }
            else if (value[isComponentConstructor]) {
                return value.renderInternal();
            }
            else {
                return document.createTextNode(value.value);
            }
        }
        else if (value != null && typeof value === 'object' && Object.getPrototypeOf(value) instanceof Component) {
            return value.element();
        }
        else if (value != null) {
            return document.createTextNode(value != undefined ? value : ' ');
        }
    }
    get isVElement() {
        return true;
    }
    diff(other) {
        if (typeof other === 'undefined') {
            return this.element().parentElement.removeChild(this.element());
        }
        if (!deq(this.props, other.props)) {
            const keys = Object.keys(this.props);
            const okeys = Object.keys(other.props);
            for (let i = 0; i < Math.max(keys.length, okeys.length); i++) {
                let key0 = keys[i];
                let key1 = okeys[i];
                if (key1 === 'children')
                    continue;
                if (!key0 || !key1) {
                    if (!key0) {
                        this.element()[key1] = other.props[key1];
                    }
                    else if (!key1) {
                        delete this.element()[key0];
                    }
                }
                else {
                    if (this.props[key0] != other.props[key0]) {
                        this.element()[key0] = other.props[key0];
                    }
                }
            }
        }
        this.props = other.props;
        if (other.children.length != this.children.length) {
            const parent = this.element().parentElement;
            if (parent) {
                parent.insertBefore(other.element(), this.element());
                parent.removeChild(this.element());
                this._element = other.element();
                this.children = other.children;
            }
        }
        else {
            this.children.forEach((child, index) => {
                if (child && child.diff && typeof other.children[index] != 'string') {
                    child.diff(other.children[index]);
                }
                else if (child != other.children[index]) {
                    const parent = this.element().parentElement;
                    if (parent && other.element() && this.element() != other._element) {
                        parent.insertBefore(other.element(), this.element());
                        parent.removeChild(this.element());
                        this._element = other.element();
                        this.children = other.children;
                    }
                }
            });
        }
    }
}
function deq(x, y) {
    if (x === y)
        return true;
    if (!(x instanceof Object) || !(y instanceof Object))
        return false;
    if (x.constructor !== y.constructor)
        return false;
    for (var p in x) {
        if (!x.hasOwnProperty(p))
            continue;
        if (!y.hasOwnProperty(p))
            return false;
        if (x[p] === y[p])
            continue;
        if (typeof x[p] !== 'object')
            return false;
        if (!deq(x[p], y[p]))
            return false;
    }
    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
            return false;
    }
    return true;
}
function dom(node_type, props, ...children) {
    let res = null;
    if (typeof node_type === 'function') {
        if (Object.getPrototypeOf(node_type) === Component) {
            res = new node_type(Object.assign(Object.assign({}, props || {}), { children }));
        }
        else {
            res = node_type(Object.assign(Object.assign({}, props || {}), { children }));
        }
    }
    else {
        res = new VElement(node_type, props, children);
    }
    executeHook('vdomcreate', res);
    return res;
}

const style = document.createElement("style");
style.setAttribute("fw-style", "true");
if (document.head) {
    document.head.appendChild(style);
}
else {
    document.addEventListener("load", () => {
        document.head.appendChild(style);
    });
}
function makeTemplateStringComplete(parts, inserts) {
    if (typeof parts === "string")
        return parts;
    let res = "";
    for (let i = 0; i < parts.length; i++) {
        res += parts[i] || "";
        res += inserts[i] || "";
    }
    return res;
}
let id = 0;
function css(parts, ...inserts) {
    const cssString = makeTemplateStringComplete(parts, inserts);
    style.innerHTML += `/*${id++}*/${cssString}`.replace(/\n/g, "");
}

var fw = {
    dom,
    StatefulData,
    stateJoin,
    css,
    Component,
    verbose: verbose$1,
    Ref
};

export default fw;
export { Component, OStatefulData, Ref, StatefulData, VChildRegion, VElement, css, dom, executeHook, findStateDeep, getHooks, isComponentConstructor, isState, production, registerHook, stateJoin, subscribeToHook };
