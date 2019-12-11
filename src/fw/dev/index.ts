import './polyfills';
import { dom } from './dom';
import { StatefulData, stateJoin } from './state';
import { css } from './makestyles';
import { Component } from './component';
import verbose from './verbose';
import { Ref } from "./ref";
export default {
	dom,
	StatefulData,
	stateJoin,
	css,
	Component,
	verbose,
	Ref
};
export * from './component';
export * from './dom';
export * from './ie_Symbol';
export * from './makestyles';
export * from './prod';
export * from './state';
export * from './util';
export * from './verbose';
