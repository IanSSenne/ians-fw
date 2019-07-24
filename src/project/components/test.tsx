import fw from "../../fw/index";
const {Component,StatefulData}=fw;
export default class Test extends Component{
    hours:any;
    minutes:any;
    seconds:any;
    id:any;
    constructor(props){
        super(props);
        this.hours = StatefulData(0);
        this.minutes = StatefulData(0);
        this.seconds = StatefulData(0);
        this.id=setInterval(this.updateTimes.bind(this),1000);
    }
    private updateTimes(){
        this.seconds.value++;
        if(this.seconds.value>59){
            this.seconds.value = 0;
            this.minutes.value++;
        }
        if(this.minutes.value>59){
            this.minutes.value = 0;
            this.hours.value++;
        }
    }
    public render(){
        let el = <h1>
            {this.hours.value.toString().padStart(2,"0")}
            :
            {this.minutes.value.toString().padStart(2,"0")}
            :
            {this.seconds.value.toString().padStart(2,"0")}
        </h1>
        return el;
    }
}