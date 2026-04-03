import React, { useState, useCallback } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors, style } from '../theme.js';
import { useGameStore } from '../../engine/state.js';
import {
  getAllChapters,
  getChapterMeta,
  isChapterUnlocked,
  isChapterAvailable,
  type OrientationChapter,
  type OrientationStep,
} from '../../engine/orientation/index.js';
import { CommandInput } from '../components/CommandInput.js';
import { AlertBox } from '../components/AlertBox.js';

type Mode = 'chapter-select' | 'chapter-play';
type StepPhase = 'reading' | 'awaiting-command' | 'showing-output' | 'showing-explanation' | 'showing-quiz';

const TIER_LABELS: Record<number, string> = {
  1: 'FOUNDATIONS',
  2: 'DEFENSIVE OPERATIONS',
  3: 'OFFENSIVE AWARENESS',
  4: 'ADVANCED OPERATIONS',
};

const SPEAKER_COLORS: Record<string, string> = {
  HANDLER: colors.white,
  OMNIUS: colors.omnius,
  KAI: colors.cyan,
  REN: colors.warning,
  'DIRECTOR VASQUEZ': colors.purple,
};

export function OrientationScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const completeChapter = useGameStore((s) => s.completeChapter);
  const completedChapters = useGameStore((s) => s.orientationProgress.completedChapters);
  const tutorialCompleted = useGameStore((s) => s.tutorialCompleted);
  const addBehavioralEvent = useGameStore((s) => s.addBehavioralEvent);
  const adminMode = useGameStore((s) => s.adminMode);

  const [mode, setMode] = useState<Mode>('chapter-select');
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  // Chapter play state
  const [activeChapter, setActiveChapter] = useState<OrientationChapter | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<StepPhase>('reading');
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [lastHint, setLastHint] = useState('');
  const [selectedQuizOption, setSelectedQuizOption] = useState(-1);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const chapters = getChapterMeta();
  const allChapters = getAllChapters();

  const currentStep: OrientationStep | null =
    activeChapter?.sections[sectionIndex]?.steps[stepIndex] ?? null;
  const currentSection = activeChapter?.sections[sectionIndex] ?? null;

  const advanceStep = useCallback(() => {
    if (!activeChapter) return;

    const section = activeChapter.sections[sectionIndex];
    if (!section) return;

    // Silent ML event
    addBehavioralEvent({
      missionId: 'noop',
      type: 'command',
      data: {
        event: 'step_complete',
        chapterId: activeChapter.id,
        sectionId: section.id,
        stepIndex,
        stepType: currentStep?.type,
      },
    });

    if (stepIndex < section.steps.length - 1) {
      // Next step in section
      setStepIndex((i) => i + 1);
    } else if (sectionIndex < activeChapter.sections.length - 1) {
      // Next section
      setSectionIndex((i) => i + 1);
      setStepIndex(0);
    } else {
      // Chapter complete
      completeChapter(activeChapter.id);
      addBehavioralEvent({
        missionId: 'noop',
        type: 'command',
        data: { event: 'chapter_complete', chapterId: activeChapter.id },
      });

      // If this was chapter 3+, go to hub; otherwise back to chapter select
      if (activeChapter.number >= 3) {
        setScreen('hub');
      } else {
        setActiveChapter(null);
        setMode('chapter-select');
      }
      return;
    }

    setPhase('reading');
    setWrongAttempts(0);
    setLastHint('');
    setSelectedQuizOption(-1);
    setQuizAnswered(false);
  }, [activeChapter, sectionIndex, stepIndex, currentStep]);

  const startChapter = useCallback((chapterIndex: number) => {
    const meta = chapters[chapterIndex];
    if (!meta) return;
    if (!isChapterUnlocked(meta.id, completedChapters)) return;
    if (!isChapterAvailable(meta.id)) return;

    const chapter = allChapters.find((c) => c.id === meta.id);
    if (!chapter) return;

    addBehavioralEvent({
      missionId: 'noop',
      type: 'command',
      data: { event: 'chapter_start', chapterId: meta.id },
    });

    setActiveChapter(chapter);
    setSectionIndex(0);
    setStepIndex(0);
    setPhase('reading');
    setMode('chapter-play');
  }, [chapters, completedChapters, allChapters]);

  // ── CHAPTER SELECT MODE ─────────────────────────

  if (mode === 'chapter-select') {
    return <ChapterSelectView
      chapters={chapters}
      completedChapters={completedChapters}
      selectedIndex={selectedChapterIndex}
      onSelect={setSelectedChapterIndex}
      onStart={startChapter}
      onBack={() => setScreen(tutorialCompleted ? 'hub' : 'title')}
    />;
  }

  // ── CHAPTER PLAY MODE ──────────────────────────

  if (!activeChapter || !currentStep || !currentSection) {
    return <Text color={colors.alert}>Orientation data error.</Text>;
  }

  return <ChapterPlayView
    chapter={activeChapter}
    section={currentSection}
    step={currentStep}
    sectionIndex={sectionIndex}
    stepIndex={stepIndex}
    totalSections={activeChapter.sections.length}
    phase={phase}
    setPhase={setPhase}
    wrongAttempts={wrongAttempts}
    setWrongAttempts={setWrongAttempts}
    lastHint={lastHint}
    setLastHint={setLastHint}
    selectedQuizOption={selectedQuizOption}
    setSelectedQuizOption={setSelectedQuizOption}
    quizAnswered={quizAnswered}
    setQuizAnswered={setQuizAnswered}
    advanceStep={advanceStep}
    adminMode={adminMode}
    addBehavioralEvent={(data) => addBehavioralEvent({ missionId: 'noop', type: 'command', data })}
  />;
}

