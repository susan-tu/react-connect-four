import * as React from 'react';
import { useContext, useState } from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';


const themes = {
  seventies: {
    foreground: "antiquewhite",
    background: "teal", 
    red: "salmon",
    yellow: "goldenrod",
  },
  classic: {
    foreground: "white",
    background: "steelblue",
    red: "red",
    yellow: "yellow",
  }
};
type Theme = {
  foreground: string;
  background: string;
  red: string;
  yellow: string;
}
type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState(themes.classic)
  const toggleTheme = () => {
    setTheme(theme === themes.classic ? themes.seventies : themes.classic);
  }

  return (
    <ThemeContext.Provider value={{ theme , toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

type ButtonRowProps = {
  redIsNext: boolean;
  isGameEnded: boolean;
  topSpotsFilled: boolean[];
  onClick: (i: number) => void;
}

const ButtonRow = ({redIsNext, isGameEnded, topSpotsFilled, onClick}: ButtonRowProps) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const renderButton = (i: number) => {
    const classes = `drop-btn ${redIsNext ? 'drop-btn--red' : 'drop-btn--black'}`;
    return (
      <button key={`button-${i}`} disabled={isGameEnded || topSpotsFilled[i]} className={classes} onClick={() => onClick(i)}>drop</button>
    );
  }
  
  return (
    <div>
      {Array.from(Array(7).keys()).map((i) => renderButton(i))}
    </div>
  );
}

type RowProps = {
  value: string[];
}
const Row = ({value}: RowProps) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const getColor = (val: string) => {
    switch(val) {
      case 'red':
        return theme.red;
      case 'black':
        return theme.yellow;
      default:
        return 'antiquewhite';
    }

  }
 
  return (
    <div className="board-row">
      {Array.from(Array(7).keys()).map((i) => 
        <span key={`spot-${i}`} className="spot" style={{backgroundColor: getColor(value[i])}} ></span>)}
    </div>
  );
}

const Game = () => {
  const [board, setBoard] = useState(Array(7*6).fill(null));
  const [redIsNext, setRedIsNext] = useState(true);
  const [lastPlaced, setLastPlaced] = useState<number | null>(null);

  const handleClick = (i: number) => {
    let currBoard = board.slice();
    const col = [i, 7 + i, 14 + i, 21 + i, 28 + i, 35 + i];
    console.log(board);
    const indexToFill = col.reverse().find((spot) => board[spot] === null);
    if (indexToFill === undefined) {
      console.log('Unable to handleClick due to there not being an empty spot in this column');
    } else {
      currBoard[indexToFill] = redIsNext ? 'red' : 'black';
      setBoard(currBoard);
      setRedIsNext(!redIsNext);
      setLastPlaced(indexToFill);
    }
  }

  const handleClickPlayAgain = () => {
    setBoard(Array(7*6).fill(null));
    setRedIsNext(true);
  }

  const renderGameStatus = (winner: string | null) => {
    if (winner === null) {
      return (
         <div className='status'>
          <br/>It's {redIsNext ? 'red' : 'black'}'s turn, make a move...
        </div>
      );
    } else if (winner === 'Stalemate') {
      return (
        <div className='status'>
          <br/>
          The game has ended in a stalemate.
          <br/>
          <br/>
          <button className='play-again-btn' onClick={() => handleClickPlayAgain()}>restart</button>
        </div>
      );
    } else {
      return (
        <div className='status'>
          <br/>
          {winner} won the game!
          <br/>
          <br/>
          <button className='play-again-btn' onClick={() => handleClickPlayAgain()}>restart</button>
        </div>
      );
    }
  }

  
    const winner = calculateWinner(board, lastPlaced);
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
      
      <div className="game">
          <h1>Connect 4</h1>
        <div className="game-board">
          <ButtonRow isGameEnded={winner !== null} redIsNext={redIsNext} topSpotsFilled={board.slice(0, 7).map((value) => value !== null)} onClick={handleClick}/>
          <Row value={board.slice(0, 7)}/>
          <Row value={board.slice(7, 14)}/>
          <Row value={board.slice(14, 21)}/>
          <Row value={board.slice(21, 28)}/>
          <Row value={board.slice(28, 35)}/>
          <Row value={board.slice(35, 42)}/>
        </div>
        {renderGameStatus(winner)}
        <label className="switch">
          <input type="checkbox"></input>
          <span className="slider round" onClick={toggleTheme}></span>
        </label>
      </div>
    );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<ThemeProvider><Game /></ThemeProvider>);

