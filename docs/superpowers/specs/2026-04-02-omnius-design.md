# Omnius - Product Requirements Document & Design Specification

**Version:** 1.0
**Date:** 2026-04-02
**Author:** Shiv Garge + Claude

---

## 1. Context & Problem Statement

There is a massive global shortage of cybersecurity professionals. The gap is projected at 3.5 million unfilled positions worldwide. Meanwhile, traditional assessment tools (certification exams, CTF competitions) measure knowledge recall rather than the behavioral aptitudes that actually predict success in cybersecurity roles: pattern recognition, analytical investigation methodology, threat intuition, decision-making under pressure, and systematic thinking.

**Omnius** is a terminal-based interactive fiction game that wraps realistic cybersecurity scenarios in an espionage thriller narrative. Players type simulated security commands, investigate incidents, and make branching decisions. Under the surface, the game measures behavioral indicators of cybersecurity aptitude — how players investigate, not just what they know.

The target audience is students, career changers, and professionals with aging technical skills who want to assess their aptitude for cybersecurity work.

---

## 2. Product Vision

**One-liner:** A terminal text adventure that secretly measures your cybersecurity aptitude through an espionage thriller.

**Core Loop:** Read narrative context -> Receive alert/mission -> Investigate using simulated commands -> Make decisions -> See consequences -> Get scored on behavioral aptitudes.

**Differentiators:**
- Terminal-native (novel in the training space, which is web-dominated)
- Behavioral aptitude assessment, not knowledge testing
- Narrative-driven engagement (thriller/espionage tone)
- Privacy-first: all data stays local, exportable reports
- Grounded in NIST CSF, MITRE ATT&CK, and CompTIA Security+ frameworks

---

## 3. Target Audience

| Persona | Description | What They Get |
|---------|-------------|---------------|
| **Career Changer** | Mid-career professional exploring cybersecurity | Aptitude validation, confidence to pursue training |
| **CS/IT Student** | College student considering security specialization | Realistic preview of security work + aptitude score |
| **Bootcamp Grad** | Recently completed general IT training | Assessment of security-specific aptitude gaps |
| **Stale-Skills Pro** | IT professional whose skills are outdated | Modern threat landscape exposure + aptitude baseline |

---

## 4. Technical Stack

### Core Runtime
- **Language:** TypeScript 5.x (strict mode)
- **Runtime:** Node.js 20+ LTS
- **Package Manager:** pnpm

### Terminal UI Layer
- **Ink 5.x** — React-based terminal rendering (component architecture)
- **ink-text-input** — Text input handling for command simulation
- **chalk 5.x** — ANSI color/style formatting
- **figlet** — ASCII art for title screens and section headers
- **cli-spinners** — Loading/thinking animations
- **boxen** — Styled box drawing for panels and alerts
- **ora** — Spinner animations for "processing" states
- **ansi-escapes** — Low-level cursor control for custom animations
- **terminal-link** — Clickable terminal links (for reports)
- **cli-table3** — Formatted tables (log viewers, network scans)

### Game Engine Layer
- **zustand** — Lightweight state management (game state, player progress, metrics)
- **immer** — Immutable state updates
- **zod** — Runtime schema validation for content files
- **yaml** — YAML parser for narrative/mission content files
- **uuid** — Unique IDs for game sessions and events

### Assessment & Reporting
- **pdfkit** — PDF generation for assessment reports
- **chart.js + chartjs-node-canvas** — Radar charts, bar charts in reports
- **date-fns** — Timestamp handling for behavioral timing metrics

### Build & Distribution
- **tsup** — TypeScript bundler
- **pkg** or **bun compile** — Standalone binary compilation
- **vitest** — Testing framework
- **eslint + prettier** — Code quality

### Content Authoring
- **YAML files** — Narrative text, dialogue trees, mission definitions
- **JSON schemas** — Validation schemas for content structure
- **Zod schemas** — Runtime validation matching JSON schemas

---

## 5. Game Architecture

### 5.1 High-Level Architecture

