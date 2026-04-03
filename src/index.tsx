#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './app.js';

// Clear screen and set title
process.stdout.write('\x1b[2J\x1b[H'); // Clear screen
process.stdout.write('\x1b]0;OMNIUS\x07'); // Set terminal title

const { waitUntilExit } = render(<App />);

waitUntilExit().then(() => {
  process.stdout.write('\x1b[2J\x1b[H'); // Clear on exit
  console.log('Connection terminated. Stay vigilant, Analyst.');
  process.exit(0);
});
