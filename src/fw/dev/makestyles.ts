const style = document.createElement("style");
style.setAttribute("fw-style", "true");
if (document.head) {
  document.head.appendChild(style);
} else {
  document.addEventListener("load", () => {
    document.head.appendChild(style);
  });
}

function makeTemplateStringComplete(parts, inserts) {
  if(typeof parts === "string")return parts;
  let res = "";
  for (let i = 0; i < parts.length; i++) {
      res += parts[i]||"";
      res += inserts[i]||"";
  }
  return res;
}
let id = 0;
export function css(parts, ...inserts) {
  const cssString = makeTemplateStringComplete(parts, inserts);
  style.innerHTML+=`/*${id++}*/${cssString}`.replace(/\n/g,"");
}