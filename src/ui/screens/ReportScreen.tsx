import React from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import {
  useGameStore,
  ALL_DIMENSIONS,
  DIMENSION_LABELS,
  type AptitudeDimension,
} from '../../engine/state.js';

export function ReportScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const dimensions = useGameStore((s) => s.dimensions);
  const missionScores = useGameStore((s) => s.missionScores);
  const completedMissions = useGameStore((s) => s.completedMissions);

  useInput((_input, key) => {
    if (key.return || key.escape) {
      setScreen('hub');
    }
  });

  const hasData = missionScores.length > 0;

  if (!hasData) {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Box borderStyle="single" borderColor={colors.border} paddingX={1}>
          <Text color={colors.matrix} bold>ASSESSMENT REPORT</Text>
        </Box>
        <Box marginY={2}>
          <Text color={colors.dim}>
            No assessment data yet. Complete at least one mission to generate a report.
          </Text>
        </Box>
        <Text color={colors.dim}>
          Press <Text color={colors.cyan} bold>ENTER</Text> to return
        </Text>
      </Box>
    );
  }

  // Sort dimensions by score for highlights
  const sortedDims = ALL_DIMENSIONS
    .map((d) => ({ dim: d, score: dimensions[d] }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score);

  const strengths = sortedDims.slice(0, 3);
  const growthAreas = [...sortedDims].reverse().slice(0, 3);

  // Role alignment
  const roleScores = [
    {
      role: 'SOC Analyst',
      score: Math.round(
        (dimensions.analytical_rigor * 0.3 +
          dimensions.pattern_recognition * 0.3 +
          dimensions.operational_efficiency * 0.4) || 0
      ),
    },
    {
      role: 'Incident Responder',
      score: Math.round(
        (dimensions.decision_quality * 0.3 +
          dimensions.adaptability * 0.3 +
          dimensions.communication_instinct * 0.4) || 0
      ),
    },
    {
      role: 'Threat Hunter',
      score: Math.round(
        (dimensions.pattern_recognition * 0.3 +
          dimensions.threat_intuition * 0.4 +
          dimensions.analytical_rigor * 0.3) || 0
      ),
    },
    {
      role: 'Security Architect',
      score: Math.round(
        (dimensions.systematic_thinking * 0.4 +
          dimensions.threat_intuition * 0.3 +
          dimensions.decision_quality * 0.3) || 0
      ),
    },
  ].sort((a, b) => b.score - a.score);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box borderStyle="double" borderColor={colors.matrix} paddingX={1} flexDirection="column">
        <Text color={colors.matrix} bold>
          OMNIUS CYBERSECURITY APTITUDE REPORT
        </Text>
        <Text color={colors.dim}>
          Missions Completed: {completedMissions.length} | Generated: {new Date().toLocaleDateString()}
        </Text>
      </Box>

      {/* Radar chart (ASCII) */}
      <Box marginY={1} flexDirection="column" borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.white} bold>APTITUDE PROFILE</Text>
        <Text> </Text>
        {ALL_DIMENSIONS.map((dim) => {
          const score = Math.round(dimensions[dim]);
          if (score === 0) return null;
          const barWidth = 25;
          const filled = Math.round((score / 100) * barWidth);
          const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
          const color = score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.alert;
          return (
            <Box key={dim}>
              <Text color={colors.dim}>{DIMENSION_LABELS[dim].padEnd(25)}</Text>
              <Text color={color}>{bar}</Text>
              <Text color={colors.dim}> {score}/100</Text>
            </Box>
          );
        })}
      </Box>

      {/* Strengths & Growth */}
      <Box gap={2}>
        <Box flexDirection="column" borderStyle="single" borderColor={colors.success} paddingX={1} flexGrow={1}>
          <Text color={colors.success} bold>STRENGTHS</Text>
          {strengths.map(({ dim, score }) => (
            <Text key={dim} color={colors.dim}>
              + {DIMENSION_LABELS[dim]} ({Math.round(score)})
            </Text>
          ))}
        </Box>
        <Box flexDirection="column" borderStyle="single" borderColor={colors.warning} paddingX={1} flexGrow={1}>
          <Text color={colors.warning} bold>GROWTH AREAS</Text>
          {growthAreas.map(({ dim, score }) => (
            <Text key={dim} color={colors.dim}>
              - {DIMENSION_LABELS[dim]} ({Math.round(score)})
            </Text>
          ))}
        </Box>
      </Box>

      {/* Role alignment */}
      <Box marginTop={1} flexDirection="column" borderStyle="single" borderColor={colors.cyan} paddingX={1}>
        <Text color={colors.cyan} bold>CAREER PATH ALIGNMENT</Text>
        <Text> </Text>
        {roleScores.map(({ role, score }, i) => (
          <Text key={role} color={i === 0 ? colors.cyan : colors.dim}>
            {i === 0 ? '>>> ' : '    '}{role.padEnd(22)} {score > 0 ? `${score}% match` : 'Insufficient data'}
          </Text>
        ))}
      </Box>

      <Box marginTop={2}>
        <Text color={colors.dim}>
          Press <Text color={colors.cyan} bold>ENTER</Text> to return to Operations Center
        </Text>
      </Box>
    </Box>
  );
}
