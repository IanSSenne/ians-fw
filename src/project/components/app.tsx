import fw from "../../fw/index";
import Test from "./test";
fw.makeStyles({
  ".approot": {
    width: "100vw",
    height: "100vh",
    top: 0,
    left: 0,
    margin: "0px",
    position:"absolute",
    color:"black"
  }
});
export default function App() {
  return (
    <div className="approot">
      <Test></Test>
    </div>
  )
}