```
+--------------------------------------------------+
|                   Omnius CLI                       |
+--------------------------------------------------+
|  Terminal UI Layer (Ink + React Components)        |
|  - ScreenRouter: manages which screen is active   |
|  - Renderer: handles animations, typing effects   |
|  - InputHandler: command parsing, autocomplete     |
+--------------------------------------------------+
|  Game Engine                                       |
|  - StateManager (zustand): game state, saves      |
|  - NarrativeEngine: dialogue trees, branching      |
|  - CommandSimulator: validates/executes commands   |
|  - MissionRunner: orchestrates mission flow        |
|  - EventBus: internal communication                |
+--------------------------------------------------+
|  Assessment Engine                                 |
|  - MetricsCollector: captures behavioral data      |
|  - AptitudeScorer: computes aptitude dimensions    |
|  - ReportGenerator: produces exportable reports    |
+--------------------------------------------------+
|  Content Layer (YAML/JSON data files)              |
|  - missions/*.yaml                                 |
|  - dialogues/*.yaml                                |
|  - commands/*.yaml                                 |
|  - scoring/*.yaml                                  |
+--------------------------------------------------+
```

### 5.2 Directory Structure

```
omnius/
├── src/
│   ├── index.tsx                  # Entry point
│   ├── app.tsx                    # Root Ink component
│   ├── engine/
│   │   ├── state.ts               # Zustand game state store
│   │   ├── narrative.ts           # Dialogue tree traversal
│   │   ├── commands.ts            # Command parser & simulator
│   │   ├── missions.ts            # Mission lifecycle manager
│   │   ├── events.ts              # Internal event bus
│   │   └── save.ts                # Save/load game state
│   ├── assessment/
│   │   ├── collector.ts           # Behavioral metrics collection
│   │   ├── scorer.ts              # Aptitude scoring algorithms
│   │   ├── dimensions.ts          # Aptitude dimension definitions
│   │   └── report.ts              # PDF/JSON report generation
│   ├── ui/
│   │   ├── screens/
│   │   │   ├── TitleScreen.tsx     # Animated title + menu
│   │   │   ├── HubScreen.tsx       # Central hub (your desk/office)
│   │   │   ├── MissionBrief.tsx    # Mission briefing screen
│   │   │   ├── Terminal.tsx        # In-mission command terminal
│   │   │   ├── Debrief.tsx         # Post-mission results
│   │   │   └── Report.tsx          # Assessment report viewer
│   │   ├── components/
│   │   │   ├── TypeWriter.tsx      # Typing animation effect
│   │   │   ├── AlertBox.tsx        # Colored alert panels
│   │   │   ├── LogViewer.tsx       # Scrollable log display
│   │   │   ├── NetworkMap.tsx      # ASCII network topology
│   │   │   ├── StatusBar.tsx       # Persistent bottom bar
│   │   │   ├── CommandInput.tsx    # Command line with autocomplete
│   │   │   ├── ProgressBar.tsx     # Mission progress indicator
│   │   │   ├── Radar.tsx           # ASCII radar chart for scores
│   │   │   └── Spinner.tsx         # Loading animations
│   │   └── theme.ts               # Color palette, text styles
│   ├── content/
│   │   ├── loader.ts              # YAML content loader + validator
│   │   └── schemas.ts             # Zod schemas for all content
│   └── utils/
│       ├── timing.ts              # Behavioral timing utilities
│       └── terminal.ts            # Terminal detection/compat
├── content/
│   ├── narrative/
│   │   ├── intro.yaml             # Opening narrative sequence
│   │   ├── hub.yaml               # Hub world dialogues
│   │   └── endings/               # Multiple ending narratives
│   ├── missions/
│   │   ├── 01-phishing-storm.yaml
│   │   ├── 02-ransomware-siege.yaml
│   │   ├── 03-insider-threat.yaml
│   │   ├── 04-supply-chain.yaml
│   │   ├── 05-apt-hunt.yaml
│   │   └── 06-cloud-breach.yaml
│   ├── commands/
│   │   ├── registry.yaml          # All available commands per context
│   │   └── responses/             # Command output templates
│   └── scoring/
│       ├── rubrics.yaml           # Scoring criteria per mission
│       └── dimensions.yaml        # Aptitude dimension weights
├── docs/
│   └── superpowers/specs/         # This document
├── tests/
│   ├── engine/
│   ├── assessment/
│   └── content/                   # Content validation tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. Narrative Design

### 6.1 Setting

**The Panopticon Group** — a covert, internationally-funded cybersecurity rapid response unit. Players are recruited after demonstrating "unusual aptitude" (the tutorial). The group operates from a secure facility, responding to cyber threats that nation-state actors, criminal organizations, and rogue AI systems pose to critical infrastructure.

The organization is named after Jeremy Bentham's panopticon — the idea that if you could see everything, you could protect everything. The AI system that monitors threats is called **OMNIUS** (Operational Monitoring Network for Unified Intelligence and Security).

### 6.2 Characters

| Character | Role | Function |
|-----------|------|----------|
| **OMNIUS** | AI threat detection system | Delivers alerts, provides data, serves as the game's narrator/interface |
| **Director Vasquez** | Head of Panopticon | Assigns missions, provides strategic context |
| **Kai Tanaka** | Senior Analyst | Mentor figure, provides hints when player struggles |
| **Ren** | Red Team Lead | Provides adversary perspective, challenges player assumptions |
| **Ghost** | Unknown entity | Recurring antagonist across missions, identity revealed in final arc |

### 6.3 Narrative Arc

**Act 1: Recruitment (Tutorial)**
- Player receives a cryptic terminal message: "We've been watching. You have potential."
- Tutorial mission: investigate a simulated phishing attack on a small company
- Teaches basic commands, establishes tone, calibrates initial aptitude baseline

**Act 2: The Missions (Core Gameplay)**
Hub world unlocks missions progressively. Each mission is a self-contained cybersecurity incident with branching outcomes:

1. **Operation: Phishing Storm** — Massive spear-phishing campaign targeting a financial institution. Analyze emails, trace infrastructure, contain the breach.
2. **Operation: Iron Lock** — Ransomware has encrypted a hospital's systems. Time-critical response with lives at stake. Triage, contain, recover.
3. **Operation: Glass House** — Insider threat at a defense contractor. Behavioral analysis, access log forensics, confrontation decisions.
4. **Operation: Upstream** — Supply chain compromise through a software vendor. Trace the malicious update, assess blast radius, coordinate disclosure.
5. **Operation: Phantom Signal** — APT (Advanced Persistent Threat) discovered in government infrastructure. Long-term threat hunting, stealth vs. speed tradeoffs.
6. **Operation: Cloudfall** — Cloud infrastructure misconfiguration exploited by criminal group. IAM investigation, lateral movement analysis, remediation.

**Act 3: Convergence**
- Missions reveal that "Ghost" has been behind multiple incidents
- Final mission ties threads together: defend Panopticon itself from a coordinated attack
- Multiple endings based on cumulative performance and key decisions

### 6.4 Mission Structure (Each Mission)

```
1. BRIEFING
   - OMNIUS delivers threat alert with initial indicators
   - Director Vasquez provides organizational context
   - Player receives mission objectives

