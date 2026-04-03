import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore, type OutputEntry } from '../../engine/state.js';
import { getPhishingStormData, type MissionData, type Decision } from '../../engine/missions.js';
import { parseCommand, executeCommand } from '../../engine/commands.js';
import { CommandInput } from '../components/CommandInput.js';
import { ProgressBar } from '../components/ProgressBar.js';

function getMissionData(id: string): MissionData | null {
  if (id === 'phishing-storm') return getPhishingStormData();
  return null;
}

export function TerminalScreen() {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const missionState = useGameStore((s) =>
    currentMissionId ? s.missionStates[currentMissionId] : null
  );
  const updateMissionState = useGameStore((s) => s.updateMissionState);
  const addOutputEntry = useGameStore((s) => s.addOutputEntry);
  const addBehavioralEvent = useGameStore((s) => s.addBehavioralEvent);
  const endMission = useGameStore((s) => s.endMission);

  const [commandDisabled, setCommandDisabled] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);

  const mission = currentMissionId ? getMissionData(currentMissionId) : null;

  if (!mission || !missionState || !currentMissionId) {
    return <Text color={colors.alert}>Mission state not found.</Text>;
  }

  // Check for decision triggers
  useEffect(() => {
    if (pendingDecision || missionState.phase === 'decision') return;

    for (const decision of mission.decisions) {
      if (missionState.decisionsMap[decision.id]) continue; // already made
      if (missionState.evidenceDiscovered.length >= decision.triggerAfterEvidence) {
        setPendingDecision(decision);
        setCommandDisabled(true);

        updateMissionState(currentMissionId, (state) => {
          state.phase = 'decision';
          state.currentDecisionId = decision.id;
        });

        addOutputEntry(currentMissionId, {
          type: 'decision',
          speaker: 'OMNIUS',
          text: `\n${'═'.repeat(50)}\nDECISION REQUIRED\n${'═'.repeat(50)}\n\n${decision.prompt}`,
        });

        decision.options.forEach((opt, i) => {
          addOutputEntry(currentMissionId, {
            type: 'decision',
            text: `  [${i + 1}] ${opt.text}`,
          });
        });

        break;
      }
    }
  }, [missionState.evidenceDiscovered.length, missionState.phase]);

  // Check for mission completion
  useEffect(() => {
    const allDecisionsMade = mission.decisions.every(
      (d) => missionState.decisionsMap[d.id]
    );
    const enoughEvidence = missionState.evidenceDiscovered.length >= mission.completionThreshold;

    if (allDecisionsMade && enoughEvidence && missionState.phase === 'investigation') {
      // Mission complete
      const elapsed = Math.floor((Date.now() - missionState.startedAt) / 1000);

      // Calculate scores from decisions
      const dimensionScores: Record<string, number> = {};
      let decisionsCorrect = 0;

      for (const [decisionId, choiceId] of Object.entries(missionState.decisionsMap)) {
        const decision = mission.decisions.find((d) => d.id === decisionId);
        const choice = decision?.options.find((o) => o.id === choiceId);
        if (choice) {
          if (choice.isOptimal) decisionsCorrect++;
          for (const [dim, score] of Object.entries(choice.scoreImpact)) {
            dimensionScores[dim] = (dimensionScores[dim] ?? 0) + score;
          }
        }
      }

      // Normalize dimension scores
      const numDecisions = mission.decisions.length;
      for (const dim of Object.keys(dimensionScores)) {
        dimensionScores[dim] = Math.round(dimensionScores[dim]! / numDecisions);
      }

      // Evidence bonus
      const evidenceRatio = missionState.evidenceDiscovered.length / mission.evidence.length;
      dimensionScores['analytical_rigor'] = Math.round(
        (dimensionScores['analytical_rigor'] ?? 50) * 0.6 + evidenceRatio * 100 * 0.4
      );

      // Time bonus/penalty
      const timeRatio = elapsed / mission.parTimeSeconds;
      dimensionScores['operational_efficiency'] = Math.round(
        timeRatio <= 1 ? 80 + (1 - timeRatio) * 20 : Math.max(30, 80 - (timeRatio - 1) * 30)
      );

      endMission({
        missionId: currentMissionId,
        completedAt: new Date().toISOString(),
        timeElapsed: elapsed,
        evidenceFound: missionState.evidenceDiscovered.length,
        evidenceTotal: mission.evidence.length,
        decisionsCorrect,
        decisionsTotal: mission.decisions.length,
        dimensions: dimensionScores as any,
        outcome: decisionsCorrect >= numDecisions * 0.6 ? 'success' : 'partial',
      });
    }
  }, [missionState.decisionsMap, missionState.phase]);

  // Handle decision input
  useInput((input) => {
    if (!pendingDecision) return;

    const num = parseInt(input);
    if (num >= 1 && num <= pendingDecision.options.length) {
      const choice = pendingDecision.options[num - 1]!;

      // Record decision
      updateMissionState(currentMissionId, (state) => {
        state.decisionsMap[pendingDecision.id] = choice.id;
        state.phase = 'investigation';
        state.currentDecisionId = null;
      });

      addBehavioralEvent({
        missionId: currentMissionId,
        type: 'decision',
        data: {
          decisionId: pendingDecision.id,
          choiceId: choice.id,
          isOptimal: choice.isOptimal,
          timeToDecide: Date.now() - missionState.startedAt,
        },
      });

      // Show consequence
      addOutputEntry(currentMissionId, {
        type: 'narrative',
        speaker: 'OMNIUS',
        text: `\nChoice: ${choice.text}\n\n${choice.consequence}`,
      });

      addOutputEntry(currentMissionId, {
        type: 'system',
        text: '\n─── Continue investigating or type "status" to review progress ───\n',
      });

      setPendingDecision(null);
      setCommandDisabled(false);
    }
  });

  const handleCommand = (input: string) => {
    if (commandDisabled) return;

    // Record in history
    updateMissionState(currentMissionId, (state) => {
      state.commandHistory.push(input);
    });

    addBehavioralEvent({
      missionId: currentMissionId,
      type: 'command',
      data: { command: input },
    });

    // Show command in output
    addOutputEntry(currentMissionId, {
      type: 'command',
      text: `> ${input}`,
    });

    // Execute
    const parsed = parseCommand(input);
    const result = executeCommand(parsed, mission, missionState);

    if (result.output === '__CLEAR__') {
      updateMissionState(currentMissionId, (state) => {
        state.outputLog = [];
      });
      return;
    }

    // Record evidence discovery
    if (result.evidenceId && result.evidenceId !== '__already_seen__') {
      updateMissionState(currentMissionId, (state) => {
        if (!state.evidenceDiscovered.includes(result.evidenceId!)) {
          state.evidenceDiscovered.push(result.evidenceId!);
        }
      });

      addBehavioralEvent({
        missionId: currentMissionId,
        type: 'evidence_found',
        data: { evidenceId: result.evidenceId },
      });
    }

    if (parsed.name === 'hint') {
      addBehavioralEvent({
        missionId: currentMissionId,
        type: 'hint_used',
        data: {},
      });
    }

    addOutputEntry(currentMissionId, {
      type: result.type as OutputEntry['type'],
      text: result.output,
    });
  };

  // Calculate time
  const elapsed = Math.floor((Date.now() - missionState.startedAt) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <Box flexDirection="column" paddingX={1} height="100%">
      {/* Status bar */}
      <Box
        borderStyle="single"
        borderColor={colors.border}
        paddingX={1}
        justifyContent="space-between"
      >
        <Text color={colors.matrix} bold>
          OP: {mission.meta.title.replace('Operation: ', '').toUpperCase()}
        </Text>
        <Text color={colors.dim}>
          Phase: {missionState.phase.toUpperCase()}
        </Text>
        <Box>
          <ProgressBar
            current={missionState.evidenceDiscovered.length}
            total={mission.evidence.length}
            width={12}
            label="Evidence"
          />
        </Box>
        <Text color={colors.dim}>
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </Text>
      </Box>

      {/* Output log */}
      <Box flexDirection="column" flexGrow={1} paddingY={1} overflowY="hidden">
        {missionState.outputLog.slice(-30).map((entry) => (
          <Box key={entry.id} flexDirection="column">
            {entry.speaker && (
              <Text color={colors.dim} bold>
                [{entry.speaker}]
              </Text>
            )}
            <Text
              color={
                entry.type === 'command'
                  ? colors.cyan
                  : entry.type === 'error'
                  ? colors.alert
                  : entry.type === 'alert'
                  ? colors.alert
                  : entry.type === 'evidence'
                  ? colors.matrix
                  : entry.type === 'decision'
                  ? colors.warning
                  : entry.type === 'narrative'
                  ? colors.purple
                  : colors.dim
              }
            >
              {entry.text}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Input area */}
      <Box borderStyle="single" borderColor={commandDisabled ? colors.warning : colors.cyan} paddingX={1}>
        {commandDisabled ? (
          <Text color={colors.warning}>
            Enter your choice [1-{pendingDecision?.options.length}]:{' '}
          </Text>
        ) : (
          <CommandInput
            onSubmit={handleCommand}
            history={missionState.commandHistory}
            disabled={commandDisabled}
          />
        )}
      </Box>

      {/* Controls hint */}
      <Box paddingX={1}>
        <Text color={colors.dim}>
          {commandDisabled
            ? 'Press a number to choose'
            : '[TAB] autocomplete  [UP] history  Type "help" for commands'}
        </Text>
      </Box>
    </Box>
  );
}
