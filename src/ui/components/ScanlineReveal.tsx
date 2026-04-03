import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

interface ScanlineRevealProps {
  lines: string[];
  color: string;
  scanColor: string;
  dimColor: string;
  interval?: number;
  onComplete?: () => void;
  active: boolean;
}

export function ScanlineReveal({
  lines,
  color,
  scanColor,
  dimColor,
  interval = 50,
  onComplete,
  active,
}: ScanlineRevealProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [idleScanLine, setIdleScanLine] = useState(0);
  const isFullyRevealed = revealedCount >= lines.length;

  // Reveal animation: line by line top to bottom
  useEffect(() => {
    if (!active || isFullyRevealed) return;

    const timer = setInterval(() => {
      setRevealedCount((prev) => {
        const next = prev + 1;
        if (next >= lines.length) {
          clearInterval(timer);
          onComplete?.();
          return lines.length;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [active, isFullyRevealed, lines.length, interval]);

  // Idle scanline sweep after fully revealed
  useEffect(() => {
    if (!isFullyRevealed) return;

    const timer = setInterval(() => {
      setIdleScanLine((prev) => (prev + 1) % lines.length);
    }, 65); // ~3 second full sweep at 65ms per line

    return () => clearInterval(timer);
  }, [isFullyRevealed, lines.length]);

  if (!active) return null;

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => {
        // During reveal phase
        if (!isFullyRevealed) {
          if (i > revealedCount) {
            // Not yet revealed — invisible (render blank braille to maintain width)
            return <Text key={i} color={dimColor}>{line.replace(/[^\s]/g, '⠀')}</Text>;
          }
          if (i === revealedCount) {
            // Active scanline — bright
            return <Text key={i} color={scanColor} bold>{line}</Text>;
          }
          // Already revealed — base color
          return <Text key={i} color={color}>{line}</Text>;
        }

        // Idle phase: slow sweeping scanline
        if (i === idleScanLine) {
          return <Text key={i} color={scanColor} bold>{line}</Text>;
        }
        // Lines near the scanline get a slight glow
        const dist = Math.abs(i - idleScanLine);
        if (dist === 1) {
          return <Text key={i} color={color}>{line}</Text>;
        }
        // Everything else is dim
        return <Text key={i} color={dimColor}>{line}</Text>;
      })}
    </Box>
  );
}
