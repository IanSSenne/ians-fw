import { dom } from "./dom";
import { StatefulData, stateJoin } from "./state";
import { makeStyles } from "./makestyles";
import { Component } from "./component";
import verbose from "./verbose";
export default {
  dom,
  StatefulData,
  stateJoin,
  makeStyles,
  Component,
  verbose
}

setTimeout(console.log.bind(console,"%cfw2gulp%cby%cIan Senne",
"color:gold;background-color:black;border-radius:3px 0px 0px 3px;padding:3px;font-size:32px",
"color:black;background-color:gray;padding:3px;font-size:32px",
"color:red;background-color:black;border-radius:0px 3px 3px 0px;padding:3px;font-size:32px"));
document.querySelector("[fw-src]").remove();