// ── Chapter Select Sub-Component ────────────────

function ChapterSelectView({
  chapters,
  completedChapters,
  selectedIndex,
  onSelect,
  onStart,
  onBack,
}: {
  chapters: ReturnType<typeof getChapterMeta>;
  completedChapters: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  onStart: (i: number) => void;
  onBack: () => void;
}) {
  useInput((input, key) => {
    if (key.upArrow) onSelect(Math.max(0, selectedIndex - 1));
    if (key.downArrow) onSelect(Math.min(chapters.length - 1, selectedIndex + 1));
    if (key.return) onStart(selectedIndex);
    if (key.escape || input === 'q') onBack();
  });

  let currentTier = 0;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box borderStyle="double" borderColor={colors.omnius} paddingX={1} flexDirection="column">
        <Text color={colors.omnius} bold>
          DI7 — NEW OBSERVER ORIENTATION PROGRAM
        </Text>
        <Text color={colors.dim}>
          Clearance progression: LEVEL 0 → LEVEL 1 → LEVEL 2 → R1
        </Text>
      </Box>

      <Box marginY={1} flexDirection="column">
        {chapters.map((ch, i) => {
          const unlocked = isChapterUnlocked(ch.id, completedChapters);
          const available = isChapterAvailable(ch.id);
          const completed = completedChapters.includes(ch.id);
          const isSelected = i === selectedIndex;

          // Tier header
          let tierHeader = null;
          if (ch.tier !== currentTier) {
            currentTier = ch.tier;
            tierHeader = (
              <Box key={`tier-${ch.tier}`} marginTop={i > 0 ? 1 : 0} marginBottom={0}>
                <Text color={colors.dim} bold>
                  ── TIER {ch.tier}: {TIER_LABELS[ch.tier]} ── {ch.clearanceLevel} ──
                </Text>
              </Box>
            );
          }

          const statusText = completed ? '  COMPLETE' : unlocked && available ? '  READY' : unlocked && !available ? '  COMING SOON' : '  LOCKED';
          const statusColor = completed ? colors.success : unlocked && available ? colors.omnius : colors.dim;

          return (
            <React.Fragment key={ch.id}>
              {tierHeader}
              <Box>
                <Text
                  color={unlocked ? (isSelected ? colors.cyan : colors.white) : '#444444'}
                  bold={isSelected}
                >
                  {isSelected ? ' ▸ ' : '   '}
                  {String(ch.number).padStart(2, '0')}. {ch.title}
                </Text>
                <Text color={statusColor} bold>
                  {statusText}
                </Text>
              </Box>
              {isSelected && unlocked && (
                <Text color={colors.dim}>
                  {'      '}{ch.subtitle} ({ch.estimatedMinutes} min)
                </Text>
              )}
            </React.Fragment>
          );
        })}
      </Box>

      <Box marginTop={1} borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.dim}>
          ↑↓ Select · Enter Begin Chapter · Esc Back
        </Text>
      </Box>
    </Box>
  );
}

