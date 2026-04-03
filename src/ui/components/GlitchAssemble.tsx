import React, { useState, useEffect, useRef } from 'react';
import { Box, Text } from 'ink';

// Random Braille characters for the glitch noise
const GLITCH_CHARS = '⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿';
const BLANK = '⠀';

interface GlitchAssembleProps {
  lines: string[];
  color: string;
  glitchColor: string;
  dimColor: string;
  durationMs?: number;     // total time from full noise to fully resolved
  onComplete?: () => void;
  active: boolean;
}

function randomGlitchChar(): string {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]!;
}

// Build a garbled version of a line: replace non-blank chars with random Braille
function garbleLine(line: string, resolveRatio: number): string {
  const chars = [...line];
  return chars.map((ch) => {
    if (ch === BLANK || ch === ' ' || ch === '\u2800') return ch;
    // resolveRatio 0 = fully garbled, 1 = fully resolved
    return Math.random() < resolveRatio ? ch : randomGlitchChar();
  }).join('');
}

export function GlitchAssemble({
  lines,
  color,
  glitchColor,
  dimColor,
  durationMs = 2500,
  onComplete,
  active,
}: GlitchAssembleProps) {
  // Progress from 0 (fully garbled) to 1 (fully resolved)
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0); // forces re-render for randomness
  const completedRef = useRef(false);

  const tickInterval = 60; // ms between frames (~16fps)
  const totalTicks = Math.ceil(durationMs / tickInterval);

  useEffect(() => {
    if (!active || completedRef.current) return;

    const timer = setInterval(() => {
      setTick((t) => t + 1);
      setProgress((prev) => {
        const next = Math.min(1, prev + 1 / totalTicks);
        if (next >= 1 && !completedRef.current) {
          completedRef.current = true;
          clearInterval(timer);
          onComplete?.();
        }
        return next;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [active, totalTicks]);

  // Idle glitch: occasional random flicker after fully assembled
  const [idleGlitchLine, setIdleGlitchLine] = useState(-1);

  useEffect(() => {
    if (progress < 1) return;

    const timer = setInterval(() => {
      // 30% chance of a glitch on each tick
      if (Math.random() < 0.3) {
        setIdleGlitchLine(Math.floor(Math.random() * lines.length));
      } else {
        setIdleGlitchLine(-1);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [progress >= 1, lines.length]);

  if (!active) return null;

  const isComplete = progress >= 1;

  // Ease-in curve: starts slow (lots of noise), accelerates toward resolution
  // This makes the "locking on" feel more dramatic
  const easedProgress = progress * progress; // quadratic ease-in

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => {
        if (isComplete) {
          // Idle: mostly resolved with occasional single-line glitch
          if (i === idleGlitchLine) {
            return (
              <Text key={`${i}-${tick}`} color={glitchColor}>
                {garbleLine(line, 0.7)}
              </Text>
            );
          }
          return <Text key={i} color={color}>{line}</Text>;
        }

        // During assembly: garble based on progress
        const garbled = garbleLine(line, easedProgress);
        // Color transitions: starts as glitchColor, fades to base color as it resolves
        const lineColor = easedProgress < 0.5 ? glitchColor : color;

        return (
          <Text key={`${i}-${tick}`} color={lineColor}>
            {garbled}
          </Text>
        );
      })}
    </Box>
  );
}
