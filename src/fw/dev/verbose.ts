const instances = [];
class verboseConstructor {
	_enabled: boolean;
	funcs: { log: Function; error: Function; warn: Function } = {
		log: console.log.bind(
			console,
			`%c ians-fw %c log %c `,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			`background: gray; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
			'background:transparent'
		),
		error: console.log.bind(
			console,
			`%c ians-fw %c error %c `,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			`background: rgb(190, 0, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
			'background:transparent'
		),
		warn: console.log.bind(
			console,
			`%c ians-fw %c warn %c `,
			'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			`background: rgb(207, 162, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
			'background:transparent'
		)
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
		vc.funcs = {
			log: console.log.bind(
				console,
				`%c ${type} %c log %c `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				`background: gray; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
				'background:transparent'
			),
			error: console.log.bind(
				console,
				`%c ${type} %c error %c `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				`background: rgb(190, 0, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
				'background:transparent'
			),
			warn: console.log.bind(
				console,
				`%c ${type} %c warn %c `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				`background: rgb(207, 162, 0); padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
				'background:transparent'
			)
		};
		return vc;
	}
}
let verbose: verboseConstructor;
export default (verbose = new verboseConstructor());
Object.defineProperty(window || globalThis || new Function('this')(), 'FW2VERBOSE', { value: verbose });
