if (!Object.assign) {
	Object.defineProperty(Object, 'assign', {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(target) {
			'use strict';
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
	String.prototype.includes = function(search, start) {
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}
if (!Array.prototype.includes) {
	Object.defineProperty(Array.prototype, 'includes', {
		enumerable: false,
		value: function(obj, start = -1) {
			var newArr = this.filter(function(el, index) {
				return el == obj && index > start;
			});
			return newArr.length > 0;
		}
	});
}
if (!Array.prototype.fill)
	Object.defineProperty(Array.prototype, 'fill', {
		value: function(value) {
			let res = [];
			for (let i = 0; i < this.value; i++) {
				res.push(value);
			}
			return res;
		}
	});
