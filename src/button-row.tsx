import * as React from 'react';

type ButtonRowProps = {
  redIsNext: boolean;
  isGameEnded: boolean;
  topSpotsFilled: boolean[];
  onClick: (i: number) => void;
}

export const ButtonRow = ({redIsNext, isGameEnded, topSpotsFilled, onClick}: ButtonRowProps) => {
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