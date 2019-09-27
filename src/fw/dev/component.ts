var requestIdleCallback;

if (!requestIdleCallback) requestIdleCallback = requestAnimationFrame;
import Symbol from './ie_Symbol';
import { isState } from './state';
import verbose from './verbose';
const INTERNALVERBOSE = verbose.createInternalInstance();
const rerender_queue = [];
declare var requestIdleCallback;
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
	// rerenderCallbackHandler(rerenderHandler, rerenderCallbackOptions);
}
// rerenderCallbackHandler(rerenderHandler, rerenderCallbackOptions);
export const isComponentConstructor: string = Symbol();
export class Component {
	public props: any;
	public children: any[];
	private WARNIFINRENDER: number = 0;
	private _element: any;
	private _initialized: any = false;
	private _relient: any[] = [];
	public isSvg: boolean = false;
	constructor(props) {
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
		// next.element.setAttribute('fw-comp-root', this.constructor.name);
		// next.element.setAttribute('fw-comp-type', 'class');
		this.WARNIFINRENDER--;
		if (this._element) {
			this._element.diff(next, true);
		} else {
			this._element = next;
		}
		return this._element.element(this.isSvg);
	}
	element() {
		if (this._element) return this._element.element(this.isSvg);
		return this.renderInternal();
	}
	render(): any {}
	rerender() {
		if (this.WARNIFINRENDER)
			console.warn('rerender initiated from within the render call, this should be avoided if posible');
		if (this.WARNIFINRENDER > 10) {
			console.error(
				'rerender error: rerender is being called within render several times in a row, this most likeally means that there is an issue.'
			);
			return null;
		}
		return this.renderInternal();
	}
	addRelient(other) {
		if (!this._relient.includes(other)) this._relient.push(other);
	}
	setRelientStateDirty(state) {
		if (!rerender_queue.includes(this)) rerender_queue.push(this);
		rerenderCallbackHandler(rerenderHandler, rerenderCallbackOptions);
		// this.rerender();
	}
	get [isState]() {
		return true;
	}
	setIsSvg(value) {
		this.isSvg = value;
	}
}
Component.prototype[isComponentConstructor] = true;
