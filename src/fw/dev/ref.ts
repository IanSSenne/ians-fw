import { VElement } from "./dom";
import IESymbol from "./ie_Symbol";
export const isRef: string = IESymbol("is-ref");
export class Ref {
    _element: VElement | null;
    _onupdatecbs: any[] = [];
    get dom() {
        return this._element._element;
    }
    get virtual() {
        return this._element;
    }
    setRef(new_item) {
        this._element = new_item;
        if (this._element!._element) this._onupdatecbs.forEach(updatedcb => updatedcb(this));
    }
    watch(cb) {
        this._onupdatecbs.push(cb);
        return () => {
            this._onupdatecbs.splice(this._onupdatecbs.indexOf(cb), 1);
        }
    }
    get [isRef]() { return true; }
}