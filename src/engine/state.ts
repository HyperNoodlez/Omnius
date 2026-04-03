import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ── Types ────────────────────────────────────────────

export type Screen =
  | 'title'
  | 'tutorial'
  | 'hub'
  | 'mission-brief'
  | 'terminal'
  | 'debrief'
  | 'report'
  | 'about'
  | 'guide'
  | 'settings';

export type AptitudeDimension =
  | 'analytical_rigor'
  | 'pattern_recognition'
  | 'threat_intuition'
  | 'systematic_thinking'
  | 'decision_quality'
  | 'communication_instinct'
  | 'operational_efficiency'
  | 'adaptability';

export const ALL_DIMENSIONS: AptitudeDimension[] = [
  'analytical_rigor',
  'pattern_recognition',
  'threat_intuition',
  'systematic_thinking',
  'decision_quality',
  'communication_instinct',
  'operational_efficiency',
  'adaptability',
];

export const DIMENSION_LABELS: Record<AptitudeDimension, string> = {
  analytical_rigor: 'Analytical Rigor',
  pattern_recognition: 'Pattern Recognition',
  threat_intuition: 'Threat Intuition',
  systematic_thinking: 'Systematic Thinking',
  decision_quality: 'Decision Quality',
  communication_instinct: 'Communication Instinct',
  operational_efficiency: 'Operational Efficiency',
  adaptability: 'Adaptability',
};

export interface BehavioralEvent {
  timestamp: number;
  missionId: string;
  type: 'command' | 'decision' | 'evidence_found' | 'hint_used' | 'help_used' | 'backtrack';
  data: Record<string, unknown>;
}

export interface MissionScore {
  missionId: string;
  completedAt: string;
  timeElapsed: number; // seconds
  evidenceFound: number;
  evidenceTotal: number;
  decisionsCorrect: number;
  decisionsTotal: number;
  dimensions: Partial<Record<AptitudeDimension, number>>;
  outcome: 'success' | 'partial' | 'failure';
}

export interface MissionState {
  phase: 'briefing' | 'investigation' | 'decision' | 'resolution' | 'debrief';
  startedAt: number;
  evidenceDiscovered: string[];
  commandHistory: string[];
  decisionsMap: Record<string, string>; // decisionId -> choiceId
  currentDecisionId: string | null;
  outputLog: OutputEntry[];
}

export interface OutputEntry {
  id: string;
  type: 'narrative' | 'command' | 'output' | 'error' | 'alert' | 'evidence' | 'system' | 'decision';
  speaker?: string;
  text: string;
  timestamp: number;
}

export interface GameSettings {
  textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
  playerName: string;
}

// ── Store ────────────────────────────────────────────

interface GameStore {
  // Admin
  adminMode: boolean;
  toggleAdmin: () => void;

  // Navigation
  screen: Screen;
  setScreen: (screen: Screen) => void;

  // Player
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;

  // Progress
  tutorialCompleted: boolean;
  orientationProgress: { currentChapter: number; completedChapters: string[] };
  completedMissions: string[];
  currentMissionId: string | null;
  missionStates: Record<string, MissionState>;

  // Assessment
  dimensions: Record<AptitudeDimension, number>;
  missionScores: MissionScore[];
  behavioralEvents: BehavioralEvent[];

  // Actions
  completeTutorial: () => void;
  completeChapter: (chapterId: string) => void;
  startMission: (missionId: string) => void;
  endMission: (score: MissionScore) => void;
  updateMissionState: (missionId: string, updater: (state: MissionState) => void) => void;
  addBehavioralEvent: (event: Omit<BehavioralEvent, 'timestamp'>) => void;
  addOutputEntry: (missionId: string, entry: Omit<OutputEntry, 'id' | 'timestamp'>) => void;
  resetGame: () => void;
}

const initialDimensions: Record<AptitudeDimension, number> = {
  analytical_rigor: 0,
  pattern_recognition: 0,
  threat_intuition: 0,
  systematic_thinking: 0,
  decision_quality: 0,
  communication_instinct: 0,
  operational_efficiency: 0,
  adaptability: 0,
};

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    // Initial state
    adminMode: false,
    screen: 'title',
    settings: {
      textSpeed: 'normal',
      playerName: 'Observer',
    },
    tutorialCompleted: false,
    orientationProgress: { currentChapter: 0, completedChapters: [] },
    completedMissions: [],
    currentMissionId: null,
    missionStates: {},
    dimensions: { ...initialDimensions },
    missionScores: [],
    behavioralEvents: [],

    // Admin — secret fast-forward mode for testing
    toggleAdmin: () =>
      set((state) => {
        state.adminMode = !state.adminMode;
        if (state.adminMode) {
          state.settings.textSpeed = 'instant';
        }
      }),

    // Navigation
    setScreen: (screen) =>
      set((state) => {
        state.screen = screen;
      }),

    // Settings
    updateSettings: (newSettings) =>
      set((state) => {
        Object.assign(state.settings, newSettings);
      }),

    // Orientation
    completeTutorial: () =>
      set((state) => {
        state.tutorialCompleted = true;
        state.screen = 'hub';
      }),

    completeChapter: (chapterId) =>
      set((state) => {
        if (!state.orientationProgress.completedChapters.includes(chapterId)) {
          state.orientationProgress.completedChapters.push(chapterId);
        }
        state.orientationProgress.currentChapter++;
        // After completing chapter 3 (Tier 1), mark tutorial as done and unlock hub
        if (state.orientationProgress.completedChapters.length >= 3) {
          state.tutorialCompleted = true;
        }
      }),

    // Mission lifecycle
    startMission: (missionId) =>
      set((state) => {
        state.currentMissionId = missionId;
        state.missionStates[missionId] = {
          phase: 'briefing',
          startedAt: Date.now(),
          evidenceDiscovered: [],
          commandHistory: [],
          decisionsMap: {},
          currentDecisionId: null,
          outputLog: [],
        };
        state.screen = 'mission-brief';
      }),

    endMission: (score) =>
      set((state) => {
        state.missionScores.push(score);
        if (!state.completedMissions.includes(score.missionId)) {
          state.completedMissions.push(score.missionId);
        }
        state.currentMissionId = null;
        state.screen = 'debrief';

        // Update aggregate dimension scores
        for (const [dim, value] of Object.entries(score.dimensions)) {
          const key = dim as AptitudeDimension;
          const existing = state.dimensions[key];
          // Rolling average weighted toward recent
          state.dimensions[key] = existing === 0 ? value! : existing * 0.4 + value! * 0.6;
        }
      }),

    updateMissionState: (missionId, updater) =>
      set((state) => {
        const ms = state.missionStates[missionId];
        if (ms) updater(ms);
      }),

    addBehavioralEvent: (event) =>
      set((state) => {
        state.behavioralEvents.push({
          ...event,
          timestamp: Date.now(),
        });
      }),

    addOutputEntry: (missionId, entry) =>
      set((state) => {
        const ms = state.missionStates[missionId];
        if (ms) {
          ms.outputLog.push({
            ...entry,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: Date.now(),
          });
        }
      }),

    resetGame: () =>
      set((state) => {
        state.screen = 'title';
        state.tutorialCompleted = false;
        state.orientationProgress = { currentChapter: 0, completedChapters: [] };
        state.completedMissions = [];
        state.currentMissionId = null;
        state.missionStates = {};
        state.dimensions = { ...initialDimensions };
        state.missionScores = [];
        state.behavioralEvents = [];
      }),
  }))
);
