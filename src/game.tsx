import * as React from 'react';
import { useContext, useState } from 'react';
import { ButtonRow } from './button-row';
import { calculateGameStatus, GameStatus } from './calculate-game-status';
import { SpotValue } from './spot-value'
import './index.css';

const themes = {
  seventies: {
    red: "salmon",
    yellow: "goldenrod",
  },
  classic: {
    red: "red",
    yellow: "yellow",
  }
};
type Theme = {
  red: string;
  yellow: string;
}
type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext);

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState(themes.classic)
  const toggleTheme = () => {
    setTheme(theme === themes.classic ? themes.seventies : themes.classic);
  }

  return (
    <ThemeContext.Provider value={{ theme , toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

type RowProps = {
  value: SpotValue[];
}

const Row = ({value}: RowProps) => {
  const { theme } = useContext(ThemeContext);
  const getColor = (val: SpotValue) => {
    switch(val) {
      case SpotValue.Red:
        return theme.red;
      case SpotValue.Yellow:
        return theme.yellow;
      default: // empty spot
        return 'antiquewhite';
    }

  }
 
  return (
    <div className="board-row">
      {Array.from(Array(7).keys()).map((i) => 
        <span data-testid="spot" key={`spot-${i}`} className="spot" style={{backgroundColor: getColor(value[i])}} ></span>)}
    </div>
  );
}

export const Game = () => {
  const [board, setBoard] = useState(Array(7*6).fill(SpotValue.Empty));
  const [redIsNext, setRedIsNext] = useState(true);
  const [lastPlaced, setLastPlaced] = useState<number | null>(null);

  const handleClick = (colIndex: number) => {
    let currBoard = board.slice();
    const col = [colIndex, 7 + colIndex, 14 + colIndex, 21 + colIndex, 28 + colIndex, 35 + colIndex];
    const indexToFill = col.reverse().find((spot) => board[spot] === SpotValue.Empty);
    if (indexToFill === undefined) {
      console.log('Unable to handleClick due to there not being an empty spot, the drop button in this col should have been disabled');
    } else {
      currBoard[indexToFill] = redIsNext ? SpotValue.Red : SpotValue.Yellow;
      setBoard(currBoard);
      setRedIsNext(!redIsNext);
      setLastPlaced(indexToFill);
    }
  }

  const handleClickPlayAgain = () => {
    setBoard(Array(7*6).fill(SpotValue.Empty));
    setRedIsNext(true);
  }

  const renderGameStatus = (status: GameStatus) => {
    switch(status) {
      case GameStatus.InProgress:
        return (
          <div className='status'>
            <br/>It's {redIsNext ? 'red' : 'yellow'}'s turn, make a move...
          </div>
        );
      case GameStatus.Stalemate:
        return (
          <div className='status'>
            <br/>
            The game has ended in a stalemate.
            <br/>
            <br/>
            <button className='play-again-btn' onClick={() => handleClickPlayAgain()}>restart</button>
          </div>
        );
      default:
        return (
          <div className='status'>
            <br/>
            {(status === GameStatus.RedWon) ? 'red' : 'yellow'} won the game!
            <br/>
            <br/>
            <button className='play-again-btn' onClick={() => handleClickPlayAgain()}>restart</button>
          </div>
        );
    }
  }
  
  const status = calculateGameStatus(board, lastPlaced);
  const { toggleTheme } = useContext(ThemeContext);
  return (    
      <div className="game">
          <h1>Connect 4</h1>
        <div className="game-board">
          <ButtonRow isGameEnded={status !== GameStatus.InProgress} redIsNext={redIsNext} topSpotsFilled={board.slice(0, 7).map((value) => value !== SpotValue.Empty)} onClick={handleClick}/>
          <Row value={board.slice(0, 7)}/>
          <Row value={board.slice(7, 14)}/>
          <Row value={board.slice(14, 21)}/>
          <Row value={board.slice(21, 28)}/>
          <Row value={board.slice(28, 35)}/>
          <Row value={board.slice(35, 42)}/>
        </div>
        {renderGameStatus(status)}
        <label className="switch">
          <input type="checkbox"></input>
          <span className="slider round" onClick={toggleTheme}></span>
        </label>
      </div>
    );
}