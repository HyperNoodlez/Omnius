// ── New Observer Orientation Program (NOOP) ──────
// DI7 — Data Intelligence Division Seven

export type OrientationStepType =
  | 'narrative'
  | 'guided-command'
  | 'practice'
  | 'scenario'
  | 'quiz'
  | 'decision';

export interface OrientationStep {
  type: OrientationStepType;
  speaker: 'HANDLER' | 'OMNIUS' | 'KAI' | 'REN' | 'DIRECTOR VASQUEZ';
  lines: string[];
  // For guided-command / practice:
  expectedCommand?: string;
  commandPatterns?: string[];
  commandOutput?: string;
  explanation?: string[];
  hintOnWrong?: string;
  // For quiz:
  question?: string;
  options?: { id: string; text: string; correct: boolean }[];
  // For scenario:
  scenarioContext?: string;
}

export interface OrientationSection {
  id: string;
  title: string;
  steps: OrientationStep[];
}

export interface OrientationChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  clearanceLevel: string;
  tier: 1 | 2 | 3 | 4;
  estimatedMinutes: number;
  sections: OrientationSection[];
}

export interface OrientationProgress {
  currentChapter: number; // 0 = not started
  completedChapters: string[];
  chapterStates: Record<string, ChapterState>;
}

export interface ChapterState {
  startedAt: number;
  completedAt?: number;
  currentSection: number;
  currentStep: number;
  quizResults: Record<string, boolean>;
  decisionsMap: Record<string, string>;
}

// ── Chapter Registry ─────────────────────────────

import { getChapter01 } from './ch01-battlefield.js';
import { getChapter02 } from './ch02-terminal.js';
import { getChapter03 } from './ch03-first-blood.js';
import { getChapter04 } from './ch04-walls-gates.js';
import { getChapter05 } from './ch05-reading-wire.js';
import { getChapter06 } from './ch06-human-factor.js';
import { getChapter07 } from './ch07-web-underbelly.js';
import { getChapter08 } from './ch08-breaching.js';
import { getChapter09 } from './ch09-invisible.js';
import { getChapter10 } from './ch10-crypto.js';
import { getChapter11 } from './ch11-cloud.js';
import { getChapter12 } from './ch12-edge.js';

export function getAllChapters(): OrientationChapter[] {
  return [
    getChapter01(),
    getChapter02(),
    getChapter03(),
    getChapter04(),
    getChapter05(),
    getChapter06(),
    getChapter07(),
    getChapter08(),
    getChapter09(),
    getChapter10(),
    getChapter11(),
    getChapter12(),
  ];
}

export function getChapterMeta(): { id: string; number: number; title: string; subtitle: string; clearanceLevel: string; tier: number; estimatedMinutes: number }[] {
  return [
    { id: 'ch01-battlefield', number: 1, title: 'The Digital Battlefield', subtitle: 'Understanding What You\'re Protecting', clearanceLevel: 'LEVEL 0', tier: 1, estimatedMinutes: 15 },
    { id: 'ch02-terminal', number: 2, title: 'The Observer\'s Terminal', subtitle: 'Your Tools, Your Weapons', clearanceLevel: 'LEVEL 0', tier: 1, estimatedMinutes: 20 },
    { id: 'ch03-first-blood', number: 3, title: 'First Blood', subtitle: 'Your First Investigation', clearanceLevel: 'LEVEL 0', tier: 1, estimatedMinutes: 25 },
    { id: 'ch04-walls-gates', number: 4, title: 'Walls and Gates', subtitle: 'Authentication & Access Control', clearanceLevel: 'LEVEL 1', tier: 2, estimatedMinutes: 25 },
    { id: 'ch05-reading-wire', number: 5, title: 'Reading the Wire', subtitle: 'Network Fundamentals for Security', clearanceLevel: 'LEVEL 1', tier: 2, estimatedMinutes: 30 },
    { id: 'ch06-human-factor', number: 6, title: 'The Human Factor', subtitle: 'Social Engineering & Deception', clearanceLevel: 'LEVEL 1', tier: 2, estimatedMinutes: 25 },
    { id: 'ch07-web-underbelly', number: 7, title: 'The Web\'s Soft Underbelly', subtitle: 'Web Application Vulnerabilities', clearanceLevel: 'LEVEL 2', tier: 3, estimatedMinutes: 35 },
    { id: 'ch08-breaching', number: 8, title: 'Breaching the Perimeter', subtitle: 'How Attackers Get In', clearanceLevel: 'LEVEL 2', tier: 3, estimatedMinutes: 35 },
    { id: 'ch09-invisible', number: 9, title: 'Invisible Enemies', subtitle: 'APTs, Evasion, and Stealth', clearanceLevel: 'LEVEL 2', tier: 3, estimatedMinutes: 35 },
    { id: 'ch10-crypto', number: 10, title: 'Crypto Wars', subtitle: 'Cryptography and Its Failures', clearanceLevel: 'R1', tier: 4, estimatedMinutes: 30 },
    { id: 'ch11-cloud', number: 11, title: 'Cloud Fortress', subtitle: 'Cloud Security & Modern Surfaces', clearanceLevel: 'R1', tier: 4, estimatedMinutes: 30 },
    { id: 'ch12-edge', number: 12, title: 'The Edge', subtitle: 'Bleeding-Edge Threats & AI Security', clearanceLevel: 'R1', tier: 4, estimatedMinutes: 30 },
  ];
}

export function isChapterUnlocked(chapterId: string, completedChapters: string[]): boolean {
  const meta = getChapterMeta();
  const chapter = meta.find((c) => c.id === chapterId);
  if (!chapter) return false;
  if (chapter.number === 1) return true;

  // Each chapter requires the previous one completed
  const prevChapter = meta.find((c) => c.number === chapter.number - 1);
  return prevChapter ? completedChapters.includes(prevChapter.id) : false;
}

export function isChapterAvailable(chapterId: string): boolean {
  // All 12 chapters are now authored and playable
  const meta = getChapterMeta();
  return meta.some((c) => c.id === chapterId);
}

export const INITIAL_ORIENTATION_PROGRESS: OrientationProgress = {
  currentChapter: 0,
  completedChapters: [],
  chapterStates: {},
};
