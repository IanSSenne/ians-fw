import { isState } from './state';
import { isRef } from "./ref";
export function findStateDeep(o: any): any[] {
	let res = [];
	const keys = Object.keys(o);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (o[key] && o[key][isRef]) {
			//noop, ref's are known to not have StatefulData
		} else if (o[key] && o[key][isState]) {
			res.push(o[key]);
		} else if (typeof o[key] === 'object') {
			res.push(...findStateDeep(o[key]));
		}
	}
	return res;
}