2. INVESTIGATION
   - Player has access to simulated command terminal
   - Commands reveal evidence, logs, network data
   - Multiple investigation paths (some more efficient than others)
   - Time pressure (soft: narrative urgency / hard: timed in some missions)

3. DECISION POINTS
   - 2-4 critical decisions per mission
   - Each decision has visible and hidden consequences
   - Decisions test: risk tolerance, communication, prioritization, ethics

4. RESOLUTION
   - Player actions determine outcome (contained/partial/failed)
   - OMNIUS provides technical debrief
   - Kai or Ren offer perspective on what could have been done differently

5. DEBRIEF & SCORING
   - Behavioral metrics summary for the mission
   - Aptitude dimension scores updated
   - Narrative consequences of decisions revealed
```

---

## 7. Game Mechanics

### 7.1 Command System

Players interact through a simulated terminal. Commands are contextual — available commands change based on the mission and current investigation phase.

**Command Categories:**

| Category | Example Commands | Purpose |
|----------|-----------------|---------|
| **Reconnaissance** | `scan network`, `whois <domain>`, `nslookup <host>` | Gather information about threats |
| **Log Analysis** | `logs show --source=firewall --last=24h`, `logs search "failed login"` | Examine system and security logs |
| **Forensics** | `analyze <file>`, `hash <file>`, `timeline --host=<ip>` | Investigate artifacts and evidence |
| **Network** | `pcap capture --interface=eth0`, `connections --active`, `traceroute <ip>` | Network traffic analysis |
| **Response** | `isolate <host>`, `block <ip>`, `revoke <user>`, `patch <vuln>` | Take containment/remediation actions |
| **Communication** | `report <finding>`, `escalate`, `notify --team=legal` | Organizational communication |
| **System** | `help`, `status`, `save`, `hint` | Game/meta commands |

**Command Parsing:**
- Fuzzy matching for typos (e.g., `sacn network` -> "Did you mean `scan network`?")
- Contextual autocomplete (Tab key)
- Help system per command (`help scan`, `scan --help`)
- Commands feel realistic but are simplified simulations — output is pre-authored content that responds to the game state

### 7.2 Branching Decision System

At key moments, the narrative pauses and presents choices:

```
╔══════════════════════════════════════════════════╗
║  DECISION REQUIRED                                ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  The ransomware is spreading. You have two         ║
║  options:                                          ║
║                                                    ║
║  [1] Isolate affected segments immediately         ║
║      (stops spread but disrupts operations)        ║
║                                                    ║
║  [2] Monitor propagation to map the full attack    ║
║      surface before acting                         ║
║      (better intel but risk of further damage)     ║
║                                                    ║
║  [3] Contact the attacker's C2 infrastructure      ║
║      to attempt negotiation                        ║
║      (risky but could buy time)                    ║
║                                                    ║
╚══════════════════════════════════════════════════╝
```

Each choice has:
- **Visible consequences** (what the player is told will happen)
- **Hidden consequences** (cascading effects revealed later)
- **Aptitude signals** (what the choice reveals about the player's thinking)

### 7.3 Information Discovery

Not all evidence is surfaced automatically. Players must actively investigate:

- Running the right commands reveals hidden information
- Some evidence requires combining multiple data sources
- Red herrings exist — not all anomalies are malicious
- Players who investigate thoroughly score higher on "analytical rigor"
- Players who investigate efficiently score higher on "operational efficiency"
- The tension between rigor and efficiency is itself a measured aptitude

---

## 8. Assessment Engine

### 8.1 Behavioral Aptitude Dimensions

Based on cybersecurity workforce research (NICE Framework, RightTrak aptitude model, and behavioral indicators from insider threat analytics), Omnius measures 8 aptitude dimensions:

| Dimension | What It Measures | How It's Captured |
|-----------|-----------------|-------------------|
| **Analytical Rigor** | Thoroughness of investigation, evidence gathering | % of available evidence discovered, command diversity |
| **Pattern Recognition** | Ability to spot anomalies in data | Speed/accuracy of identifying IOCs in logs, network data |
| **Threat Intuition** | Gut sense for danger, risk assessment | Quality of early hypotheses, decision-making with incomplete data |
| **Systematic Thinking** | Structured approach to problem-solving | Command ordering, use of methodical vs. chaotic investigation |
| **Decision Quality** | Making good calls under pressure | Outcome quality of branching decisions, risk/reward tradeoffs |
| **Communication Instinct** | When and how to escalate/report | Timing and appropriateness of escalation and notification actions |
| **Operational Efficiency** | Speed without sacrificing accuracy | Time-to-detection, time-to-containment, wasted actions |
| **Adaptability** | Response to unexpected developments | Behavior changes when initial hypothesis is wrong, pivot speed |

### 8.2 Metrics Collection

The assessment engine silently records:

**Timing Metrics:**
- Time between receiving alert and first investigative action
- Time spent reading vs. acting
- Dwell time on decision points
- Total mission completion time
- Time between evidence discovery and correct hypothesis

**Behavioral Metrics:**
- Command sequence patterns (systematic vs. random)
- Number of unique commands used vs. repeated commands
- Use of `help` and `hint` commands (learning orientation)
- Investigation breadth (how many data sources examined)
- Investigation depth (how deep into any single source)
- Backtracking frequency (reconsidering previous findings)

**Decision Metrics:**
- Choices made at each decision point
- Confidence signals (time to decide, requests for more info)
- Risk tolerance profile (aggressive vs. conservative choices)
- Escalation timing (too early, appropriate, too late)
- Ethical alignment (choices that prioritize safety vs. mission)

### 8.3 Scoring Algorithm

Each mission produces dimension scores on a 0-100 scale. The algorithm:

1. **Capture** raw behavioral events during gameplay
2. **Normalize** against expected performance ranges (calibrated from playtesting)
3. **Weight** events by their diagnostic value for each dimension
4. **Aggregate** across all missions with recency weighting
5. **Profile** — produce a composite aptitude profile

Scoring rubrics are defined in `content/scoring/rubrics.yaml` per mission, making them tunable without code changes.

### 8.4 Assessment Report

Generated locally as a PDF (and JSON for machine-readable use). Contains:

- **Aptitude Radar Chart** — visual representation of 8 dimensions
- **Dimension Breakdowns** — specific behavioral examples from gameplay
- **Strength Highlights** — top 2-3 aptitude areas
- **Growth Areas** — bottom 2-3 areas with actionable guidance
- **Mission Summaries** — per-mission performance snapshots
- **Framework Alignment** — how aptitudes map to NIST CSF functions and CompTIA Security+ domains
- **Recommended Next Steps** — suggested training resources based on profile

---

## 9. Terminal UI/UX Design

### 9.1 Visual Language

**Color Palette:**
- `#00FF41` (Matrix green) — OMNIUS system text, command output
- `#FF6B6B` (Alert red) — Threats, errors, critical alerts
- `#4ECDC4` (Cyan) — Player input, interactive elements
- `#FFE66D` (Warning yellow) — Warnings, important information
- `#A855F7` (Purple) — Narrative text, character dialogue
- `#6B7280` (Dim gray) — System messages, timestamps
- `#FFFFFF` (White) — High-emphasis text, headers

