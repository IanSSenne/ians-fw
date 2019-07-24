import * as domdiff from "./libs/diff-dom/src/index";
const svgElements='animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,script,set,solidcolor,stop,style,svg,switch,symbol,text,textPath,title,tspan,unknown,use,view,animate,animateColor,animateMotion,animateTransform,discard,mpath,set,circle,ellipse,line,polygon,polyline,rect,a,defs,g,marker,mask,missing-glyph,pattern,svg,switch,symbol,unknown,desc,metadata,title,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,feSpecularLighting,feTile,feTurbulence,font,font-face,font-face-format,font-face-name,font-face-src,font-face-uri,hkern,vkern,linearGradient,meshgradient,radialGradient,stop,circle,ellipse,image,line,mesh,path,polygon,polyline,rect,text,use,mesh,use,feDistantLight,fePointLight,feSpotLight,clipPath,defs,hatch,linearGradient,marker,mask,meshgradient,metadata,pattern,radialGradient,script,style,symbol,title,hatch,linearGradient,meshgradient,pattern,radialGradient,solidcolor,a,circle,ellipse,foreignObject,g,image,line,mesh,path,polygon,polyline,rect,svg,switch,symbol,text,textPath,tspan,unknown,use,circle,ellipse,line,mesh,path,polygon,polyline,rect,defs,g,svg,symbol,use,altGlyph,altGlyphDef,altGlyphItem,glyph,glyphRef,textPath,text,tref,tspan,altGlyph,textPath,tref,tspan,clipPath,color-profile,cursor,filter,foreignObject,hatchpath,meshpatch,meshrow,script,style,view,altGlyph,altGlyphDef,altGlyphItem,animateColor,cursor,font,font-face,font-face-format,font-face-name,font-face-src,font-face-uri,glyph,glyphRef,hkern,missing-glyph,tref,vkern,a,altGlyph,altGlyphDef,altGlyphItem,animate,animateColor,animateMotion,animateTransform,circle,clipPath,color-profile,cursor,defs,desc,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,font,font-face,font-face-format,font-face-name,font-face-src,font-face-uri,foreignObject,g,glyph,glyphRef,hkern,image,line,linearGradient,marker,mask,metadata,missing-glyph,mpath,path,pattern,polygon,polyline,radialGradient,rect,script,set,stop,style,svg,switch,symbol,text,textPath,title,tref,tspan,use,view,vkern'.split(",");
const diff = new domdiff.DiffDOM()
interface PropsObject {
  [key: string]: any
}
import { isState } from "./state";
import {isComponentConstructor, Component} from "./component";
function flatten(arr: Array<any>) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i].constructor === Array) arr.splice(i, 1, ...arr[i]);
  }
  return arr;
}
function findStateDeep(o: any): any[] {
  let res = [];
  const keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (o[key] && o[key][isState]) {
      res.push(o[key]);
    } else if (typeof o[key] === "object") {
      res.push(...findStateDeep(o[key]));
    }
  }
  return res;
}
function deferAssignment(object: object, props: object) {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = (props as any)[key];
    if (value && value[isState]) {
      (object as any)[key] = value.value;
    } else {
      (object as any)[key] = value;
    }
  }
}
export class VChildRegion {
  elements: VElement[];
  references: Map<object, any[]> = new Map();
  initializer: Function;
  constructor(initializer: Function) {
    this.initializer = initializer;
    this.elements = [];
    if (!((this.elements as any) instanceof Array)) this.elements = [this.elements as any];
    this.render();
  }
  render() {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].element.remove();
    }
    this.elements = this.initializer();
    for (let i = 0; i < this.elements.length; i++) {
      const states = [...this.elements[i].references.keys()];
      for (let j = 0; j < states.length; j++) {
        if (!this.references.has(states[j])) {
          this.references.set(states[j], []);
        }
        this.references.get(states[j]).push(this.elements[i]);
        (states[j] as any).addRelient(this);
      }
    }
  }
  //#####D0 this############################################################################################################################################################################
  setRelientStateDirty(state: any) {
    // let effected = this.references.get(state);
  }
}
export class VElement {
  type: string;
  props: PropsObject;
  children: any[];
  childrefs: any[] = [];
  states: any[];
  element: any;
  references: Map<object, Array<any>> = new Map();
  constructor(type: string, props: PropsObject, _children: any[]) {
    const children = flatten(_children);
    this.type = type;
    this.props = props || ({} as PropsObject);
    this.children = children;
    this.states = [];
    if(svgElements.includes(type)){
      this.element = document.createElementNS("http://www.w3.org/2000/svg",this.type)
    }else{
      this.element = document.createElement(this.type);
    }
    for (let i = 0; i < this.children.length; i++) {
      let el = VElement.resolve(this.children[i]);
      if (this.children[i] && this.children[i][isState]) {
        this.states.push(this.children[i]);
        if (!this.references.has(this.children[i])) {
          this.references.set(this.children[i], []);
        }
        this.references.get(this.children[i]).push(el);
        this.element.appendChild(el);
      } else if (this.children[i] instanceof Function) {
        this.childrefs[i] = new VChildRegion(this.children[i]);
        let elements = this.childrefs[i].elements;
        for (let j = 0; j < elements.length; j++) {
          this.element.appendChild(elements[j].element);
        }
      } else if(el){
        this.element.appendChild(el);
      }
    }
    const keys = Object.keys(this.props);
    if (this.props) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (this.props[key] && this.props[key][isState]) {
          this.states.push(this.props[key]);
          if (!this.references.has(this.props[key])) {
            this.references.set(this.props[key], []);
          }
          this.references.get(this.props[key]).push(key);
        } else if (typeof this.props[key] === "object") {
          const deep_states = findStateDeep(this.props[key]);
          for (let i = 0; i < deep_states.length; i++) {
            deep_states[i].addRelient(this);
            this.states.push(deep_states[i]);
            if (!this.references.has(deep_states[i])) {
              this.references.set(deep_states[i], []);
            }
            this.references.get(deep_states[i]).push(key);
          }
        }
      }
    }
    for (let i = 0; i < keys.length; i++) {
      const key: string = keys[i];
      if (this.props[key] && this.props[key][isState]) {
        this.element[key] = props[key].value;
      } else if (typeof props[key] == "object") {
        deferAssignment(this.element[key], props[key]);
        if (key.substr(0, 2) !== "on") this.element.setAttribute(key, this.element[key].value);
      } else {
        try{
          this.element[key] = props[key];
        }catch{}
        if (key.substr(0, 2) !== "on") this.element.setAttribute(key, this.element[key]);
      }
    }
    for (let i = 0; i < this.states.length; i++) {
      this.states[i].addRelient(this);
    }
  }
  setRelientStateDirty(state: any) {
    const effected = this.references.get(state);
    for (let i = 0; i < effected.length; i++) {
      const item = effected[i];
      if (item instanceof Text) {
        item.textContent = state.value;
      } else if (item instanceof HTMLSpanElement && item.hasAttribute("is-state-wrapper")) {
        if (state.hasRelatedNodes()) {
          state.relatedNodes.forEach((el: any) => {
            if (!state.relatedNodes.includes(el)) el.element.remove();
          });
        }
        state.value.forEach((el: any) => {
          item.appendChild(el.element);
        });
      }
      else if (typeof item === "string") {
        if (this.props[item] && this.props[item][isState]) {
          (this.element as any)[item] = this.props[item].value;
        } else if (this.props[item] instanceof Object) {
          deferAssignment((this.element as any)[item], this.props[item]);
        }
      } 
    }
  }
  static resolve(value: any) {
    if (value instanceof VElement) {
      return value.element;
    } else if (value != undefined && value[isState]) {
      if (value.value && value.value.constructor === Array) {
        let span = document.createElement("span");
        span.setAttribute("is-state-wrapper", "true");
        for (let i = 0; i < value.value.length; i++) {
          span.appendChild(VElement.resolve(value.value[i]));
        }
        return span;
      } else if(value[isComponentConstructor]){
        return value.renderInternal();
      }else{
        return document.createTextNode(value.value);
      }
    } else if(value!=null&&Object.getPrototypeOf(value) instanceof Component){
      return value.element;
    }else if(value!=null){
      return document.createTextNode(value != undefined ? value : " ");
    }
  }

  get isVElement() { return true; }

  diff(other:VElement){
    return diff.apply(this.element,diff.diff(this.element,other.element));
  }
}
export function dom<A extends Component>(node_type: string | Function | A, props: null | PropsObject, ...children: any[]) {

  if (typeof node_type === "function") {
    if(Object.getPrototypeOf(node_type)===Component){
      return new (node_type as any)({ ...(props || {}), children });
    }
    return node_type({ ...(props || {}), children });
  }
  return new VElement(node_type as string, props, children);
}