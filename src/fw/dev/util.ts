import { isState } from './state';
export function findStateDeep(o: any): any[] {
	let res = [];
	const keys = Object.keys(o);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (o[key] && o[key][isState]) {
			res.push(o[key]);
		} else if (typeof o[key] === 'object') {
			res.push(...findStateDeep(o[key]));
		}
	}
	return res;
}
