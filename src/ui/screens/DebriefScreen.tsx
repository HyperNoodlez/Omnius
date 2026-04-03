import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore, DIMENSION_LABELS, type AptitudeDimension } from '../../engine/state.js';

export function DebriefScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const missionScores = useGameStore((s) => s.missionScores);
  const dimensions = useGameStore((s) => s.dimensions);
  const [showDetails, setShowDetails] = useState(false);

  const lastScore = missionScores[missionScores.length - 1];

  useInput((input, key) => {
    if (input === 'd' || input === 'D') {
      setShowDetails(!showDetails);
    }
    if (key.return) {
      setScreen('hub');
    }
  });

  if (!lastScore) {
    return <Text color={colors.alert}>No mission scores found.</Text>;
  }

  const outcomeColors = {
    success: colors.success,
    partial: colors.warning,
    failure: colors.alert,
  };

  const outcomeLabels = {
    success: 'MISSION SUCCESS',
    partial: 'PARTIAL SUCCESS',
    failure: 'MISSION FAILED',
  };

  const mins = Math.floor(lastScore.timeElapsed / 60);
  const secs = lastScore.timeElapsed % 60;

  // Build dimension bars
  const dimensionEntries = Object.entries(lastScore.dimensions) as [AptitudeDimension, number][];

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box borderStyle="double" borderColor={outcomeColors[lastScore.outcome]} paddingX={1} flexDirection="column">
        <Text color={outcomeColors[lastScore.outcome]} bold>
          {outcomeLabels[lastScore.outcome]}
        </Text>
        <Text color={colors.dim}>
          Mission: {lastScore.missionId.replace(/-/g, ' ').toUpperCase()}
        </Text>
      </Box>

      {/* Stats summary */}
      <Box marginY={1} flexDirection="column">
        <Text>{style.omnius} Mission debrief follows.</Text>
        <Text> </Text>

        <Box flexDirection="column" borderStyle="single" borderColor={colors.border} paddingX={1}>
          <Text color={colors.white} bold>PERFORMANCE SUMMARY</Text>
          <Text> </Text>
          <Text color={colors.dim}>
            Time Elapsed:    <Text color={colors.cyan}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</Text>
          </Text>
          <Text color={colors.dim}>
            Evidence Found:  <Text color={colors.cyan}>{lastScore.evidenceFound}/{lastScore.evidenceTotal}</Text>
          </Text>
          <Text color={colors.dim}>
            Decisions:       <Text color={colors.cyan}>{lastScore.decisionsCorrect}/{lastScore.decisionsTotal} optimal</Text>
          </Text>
          <Text color={colors.dim}>
            Outcome:         <Text color={outcomeColors[lastScore.outcome]} bold>{lastScore.outcome.toUpperCase()}</Text>
          </Text>
        </Box>
      </Box>

      {/* Operational dimensions */}
      <Box flexDirection="column" borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.white} bold>OPERATIONAL ASSESSMENT</Text>
        <Text> </Text>

        {dimensionEntries.map(([dim, score]) => {
          const barWidth = 20;
          const filled = Math.round((score / 100) * barWidth);
          const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
          const color = score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.alert;

          return (
            <Box key={dim}>
              <Text color={colors.dim}>
                {(DIMENSION_LABELS[dim] ?? dim).padEnd(25)}
              </Text>
              <Text color={color}>{bar}</Text>
              <Text color={colors.dim}> {score}</Text>
            </Box>
          );
        })}
      </Box>

      {/* Actions */}
      <Box marginTop={2}>
        <Text color={colors.dim}>
          Press <Text color={colors.cyan} bold>ENTER</Text> to return to Operations Center
          {'  '}
          [D] Toggle detailed breakdown
        </Text>
      </Box>
    </Box>
  );
}