**Typography Conventions:**
- UPPERCASE for system alerts and headers
- Monospace for all text (terminal native)
- `>` prefix for player input
- `[OMNIUS]` prefix for AI narrator
- `[CHARACTER]` prefix for NPC dialogue

### 9.2 Screen Layouts

**Title Screen:**
```
 ██████╗ ███╗   ███╗███╗   ██╗██╗██╗   ██╗███████╗
██╔═══██╗████╗ ████║████╗  ██║██║██║   ██║██╔════╝
██║   ██║██╔████╔██║██╔██╗ ██║██║██║   ██║███████╗
██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║   ██║╚════██║
╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║╚██████╔╝███████║
 ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚══════╝

    Operational Monitoring Network for Unified
           Intelligence and Security

         [ NEW GAME ]    [ CONTINUE ]
         [ SETTINGS ]    [ ABOUT    ]
```

**Hub Screen (The Desk):**
```
┌─────────────────────────────────────────────────────┐
│ PANOPTICON GROUP — Secure Operations Center          │
│ Analyst: [PLAYER_NAME]  |  Clearance: Level 2       │
│ Date: 2026-03-15        |  Threat Level: ████░ HIGH  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  [OMNIUS] Good morning, Analyst. Three situations     │
│  require your attention today.                        │
│                                                       │
│  AVAILABLE MISSIONS:                                  │
│  ┌─────────────────────────────────────────┐         │
│  │ [1] Operation: Phishing Storm  ★☆☆      │         │
│  │     Financial sector breach detected     │         │
│  │     Status: NEW                          │         │
│  ├─────────────────────────────────────────┤         │
│  │ [2] Operation: Iron Lock       ★★☆      │         │
│  │     Hospital ransomware - CRITICAL       │         │
│  │     Status: LOCKED (complete mission 1)  │         │
│  └─────────────────────────────────────────┘         │
│                                                       │
│  QUICK ACTIONS:                                       │
│  [R] Review assessment   [S] Settings   [Q] Quit     │
│                                                       │
├─────────────────────────────────────────────────────┤
│ > _                                                   │
└─────────────────────────────────────────────────────┘
```

