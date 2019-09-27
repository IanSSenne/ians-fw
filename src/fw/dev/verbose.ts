const instances = [];
class verboseConstructor {
	_enabled: boolean;
	funcs: { log: Function; error: Function; warn: Function } = {
		log: console.log.bind(console, '[fw2gulp LOG]'),
		error: console.error.bind(console, '[fw2gulp ERR]'),
		warn: console.warn.bind(console, '[fw2gulp WRN]')
	};
	constructor() {
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
		if (this._enabled) this.funcs.log(...content);
	}
	error(...content) {
		if (this._enabled) this.funcs.error(...content);
	}
	warn(...content) {
		if (this._enabled) this.funcs.warn(...content);
	}
	createInternalInstance() {
		return this.createInstance('fw2gulp INTERNAL ');
	}
	createInstance(type) {
		let vc = new verboseConstructor();
		vc.funcs.log = console.log.bind(console, `[${type}LOG]`);
		vc.funcs.error = console.error.bind(console, `[${type}ERR]`);
		vc.funcs.warn = console.warn.bind(console, `[${type}WRN]`);
		return vc;
	}
}
let verbose: verboseConstructor;
export default (verbose = new verboseConstructor());
Object.defineProperty(window || globalThis || new Function('this')(), 'FW2VERBOSE', { value: verbose });
