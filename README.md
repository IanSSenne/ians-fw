# ians-fw
by: Ian Senne

## Install

`$ npm i ians-fw`

## Features

- Basic support for ie11, edge, chrome, and firefox
- Comes with a developement server, and an fw-script command

### fw-scripts
for developement, `$ fw-scripts dev` will watch for file changes in the project and rebuild build file is exposed on the development server under `/~/index.js`, there is currently no live reloading.

in progress is `$ fw-scripts build` which will when done output a file or set of files for use in production.

### framework
ians-fw export an object with the following properties, `dom`, `StatefulData`, `stateJoin`, `css`, `Component`, and `verbose`
further mentions of `fw` will assume that fw is the result of importing `ians-fw`

####dom
`fw.dom(element_name/component,props|null,...children);`
returns a `VElement` or component instance

###StatefulData
`fw.StatefulData(value);`
returns an `OStatefulData` instance
(note: this object may behave differently depending on context)
###stateJoin
`fw.stateJoin(...values);`
returns an StatefulData like object which has a getter for value that will return a string concatination of all inputs, updates relient objects when any inputs of type `OStatefulData` or resulting from `fw.stateJoin` update

###css
`fw.css(rawstring,...parts);`
appends css given by template literal call to the frameworks generated style tag.
ex. ````fw.css`.test{color:red;}` ````

###Component
`fw.Component` is a class meant to be extended to create a class based component, used much like reacts `React.Component` object
###verbose
`fw.verbose`
returns an object which has a getter and setter for enabled and 3 functions, `fw.verbose.log(...contents)` `fw.verbose.warn(...contents)` and `fw.verbose.error(...contents)`




#Stateful Data

Stateful data will behave differently if used in a functional component vs a class based component, in a functional component state is not bound to the component but any element 
```jsx
import fw from 'ians-fw';
export function ExampleComponent(props){
	const count = fw.StatefulData(0);
	setInterval(()=>{count.value++;},1000);
	return <div>{count}</div>
}
```
count updating in this case will only update the content of the div instead of causing a rerender.

within class based components it is expected that any stateful data is defined within the constructor 
```jsx
import fw from 'ians-fw';
export class ExampleComponent extends fw.Component{
  constructor(props){
  		super(props);
		this.count = fw.StatefulData(0);
		setInterval(()=>{this.count.value++},1000);
   }
   render(){
   		return <div>{this.count.value}</div>
  }
}
```

in this case the stateful data is bound to the component and will queue a rerender whenever it updates.