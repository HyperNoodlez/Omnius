import type { MissionData, Evidence } from './missions.js';
import type { MissionState } from './state.js';

// ── Command Parser ───────────────────────────────

export interface ParsedCommand {
  name: string;
  args: string[];
  flags: Record<string, string>;
  raw: string;
}

export function parseCommand(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/);
  const name = (parts[0] ?? '').toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]!;
    if (part.startsWith('--')) {
      const [key, ...valueParts] = part.slice(2).split('=');
      flags[key!] = valueParts.join('=') || 'true';
    } else {
      args.push(part);
    }
  }

  return { name, args, flags, raw: input.trim() };
}

// ── Command Executor ─────────────────────────────

export interface CommandResult {
  output: string;
  evidenceId?: string; // which evidence this reveals
  type: 'output' | 'error' | 'alert' | 'evidence' | 'system';
}

export function executeCommand(
  parsed: ParsedCommand,
  mission: MissionData,
  missionState: MissionState
): CommandResult {
  // Check if command is available in this mission
  if (!mission.availableCommands.includes(parsed.name) && !['help', 'status', 'hint', 'clear'].includes(parsed.name)) {
    return {
      output: `Unknown command: ${parsed.name}. Type 'help' for available commands.`,
      type: 'error',
    };
  }

  // Meta commands
  switch (parsed.name) {
    case 'help':
      return handleHelp(mission);
    case 'status':
      return handleStatus(mission, missionState);
    case 'hint':
      return handleHint(mission, missionState);
    case 'clear':
      return { output: '__CLEAR__', type: 'system' };
  }

  // Try to match command to evidence
  const matchedEvidence = findMatchingEvidence(parsed, mission, missionState);
  if (matchedEvidence) {
    return {
      output: matchedEvidence.content,
      evidenceId: matchedEvidence.id,
      type: 'evidence',
    };
  }

  // Generic command responses
  return getGenericResponse(parsed, mission);
}

function findMatchingEvidence(
  parsed: ParsedCommand,
  mission: MissionData,
  missionState: MissionState
): Evidence | null {
  for (const evidence of mission.evidence) {
    if (missionState.evidenceDiscovered.includes(evidence.id)) {
      // Already discovered — show it again but don't re-trigger
      if (matchesDiscoveryCommand(parsed, evidence.discoveryCommand)) {
        return { ...evidence, id: '__already_seen__' };
      }
      continue;
    }

    if (matchesDiscoveryCommand(parsed, evidence.discoveryCommand)) {
      return evidence;
    }
  }
  return null;
}

function matchesDiscoveryCommand(parsed: ParsedCommand, pattern: string): boolean {
  const normalizedInput = parsed.raw.toLowerCase().replace(/\s+/g, ' ');
  const normalizedPattern = pattern.toLowerCase().replace(/\s+/g, ' ');

  // Exact match
  if (normalizedInput === normalizedPattern) return true;

  // Partial match — check if the core command and key flags match
  const patternParts = normalizedPattern.split(' ');
  const inputParts = normalizedInput.split(' ');

  // Command name must match
  if (patternParts[0] !== inputParts[0]) return false;

  // Check for key flag presence (e.g., --source=email-gateway)
  const patternFlags = patternParts.filter((p) => p.startsWith('--'));
  const inputFlags = inputParts.filter((p) => p.startsWith('--'));

  // All pattern flags should be present in input
  for (const pf of patternFlags) {
    if (!inputFlags.some((inf) => inf.includes(pf.split('=')[0]!))) {
      // If the key flag value is present anywhere in the input, count it
      const flagValue = pf.split('=')[1];
      if (flagValue && normalizedInput.includes(flagValue)) continue;
      return false;
    }
  }

  // Check for key args (non-flag parts after command name)
  const patternArgs = patternParts.filter((p) => !p.startsWith('--')).slice(1);
  for (const pa of patternArgs) {
    if (!normalizedInput.includes(pa)) return false;
  }

  return true;
}

function handleHelp(mission: MissionData): CommandResult {
  const cmds = mission.availableCommands;
  const helpText = `═══ AVAILABLE COMMANDS ═══════════════════════════════

INVESTIGATION:
  logs show --source=<src> [--search=<term>]  View security logs
    Sources: email-gateway, firewall, auth, drive, dns, proxy
  analyze <file>                              Analyze a file or artifact
  whois <domain>                              Domain registration lookup
  nslookup <host>                             DNS resolution lookup
  connections [--user=<email>]                Active network connections
  scan network --target=<range>               Scan IP range

RESPONSE:
  isolate <host>                              Isolate a host from network
  revoke <user>                               Revoke user access tokens
  block <ip>                                  Block IP at firewall

COMMUNICATION:
  report <finding>                            Report a finding
  escalate                                    Escalate to management

SYSTEM:
  help                                        Show this help
  status                                      Mission status
  hint                                        Get a hint (affects score)
  clear                                       Clear terminal output`;

  return { output: helpText, type: 'system' };
}

