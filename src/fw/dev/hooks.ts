const hooks = new Map();
export function getHooks(target) {
	return hooks.get(target).hooks;
}
export function registerHook(target: string, callback?: boolean) {
	if (callback) {
		hooks.set(target, { hooks: [] });
	} else {
		hooks.set(target, { hooks: [] });
	}
}
export function executeHook(target, data) {
	const hook = hooks.get(target);
	hook.hooks.forEach(hookcb => {
		hookcb(data);
	});
}
export function subscribeToHook(target, callback) {
	const hook = hooks.get(target);
	if (hook) {
		hook.hooks.push(callback);
	} else {
		throw new Error("unable to subscribe to hook, hook '" + target + "' does not exist");
	}
}
