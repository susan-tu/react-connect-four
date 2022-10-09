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
  const toggleTheme = React.useCallback(
    () => {
      setTheme(theme === themes.classic ? themes.seventies : themes.classic);
    },
    [theme, themes]
  );

  return (
    <ThemeContext.Provider value={{ theme , toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

type RowProps = {
  values: SpotValue[];
}

const Row = ({values}: RowProps) => {
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
      {values.map((value, i) =>
        <span data-testid="spot" key={i} className="spot" style={{backgroundColor: getColor(value)}} ></span>)}
    </div>
  );
}

type State = {
  board: SpotValue[],
  redIsNext: boolean,
  lastPlaced: number | null
}
const initialState: State = {
  board: Array(7*6).fill(SpotValue.Empty),
  redIsNext: true,
  lastPlaced: null
}

type Action =
  | { type: 'drop', column: number }
  | { type: 'restart' }


function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'drop':
      let currBoard = state.board.slice();
      const colIndex = action.column;
      const col = [colIndex, 7 + colIndex, 14 + colIndex, 21 + colIndex, 28 + colIndex, 35 + colIndex];
      const indexToFill = col.reverse().find((spot) => state.board[spot] === SpotValue.Empty);
      if (indexToFill === undefined) {
        console.log(`Unable to handle drop action in col ${colIndex} due to there not being an empty spot, the drop button should have been disabled`);
        return state;
      } else {
        currBoard[indexToFill] = state.redIsNext ? SpotValue.Red : SpotValue.Yellow;
        return  { board: currBoard, redIsNext: !state.redIsNext, lastPlaced: indexToFill};
      }
    case 'restart':
      return initialState;
  }
}

export const Game = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const renderGameStatus = (status: GameStatus) => {
    switch(status) {
      case GameStatus.InProgress:
        return (
          <div className='status'>
            <br/>It's {state.redIsNext ? 'red' : 'yellow'}'s turn, make a move...
          </div>
        );
      case GameStatus.Stalemate:
        return (
          <div className='status'>
            <br/>
            The game has ended in a stalemate.
            <br/>
            <br/>
            <button className='play-again-btn' onClick={() => dispatch({type: 'restart'})}>restart</button>
          </div>
        );
      default:
        return (
          <div className='status'>
            <br/>
            {(status === GameStatus.RedWon) ? 'red' : 'yellow'} won the game!
            <br/>
            <br/>
            <button className='play-again-btn' onClick={() => dispatch({type: 'restart'})}>restart</button>
          </div>
        );
    }
  }
  
  const status = calculateGameStatus(state.board, state.lastPlaced);
  const { toggleTheme } = useContext(ThemeContext);
  return (    
      <div className="game">
          <h1>Connect 4</h1>
        <div className="game-board">
          <ButtonRow isGameEnded={status !== GameStatus.InProgress} redIsNext={state.redIsNext} topSpotsFilled={state.board.slice(0, 7).map((value) => value !== SpotValue.Empty)} onClick={(i) => dispatch({type: 'drop', column: i})}/>
          <Row values={state.board.slice(0, 7)}/>
          <Row values={state.board.slice(7, 14)}/>
          <Row values={state.board.slice(14, 21)}/>
          <Row values={state.board.slice(21, 28)}/>
          <Row values={state.board.slice(28, 35)}/>
          <Row values={state.board.slice(35, 42)}/>
        </div>
        {renderGameStatus(status)}
        <label className="switch">
          <input type="checkbox"></input>
          <span className="slider round" onClick={toggleTheme}></span>
        </label>
      </div>
    );
}