// ── Chapter Play Sub-Component ──────────────────

function ChapterPlayView({
  chapter,
  section,
  step,
  sectionIndex,
  stepIndex,
  totalSections,
  phase,
  setPhase,
  wrongAttempts,
  setWrongAttempts,
  lastHint,
  setLastHint,
  selectedQuizOption,
  setSelectedQuizOption,
  quizAnswered,
  setQuizAnswered,
  advanceStep,
  adminMode,
  addBehavioralEvent,
}: {
  chapter: OrientationChapter;
  section: { id: string; title: string; steps: OrientationStep[] };
  step: OrientationStep;
  sectionIndex: number;
  stepIndex: number;
  totalSections: number;
  phase: StepPhase;
  setPhase: (p: StepPhase) => void;
  wrongAttempts: number;
  setWrongAttempts: (fn: (n: number) => number) => void;
  lastHint: string;
  setLastHint: (h: string) => void;
  selectedQuizOption: number;
  setSelectedQuizOption: (n: number) => void;
  quizAnswered: boolean;
  setQuizAnswered: (b: boolean) => void;
  advanceStep: () => void;
  adminMode: boolean;
  addBehavioralEvent: (data: Record<string, unknown>) => void;
}) {
  const speakerColor = SPEAKER_COLORS[step.speaker] ?? colors.dim;

  // Handle keyboard input
  useInput((input, key) => {
    // ADMIN: Space instantly skips to next step regardless of phase
    if (adminMode && input === ' ') {
      advanceStep();
      return;
    }

    // Narrative + decision aftermath: Enter advances
    if (step.type === 'narrative' && phase === 'reading' && key.return) {
      advanceStep();
      return;
    }

    // After showing command output, Enter shows explanation
    if (phase === 'showing-output' && key.return) {
      if (step.explanation && step.explanation.length > 0) {
        setPhase('showing-explanation');
      } else {
        advanceStep();
      }
      return;
    }

    // After explanation, Enter advances
    if (phase === 'showing-explanation' && key.return) {
      advanceStep();
      return;
    }

    // Quiz: number keys select, Enter confirms after selection
    if ((step.type === 'quiz' || step.type === 'decision') && phase === 'reading' && step.options) {
      const num = parseInt(input);
      if (num >= 1 && num <= step.options.length) {
        setSelectedQuizOption(num - 1);
        if (!quizAnswered) {
          setQuizAnswered(true);
          addBehavioralEvent({
            event: step.type === 'quiz' ? 'quiz_answer' : 'decision_made',
            chapterId: chapter.id,
            sectionId: section.id,
            optionId: step.options[num - 1]!.id,
            correct: step.options[num - 1]!.correct,
          });
        }
      }
      if (key.return && quizAnswered) {
        advanceStep();
      }
    }
  });

  // Handle command submission for guided/practice steps
  const handleCommand = (input: string) => {
    if (!step.commandPatterns && !step.expectedCommand) return;

    const normalized = input.trim().toLowerCase();
    const patterns = step.commandPatterns ?? [];
    const isCorrect = patterns.some((p) => normalized === p.toLowerCase())
      || (step.expectedCommand && normalized === step.expectedCommand.toLowerCase());

    addBehavioralEvent({
      event: 'command_attempt',
      chapterId: chapter.id,
      command: input,
      correct: !!isCorrect,
      attempt: wrongAttempts + 1,
    });

    if (isCorrect) {
      setPhase('showing-output');
      setLastHint('');
    } else {
      setWrongAttempts((n: number) => n + 1);
      setLastHint(step.hintOnWrong ?? `Try: ${step.expectedCommand}`);
    }
  };

  const progressPct = Math.round(((sectionIndex + 1) / totalSections) * 100);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Header */}
      <Box borderStyle="single" borderColor={colors.omnius} paddingX={1} justifyContent="space-between">
        <Text color={colors.omnius} bold>
          CH.{String(chapter.number).padStart(2, '0')}: {chapter.title.toUpperCase()}
        </Text>
        <Text color={colors.dim}>
          {section.title} · {chapter.clearanceLevel}
        </Text>
      </Box>

      {/* Speaker */}
      <Box marginTop={1}>
        <Text color={speakerColor} bold>[{step.speaker}]</Text>
      </Box>

      {/* Narrative lines */}
      <Box flexDirection="column" marginTop={1}>
        {step.lines.map((line, i) => (
          <Text key={i} color={line === '' ? undefined : step.speaker === 'HANDLER' ? colors.white : colors.purple}>
            {line === '' ? ' ' : line}
          </Text>
        ))}
      </Box>

      {/* Quiz options */}
      {(step.type === 'quiz' || step.type === 'decision') && step.options && phase === 'reading' && (
        <Box flexDirection="column" marginTop={1}>
          {step.question && (
            <Box marginBottom={1}>
              <AlertBox title={step.type === 'quiz' ? 'Question' : 'Decision Required'} type={step.type === 'quiz' ? 'info' : 'warning'}>
                <Text color={colors.cyan}>{step.question}</Text>
              </AlertBox>
            </Box>
          )}
          {step.options.map((opt, i) => {
            const isSelected = selectedQuizOption === i;
            const showResult = quizAnswered && isSelected;
            return (
              <Text
                key={opt.id}
                color={showResult ? (opt.correct ? colors.success : colors.alert) : isSelected ? colors.cyan : colors.dim}
                bold={isSelected}
              >
                {'  '}[{i + 1}] {opt.text}
                {showResult ? (opt.correct ? ' ✓' : ' ✗') : ''}
              </Text>
            );
          })}
          <Box marginTop={1}>
            <Text color={colors.dim}>
              {quizAnswered
                ? `Press ENTER to continue`
                : 'Press 1-' + step.options.length + ' to select'}
            </Text>
          </Box>
        </Box>
      )}

      {/* Command input for guided/practice steps */}
      {(step.type === 'guided-command' || step.type === 'practice') && phase === 'reading' && (
        <Box flexDirection="column" marginTop={1}>
          <Box borderStyle="single" borderColor={colors.cyan} paddingX={1}>
            <CommandInput onSubmit={handleCommand} prompt=">" />
          </Box>
          {lastHint && (
            <Box marginTop={1}>
              <Text color={colors.warning}>
                {wrongAttempts >= 2 ? '>> ' : ''}{lastHint}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Command output */}
      {phase === 'showing-output' && step.commandOutput && (
        <Box flexDirection="column" marginTop={1}>
          <Box borderStyle="single" borderColor={colors.omnius} paddingX={1}>
            <Text color={colors.omnius}>{step.commandOutput}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color={colors.dim}>Press <Text color={colors.cyan} bold>ENTER</Text> to continue...</Text>
          </Box>
        </Box>
      )}

      {/* Explanation */}
      {phase === 'showing-explanation' && step.explanation && (
        <Box flexDirection="column" marginTop={1}>
          <AlertBox title="Handler Analysis" type="info">
            <Box flexDirection="column">
              {step.explanation.map((line, i) => (
                <Text key={i} color={line === '' ? undefined : colors.white}>
                  {line === '' ? ' ' : line}
                </Text>
              ))}
            </Box>
          </AlertBox>
          <Box marginTop={1}>
            <Text color={colors.dim}>Press <Text color={colors.cyan} bold>ENTER</Text> to continue...</Text>
          </Box>
        </Box>
      )}

      {/* Continue prompt for narrative */}
      {step.type === 'narrative' && phase === 'reading' && (
        <Box marginTop={2}>
          <Text color={colors.dim}>
            Press <Text color={colors.cyan} bold>ENTER</Text> to continue...
          </Text>
        </Box>
      )}

      {/* Progress bar */}
      <Box marginTop={1} borderStyle="single" borderColor={colors.border} paddingX={1}>
        <Text color={colors.dim}>
          {'█'.repeat(Math.round(progressPct / 5))}
          {'░'.repeat(20 - Math.round(progressPct / 5))}
          {' '}{progressPct}% — Section {sectionIndex + 1}/{totalSections}
        </Text>
      </Box>
    </Box>
  );
}
