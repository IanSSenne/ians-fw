const style = document.createElement("style");
style.setAttribute("fw-style", "true");
const class_names = new Map();
function getClassName(name: string): string {
  if (class_names.has(name)) {
    const id = class_names.get(name) + 1;
    class_names.set(name, id);
    return name + "-" + id;
  } else {
    class_names.set(name, 0);
  }
  return name;
}
interface styleObject {
  [key: string]: styleObject | any;
}
function makeStylesC(styles: styleObject) {
  let o: any = {};
  let class_names: any = {};
  let root_class_names = Object.keys(styles);
  for (let i = 0; i < root_class_names.length; i++) {
    let root_class_name = root_class_names[i];
    let calculated_class_name = getClassName(root_class_name);
    o[calculated_class_name] = styles[root_class_name];
    class_names[root_class_name] = calculated_class_name;
  }
  let classes = [];
  function getCssString(str: string) {
    return str.replace(/[A-Z]/g, (match: string) => "-" + match.toLowerCase());
  }
  function parse(o: any, name: string) {
    let class_str = [];
    let keys = Object.keys(o);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (typeof o[key] === "object") {
        parse(o[key], name + key);
      } else {
        class_str.push(getCssString(key) + ":" + o[key]);
      }
    }
    classes.push(`${name}{${class_str.join(";")}}`);
  }

  let keys = Object.keys(o);
  for (let i = 0; i < keys.length; i++) {
    classes.push(parse(o[keys[i]], keys[i]));
  }
  let style_strings = classes.join("\n");
  style.innerHTML += style_strings;
  return class_names;
}

makeStylesC.raw = function(string:string){
  style.innerHTML+="/*raw*/\n\n"+string+"\n/*end raw*/\n";
}


if (document.head) {
  document.head.appendChild(style);
} else {
  document.addEventListener("load", () => {
    document.head.appendChild(style);
  });
}

export const makeStyles = makeStylesC;