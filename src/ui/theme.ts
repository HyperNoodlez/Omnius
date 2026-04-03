import chalk from 'chalk';

// Omnius color palette
export const colors = {
  // Primary colors
  omnius: '#FF8C00',     // OMNIUS system text, command output (orange)
  alert: '#FF6B6B',      // Threats, errors, critical alerts
  cyan: '#4ECDC4',       // Player input, interactive elements
  warning: '#FFE66D',    // Warnings, important info
  purple: '#A855F7',     // Narrative text, character dialogue
  dim: '#6B7280',        // System messages, timestamps
  white: '#FFFFFF',      // High-emphasis text, headers

  // Status colors
  success: '#22C55E',
  info: '#3B82F6',

  // UI element colors
  border: '#374151',
  borderHighlight: '#4ECDC4',
  background: '#111827',
} as const;

// Styled text helpers
export const style = {
  // Character/system prefixes
  handler: chalk.hex(colors.white).bold('[HANDLER]'),
  omnius: chalk.hex(colors.omnius).bold('[OMNIUS]'),
  director: chalk.hex(colors.purple).bold('[DIRECTOR VASQUEZ]'),
  kai: chalk.hex(colors.cyan).bold('[KAI]'),
  ren: chalk.hex(colors.warning).bold('[REN]'),
  ghost: chalk.hex(colors.alert).bold('[???]'),
  system: chalk.hex(colors.dim).italic('[SYSTEM]'),

  // Text styles
  narrative: (text: string) => chalk.hex(colors.purple)(text),
  command: (text: string) => chalk.hex(colors.cyan)(text),
  output: (text: string) => chalk.hex(colors.omnius)(text),
  error: (text: string) => chalk.hex(colors.alert)(text),
  warn: (text: string) => chalk.hex(colors.warning)(text),
  dimText: (text: string) => chalk.hex(colors.dim)(text),
  highlight: (text: string) => chalk.hex(colors.white).bold(text),
  success: (text: string) => chalk.hex(colors.success)(text),

  // Special formatting
  header: (text: string) => chalk.hex(colors.omnius).bold(text.toUpperCase()),
  subheader: (text: string) => chalk.hex(colors.cyan).underline(text),
  timestamp: (text: string) => chalk.hex(colors.dim)(`[${text}]`),
  evidence: (text: string) => chalk.hex(colors.warning).bold(`[EVIDENCE] ${text}`),
  alert: (text: string) => chalk.hex(colors.alert).bold(`!! ${text} !!`),
} as const;

// Box-drawing characters
export const box = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  teeRight: '├',
  teeLeft: '┤',
  teeDown: '┬',
  teeUp: '┴',
  cross: '┼',

  // Double line variants
  dTopLeft: '╔',
  dTopRight: '╗',
  dBottomLeft: '╚',
  dBottomRight: '╝',
  dHorizontal: '═',
  dVertical: '║',
} as const;

// Gradient block title art (░▒▓█ style — Hitman aesthetic)
export const TITLE_ART = [
  '░▒▓██████▓▒░░▒▓██████████████▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓███████▓▒░',
  '░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░',
  '░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░',
  '░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░',
  '░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░',
  '░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░',
  ' ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░░▒▓██████▓▒░░▒▓███████▓▒░',
];

export const SUBTITLE = 'D A T A   I N T E L L I G E N C E   D I V I S I O N   S E V E N';