**Mission Terminal Screen:**
```
┌─────────────────────────────────────────────────────┐
│ OP: PHISHING STORM  │  Phase: Investigation          │
│ Time: 00:14:32       │  Evidence: 4/12 found          │
├─────────────────────────────────────────────────────┤
│                                                       │
│  [OMNIUS] Email gateway logs are available.           │
│  3,247 emails flagged in the last 6 hours.            │
│  Recommend starting with pattern analysis.            │
│                                                       │
│  > logs show --source=email-gateway --last=6h         │
│                                                       │
│  ═══ EMAIL GATEWAY LOGS ═══════════════════════       │
│  [06:14] INBOUND from noreply@paypa1.com → CFO       │
│  [06:14] INBOUND from noreply@paypa1.com → CISO      │
│  [06:15] INBOUND from noreply@paypa1.com → HR-DIR    │
│  [06:22] OUTBOUND CFO → https://paypa1.com/verify    │
│  [06:34] ALERT: Unusual auth from CFO-LAPTOP          │
│  ... (showing 5 of 3247, use --limit to show more)   │
│                                                       │
│  > _                                                  │
├─────────────────────────────────────────────────────┤
│ [TAB] autocomplete  [UP] history  [F1] help          │
└─────────────────────────────────────────────────────┘
```

