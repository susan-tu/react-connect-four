/**
 * @jest-environment jsdom
 */

import {render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Game, ThemeProvider } from "../src/game";
import React from 'react';

test('Game shows reset button if there is a winner, and pressing reset clears board', async () => {
  render(<ThemeProvider><Game /></ThemeProvider>);

  const dropButtons = await screen.findAllByRole('button', {name: /drop/i});
  expect(dropButtons).toHaveLength(7);
  expect(screen.queryByRole('button', {name: /restart/i})).toBeNull();
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[0]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[1]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[0]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[1]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[0]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[1]);
  fireEvent.click(screen.getAllByRole('button', {name: /drop/i})[0]); // red wins
  const restartButton = await screen.findAllByRole('button', {name: /restart/i});
  expect(restartButton).toHaveLength(1);
  fireEvent.click(restartButton[0]);
  const spots = screen.getAllByTestId('spot');
  expect(spots).toHaveLength(42);
  spots.map((spot) => expect(spot).toHaveStyle(`background-image: antiquewhite`));
});