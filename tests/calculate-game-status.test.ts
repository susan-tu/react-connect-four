import {describe, expect, test} from '@jest/globals';
import { calculateGameStatus, checkForHorizontalWinner, GameStatus } from '../src/calculate-game-status';
import { SpotValue } from '../src/spot-value';

describe('calculateGameStatus', () => {
  test('correctly identifies horizontal row winner', () => {
    const board = [
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Red,
    ];
    expect(checkForHorizontalWinner(board, 40)).toBe(SpotValue.Red);
    expect(calculateGameStatus(board, 40)).toBe(GameStatus.RedWon);
  });

  test('correctly identifies vertical col winner', () => {
    const board = [
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Empty,
    ];
    expect(calculateGameStatus(board, 16)).toBe(GameStatus.YellowWon);
  });

  test('correctly identifies slash winner', () => {
    const board = [
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty,
    ];
    expect(calculateGameStatus(board, 16)).toBe(GameStatus.YellowWon);
  });

  test('correctly identifies backslash winner', () => {
    const board = [
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Yellow, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty,
    ];
    expect(calculateGameStatus(board, 18)).toBe(GameStatus.YellowWon);
  });

  test('correctly identifies stalemate', () => {
    const board = [
        SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Red,
        SpotValue.Red, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Red,
        SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Red,
        SpotValue.Yellow, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow,
        SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow, SpotValue.Red, SpotValue.Yellow,
        SpotValue.Yellow, SpotValue.Yellow, SpotValue.Yellow, SpotValue.Red, SpotValue.Red, SpotValue.Red, SpotValue.Yellow,
    ];
    expect(calculateGameStatus(board, 16)).toBe(GameStatus.Stalemate);
  });

  test('correctly identifies no winner yet', () => {
    const board = [
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty, SpotValue.Empty,
        SpotValue.Empty, SpotValue.Empty, SpotValue.Empty, SpotValue.Red, SpotValue.Red, SpotValue.Yellow, SpotValue.Empty,
    ];
    expect(calculateGameStatus(board, 16)).toBe(GameStatus.InProgress);
  });
});