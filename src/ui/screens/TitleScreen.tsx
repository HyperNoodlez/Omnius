import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { TITLE_ART, SUBTITLE, colors } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import { Spinner } from '../components/Spinner.js';

type MenuOption = 'new' | 'continue' | 'about';

export function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const [phase, setPhase] = useState<'boot' | 'title' | 'menu'>('boot');
  const [selected, setSelected] = useState<MenuOption>('new');
  const [bootLine, setBootLine] = useState(0);

  const hasSave = completedMissions.length > 0;

  // Boot sequence animation
  const bootLines = [
    'Initializing secure connection...',
    'Establishing encrypted tunnel...',
    'Verifying clearance level...',
    'Loading OMNIUS kernel v4.2.1...',
    'Threat intelligence database: ONLINE',
    'Neural pattern analyzer: STANDBY',
    'Connection established.',
  ];

  useEffect(() => {
    if (phase !== 'boot') return;

    const timer = setInterval(() => {
      setBootLine((prev) => {
        if (prev >= bootLines.length - 1) {
          clearInterval(timer);
          setTimeout(() => setPhase('title'), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'title') {
      setTimeout(() => setPhase('menu'), 1500);
    }
  }, [phase]);

  const menuOptions: { key: MenuOption; label: string; available: boolean }[] = [
    { key: 'new', label: 'NEW GAME', available: true },
    { key: 'continue', label: 'CONTINUE', available: hasSave },
    { key: 'about', label: 'ABOUT', available: true },
  ];

  const availableOptions = menuOptions.filter((o) => o.available);

  useInput((input, key) => {
    if (phase !== 'menu') {
      // Skip animations on any key press
      if (phase === 'boot') {
        setBootLine(bootLines.length - 1);
        setPhase('title');
      }
      if (phase === 'title') {
        setPhase('menu');
      }
      return;
    }

    const currentIndex = availableOptions.findIndex((o) => o.key === selected);

    if (key.upArrow) {
      const prev = Math.max(0, currentIndex - 1);
      setSelected(availableOptions[prev]!.key);
    }
    if (key.downArrow) {
      const next = Math.min(availableOptions.length - 1, currentIndex + 1);
      setSelected(availableOptions[next]!.key);
    }
    if (key.return) {
      if (selected === 'new') {
        setScreen('hub');
      } else if (selected === 'continue') {
        setScreen('hub');
      } else if (selected === 'about') {
        // For now, just flash info (we can build a proper about screen later)
      }
    }
  });

  // Boot phase
  if (phase === 'boot') {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        {bootLines.slice(0, bootLine + 1).map((line, i) => (
          <Text key={i} color={i === bootLine ? colors.matrix : colors.dim}>
            {i < bootLine ? '✓' : '>'} {line}
          </Text>
        ))}
        {bootLine < bootLines.length - 1 && (
          <Box marginTop={1}>
            <Spinner label="Connecting..." />
          </Box>
        )}
      </Box>
    );
  }

  // Title and menu
  return (
    <Box flexDirection="column" alignItems="center" paddingY={1}>
      {/* ASCII Title */}
      <Box>
        <Text color={colors.matrix} bold>
          {TITLE_ART}
        </Text>
      </Box>

      <Box marginY={1}>
        <Text color={colors.dim} italic>
          {SUBTITLE}
        </Text>
      </Box>

      {/* Menu */}
      {phase === 'menu' && (
        <Box flexDirection="column" alignItems="center" marginTop={1}>
          {menuOptions.map((opt) => {
            if (!opt.available) return null;
            const isSelected = selected === opt.key;
            return (
              <Box key={opt.key} marginY={0}>
                <Text
                  color={isSelected ? colors.cyan : colors.dim}
                  bold={isSelected}
                >
                  {isSelected ? '▸ ' : '  '}
                  {opt.label}
                  {isSelected ? ' ◂' : '  '}
                </Text>
              </Box>
            );
          })}

          <Box marginTop={2}>
            <Text color={colors.dim}>
              ↑↓ Navigate · Enter Select · Ctrl+C Quit
            </Text>
          </Box>
        </Box>
      )}

      {phase === 'title' && (
        <Box marginTop={1}>
          <Text color={colors.dim}>Press any key to continue...</Text>
        </Box>
      )}
    </Box>
  );
}
