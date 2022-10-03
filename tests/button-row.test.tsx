/**
 * @jest-environment jsdom
 */

import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import { ButtonRow } from "../src/button-row";
import React from 'react';

test('ButtonRow does not render any buttons if the game is over', async () => {
  render(<ButtonRow redIsNext={false} isGameEnded={true} topSpotsFilled={[false, false, false, false, false, false, false]} onClick={() => {}}/>);

  const dropButtons = await screen.findAllByRole('button', {name: /drop/i});
  expect(dropButtons).toHaveLength(7);
  dropButtons.map((btn) => expect(btn).toBeDisabled());
});

test('ButtonRow only renders buttons for cols that are not entirely filled', async () => {
  render(<ButtonRow redIsNext={false} isGameEnded={false} topSpotsFilled={[true, true, false, false, false, false, false]} onClick={() => {}}/>);

  const dropButtons = await screen.findAllByRole('button', {name: /drop/i});
  expect(dropButtons).toHaveLength(7);
  const disabledButtons = dropButtons.slice(0, 2);
  const enabledButtons = dropButtons.slice(2);
  disabledButtons.map((btn) => expect(btn).toBeDisabled());
  enabledButtons.map((btn) => expect(btn).toBeEnabled());
});

