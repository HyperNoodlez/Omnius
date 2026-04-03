import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

interface AlertBoxProps {
  title: string;
  children: React.ReactNode;
  type?: 'alert' | 'warning' | 'info' | 'success';
  width?: number;
}

const TYPE_CONFIG = {
  alert: { color: colors.alert, icon: '!!' },
  warning: { color: colors.warning, icon: '!!' },
  info: { color: colors.cyan, icon: '>>' },
  success: { color: colors.success, icon: '++' },
} as const;

export function AlertBox({ title, children, type = 'info', width }: AlertBoxProps) {
  const config = TYPE_CONFIG[type];

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={config.color}
      paddingX={1}
      width={width}
    >
      <Text color={config.color} bold>
        {config.icon} {title.toUpperCase()} {config.icon}
      </Text>
      <Text> </Text>
      {children}
    </Box>
  );
}