function handleStatus(mission: MissionData, state: MissionState): CommandResult {
  const elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const evidenceCount = state.evidenceDiscovered.length;
  const totalEvidence = mission.evidence.length;
  const decisionsCount = Object.keys(state.decisionsMap).length;
  const totalDecisions = mission.decisions.length;

  return {
    output: `═══ MISSION STATUS ══════════════════════════════════════

Mission:    ${mission.meta.title}
Phase:      ${state.phase.toUpperCase()}
Time:       ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}
Evidence:   ${evidenceCount}/${totalEvidence} discovered
Decisions:  ${decisionsCount}/${totalDecisions} made
Commands:   ${state.commandHistory.length} executed`,
    type: 'system',
  };
}

function handleHint(mission: MissionData, state: MissionState): CommandResult {
  const undiscovered = mission.evidence.filter(
    (e) => !state.evidenceDiscovered.includes(e.id)
  );

  if (undiscovered.length === 0) {
    return {
      output: 'You\'ve found all available evidence. Review your findings or make a decision.',
      type: 'system',
    };
  }

  // Give a vague hint about the next piece of evidence
  const next = undiscovered[0]!;
  const cmdParts = next.discoveryCommand.split(' ');
  const hintCommand = cmdParts[0];

  const hints: Record<string, string> = {
    logs: 'Try examining the system logs. Different sources may reveal different information.',
    analyze: 'There are artifacts that could be analyzed for more details.',
    whois: 'Domain registration details can reveal important information about threat infrastructure.',
    nslookup: 'DNS lookups can help map attacker infrastructure.',
    connections: 'Checking active connections might reveal ongoing compromises.',
    scan: 'Scanning the attacker\'s network range could reveal their infrastructure.',
  };

  return {
    output: `[HINT] ${hints[hintCommand!] ?? `Try using the '${hintCommand}' command to investigate further.`}\n\nNote: Using hints affects your Adaptability score.`,
    type: 'system',
  };
}

function getGenericResponse(parsed: ParsedCommand, _mission: MissionData): CommandResult {
  // Generic responses for commands that don't match evidence
  switch (parsed.name) {
    case 'logs':
      if (!parsed.flags['source']) {
        return {
          output: 'Usage: logs show --source=<source> [--search=<term>]\nSources: email-gateway, firewall, auth, drive, dns, proxy',
          type: 'error',
        };
      }
      return {
        output: `No notable entries found in ${parsed.flags['source']} logs for the specified criteria.\nTry different search terms or time ranges.`,
        type: 'output',
      };

    case 'whois':
      if (parsed.args.length === 0) {
        return { output: 'Usage: whois <domain>', type: 'error' };
      }
      return {
        output: `WHOIS lookup for ${parsed.args[0]}: No suspicious indicators found.\nDomain appears legitimate.`,
        type: 'output',
      };

    case 'nslookup':
      if (parsed.args.length === 0) {
        return { output: 'Usage: nslookup <hostname>', type: 'error' };
      }
      return {
        output: `DNS lookup for ${parsed.args[0]}: Resolves to standard infrastructure.\nNo anomalies detected.`,
        type: 'output',
      };

    case 'connections':
      return {
        output: 'All connections appear normal for specified criteria.',
        type: 'output',
      };

    case 'scan':
      if (!parsed.flags['target']) {
        return { output: 'Usage: scan network --target=<ip-range>', type: 'error' };
      }
      return {
        output: `Scan of ${parsed.flags['target']}: No responsive hosts found in specified range.`,
        type: 'output',
      };

    case 'analyze':
      if (parsed.args.length === 0) {
        return { output: 'Usage: analyze <filename>', type: 'error' };
      }
      return {
        output: `File "${parsed.args[0]}" not found in evidence collection.\nAvailable artifacts will appear as you investigate.`,
        type: 'output',
      };

    case 'isolate':
      return {
        output: `Host isolation requires a specific target. Use 'connections' to identify compromised hosts first.`,
        type: 'output',
      };

    case 'revoke':
      return {
        output: `Token revocation requires a specific user. Use 'connections' to identify compromised accounts first.`,
        type: 'output',
      };

    case 'block':
      return {
        output: `Firewall block requires a specific IP. Use 'logs' or 'scan' to identify threat IPs first.`,
        type: 'output',
      };

    case 'report':
      return {
        output: `Finding noted. Continue investigating to build a comprehensive picture.`,
        type: 'output',
      };

    case 'escalate':
      return {
        output: `Escalation registered. Continue gathering evidence for a more informed escalation.`,
        type: 'output',
      };

    default:
      return {
        output: `Command '${parsed.name}' not recognized. Type 'help' for available commands.`,
        type: 'error',
      };
  }
}
