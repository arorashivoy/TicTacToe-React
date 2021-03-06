import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class WonSquare extends React.Component {
  render() {
    return (
      <button 
        className="won-square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

  
class Board extends React.Component {
  renderSquare(i) {
    const won = this.props.wonSquares.includes(i);

    if (won) {
      return (
        <WonSquare 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    } else {
      return (
          <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
          />
      );
    }
  }

  render() {
    let boardRows = [];
    for (let row = 0; row < 3; row++) {
      let boardCols = [];
      for (let col = 0; col < 3; col++){
        boardCols.push(<span key={(row*3)+col}>{this.renderSquare((row*3)+col)}</span>);
      };
      boardRows.push(<div key={row}>{boardCols}</div>);
    }

    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares)[0] || squares[i]) {
      return ;
    }

    squares[i] = this.state.xIsNext ? "X":"O";
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step%2) === 0,
    });
  }

  checkNoNull(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        return false
      }
    }
    return true
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    if (!winner[0]) {
      winner[1] = Array(3).fill(null);
    }

    const moves = history.map((step,  move) => {
      let col, row;
      if (move !== 0){
        for (let i = 0; i < 9; i++) {
          if (this.state.history[move-1].squares[i] !== step.squares[i]) {
            col = Math.floor(i/3) 
            row = i - (3*col)
          }
        };
      };

      const desc = move ?
        'Go to move #' + move + ' (' + (col+1) + ', ' + (row+1) + ")":
        'Go to game start';
      
        if (move === this.state.stepNumber) {
          return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
            </li>
          )
        } else {
          return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          )
        };
    });

    const noNull = this.checkNoNull(current.squares)
    let status;
    if (winner[0]) {
      status = 'Winner: ' + winner[0];
    }
    else if (noNull) {
      status = 'It is a DRAW'
    }
    else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X':'O');
    }

    return (
      <div className="game">
        <div className="status">{status}</div>
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            // wonSquares={this.state.wonSquares}
            wonSquares={winner[1]}
          />
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
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
    if (squares[b] === squares[c] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, Array(3).fill(null)];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

