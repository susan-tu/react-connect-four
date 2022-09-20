import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/*class Square extends React.Component {

  render() {
    return (
      <button className="square" onClick={() => { this.props.onClick() }}>
        {this.props.value}
      </button>
    );
  }
}*/

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [Array(9).fill(null)],
      xIsNext: true,
      moveToShow: null,
    };
  }

  handleClick(i) {
    const squares = this.state.history[this.state.history.length - 1].slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    const winner = calculateWinner(squares);
    const moveToShow = winner ? this.state.history.length : null;
    this.setState({history: this.state.history.concat([squares]), xIsNext: !this.state.xIsNext, moveToShow: moveToShow})
  }

  renderSquare(i) {
    const moveToShow = this.state.moveToShow !== null ?  this.state.moveToShow : this.state.history.length - 1;
    return <Square value={this.state.history[moveToShow][i]} onClick={() => this.handleClick(i)}/>;
  }

  renderMoveRow(state, i) {
    return (
      <li key={i}>
        <button onClick={() => this.setState({...this.state, moveToShow: i})}>Go to move #{i}</button>
      </li>
    );
  }

  renderMoves() {
    return (
      <ol>
        {this.state.history.map((state, i) => this.renderMoveRow(state, i))}
      </ol>
    );
  }

  render() {
    const winner = calculateWinner(this.state.history[this.state.history.length - 1]);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">
          {status}
          {this.state.moveToShow !== null && this.renderMoves()}
        </div>

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

class Game extends React.Component {
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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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