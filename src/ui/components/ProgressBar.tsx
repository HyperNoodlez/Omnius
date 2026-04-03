import React from 'react';
import { Text } from 'ink';
import { colors } from '../theme.js';

interface ProgressBarProps {
  current: number;
  total: number;
  width?: number;
  label?: string;
  color?: string;
}

export function ProgressBar({
  current,
  total,
  width = 20,
  label,
  color = colors.matrix,
}: ProgressBarProps) {
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;
  const filled = Math.round(ratio * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const pct = Math.round(ratio * 100);

  return (
    <Text>
      {label ? <Text color={colors.dim}>{label}: </Text> : null}
      <Text color={color}>{bar}</Text>
      <Text color={colors.dim}> {pct}% ({current}/{total})</Text>
    </Text>
  );
}
