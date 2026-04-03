import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { TITLE_ART, SUBTITLE, colors } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import { Spinner } from '../components/Spinner.js';
import { AnimatedEyes } from '../components/AnimatedEyes.js';
import { GlitchAssemble } from '../components/GlitchAssemble.js';
import { FIGURE_ART } from '../assets/figure.js';

type MenuOption = 'new' | 'continue' | 'orientation' | 'about' | 'quit';
type Phase = 'boot' | 'figure-reveal' | 'title' | 'menu';

export function TitleScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const tutorialCompleted = useGameStore((s) => s.tutorialCompleted);
  const adminMode = useGameStore((s) => s.adminMode);
  const toggleAdmin = useGameStore((s) => s.toggleAdmin);
  const [phase, setPhase] = useState<Phase>('boot');
  const [selected, setSelected] = useState<MenuOption>('new');
  const [bootLine, setBootLine] = useState(0);
  const [secretTaps, setSecretTaps] = useState(0);

  const hasSave = completedMissions.length > 0;

  // Boot sequence
  const bootLines = [
    'Initializing secure connection...',
    'Establishing encrypted tunnel...',
    'Verifying clearance level...',
    'Loading DI7 OMNIUS kernel v4.2.1...',
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
          setTimeout(() => setPhase('figure-reveal'), 400);
          return prev;
        }
        return prev + 1;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'title') {
      setTimeout(() => setPhase('menu'), 1200);
    }
  }, [phase]);

  const menuOptions: { key: MenuOption; label: string; available: boolean }[] = [
    { key: 'new', label: 'NEW OPERATION', available: true },
    { key: 'continue', label: 'CONTINUE', available: hasSave },
    { key: 'orientation', label: 'ORIENTATION', available: tutorialCompleted },
    { key: 'about', label: 'ABOUT DI7', available: true },
    { key: 'quit', label: 'QUIT', available: true },
  ];

  const availableOptions = menuOptions.filter((o) => o.available);

  useInput((input, key) => {
    // Secret admin toggle: press ] three times
    if (input === ']') {
      const newTaps = secretTaps + 1;
      setSecretTaps(newTaps);
      if (newTaps >= 3) {
        toggleAdmin();
        setSecretTaps(0);
      }
      return;
    } else if (secretTaps > 0) {
      setSecretTaps(0); // reset if any other key pressed
    }

    // Skip animations
    if (phase === 'boot') {
      setBootLine(bootLines.length - 1);
      setPhase('figure-reveal');
      return;
    }
    if (phase === 'figure-reveal' || phase === 'title') {
      setPhase('menu');
      return;
    }
    if (phase !== 'menu') return;

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
      switch (selected) {
        case 'new':
          setScreen(tutorialCompleted ? 'hub' : 'tutorial');
          break;
        case 'continue':
          setScreen('hub');
          break;
        case 'orientation':
          setScreen('tutorial');
          break;
        case 'about':
          setScreen('about');
          break;
        case 'quit':
          process.exit(0);
      }
    }
  });

  // ── BOOT PHASE ──────────────────────────────
  if (phase === 'boot') {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        {bootLines.slice(0, bootLine + 1).map((line, i) => (
          <Text key={i} color={i === bootLine ? colors.omnius : colors.dim}>
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

  // ── MAIN LAYOUT (figure-reveal, title, menu) ──
  // Split screen: figure LEFT, logo+menu RIGHT
  const showTitle = phase === 'title' || phase === 'menu';
  const showMenu = phase === 'menu';

  return (
    <Box flexDirection="row" paddingY={1}>
      {/* LEFT: Braille figure with scanline */}
      <Box flexDirection="column" width="45%">
        <GlitchAssemble
          lines={FIGURE_ART}
          color="#8B4500"
          glitchColor={colors.omnius}
          dimColor="#3D2000"
          durationMs={2500}
          active
          onComplete={() => {
            if (phase === 'figure-reveal') {
              setPhase('title');
            }
          }}
        />
      </Box>

      {/* RIGHT: Logo, subtitle, eyes, menu */}
      <Box flexDirection="column" width="55%" paddingLeft={2}>
        {/* Title art */}
        {showTitle && (
          <Box flexDirection="column">
            {TITLE_ART.map((line, i) => (
              <Text key={i} color={colors.omnius} bold>
                {line}
              </Text>
            ))}
          </Box>
        )}

        {/* Subtitle */}
        {showTitle && (
          <Box marginTop={1}>
            <Text color={colors.dim} italic>
              {SUBTITLE}
            </Text>
          </Box>
        )}

        {/* Eyes */}
        {showTitle && (
          <Box flexDirection="row" marginTop={1} gap={4}>
            <AnimatedEyes side="left" active />
            <AnimatedEyes side="right" active />
          </Box>
        )}

        {/* Menu */}
        {showMenu && (
          <Box flexDirection="column" marginTop={2}>
            {menuOptions.map((opt) => {
              if (!opt.available) return null;
              const isSelected = selected === opt.key;

              if (isSelected) {
                return (
                  <Box key={opt.key} flexDirection="column" marginY={0}>
                    <Text color={colors.cyan}>┌{'─'.repeat(opt.label.length + 4)}┐</Text>
                    <Text color={colors.cyan} bold>│ ▸ {opt.label} │</Text>
                    <Text color={colors.cyan}>└{'─'.repeat(opt.label.length + 4)}┘</Text>
                  </Box>
                );
              }

              return (
                <Box key={opt.key} marginY={0}>
                  <Text color={colors.dim}>
                    {'  '}{opt.label}
                  </Text>
                </Box>
              );
            })}

            <Box marginTop={2}>
              <Text color={colors.dim}>
                ↑↓ Navigate · Enter Select · Ctrl+C Quit
              </Text>
            </Box>
            {adminMode && (
              <Box marginTop={1}>
                <Text color={colors.alert} bold>
                  [ADMIN MODE ACTIVE] — Space skips steps/pages
                </Text>
              </Box>
            )}
          </Box>
        )}

        {/* Phase hints */}
        {phase === 'figure-reveal' && (
          <Box marginTop={2}>
            <Text color={colors.dim}>Press any key to skip...</Text>
          </Box>
        )}
        {phase === 'title' && (
          <Box marginTop={2}>
            <Text color={colors.dim}>Press any key to continue...</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
