import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import { TUTORIAL_STEPS, type TutorialStep } from '../../engine/tutorial.js';
import { CommandInput } from '../components/CommandInput.js';
import { AlertBox } from '../components/AlertBox.js';

type StepPhase = 'reading' | 'awaiting-command' | 'showing-output' | 'showing-explanation';

export function TutorialScreen() {
  const completeTutorial = useGameStore((s) => s.completeTutorial);

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<StepPhase>('reading');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lastWrongHint, setLastWrongHint] = useState('');

  const step = TUTORIAL_STEPS[stepIndex];
  const isLastStep = stepIndex >= TUTORIAL_STEPS.length - 1;
  const progress = `${stepIndex + 1}/${TUTORIAL_STEPS.length}`;

  const advanceStep = useCallback(() => {
    if (isLastStep) {
      completeTutorial();
    } else {
      setStepIndex((i) => i + 1);
      setPhase('reading');
      setWrongAttempts(0);
      setLastWrongHint('');
    }
  }, [isLastStep, completeTutorial]);

  // Handle Enter to advance narrative steps
  useInput((_input, key) => {
    if (!step) return;

    // For narrative steps, Enter advances
    if (step.type === 'narrative' && phase === 'reading' && key.return) {
      advanceStep();
    }

    // After showing output, Enter shows explanation
    if (phase === 'showing-output' && key.return) {
      if (step.explanation && step.explanation.length > 0) {
        setPhase('showing-explanation');
      } else {
        advanceStep();
      }
    }

    // After explanation, Enter advances
    if (phase === 'showing-explanation' && key.return) {
      advanceStep();
    }
  });

  const handleCommand = (input: string) => {
    if (!step) return;

    const normalized = input.trim().toLowerCase();
    const patterns = step.commandPatterns ?? [];
    const isCorrect = patterns.some((p) => normalized === p.toLowerCase())
      || (step.expectedCommand && normalized === step.expectedCommand.toLowerCase());

    if (isCorrect) {
      setPhase('showing-output');
      setLastWrongHint('');
    } else {
      setWrongAttempts((n) => n + 1);
      setLastWrongHint(step.hintOnWrong ?? `Try: ${step.expectedCommand}`);
    }
  };

  if (!step) {
    return <Text color={colors.alert}>Tutorial data error.</Text>;
  }

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box borderStyle="single" borderColor={colors.omnius} paddingX={1} justifyContent="space-between">
        <Text color={colors.omnius} bold>
          OMNIUS ORIENTATION
        </Text>
        <Text color={colors.dim}>
          Step {progress}
        </Text>
      </Box>

      {/* Step title */}
      {step.title && (
        <Box marginTop={1}>
          <Text color={colors.white} bold underline>
            {step.title}
          </Text>
        </Box>
      )}

      {/* Speaker */}
      <Box marginTop={1}>
        <Text color={colors.omnius} bold>[{step.speaker}]</Text>
      </Box>

      {/* Narrative content */}
      <Box flexDirection="column" marginTop={1}>
        {step.lines.map((line, i) => (
          <Text key={i} color={line === '' ? undefined : colors.purple}>
            {line === '' ? ' ' : line}
          </Text>
        ))}
      </Box>

      {/* Command prompt for guided/practice steps */}
      {(step.type === 'guided-command' || step.type === 'practice') && phase === 'reading' && (
        <Box flexDirection="column" marginTop={1}>
          {step.type === 'guided-command' && step.expectedCommand && (
            <Box marginBottom={1}>
              <Text color={colors.dim}>
                Expected: <Text color={colors.cyan}>{step.expectedCommand}</Text>
              </Text>
            </Box>
          )}
          <Box borderStyle="single" borderColor={colors.cyan} paddingX={1}>
            <CommandInput onSubmit={handleCommand} prompt=">" />
          </Box>
          {lastWrongHint && (
            <Box marginTop={1}>
              <Text color={colors.warning}>
                {wrongAttempts >= 2 ? '⚠ ' : ''}{lastWrongHint}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Command output */}
      {phase === 'showing-output' && step.commandOutput && (
        <Box flexDirection="column" marginTop={1}>
          <Box borderStyle="single" borderColor={colors.omnius} paddingX={1}>
            <Text color={colors.omnius}>
              {step.commandOutput}
            </Text>
          </Box>
          <Box marginTop={1}>
            <Text color={colors.dim}>
              Press <Text color={colors.cyan} bold>ENTER</Text> to continue...
            </Text>
          </Box>
        </Box>
      )}

      {/* Explanation */}
      {phase === 'showing-explanation' && step.explanation && (
        <Box flexDirection="column" marginTop={1}>
          {/* Still show the output above */}
          {step.commandOutput && (
            <Box borderStyle="single" borderColor={colors.border} paddingX={1} marginBottom={1}>
              <Text color={colors.dim}>
                {step.commandOutput}
              </Text>
            </Box>
          )}
          <AlertBox title="Analysis" type="info">
            <Box flexDirection="column">
              {step.explanation.map((line, i) => (
                <Text key={i} color={line === '' ? undefined : colors.cyan}>
                  {line === '' ? ' ' : line}
                </Text>
              ))}
            </Box>
          </AlertBox>
          <Box marginTop={1}>
            <Text color={colors.dim}>
              Press <Text color={colors.cyan} bold>ENTER</Text>{' '}
              {isLastStep ? 'to begin your first mission...' : 'to continue...'}
            </Text>
          </Box>
        </Box>
      )}

      {/* Continue prompt for narrative steps */}
      {step.type === 'narrative' && phase === 'reading' && (
        <Box marginTop={2}>
          <Text color={colors.dim}>
            Press <Text color={colors.cyan} bold>ENTER</Text>{' '}
            {isLastStep ? 'to begin your first mission...' : 'to continue...'}
          </Text>
        </Box>
      )}

      {/* Progress bar at bottom */}
      <Box marginTop={1} borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.dim}>
          {'█'.repeat(Math.round(((stepIndex + 1) / TUTORIAL_STEPS.length) * 20))}
          {'░'.repeat(20 - Math.round(((stepIndex + 1) / TUTORIAL_STEPS.length) * 20))}
          {' '}Orientation Progress
        </Text>
      </Box>
    </Box>
  );
}
