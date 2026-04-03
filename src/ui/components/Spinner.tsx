import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import cliSpinners from 'cli-spinners';
import { colors } from '../theme.js';

interface SpinnerProps {
  label?: string;
  type?: keyof typeof cliSpinners;
  color?: string;
}

export function Spinner({ label, type = 'dots', color = colors.matrix }: SpinnerProps) {
  const spinner = cliSpinners[type];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % spinner.frames.length);
    }, spinner.interval);
    return () => clearInterval(timer);
  }, [spinner]);

  return (
    <Text>
      <Text color={color}>{spinner.frames[frame]}</Text>
      {label ? <Text color={colors.dim}> {label}</Text> : null}
    </Text>
  );
}
