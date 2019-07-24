import { VElement } from "./dom";
import { isState } from "./state";
import verbose from "./verbose";
const rerender_queue = [];
declare var requestIdleCallback;
const rerenderCallbackOptions = {timeout:500};
const rerenderCallbackHandler = requestIdleCallback||requestAnimationFrame
function rerenderHandler(){
    let item = rerender_queue.shift();
    if(item){
        verbose.log("handling rerender for",item,"resulting in",item.rerender());
    }
    rerenderCallbackHandler(rerenderHandler,rerenderCallbackOptions);
}
rerenderCallbackHandler(rerenderHandler,rerenderCallbackOptions);
export const isComponentConstructor: unique symbol = Symbol();
export class Component{
    public props: any;
    public children: any[];
    private WARNIFINRENDER:number = 0;
    private _element:any;
    private _initialized:any = false;
    private _relient:any[] = [];
    constructor(props){
        this.props = props;
        if(!this.renderFunctionExists()){
            throw new Error("Components must define a render function");
        }
    }
    renderFunctionExists(){
        return this.render instanceof Function
    }
    renderInternal(){
        if(!this._initialized){
            let keys = Object.keys(this);
            for(let i = 0;i<keys.length;i++){
                if(this[keys[i]][isState]){
                    this[keys[i]].addRelient(this);
                }
            }
            this._initialized=true;
        }
        this.WARNIFINRENDER++;
        let next = this.render();
        this.WARNIFINRENDER--;
        if(this._element){
            this._element.diff(next);
        }else{
            this._element = next;
        }
        return this._element.element;
    }
    get element(){
      return this.renderInternal();
    }
    render():any{}
    rerender(){
        if(this.WARNIFINRENDER)console.warn("rerender initiated from within the render call, this should be avoided if posible");
        if(this.WARNIFINRENDER>10){
            console.error("rerender error: rerender is being called within render several times in a row, this most likeally means that there is an issue.")
            return null;
        }
        let res = this.renderInternal();
        return res;
    }
    addRelient(other){
        if(!this._relient.includes(other))this._relient.push(other);
    }
    setRelientStateDirty(state){
        if(!rerender_queue.includes(this))rerender_queue.push(this);
    }
    [isComponentConstructor] = true;
    get [isState](){return true}
}