import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import { getPhishingStormData, type MissionData } from '../../engine/missions.js';
import { TypeWriter } from '../components/TypeWriter.js';
import { AlertBox } from '../components/AlertBox.js';

function getMissionData(id: string): MissionData | null {
  if (id === 'phishing-storm') return getPhishingStormData();
  return null;
}

export function MissionBriefScreen() {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const setScreen = useGameStore((s) => s.setScreen);
  const updateMissionState = useGameStore((s) => s.updateMissionState);
  const addOutputEntry = useGameStore((s) => s.addOutputEntry);

  const [lineIndex, setLineIndex] = useState(0);
  const [showObjectives, setShowObjectives] = useState(false);
  const [ready, setReady] = useState(false);

  const mission = currentMissionId ? getMissionData(currentMissionId) : null;

  useEffect(() => {
    if (!mission) return;

    const lines = mission.briefing.lines;
    if (lineIndex < lines.length - 1) {
      const timer = setTimeout(() => setLineIndex((i) => i + 1), 800);
      return () => clearTimeout(timer);
    } else {
      // All briefing lines shown, show objectives
      setTimeout(() => setShowObjectives(true), 1000);
      setTimeout(() => setReady(true), 2000);
    }
  }, [lineIndex, mission]);

  useInput((_input, key) => {
    if (!mission || !currentMissionId) return;

    // Skip animation
    if (!ready && (key.return || _input === ' ')) {
      setLineIndex(mission.briefing.lines.length - 1);
      setShowObjectives(true);
      setReady(true);
      return;
    }

    // Launch mission
    if (ready && key.return) {
      updateMissionState(currentMissionId, (state) => {
        state.phase = 'investigation';
      });

      // Add initial briefing to mission log
      addOutputEntry(currentMissionId, {
        type: 'narrative',
        speaker: 'OMNIUS',
        text: mission.briefing.lines.join('\n'),
      });

      setScreen('terminal');
    }
  });

  if (!mission) {
    return <Text color={colors.alert}>Mission data not found.</Text>;
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Mission header */}
      <Box borderStyle="double" borderColor={colors.warning} paddingX={1}>
        <Text color={colors.warning} bold>
          MISSION BRIEFING: {mission.meta.title.toUpperCase()}
        </Text>
      </Box>

      <Box marginY={1} />

      {/* Briefing text */}
      <Box flexDirection="column">
        <Text>{style.omnius}</Text>
        <Box marginTop={1} flexDirection="column">
          {mission.briefing.lines.slice(0, lineIndex + 1).map((line, i) => (
            <Text key={i} color={line === '' ? undefined : colors.omnius}>
              {line === '' ? ' ' : line}
            </Text>
          ))}
        </Box>
      </Box>

      {/* Objectives */}
      {showObjectives && (
        <Box marginTop={1}>
          <AlertBox title="Mission Objectives" type="info">
            <Box flexDirection="column">
              {mission.briefing.objectives.map((obj, i) => (
                <Text key={i} color={colors.cyan}>
                  [{i + 1}] {obj}
                </Text>
              ))}
            </Box>
          </AlertBox>
        </Box>
      )}

      {/* Ready prompt */}
      {ready && (
        <Box marginTop={2}>
          <Text color={colors.dim}>
            Press <Text color={colors.cyan} bold>ENTER</Text> to begin investigation...
          </Text>
        </Box>
      )}

      {!ready && (
        <Box marginTop={1}>
          <Text color={colors.dim} italic>Press any key to skip animation...</Text>
        </Box>
      )}
    </Box>
  );
}
