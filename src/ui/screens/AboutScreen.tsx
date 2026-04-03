import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors } from '../theme.js';
import { useGameStore } from '../../engine/state.js';

const ABOUT_LINES = [
  '╔══════════════════════════════════════════════════════════╗',
  '║              C L A S S I F I E D                         ║',
  '║              DI7 — EYES ONLY                             ║',
  '╠══════════════════════════════════════════════════════════╣',
  '║                                                          ║',
  '║  DI7 — DATA INTELLIGENCE DIVISION SEVEN                  ║',
  '║                                                          ║',
  '║  Established under directive OMNIUS-7, DI7 operates      ║',
  '║  as a covert rapid-response unit specializing in cyber   ║',
  '║  threat intelligence and incident response.              ║',
  '║                                                          ║',
  '║  Our mission: detect, analyze, and neutralize digital    ║',
  '║  threats before they reach critical mass.                ║',
  '║                                                          ║',
  '║  OMNIUS — our core intelligence system — monitors        ║',
  '║  global network traffic, dark web communications, and    ║',
  '║  threat actor infrastructure around the clock. When      ║',
  '║  OMNIUS identifies a threat, DI7 Observers are deployed. ║',
  '║                                                          ║',
  '║  ─── THE OBSERVER PROGRAM ───                            ║',
  '║                                                          ║',
  '║  You are here because someone believes you have the      ║',
  '║  instincts for this work. The New Observer Orientation   ║',
  '║  Program will determine if they are right.               ║',
  '║                                                          ║',
  '║  ─── CLEARANCE LEVELS ───                                ║',
  '║                                                          ║',
  '║  LEVEL 0   Orientation — Foundations                     ║',
  '║  LEVEL 1   Defensive Operations                          ║',
  '║  LEVEL 2   Offensive Awareness                           ║',
  '║  R1        Advanced Operations (Restricted)              ║',
  '║                                                          ║',
  '║  ─── CREDITS ───                                         ║',
  '║                                                          ║',
  '║  Created by Shiv Garge                                   ║',
  '║  Garge Studio                                            ║',
  '║                                                          ║',
  '║  Powered by OMNIUS v4.2.1                                ║',
  '║                                                          ║',
  '║  Source material:                                        ║',
  '║  · Security Engineering — Ross Anderson                  ║',
  '║  · The Hacker Playbook 3 — Peter Kim                     ║',
  '║  · Web App Hacker\'s Handbook — Stuttard & Pinto          ║',
  '║                                                          ║',
  '╚══════════════════════════════════════════════════════════╝',
];

export function AboutScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const [scrollOffset, setScrollOffset] = useState(0);

  const visibleLines = 30;
  const maxScroll = Math.max(0, ABOUT_LINES.length - visibleLines);

  useInput((_input, key) => {
    if (key.return || key.escape) {
      setScreen('title');
    }
    if (key.upArrow) {
      setScrollOffset((s) => Math.max(0, s - 1));
    }
    if (key.downArrow) {
      setScrollOffset((s) => Math.min(maxScroll, s + 1));
    }
  });

  return (
    <Box flexDirection="column" paddingX={4} paddingY={1}>
      <Box flexDirection="column">
        {ABOUT_LINES.slice(scrollOffset, scrollOffset + visibleLines).map((line, i) => (
          <Text key={i} color={line.includes('───') ? colors.omnius : line.includes('╔') || line.includes('╚') || line.includes('╠') ? colors.omnius : colors.dim}>
            {line}
          </Text>
        ))}
      </Box>

      {maxScroll > 0 && (
        <Box marginTop={1}>
          <Text color={colors.dim}>
            ↑↓ Scroll · {scrollOffset > 0 ? '▲' : ' '} {scrollOffset < maxScroll ? '▼' : ' '}
          </Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text color={colors.dim}>
          Press <Text color={colors.cyan} bold>ESC</Text> or <Text color={colors.cyan} bold>ENTER</Text> to return
        </Text>
      </Box>
    </Box>
  );
}
