import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { colors } from '../theme.js';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  prompt?: string;
  disabled?: boolean;
  history?: string[];
}

export function CommandInput({ onSubmit, prompt = '>', disabled = false, history = [] }: CommandInputProps) {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);

  useInput((input, key) => {
    if (disabled) return;

    if (key.upArrow && history.length > 0) {
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      setValue(history[history.length - 1 - newIndex] ?? '');
    }

    if (key.downArrow) {
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      if (newIndex === -1) {
        setValue('');
      } else {
        setValue(history[history.length - 1 - newIndex] ?? '');
      }
    }
  });

  const handleSubmit = (input: string) => {
    const trimmed = input.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setValue('');
      setHistoryIndex(-1);
    }
  };

  return (
    <Box>
      <Text color={colors.cyan} bold>
        {prompt}{' '}
      </Text>
      {disabled ? (
        <Text color={colors.dim}>...</Text>
      ) : (
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        />
      )}
    </Box>
  );
}
