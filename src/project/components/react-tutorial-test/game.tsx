import fw from "../../../fw/index";
import {OStatefulData} from "./../../../fw/state";
class Square extends fw.Component {
    state:OStatefulData<boolean|null>;
    constructor(props){
        super(props);
        this.state = fw.StatefulData<boolean|null>(this.props.value);
    }
    render() {
      return (
        <button className="square" onclick={()=>{
            if(this.props.value!=""){
                this.props.value.value=this.props.next.value;
                this.props.onClick()
              }
            }}>
          {this.state.value}
        </button>
      );
    }
  }
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}
class Board extends fw.Component {
    squares:any;
    next:OStatefulData<string> = fw.StatefulData("X");
    constructor(props){
        super(props);
        this.squares = Array(9).fill(0).map((_,i)=>fw.StatefulData<string>(""));
    }
    onClick(){
        let last = this.next.value;
        if(last==="X"){
            this.next.value="O";
        }else{
            this.next.value="X";
        }
    }
    renderSquare(i) {
      return <Square value={this.squares[i]} next={this.next} onClick={()=>this.onClick()}/>;
    }
  
    render() {
      let status = 'Next player: ' + this.next.value;
      const winner = calculateWinner(this.squares);
      if(winner){
          status = `Winner: ${winner}`;
      }
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }

  export class Game extends fw.Component {
      constructor(props){
          super(props);
      }
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }

  export class Clock extends fw.Component {
    clock:OStatefulData<number>;
    constructor(props){
      super(props);
      this.clock=fw.StatefulData(0);
      setInterval(()=>this.clock.value++);
    }
    render(){
      let t = ~~(Date.now());
      return (
        <div>
          {t}
        </div>
      );
    }
  }
  
  // ========================================