function calculateWinner(board: string[], lastPlaced: number | null) : string | null {

  if (lastPlaced === null) {
    return null;
  }  // check horizontal
  const rowBoundaries = [0, 7, 14, 21, 28, 35, 42] 
  const rowBoundaryIndexForLastPlaced = rowBoundaries.length - rowBoundaries.reverse().findIndex((boundary) => lastPlaced < boundary)
  const rowStartForLastPlaced = rowBoundaries[rowBoundaryIndexForLastPlaced - 1]
  const rowPastEndForLastPlaced = rowBoundaries[rowBoundaryIndexForLastPlaced]
  let startFourInRowCheck = Math.max(lastPlaced - 3, rowStartForLastPlaced)
  while (startFourInRowCheck + 3 < rowPastEndForLastPlaced) {
    if (board[lastPlaced] === board[startFourInRowCheck] && 
    board[lastPlaced] === board[startFourInRowCheck + 1] &&
    board[lastPlaced] === board[startFourInRowCheck + 2] &&
    board[lastPlaced] === board[startFourInRowCheck + 3]) {
      return board[lastPlaced];
    } else {
      startFourInRowCheck += 1;
    }
  }  

  // check vertical 
  let indexToCheckInCol = lastPlaced + 7;
  let numConsecutive = 1;
  while (indexToCheckInCol < 42) {
    if (board[indexToCheckInCol] === board[lastPlaced]) {
      numConsecutive += 1;
      if (numConsecutive === 4) {
        return board[lastPlaced];
      }
      indexToCheckInCol += 7;
    } else {
      break;
    }
  }


  // check slash diagonal
  const slashIndices = [
    lastPlaced - 3 * 7 - 3, 
    lastPlaced - 2 * 7 - 2, 
    lastPlaced - 7 - 1, 
    lastPlaced,
    lastPlaced + 7 + 1,
    lastPlaced + 2 * 7 + 2,
    lastPlaced + 3 * 7 + 3];
  const fromTop = Math.floor(lastPlaced / 7); 
  const fromLeft = lastPlaced % 7;
  const numLeft = Math.min(3, Math.min(fromTop, fromLeft));
  const numRight = Math.min(3, Math.min(5 - fromTop, 6 - fromLeft));
  const keptSlashIndices = slashIndices.slice(3 - numLeft, 3 + numRight + 1);
  for (let i = 0; i < keptSlashIndices.length - 3; i++) {
    if (board[keptSlashIndices[i]] === board[keptSlashIndices[i+1]] && 
    board[keptSlashIndices[i+1]] === board[keptSlashIndices[i+2]] &&
    board[keptSlashIndices[i+2]] === board[keptSlashIndices[i+3]]) {
      return board[lastPlaced];
    }
  }

  // check backslash diagonal
  const backslashIndices = [
    lastPlaced - 3 * 7 + 3,
    lastPlaced - 2 * 7 + 2,
    lastPlaced - 7 + 1, 
    lastPlaced,
    lastPlaced + 7 - 1,
    lastPlaced + 2 * 7 - 2,
    lastPlaced + 3 * 7 - 3];
  const backslashNumLeft = Math.min(3, Math.min(5 - fromTop, fromLeft));
  const backslashNumRight = Math.min(3, Math.min(fromTop, 6 - fromLeft));
  const keptBackslashIndices = backslashIndices.slice(3 - backslashNumRight, 3 + backslashNumLeft + 1);
  for (let i = 0; i < keptBackslashIndices.length - 3; i++) {
    const indicesToCheck = keptBackslashIndices.slice(i, i+4);
    if (board[indicesToCheck[0]] === board[indicesToCheck[1]] && 
    board[indicesToCheck[1]] === board[indicesToCheck[2]] &&
    board[indicesToCheck[2]] === board[indicesToCheck[3]]) {
      return board[lastPlaced];
    }
  }

  if (board.find((spot) => spot === null) === undefined) {
    return 'Stalemate';
  }
  return null;
}