### 9.3 Animations & Effects

| Effect | Where Used | Implementation |
|--------|-----------|----------------|
| **Typewriter text** | Narrative text, OMNIUS dialogue | Character-by-character rendering with variable speed |
| **Scan line** | Title screen, transitions | Horizontal line sweep animation |
| **Glitch text** | Threat alerts, hacking scenes | Random character substitution with rapid correction |
| **Progress bar** | Loading data, scanning | Animated fill with percentage |
| **Fade in/out** | Screen transitions | Gradual opacity change via ANSI dim attributes |
| **Pulsing** | Active alerts, cursor | Brightness oscillation |
| **Matrix rain** | Background during certain scenes | Falling character columns (subtle, background-only) |
| **Spinner** | Processing commands | Rotating braille/dot characters |
| **Box draw** | Panels, menus | Animated border drawing from corner |

### 9.4 Input Interactions

| Input | Behavior |
|-------|----------|
| **Text typing** | Echo with cyan color, command history with up/down arrows |
| **Tab** | Autocomplete with popup suggestion list |
| **Enter** | Execute command, animate response |
| **Ctrl+C** | Confirm quit (double-tap) |
| **Ctrl+L** | Clear terminal output |
| **F1** | Context-sensitive help |
| **1-9 keys** | Quick selection during choice prompts |
| **Escape** | Cancel current action / close overlay |

---

## 10. Content Schema Design

### 10.1 Mission Schema (YAML)

