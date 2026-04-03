import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

interface AnimatedEyesProps {
  side: 'left' | 'right';
  active?: boolean;
}

// Each eye state is 6 lines tall to match the TITLE_ART height
type EyeState = 'open' | 'look-left' | 'look-right' | 'blink' | 'half-open';

interface EyeFrame {
  lines: string[];
  pupilColor?: string;
}

function getEyeFrames(side: 'left' | 'right'): Record<EyeState, EyeFrame> {
  // Mirror pupil positions for left vs right eye
  const isLeft = side === 'left';

  return {
    'open': {
      lines: [
        '         ',
        ' ╔═════╗ ',
        ' ║  ●  ║ ',
        ' ║     ║ ',
        ' ╚═════╝ ',
        '         ',
      ],
    },
    'look-left': {
      lines: [
        '         ',
        ' ╔═════╗ ',
        ' ║●    ║ ',
        ' ║     ║ ',
        ' ╚═════╝ ',
        '         ',
      ],
    },
    'look-right': {
      lines: [
        '         ',
        ' ╔═════╗ ',
        ' ║    ●║ ',
        ' ║     ║ ',
        ' ╚═════╝ ',
        '         ',
      ],
    },
    'blink': {
      lines: [
        '         ',
        ' ╔═════╗ ',
        ' ║     ║ ',
        ' ║─────║ ',
        ' ╚═════╝ ',
        '         ',
      ],
    },
    'half-open': {
      lines: [
        '         ',
        ' ╔═════╗ ',
        ' ║ ─── ║ ',
        ' ║  ●  ║ ',
        ' ╚═════╝ ',
        '         ',
      ],
    },
  };
}

// Animation sequence with timing (ms) per state
// Irregular timing makes it feel alive, not mechanical
const ANIMATION_SEQUENCE: { state: EyeState; duration: number }[] = [
  { state: 'open', duration: 2200 },
  { state: 'blink', duration: 150 },
  { state: 'open', duration: 1800 },
  { state: 'look-left', duration: 900 },
  { state: 'open', duration: 600 },
  { state: 'look-right', duration: 900 },
  { state: 'open', duration: 2500 },
  { state: 'blink', duration: 130 },
  { state: 'half-open', duration: 500 },
  { state: 'open', duration: 1500 },
  { state: 'look-right', duration: 700 },
  { state: 'look-left', duration: 700 },
  { state: 'open', duration: 3000 },
  { state: 'blink', duration: 140 },
  { state: 'blink', duration: 100 }, // double blink
  { state: 'open', duration: 1200 },
];

export function AnimatedEyes({ side, active = true }: AnimatedEyesProps) {
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const frames = getEyeFrames(side);

  useEffect(() => {
    if (!active) return;

    const current = ANIMATION_SEQUENCE[sequenceIndex % ANIMATION_SEQUENCE.length]!;

    const timer = setTimeout(() => {
      setSequenceIndex((i) => (i + 1) % ANIMATION_SEQUENCE.length);
    }, current.duration);

    return () => clearTimeout(timer);
  }, [sequenceIndex, active]);

  if (!active) {
    // Show closed eyes when inactive
    return (
      <Box flexDirection="column">
        {frames['blink'].lines.map((line, i) => (
          <Text key={i} color={colors.dim}>
            {line}
          </Text>
        ))}
      </Box>
    );
  }

  const currentState = ANIMATION_SEQUENCE[sequenceIndex % ANIMATION_SEQUENCE.length]!.state;
  const currentFrame = frames[currentState];

  return (
    <Box flexDirection="column">
      {currentFrame.lines.map((line, i) => (
        <Text key={i} color={currentState === 'blink' ? colors.dim : colors.omnius} bold>
          {line}
        </Text>
      ))}
    </Box>
  );
}
