if (!Symbol) {
	var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0987654321!@#$%^&*()';
	var Symbol = function(desc) {
		let arr = [];
		for (let i = 0; i < 128; i++) {
			arr.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
		}
		return 'IESymbol(' + arr.join(``) + (desc || '') + ')';
	};
}
export default function $Symbol(description?: string) {
	return Symbol(description);
}
$Symbol.$Symbol = function() {
	return Symbol;
}.bind(window)();