```yaml
# content/missions/01-phishing-storm.yaml
id: phishing-storm
title: "Operation: Phishing Storm"
difficulty: 1  # 1-3 stars
estimated_time: 30  # minutes
unlock_condition: null  # first mission, always available

briefing:
  narrator: omnius
  text: |
    THREAT ALERT — Priority Level: HIGH
    A coordinated spear-phishing campaign has been detected targeting
    Meridian Financial Group. Multiple executive accounts may be compromised.
  objectives:
    - Identify the phishing infrastructure
    - Determine which accounts were compromised
    - Contain the breach before data exfiltration

phases:
  - id: investigation
    available_commands:
      - logs
      - analyze
      - whois
      - nslookup
      - connections
      - report
    evidence:
      - id: phishing-emails
        discovery_command: "logs show --source=email-gateway"
        content: |
          [06:14] INBOUND from noreply@paypa1.com -> CFO
          ...
        aptitude_signal:
          dimension: pattern_recognition
          trigger: "player notices paypa1 vs paypal typosquat"
          weight: 0.8
      # ... more evidence items

decisions:
  - id: immediate-response
    trigger: "after 3+ evidence items discovered"
    prompt: "The CFO's account shows suspicious OAuth tokens..."
    options:
      - id: isolate-immediately
        text: "Revoke all OAuth tokens and force password reset"
        consequences:
          narrative: "The breach is contained but the CFO loses access..."
          score_impact:
            decision_quality: 0.8
            threat_intuition: 0.7
      - id: monitor-first
        text: "Monitor the tokens to trace the attacker's infrastructure"
        consequences:
          narrative: "You observe the attacker accessing the shared drive..."
          score_impact:
            decision_quality: 0.6
            analytical_rigor: 0.9

scoring:
  par_time: 1800  # 30 minutes in seconds
  evidence_total: 12
  critical_evidence: [phishing-emails, cfo-oauth, c2-domain]
```

### 10.2 Command Schema

```yaml
# content/commands/registry.yaml
commands:
  - name: logs
    category: log_analysis
    usage: "logs show --source=<source> [--last=<duration>] [--search=<term>]"
    description: "View system and security logs"
    contexts: [investigation, response]  # phases where available
    subcommands:
      - show
      - search
      - export
    flags:
      - name: source
        required: true
        options: [firewall, email-gateway, auth, dns, proxy, endpoint]
      - name: last
        required: false
        default: "24h"
      - name: search
        required: false
      - name: limit
        required: false
        default: 20
```

---

## 11. Cybersecurity Accuracy Standards

### 11.1 Framework Alignment

Every mission maps to specific frameworks to ensure educational accuracy:

| Mission | NIST CSF Functions | MITRE ATT&CK Techniques | CompTIA Sec+ Domains |
|---------|-------------------|-------------------------|---------------------|
| Phishing Storm | Detect, Respond | T1566 (Phishing), T1078 (Valid Accounts) | Threats & Vulnerabilities |
| Iron Lock | Respond, Recover | T1486 (Data Encrypted), T1490 (Inhibit Recovery) | Security Operations |
| Glass House | Identify, Detect | T1078 (Valid Accounts), T1530 (Data from Cloud) | Security Program Mgmt |
| Upstream | Identify, Protect | T1195 (Supply Chain), T1072 (Software Deploy) | Security Architecture |
| Phantom Signal | Detect, Respond | T1071 (App Layer Protocol), T1041 (Exfiltration) | Security Operations |
| Cloudfall | Protect, Detect | T1190 (Exploit Public App), T1078.004 (Cloud Accts) | Security Architecture |

### 11.2 Technical Accuracy Requirements

- All simulated command outputs must reflect realistic data formats
- Log formats must match industry standards (syslog, CEF, JSON logs)
- Network addresses must use RFC 5737 documentation ranges (192.0.2.0/24, 198.51.100.0/24)
- Email headers must follow RFC 5322 structure
- MITRE ATT&CK technique IDs must be current and correctly categorized
- Incident response procedures must align with NIST SP 800-61 Rev. 2
- All "wrong" choices must be plausibly wrong (no obviously bad options)

### 11.3 Review Process

Content should be reviewed against:
- NIST Cybersecurity Framework v2.0
- MITRE ATT&CK Enterprise Matrix (latest)
- CompTIA Security+ SY0-701 objectives
- SANS Incident Response methodology

---

## 12. Save System & Game State

### 12.1 Save State Structure

