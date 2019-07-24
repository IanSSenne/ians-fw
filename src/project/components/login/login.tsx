import fw from "../../../fw/index";
const styles = fw.makeStyles({
  ".login":{
    width:"280px"
  }
})

fw.makeStyles({
  "form":{
  "width": "320px",
  "margin-top": "45px",
  "margin-right": "auto",
  "margin-bottom": "45px",
  "margin-left": "auto"
},"form h1":{
  "font-size": "3em",
  "font-weight": "300",
  "text-align": "center"
},"form h5":{
  "text-align": "center",
  "text-transform": "uppercase",
  "color": "rgb(198, 198, 198)"
},"form hr.sep":{
  "background-color": "rgb(33, 150, 243)",
  "box-shadow": "none",
  "border-top-style": "none",
  "border-right-style": "none",
  "border-bottom-style": "none",
  "border-left-style": "none",
  "height": "2px",
  "width": "25%",
  "margin-top": "0px",
  "margin-right": "auto",
  "margin-bottom": "45px",
  "margin-left": "auto"
},"form .emoji":{
  "font-size": "1.2em"
},".group":{
  "position": "relative",
  "margin-top": "45px",
  "margin-right": "0px",
  "margin-bottom": "45px",
  "margin-left": "0px"
},"textarea":{
  "resize": "none"
},"input, textarea":{
  "background-image": "none",
  "font-size": "18px",
  "padding-top": "10px",
  "padding-right": "10px",
  "padding-bottom": "10px",
  "padding-left": "5px",
  "display": "block",
  "width": "320px",
  "border-top-style": "none",
  "border-right-style": "none",
  "border-left-style": "none",
  "border-top-left-radius": "0px",
  "border-top-right-radius": "0px",
  "border-bottom-right-radius": "0px",
  "border-bottom-left-radius": "0px",
  "border-bottom-width": "1px",
  "border-bottom-style": "solid",
  "border-bottom-color": "rgb(198, 198, 198)"
},"input:focus, textarea:focus":{
  "outline-style": "none",
  "outline-width": "initial"
},"input:focus ~ label, input:valid ~ label, textarea:focus ~ label, textarea:valid ~ label":{
  "top": "-14px",
  "font-size": "12px",
  "color": "rgb(33, 150, 243)"
},"input:focus ~ .bar::before, textarea:focus ~ .bar::before":{
  "width": "320px"
},"input[type=\"password\"]":{
  "letter-spacing": "0.3em"
},"label":{
  "font-size": "16px",
  "font-weight": "normal",
  "position": "absolute",
  "pointer-events": "none",
  "left": "5px",
  "top": "10px",
  "transition-duration": "300ms",
  "transition-timing-function": "ease",
  "transition-delay": "0s",
  "transition-property": "all"
},".bar":{
  "position": "relative",
  "display": "block",
  "width": "320px"
},".bar::before":{
  "content": "\"\"",
  "height": "2px",
  "width": "0px",
  "bottom": "0px",
  "position": "absolute",
  "background-color": "rgb(33, 150, 243)",
  "transition-duration": "300ms",
  "transition-timing-function": "ease",
  "transition-delay": "0s",
  "tranwhitesition-property": "all",
  "left": "0%"
},".bar-error::before":{
  "content": "\"\"",
  "height": "2px",
  "width": "0px",
  "bottom": "0px",
  "position": "absolute",
  "background-color": "white",
  "transition-duration": "300ms",
  "transition-timing-function": "ease",
  "transition-delay": "0s",
  "transition-property": "all",
  "left": "0%"
},".bar-error":{
  "color":"white"
},
".btn":{
  "background-color": "rgb(255, 255, 255)",
  "color": "white",
  "border-top-style": "none",
  "border-right-style": "none",
  "border-bottom-style": "none",
  "border-left-style": "none",
  "padding-top": "10px",
  "padding-right": "20px",
  "padding-bottom": "10px",
  "padding-left": "20px",
  "border-top-left-radius": "3px",
  "border-top-right-radius": "3px",
  "border-bottom-right-radius": "3px",
  "border-bottom-left-radius": "3px",
  "letter-spacing": "0.06em",
  "text-transform": "uppercase",
  "text-decoration-line": "none",
  "outline-style": "none",
  "box-shadow": "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
  "transition-duration": "0.3s",
  "transition-timing-function": "cubic-bezier(0.25, 0.8, 0.25, 1)",
  "transition-delay": "0s",
  "transition-property": "all"
},".btn:hover":{
  "color": "white",
  "box-shadow": "rgba(0, 0, 0, 0.18) 0px 7px 14px, rgba(0, 0, 0, 0.12) 0px 5px 5px"
},".btn.btn-link":{
  "background-color": "rgb(33, 150, 243)",
  "color": "rgb(211, 234, 253)"
},".btn.btn-link:hover":{
  "background-color": "rgb(13, 138, 238)",
  "color": "rgb(222, 239, 253)"
},".btn.btn-submit":{
  "transition":"1s",
  "background-color": "rgb(33, 150, 243)",
  "color": "white"
},".btn.btn-submit:hover":{
  "background-color": "rgb(13, 138, 238)",
  "color": "white"
},".btn.btn-cancel:hover":{
  "background-color": "rgb(225, 225, 225)",
  "color": "rgb(139, 139, 139)"
},".btn.btn-cancel":{
  "transition":"1s",
  "background-color": "rgb(238, 238, 238)"
},".btn-box":{
  "text-align": "center",
  "margin-top": "50px",
  "margin-right": "0px",
  "margin-bottom": "50px",
  "margin-left": "0px"
}
});
function submit(evt){
  console.log(evt);
}
export default function Login() {
  const username = fw.StatefulData("");
  const password = fw.StatefulData("");
  const buttontype = fw.StatefulData("submit");
  const validusername = fw.StatefulData("");
  const validpassword = fw.StatefulData("");
  return (
<div class="wrapper">
  <form onsubmit={function(evt){
    evt.preventDefault();
    if(username.value.length>5){
      validusername.value="";
    }else{
      validusername.value="bar-error";
    }
    buttontype.value="submit";
    if(buttontype.value==="cancel")return false;
    submit(evt);
    buttontype.value="cancel";
    return false;
  }}>
    <h1 class="logintitle">Login</h1>
    <div class="group">
      <input type="text" requiwhite="requiwhite" onchange={function({target}){
        username.value = target.value;
      }} value={username} autocomplete="username" id="username"/>
      <span class="highlight"></span>
      <span className={fw.stateJoin("bar ",validusername)}></span>
      <label for="username">Email</label>
    </div>
    <div class="group">
      <input type="password" requiwhite="requiwhite" onchange={function({target}){
        password.value = target.value;
      }} value={password} autocomplete="current-password" id="password"/>
      <span class="highlight"></span>
      <span className={fw.stateJoin("bar ",validpassword)}></span>
      <label className={validpassword}>Password</label>
      <label for="password"></label>
    </div>
    <div class="btn-box">
      <button className={fw.stateJoin("btn btn-",buttontype)} type="submit">submit</button>
    </div>
  </form>
</div>
  );
}