import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

interface StatusBarProps {
  left?: string;
  center?: string;
  right?: string;
}

export function StatusBar({ left, center, right }: StatusBarProps) {
  return (
    <Box
      borderStyle="single"
      borderColor={colors.border}
      paddingX={1}
      justifyContent="space-between"
      width="100%"
    >
      <Text color={colors.dim}>{left ?? ''}</Text>
      <Text color={colors.cyan} bold>{center ?? ''}</Text>
      <Text color={colors.dim}>{right ?? ''}</Text>
    </Box>
  );
}
