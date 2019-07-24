import { VElement } from "./dom";

interface STATEDEPENDENTOBJECT {
  setRelientStateDirty(state: any): void
}
export const isState: unique symbol = Symbol();
export class OStatefulData<T>{
  private _value: T;
  private _relientObjects: any[] = [];
  public relatedNodes: any[] = [];
  constructor(value: T) {
    this._value = value;
  }
  hasRelatedNodes() {
    return this.relatedNodes.length > 0;
  }
  addRelient(obj: any) {
    this._relientObjects.push(obj);
  }
  get value(): T {
    return this._value;
  }
  set value(new_value: T) {
    this._value = new_value;
    if (new_value && new_value.constructor === Array) {
      this.relatedNodes = [];
      (new_value as any).forEach((item: any) => {
        if (item.isVElement) {
          this.relatedNodes.push(item);
        }
      });
    } else if (new_value&& (new_value as any).isVElement) {
      this.relatedNodes = [new_value];
    }
    for (let i = 0; i < this._relientObjects.length; i++) {
      this._relientObjects[i].setRelientStateDirty(this);
    }
  }
  get [isState]() {
    return true;
  }
  [Symbol.iterator]() {
    return (function* (value: any) { yield value; })(this._value);
  }
}
export function StatefulData<T>(data: T) {
  return new OStatefulData<T>(data);
}
export function stateJoin(...parts: Array<any | VElement>) {
  let relience: any[] = [];
  let stateObj = ({
    get value() {
      let res = "";
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] && parts[i][isState]) {
          res += parts[i].value;
        } else if (parts[i]) {
          res += parts[i];
        }
      }
      return res;
    },
    addRelient(o: STATEDEPENDENTOBJECT) {
      relience.push(o);
    },
    setRelientStateDirty() {
      relience.forEach(function (o: STATEDEPENDENTOBJECT) {
        if (o.setRelientStateDirty) {
          o.setRelientStateDirty(stateObj);
        }
      });
    },
    [isState]: true
  } as unknown as string);
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] && parts[i][isState]) {
      parts[i].addRelient(stateObj);
    }
  }
  return stateObj;
}