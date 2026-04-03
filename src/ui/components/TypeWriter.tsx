import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import { useGameStore } from '../../engine/state.js';

interface TypeWriterProps {
  text: string;
  color?: string;
  bold?: boolean;
  onComplete?: () => void;
  delay?: number; // override per-character delay
}

const SPEED_MAP = {
  slow: 50,
  normal: 25,
  fast: 10,
  instant: 0,
};

export function TypeWriter({ text, color, bold, onComplete, delay }: TypeWriterProps) {
  const textSpeed = useGameStore((s) => s.settings.textSpeed);
  const charDelay = delay ?? SPEED_MAP[textSpeed];
  const [displayed, setDisplayed] = useState(charDelay === 0 ? text : '');
  const [done, setDone] = useState(charDelay === 0);

  useEffect(() => {
    if (charDelay === 0) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }

    let index = 0;
    setDisplayed('');
    setDone(false);

    const timer = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, charDelay);

    return () => clearInterval(timer);
  }, [text, charDelay]);

  return (
    <Text color={color} bold={bold}>
      {displayed}
      {!done ? '█' : ''}
    </Text>
  );
}