```typescript
interface GameState {
  version: string;
  sessionId: string;
  player: {
    name: string;
    createdAt: string;
  };
  progress: {
    completedMissions: string[];
    currentMission: string | null;
    missionStates: Record<string, MissionState>;
    hubDialogueFlags: string[];
  };
  assessment: {
    dimensions: Record<AptitudeDimension, number>;
    missionScores: Record<string, MissionScore>;
    behavioralEvents: BehavioralEvent[];
  };
  settings: {
    textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
    colorMode: 'full' | '256' | 'basic' | 'none';
    soundEffects: boolean;  // terminal bell for alerts
  };
}
```

### 12.2 Save Location

- **macOS:** `~/.local/share/omnius/`
- **Linux:** `$XDG_DATA_HOME/omnius/` or `~/.local/share/omnius/`
- **Windows:** `%APPDATA%/omnius/`

Auto-save after each mission completion and at decision points.

---

## 13. Distribution Strategy

### 13.1 Installation Methods

1. **npm global install:** `npm install -g omnius` then `omnius`
2. **npx (no install):** `npx omnius`
3. **Standalone binary:** Download from releases (compiled via `pkg` or `bun compile`)
4. **Homebrew (future):** `brew install omnius`

### 13.2 System Requirements

- Node.js 20+ (for npm/npx installs)
- Terminal with ANSI color support (virtually all modern terminals)
- Minimum 80x24 terminal size (recommended: 120x40)
- OS: macOS, Linux, Windows (with Windows Terminal)

---

## 14. MVP Scope (v0.1)

For the initial playable version:

**In Scope:**
- Title screen with ASCII art and animations
- Hub world with mission selection
- 1 complete mission: Operation Phishing Storm (the tutorial/first mission)
- Simulated command terminal with 6-8 commands
- 3 branching decision points
- Basic assessment metrics collection
- Local JSON save system
- Simple text-based assessment summary (no PDF yet)
- Typewriter text effect, box drawing, colored output

**Out of Scope for MVP:**
- Missions 2-6 (content authoring after engine is proven)
- PDF report generation
- Standalone binary compilation
- Autocomplete
- Full animation suite (minimal animations in MVP)
- Sound effects
- Multiple endings

---

## 15. Verification Plan

### 15.1 How to Test

1. **Build & Run:** `pnpm dev` should launch the game in terminal
2. **Title Screen:** Animated ASCII art displays, menu is navigable
3. **Hub World:** Player can view available missions, select Phishing Storm
4. **Mission Gameplay:**
   - Briefing text displays with typewriter effect
   - Command input accepts and parses simulated commands
   - `logs show --source=email-gateway` returns realistic log output
   - Evidence discovery is tracked in the status bar
   - Decision prompts appear at correct triggers
   - Mission resolves based on choices
5. **Assessment:** After mission, a summary of behavioral metrics displays
6. **Save/Load:** Game state persists between sessions
7. **Terminal Compatibility:** Test in iTerm2, Terminal.app, VS Code terminal

### 15.2 Content Accuracy Verification

- Cross-reference all log formats with real-world examples
- Verify MITRE ATT&CK technique IDs are current
- Ensure command names and flags mirror real security tools (simplified)
- Validate that "correct" investigation paths align with industry best practices

---

## Appendix A: Aptitude Dimension Mapping to Cybersecurity Roles

| Dimension | SOC Analyst | Incident Responder | Threat Hunter | Security Architect |
|-----------|------------|-------------------|--------------|-------------------|
| Analytical Rigor | HIGH | HIGH | HIGH | MEDIUM |
| Pattern Recognition | HIGH | MEDIUM | CRITICAL | MEDIUM |
| Threat Intuition | MEDIUM | HIGH | CRITICAL | HIGH |
| Systematic Thinking | MEDIUM | HIGH | MEDIUM | CRITICAL |
| Decision Quality | MEDIUM | CRITICAL | HIGH | HIGH |
| Communication Instinct | HIGH | CRITICAL | LOW | HIGH |
| Operational Efficiency | CRITICAL | HIGH | MEDIUM | LOW |
| Adaptability | MEDIUM | CRITICAL | HIGH | MEDIUM |

This mapping allows the assessment report to suggest which cybersecurity career paths align with a player's natural aptitudes.
