import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import { getMissionRegistry, type MissionMeta } from '../../engine/missions.js';

export function HubScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const startMission = useGameStore((s) => s.startMission);
  const completedMissions = useGameStore((s) => s.completedMissions);
  const playerName = useGameStore((s) => s.settings.playerName);
  const dimensions = useGameStore((s) => s.dimensions);

  const missions = getMissionRegistry();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isMissionUnlocked = (mission: MissionMeta) => {
    if (!mission.unlockCondition) return true;
    return completedMissions.includes(mission.unlockCondition);
  };

  useInput((_input, key) => {
    if (key.upArrow) {
      setSelectedIndex((i) => Math.max(0, i - 1));
    }
    if (key.downArrow) {
      setSelectedIndex((i) => Math.min(missions.length - 1, i + 1));
    }
    if (key.return) {
      const mission = missions[selectedIndex];
      if (mission && isMissionUnlocked(mission)) {
        startMission(mission.id);
      }
    }

    // Quick actions
    if (_input === 'r' || _input === 'R') {
      setScreen('report');
    }
    if (_input === 'g' || _input === 'G') {
      setScreen('guide');
    }
    if (_input === 'q' || _input === 'Q') {
      process.exit(0);
    }
  });

  const threatLevel = completedMissions.length === 0 ? 'ELEVATED' : 'HIGH';
  const threatBar = completedMissions.length === 0 ? '███░░' : '████░';

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box
        borderStyle="single"
        borderColor={colors.border}
        paddingX={1}
        flexDirection="column"
      >
        <Text color={colors.omnius} bold>
          DI7 — Data Intelligence Division // Secure Operations Center
        </Text>
        <Box justifyContent="space-between">
          <Text color={colors.dim}>
            Observer: <Text color={colors.cyan} bold>{playerName}</Text>
          </Text>
          <Text color={colors.dim}>
            Threat Level: <Text color={colors.warning}>{threatBar}</Text>{' '}
            <Text color={colors.warning} bold>{threatLevel}</Text>
          </Text>
        </Box>
      </Box>

      {/* OMNIUS greeting */}
      <Box marginY={1} flexDirection="column">
        <Text>
          {style.omnius} Good morning, Observer. {missions.length} situations
          require your attention.
        </Text>
      </Box>

      {/* Mission list */}
      <Box flexDirection="column" marginY={1}>
        <Text color={colors.omnius} bold>
          AVAILABLE MISSIONS:
        </Text>
        <Text> </Text>

        {missions.map((mission, i) => {
          const isSelected = i === selectedIndex;
          const isUnlocked = isMissionUnlocked(mission);
          const isCompleted = completedMissions.includes(mission.id);
          const stars = '★'.repeat(mission.difficulty) + '☆'.repeat(3 - mission.difficulty);

          return (
            <Box
              key={mission.id}
              borderStyle="single"
              borderColor={isSelected ? colors.cyan : colors.border}
              paddingX={1}
              flexDirection="column"
              marginBottom={1}
            >
              <Box justifyContent="space-between">
                <Text
                  color={isUnlocked ? (isSelected ? colors.cyan : colors.white) : colors.dim}
                  bold={isSelected}
                >
                  {isSelected ? '▸ ' : '  '}
                  [{i + 1}] {mission.title}  {stars}
                </Text>
                <Text
                  color={isCompleted ? colors.success : isUnlocked ? colors.warning : colors.dim}
                  bold
                >
                  {isCompleted ? 'COMPLETE' : isUnlocked ? 'NEW' : 'LOCKED'}
                </Text>
              </Box>
              <Text color={isUnlocked ? colors.dim : '#444444'}>
                {'    '}{isUnlocked ? mission.description : `Complete ${mission.unlockCondition} to unlock`}
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Quick actions */}
      <Box marginTop={1} borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.dim}>
          ↑↓ Select Mission · Enter Launch · [R] Report · [G] Guide · [Q] Quit
        </Text>
      </Box>
    </Box>
  );
}
