import fw from "../fw/index.js";
// console.log(fw.dom("div",null).element);
import App from "./components/app.js";
const app = <App></App> as any;
function attempAppendIfBodyRAF() {
  if (document.body) {
    document.body.appendChild(app.element);
  } else {
    requestAnimationFrame(attempAppendIfBodyRAF);
  }
}
try {
  document.body.appendChild(app.element);
} catch (e) {
  attempAppendIfBodyRAF();
}