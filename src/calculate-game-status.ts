import { SpotValue } from './spot-value'

export enum GameStatus {
  RedWon = 1,
  YellowWon,
  Stalemate,
  InProgress
}

export function checkForHorizontalWinner(board: SpotValue[], lastPlaced: number) : SpotValue | null {
  const rowBoundaries = [0, 7, 14, 21, 28, 35, 42, 49] 
  const rowBoundaryIndexForLastPlaced = Math.floor(lastPlaced / 7);
  const rowStartForLastPlaced = rowBoundaries[rowBoundaryIndexForLastPlaced]
  const rowPastEndForLastPlaced = rowBoundaries[rowBoundaryIndexForLastPlaced + 1]
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
  return null;  
}

function checkForVerticalWinner(board: (SpotValue | null)[], lastPlaced: number) : SpotValue | null {
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
  return null;
}

function checkForSlashWinner(board: (SpotValue | null)[], lastPlaced: number) : SpotValue | null {
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
  return null;
}

function checkForBackslashWinner(board: (SpotValue | null)[], lastPlaced: number) : SpotValue | null {
  const backslashIndices = [
    lastPlaced - 3 * 7 + 3,
    lastPlaced - 2 * 7 + 2,
    lastPlaced - 7 + 1, 
    lastPlaced,
    lastPlaced + 7 - 1,
    lastPlaced + 2 * 7 - 2,
    lastPlaced + 3 * 7 - 3];
  const fromTop = Math.floor(lastPlaced / 7); 
  const fromLeft = lastPlaced % 7;
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
  return null;
}

export function calculateGameStatus(board: SpotValue[], lastPlaced: number | null) : GameStatus {

  if (lastPlaced === null) {
    return GameStatus.InProgress;
  }  

  const winner = checkForHorizontalWinner(board, lastPlaced) || checkForVerticalWinner(board, lastPlaced) || checkForSlashWinner(board, lastPlaced) || checkForBackslashWinner(board, lastPlaced);
  if (winner === SpotValue.Red) {
    return GameStatus.RedWon;
  }

  if (winner === SpotValue.Yellow) {
    return GameStatus.YellowWon;
  }

  if (board.find((spot) => spot === SpotValue.Empty) === undefined) {
    return GameStatus.Stalemate;
  }
  
  return GameStatus.InProgress;
}