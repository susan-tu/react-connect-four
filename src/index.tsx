import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { Game, ThemeProvider } from './game';

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<ThemeProvider><Game /></ThemeProvider>);