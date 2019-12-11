import { isState } from './state';
import { isComponentConstructor, Component } from './component';
import verbose from './verbose';
import { production } from './prod';
import { findStateDeep } from './util';
import { registerHook, executeHook } from './hooks';
import { isRef } from "./ref";
registerHook('domrenderstart', false);
registerHook('domrenderend', false);
registerHook('vdomcreate', false);
interface PropsObject {
	[key: string]: any;
}
const FWINTERNALVERBOSE = verbose.createInternalInstance();
FWINTERNALVERBOSE.enabled = !production;
function deferAssignment(object: object, props: object) {
	const keys = Object.keys(props);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = (props as any)[key];
		if (value && value[isState]) {
			(object as any)[key] = value.value;
		} else {
			if (Object.isSealed(object) || Object.isFrozen(object)) {
				(object as any)[key] = value;
			}
		}
	}
}
export class VChildRegion {
	_elements: VElement[];
	references: Map<object, any[]> = new Map();
	initializer: Function;
	constructor(initializer: Function) {
		this.initializer = initializer;
		this._elements = [];
		if (!((this._elements as any) instanceof Array)) this._elements = [this._elements as any];
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
				(states[j] as any).addRelient(this);
			}
		}
	}
	setRelientStateDirty(state: any) {
		return null;
		//this is here as a formality, no action should ever be taken...
	}
}
function flat(arr: any[], res = []) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] instanceof Array) {
			flat(arr[i], res);
		} else {
			res.push(arr[i]);
		}
	}
	return res;
}
export class VElement {
	type: string;
	props: PropsObject;
	children: any[];
	childrefs: any[] = [];
	states: any[];
	_element: any;
	isSvg: boolean;
	references: Map<object, Array<any>> = new Map();
	constructor(type: string, props: PropsObject, _children: any[]) {
		const children = flat(_children);
		this.type = type;
		this.props = props || ({} as PropsObject);
		this.children = children;
		this.states = [];
		this.isSvg = this.type === 'svg';
	}
	element(COM_isSvg?) {
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
				} else if (typeof _ === 'object' && Object.getPrototypeOf(_) === Component) {
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
		} else {
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
			} else if (this.children[i] instanceof Function) {
				this.childrefs[i] = new VChildRegion(this.children[i]);
				let elements = this.childrefs[i]._elements;
				for (let j = 0; j < elements.length; j++) {
					this._element.appendChild(elements[j]._element);
				}
			} else if (el) {
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
				} else if (typeof this.props[key] === 'object') {
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
			const key: string = keys[i];
			if (key != "ref") {
				if (this.props[key] && this.props[key][isState]) {
					this._element[key] = this.props[key].value;
				} else if (typeof this.props[key] == 'object') {
					if (key != 'children') deferAssignment(this._element[key], this.props[key]);
				} else {
					try {
						if (key.substr(0, 2) == 'on') {
							this._element.addEventListener(key.substr(2), this.props[key]);
						} else {
							this._element[key] = this.props[key];
							if (isSvg) this._element.setAttribute(key, this.props[key]);
						}
					} catch (e) {
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
	setRelientStateDirty(state: any) {
		const effected = this.references.get(state);
		for (let i = 0; i < effected.length; i++) {
			const item = effected[i];
			if (item instanceof Text) {
				item.textContent = state.value;
			} else if (item instanceof HTMLSpanElement && item.hasAttribute('is-state-wrapper')) {
				if (state.hasRelatedNodes()) {
					state.relatedNodes.forEach((el: any) => {
						if (!state.relatedNodes.includes(el)) el.element().remove();
					});
				}
				state.value.forEach((el: any) => {
					item.appendChild(el.element());
				});
			} else if (typeof item === 'string') {
				if (this.props[item] && this.props[item][isState]) {
					(this.element() as any)[item] = this.props[item].value;
				} else if (this.props[item] instanceof Object) {
					deferAssignment((this.element() as any)[item], this.props[item]);
				}
			}
		}
		executeHook('domrenderend', this);
	}
	static resolve(value: any) {
		if (value instanceof VElement) {
			return value.element();
		} else if (value != undefined && value[isState]) {
			if (value.value && value.value.constructor === Array) {
				let span = document.createElement('span');
				span.setAttribute('is-state-wrapper', 'true');
				for (let i = 0; i < value.value.length; i++) {
					span.appendChild(VElement.resolve(value.value[i]));
				}
				return span;
			} else if (value[isComponentConstructor]) {
				return value.renderInternal();
			} else {
				return document.createTextNode(value.value);
			}
		} else if (value != null && typeof value === 'object' && Object.getPrototypeOf(value) instanceof Component) {
			return value.element();
		} else if (value != null) {
			return document.createTextNode(value != undefined ? value : ' ');
		}
	}

	get isVElement() {
		return true;
	}

	diff(other: VElement) {
		if (typeof other === 'undefined') {
			return this.element().parentElement.removeChild(this.element());
		}
		// console.log(this, other);
		if (!deq(this.props, other.props)) {
			const keys = Object.keys(this.props);
			const okeys = Object.keys(other.props);
			for (let i = 0; i < Math.max(keys.length, okeys.length); i++) {
				let key0 = keys[i];
				let key1 = okeys[i];
				if (key1 === 'children') continue;
				if (!key0 || !key1) {
					if (!key0) {
						this.element()[key1] = other.props[key1];
					} else if (!key1) {
						delete this.element()[key0];
					}
				} else {
					if (this.props[key0] != other.props[key0]) {
						this.element()[key0] = other.props[key0];
					}
				}
			}
		}
		this.props = other.props;
		if (other.children.length != this.children.length) {
			// this._element.replaceWith(other._element);
			const parent: HTMLDivElement = this.element().parentElement;
			if (parent) {
				parent.insertBefore(other.element(), this.element());
				parent.removeChild(this.element());
				this._element = other.element();
				this.children = other.children;
			}
		} else {
			this.children.forEach((child, index) => {
				if (child && child.diff && typeof other.children[index] != 'string') {
					child.diff(other.children[index]);
				} else if (child != other.children[index]) {
					// this._element.replaceWith(other._element);
					const parent: HTMLDivElement = this.element().parentElement;
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
	//https://stackoverflow.com/a/6713782
	if (x === y) return true;
	// if both x and y are null or undefined and exactly the same

	if (!(x instanceof Object) || !(y instanceof Object)) return false;
	// if they are not strictly equal, they both need to be Objects

	if (x.constructor !== y.constructor) return false;
	// they must have the exact same prototype chain, the closest we can do is
	// test there constructor.

	for (var p in x) {
		if (!x.hasOwnProperty(p)) continue;
		// other properties were tested using x.constructor === y.constructor

		if (!y.hasOwnProperty(p)) return false;
		// allows to compare x[ p ] and y[ p ] when set to undefined

		if (x[p] === y[p]) continue;
		// if they have the same strict value or identity then they are equal

		if (typeof x[p] !== 'object') return false;
		// Numbers, Strings, Functions, Booleans must be strictly equal

		if (!deq(x[p], y[p])) return false;
		// Objects and Arrays must be tested recursively
	}

	for (p in y) {
		if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
		// allows x[ p ] to be set to undefined
	}
	return true;
}
export function dom<A extends Component>(
	node_type: string | Function | A,
	props: null | PropsObject,
	...children: any[]
) {
	let res = null;
	if (typeof node_type === 'function') {
		if (Object.getPrototypeOf(node_type) === Component) {
			res = new (node_type as any)({ ...props || {}, children });
		} else {
			res = node_type({ ...props || {}, children });
		}
		// res._element.setAttribute('fw-comp-root', node_type.name);
		// res._element.setAttribute('fw-comp-type', 'func');
	} else {
		res = new VElement(node_type as string, props, children);
	}

	executeHook('vdomcreate', res);
	return res;
}
