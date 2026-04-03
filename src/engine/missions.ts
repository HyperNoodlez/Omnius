// ── Mission Registry & Data ──────────────────────

export interface MissionMeta {
  id: string;
  title: string;
  difficulty: number; // 1-3
  description: string;
  unlockCondition: string | null;
  estimatedMinutes: number;
}

export interface Evidence {
  id: string;
  discoveryCommand: string; // command pattern that reveals this
  content: string;
  aptitudeSignal?: {
    dimension: string;
    description: string;
    weight: number;
  };
}

export interface DecisionOption {
  id: string;
  text: string;
  consequence: string;
  scoreImpact: Record<string, number>;
  isOptimal: boolean;
}

export interface Decision {
  id: string;
  triggerAfterEvidence: number; // triggers after N evidence items found
  prompt: string;
  options: DecisionOption[];
}

export interface MissionData {
  meta: MissionMeta;
  briefing: {
    narrator: string;
    lines: string[];
    objectives: string[];
  };
  availableCommands: string[];
  evidence: Evidence[];
  decisions: Decision[];
  completionThreshold: number; // min evidence to complete
  parTimeSeconds: number;
}

// ── Mission Registry ─────────────────────────────

export function getMissionRegistry(): MissionMeta[] {
  return [
    {
      id: 'phishing-storm',
      title: 'Operation: Phishing Storm',
      difficulty: 1,
      description: 'A coordinated spear-phishing campaign targeting a financial institution',
      unlockCondition: null,
      estimatedMinutes: 25,
    },
    {
      id: 'iron-lock',
      title: 'Operation: Iron Lock',
      difficulty: 2,
      description: 'Ransomware has encrypted a hospital\'s critical systems',
      unlockCondition: 'phishing-storm',
      estimatedMinutes: 35,
    },
    {
      id: 'glass-house',
      title: 'Operation: Glass House',
      difficulty: 2,
      description: 'Insider threat at a defense contractor — behavioral forensics required',
      unlockCondition: 'phishing-storm',
      estimatedMinutes: 30,
    },
    {
      id: 'upstream',
      title: 'Operation: Upstream',
      difficulty: 3,
      description: 'Supply chain compromise through a trusted software vendor',
      unlockCondition: 'iron-lock',
      estimatedMinutes: 40,
    },
    {
      id: 'phantom-signal',
      title: 'Operation: Phantom Signal',
      difficulty: 3,
      description: 'Advanced persistent threat discovered in government infrastructure',
      unlockCondition: 'glass-house',
      estimatedMinutes: 45,
    },
    {
      id: 'cloudfall',
      title: 'Operation: Cloudfall',
      difficulty: 3,
      description: 'Cloud infrastructure breach exploited by an organized criminal group',
      unlockCondition: 'upstream',
      estimatedMinutes: 40,
    },
  ];
}

// ── Mission 1: Phishing Storm (Complete Data) ────

export function getPhishingStormData(): MissionData {
  return {
    meta: getMissionRegistry()[0]!,
    briefing: {
      narrator: 'omnius',
      lines: [
        'THREAT ALERT — Priority Level: HIGH',
        '',
        'A coordinated spear-phishing campaign has been detected targeting',
        'Meridian Financial Group, a mid-size investment firm with $2.3B in',
        'assets under management.',
        '',
        'Initial indicators suggest this is not a generic spray-and-pray',
        'campaign. The emails are individually crafted, targeting C-suite',
        'executives with knowledge of ongoing M&A activity.',
        '',
        'At least one executive appears to have engaged with the phishing',
        'infrastructure. Time is critical — data exfiltration may already',
        'be underway.',
      ],
      objectives: [
        'Identify the phishing infrastructure and campaign scope',
        'Determine which accounts have been compromised',
        'Contain the breach before sensitive M&A data is exfiltrated',
      ],
    },
    availableCommands: [
      'logs',
      'analyze',
      'whois',
      'nslookup',
      'connections',
      'scan',
      'isolate',
      'revoke',
      'block',
      'report',
      'escalate',
      'help',
      'status',
      'hint',
    ],
    evidence: [
      {
        id: 'phishing-emails',
        discoveryCommand: 'logs show --source=email-gateway',
        content: `═══ EMAIL GATEWAY LOGS (Last 6 hours) ══════════════════════

[06:14:23] INBOUND  from: noreply@paypa1-secure.com → j.morrison@meridian.com (CFO)
           Subject: "Urgent: Wire Transfer Authorization Required"
           Attachment: invoice_Q4_2026.pdf (42KB)
           SPF: SOFTFAIL  DKIM: NONE  DMARC: FAIL

[06:14:45] INBOUND  from: noreply@paypa1-secure.com → s.chen@meridian.com (CISO)
           Subject: "Security Alert: Unusual Login Detected"
           Link: https://paypa1-secure.com/verify?token=aGVsbG8=
           SPF: SOFTFAIL  DKIM: NONE  DMARC: FAIL

[06:15:02] INBOUND  from: noreply@paypa1-secure.com → r.patel@meridian.com (HR Director)
           Subject: "Employee Benefits Portal Update Required"
           Link: https://paypa1-secure.com/hr-portal
           SPF: SOFTFAIL  DKIM: NONE  DMARC: FAIL

[06:22:18] OUTBOUND  j.morrison@meridian.com → https://paypa1-secure.com/verify
           Method: POST  Status: 302 Redirect
           !! CFO clicked the phishing link !!

[06:34:01] ALERT    Unusual OAuth token grant for j.morrison@meridian.com
           Source IP: 198.51.100.47  GeoIP: Bucharest, Romania
           Scope: mail.read, drive.readonly, calendar.read

Showing 5 of 847 entries. Use --limit to show more.`,
        aptitudeSignal: {
          dimension: 'pattern_recognition',
          description: 'Player notices paypa1-secure.com typosquat domain and SPF/DKIM/DMARC failures',
          weight: 0.8,
        },
      },
      {
        id: 'domain-whois',
        discoveryCommand: 'whois paypa1-secure.com',
        content: `═══ WHOIS LOOKUP: paypa1-secure.com ═════════════════════

Domain Name: paypa1-secure.com
Registry Domain ID: 2845739201_DOMAIN_COM-VRSN
Registrar: NameSilo, LLC
Creation Date: 2026-03-28T03:42:11Z   ← REGISTERED 5 DAYS AGO
Expiration Date: 2027-03-28T03:42:11Z
Registrant Organization: REDACTED FOR PRIVACY
Registrant Country: PA (Panama)
Name Servers:
  ns1.bulletproof-dns.net    ← KNOWN BULLETPROOF HOSTING
  ns2.bulletproof-dns.net

!! Domain registered recently through privacy-protected registrar !!
!! Name servers associated with known bulletproof hosting provider !!`,
        aptitudeSignal: {
          dimension: 'analytical_rigor',
          description: 'Player investigates the domain registration details',
          weight: 0.7,
        },
      },
      {
        id: 'dns-lookup',
        discoveryCommand: 'nslookup paypa1-secure.com',
        content: `═══ DNS LOOKUP: paypa1-secure.com ════════════════════════

Server:  8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    paypa1-secure.com
Address: 198.51.100.47

Reverse DNS: no PTR record found
ASN: AS62904 - EONIX CORPORATION (Known hosting for phishing infra)
GeoIP: Bucharest, Romania
Hosting: Bulletproof VPS provider, frequently flagged for abuse`,
        aptitudeSignal: {
          dimension: 'systematic_thinking',
          description: 'Player correlates DNS IP with OAuth login source',
          weight: 0.8,
        },
      },
      {
        id: 'cfo-connections',
        discoveryCommand: 'connections --user=j.morrison',
        content: `═══ ACTIVE CONNECTIONS: j.morrison@meridian.com ══════════

Session ID   Source IP        Dest IP          Service     Duration
─────────────────────────────────────────────────────────────────
SES-4401     10.20.1.15       172.16.0.5       Exchange    02:14:33
SES-4402     10.20.1.15       172.16.0.12      SharePoint  01:48:22
SES-4403     198.51.100.47    172.16.0.5       IMAP/OAuth  00:47:18  !! EXTERNAL !!
SES-4404     198.51.100.47    172.16.0.20      Drive API   00:32:05  !! EXTERNAL !!
SES-4405     198.51.100.47    172.16.0.8       Calendar    00:32:01  !! EXTERNAL !!

!! 3 active sessions from external IP 198.51.100.47 !!
!! This IP matches the phishing infrastructure !!
!! Attacker has active access to CFO's email, drive, and calendar !!`,
        aptitudeSignal: {
          dimension: 'threat_intuition',
          description: 'Player checks active connections to assess real-time compromise',
          weight: 0.9,
        },
      },
      {
        id: 'cfo-drive-activity',
        discoveryCommand: 'logs show --source=drive --user=j.morrison',
        content: `═══ DRIVE ACTIVITY: j.morrison@meridian.com ═══════════════

[06:35:22] FILE_VIEW  /Confidential/M&A/Project-Falcon-LOI.docx
           Source: 198.51.100.47 (EXTERNAL)
[06:36:01] FILE_VIEW  /Confidential/M&A/Project-Falcon-Valuation.xlsx
           Source: 198.51.100.47 (EXTERNAL)
[06:36:44] FILE_DOWNLOAD  /Confidential/M&A/Project-Falcon-LOI.docx
           Source: 198.51.100.47 (EXTERNAL)  Size: 2.4MB
[06:37:12] FILE_DOWNLOAD  /Confidential/M&A/Project-Falcon-Valuation.xlsx
           Source: 198.51.100.47 (EXTERNAL)  Size: 4.1MB
[06:38:55] FILE_VIEW  /Confidential/M&A/Project-Falcon-Board-Approval.pdf
           Source: 198.51.100.47 (EXTERNAL)
[06:39:30] FILE_DOWNLOAD  /Confidential/M&A/Project-Falcon-Board-Approval.pdf
           Source: 198.51.100.47 (EXTERNAL)  Size: 1.8MB

!! 6.3MB of M&A documents downloaded to external IP !!
!! DATA EXFILTRATION IN PROGRESS !!`,
        aptitudeSignal: {
          dimension: 'analytical_rigor',
          description: 'Player investigates what data the attacker accessed',
          weight: 0.9,
        },
      },
      {
        id: 'firewall-logs',
        discoveryCommand: 'logs show --source=firewall',
        content: `═══ FIREWALL LOGS (Last 6 hours) ═════════════════════════

[06:00-06:30] Normal traffic patterns. No anomalies.

[06:34:18] ALLOW  198.51.100.47:443 → 172.16.0.5:993  IMAP/TLS
           Rule: OAUTH-CLOUD-ACCESS (auto-generated)
[06:34:19] ALLOW  198.51.100.47:443 → 172.16.0.20:443 Drive API
[06:34:20] ALLOW  198.51.100.47:443 → 172.16.0.8:443  Calendar API

[06:45:00] ALLOW  198.51.100.47:443 → 172.16.0.5:993  IMAP/TLS
           Data transferred: 847KB outbound

[07:00-07:15] Connection attempts from 198.51.100.23 (NEW IP)
           → 172.16.0.5:993 - BLOCKED (no valid token)
           → 172.16.0.12:443 - BLOCKED (no valid token)
           NOTE: This IP is in same /24 as .47 — same attacker, new machine?

Total suspicious connections: 14
Total data egress to 198.51.100.0/24: 8.4MB`,
        aptitudeSignal: {
          dimension: 'pattern_recognition',
          description: 'Player notices the second attacker IP in the same subnet',
          weight: 0.7,
        },
      },
      {
        id: 'other-victims',
        discoveryCommand: 'logs show --source=auth --search=failed',
        content: `═══ AUTHENTICATION LOGS (Failed Attempts) ════════════════

[07:02:33] FAILED  s.chen@meridian.com  OAuth grant attempt
           Source: 198.51.100.23  Scope: mail.read
           Reason: MFA challenge not completed
           !! CISO was phished but MFA blocked the takeover !!

[07:04:15] FAILED  r.patel@meridian.com  OAuth grant attempt
           Source: 198.51.100.23  Scope: mail.read, drive.readonly
           Reason: MFA challenge not completed
           !! HR Director was phished but MFA blocked the takeover !!

[07:12:44] SUCCESS  j.morrison@meridian.com  OAuth token refresh
           Source: 198.51.100.47
           !! CFO account still actively compromised !!

Summary: 2 additional phishing targets protected by MFA.
         CFO account remains the only confirmed compromise.
         CFO did NOT have MFA enabled.`,
        aptitudeSignal: {
          dimension: 'systematic_thinking',
          description: 'Player investigates scope of compromise across all targeted users',
          weight: 0.8,
        },
      },
      {
        id: 'email-analysis',
        discoveryCommand: 'analyze invoice_Q4_2026.pdf',
        content: `═══ FILE ANALYSIS: invoice_Q4_2026.pdf ═══════════════════

File: invoice_Q4_2026.pdf
Size: 42,318 bytes
Type: PDF document, version 1.7
MD5:  a3f2b8c9d1e4f5a6b7c8d9e0f1a2b3c4
SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069

Static Analysis:
  - Contains embedded JavaScript (suspicious)
  - JavaScript calls: app.launchURL()
  - URL extracted: https://paypa1-secure.com/verify?uid=CFO&token=ZXhmaWw=
  - No macro content
  - No executable payload

Classification: PHISHING LURE (credential harvesting)
Threat Level: MEDIUM — redirects to credential phishing page, no malware payload

VirusTotal: 3/72 detections (Kaspersky, CrowdStrike, SentinelOne)
First Seen: 2026-03-28 (matches domain registration date)`,
        aptitudeSignal: {
          dimension: 'analytical_rigor',
          description: 'Player performs malware analysis on the phishing attachment',
          weight: 0.6,
        },
      },
      {
        id: 'scan-network',
        discoveryCommand: 'scan network --target=198.51.100.0/24',
        content: `═══ NETWORK SCAN: 198.51.100.0/24 ═══════════════════════

Scanning... Done. 3 hosts responsive.

HOST              PORT    SERVICE         STATE
198.51.100.23     22      SSH             OPEN
198.51.100.23     80      HTTP            OPEN (redirect→443)
198.51.100.23     443     HTTPS           OPEN (cert: *.paypa1-secure.com)

198.51.100.47     22      SSH             OPEN
198.51.100.47     443     HTTPS           OPEN (cert: *.paypa1-secure.com)
198.51.100.47     993     IMAPS           OPEN (reverse proxy)
198.51.100.47     8443    HTTPS-ALT       OPEN (C2 panel?)

198.51.100.100    80      HTTP            OPEN (nginx default page)
198.51.100.100    443     HTTPS           OPEN (cert: expired)

!! .47 port 8443 may be attacker's command & control panel !!
!! Two distinct servers sharing same phishing certificate !!`,
        aptitudeSignal: {
          dimension: 'threat_intuition',
          description: 'Player proactively scans attacker infrastructure',
          weight: 0.7,
        },
      },
    ],

    decisions: [
      {
        id: 'initial-response',
        triggerAfterEvidence: 3,
        prompt: `The CFO's account shows active external sessions from the phishing infrastructure. The attacker has OAuth tokens granting access to email, drive, and calendar. What's your immediate response?`,
        options: [
          {
            id: 'revoke-immediately',
            text: 'Revoke all OAuth tokens and force password reset for the CFO immediately',
            consequence: `You revoke the CFO's OAuth tokens. The attacker's sessions are terminated within 30 seconds. The CFO is temporarily locked out but the bleeding stops. 6.3MB of M&A data was already exfiltrated, but you prevented further access to email archives and upcoming board materials.`,
            scoreImpact: {
              decision_quality: 85,
              threat_intuition: 80,
              operational_efficiency: 90,
            },
            isOptimal: true,
          },
          {
            id: 'monitor-first',
            text: 'Monitor the active sessions to map the full extent of attacker access before acting',
            consequence: `While monitoring, the attacker downloads 3 additional confidential documents totaling 12MB. You gain better intelligence on their infrastructure but at the cost of more data loss. The CFO's calendar reveals an upcoming board meeting about Project Falcon.`,
            scoreImpact: {
              decision_quality: 50,
              analytical_rigor: 75,
              operational_efficiency: 40,
            },
            isOptimal: false,
          },
          {
            id: 'isolate-network',
            text: 'Isolate the entire executive network segment to prevent lateral movement',
            consequence: `The executive floor loses all network access. This stops the attacker but also disrupts a live client call the CEO is on, and blocks 47 employees from working. The attacker had no ability to move laterally — only the CFO's cloud tokens were compromised. The response was disproportionate.`,
            scoreImpact: {
              decision_quality: 45,
              communication_instinct: 30,
              threat_intuition: 35,
            },
            isOptimal: false,
          },
        ],
      },
      {
        id: 'escalation-timing',
        triggerAfterEvidence: 6,
        prompt: `You've confirmed that M&A documents related to "Project Falcon" were exfiltrated. This is material non-public information that could be used for insider trading. Who do you escalate to?`,
        options: [
          {
            id: 'legal-and-ciso',
            text: 'Escalate to Legal and CISO immediately — this is a potential securities violation',
            consequence: `Legal counsel initiates SEC notification procedures. The CISO activates the full incident response plan. The board is notified within 2 hours. Your quick escalation demonstrates understanding that this is no longer just a technical incident — it has regulatory implications.`,
            scoreImpact: {
              communication_instinct: 95,
              decision_quality: 90,
              threat_intuition: 85,
            },
            isOptimal: true,
          },
          {
            id: 'ciso-only',
            text: 'Report to CISO only — keep the circle small until we know more',
            consequence: `The CISO appreciates the discretion but immediately asks why Legal wasn't looped in. Material non-public information theft has mandatory reporting requirements. The 4-hour delay in notifying Legal creates compliance risk.`,
            scoreImpact: {
              communication_instinct: 55,
              decision_quality: 60,
              analytical_rigor: 70,
            },
            isOptimal: false,
          },
          {
            id: 'full-incident',
            text: 'Activate full incident response — notify all department heads and freeze all systems',
            consequence: `The full IR activation causes widespread panic. Trading operations are halted for 3 hours. While thorough, the response magnitude doesn't match the scoped breach. News of the "security incident" leaks to a financial reporter before the company can control the narrative.`,
            scoreImpact: {
              communication_instinct: 35,
              decision_quality: 40,
              adaptability: 45,
            },
            isOptimal: false,
          },
        ],
      },
      {
        id: 'remediation-strategy',
        triggerAfterEvidence: 8,
        prompt: `The immediate threat is contained. Now you need to recommend remediation. What's your priority?`,
        options: [
          {
            id: 'mfa-and-review',
            text: 'Enforce MFA for all executives + review OAuth app permissions org-wide',
            consequence: `Within 24 hours, all C-suite accounts have MFA enabled. The OAuth review discovers 3 other suspicious app authorizations that were dormant — planted months ago. Your systematic approach prevents future attacks through the same vector.`,
            scoreImpact: {
              systematic_thinking: 90,
              decision_quality: 85,
              adaptability: 80,
            },
            isOptimal: true,
          },
          {
            id: 'block-and-monitor',
            text: 'Block the attacker IP range and enhance email filtering rules',
            consequence: `The IP block is effective short-term, but the attacker can easily switch infrastructure. The email filter improvements help but don't address the root cause — the CFO had no MFA. You've treated the symptom, not the disease.`,
            scoreImpact: {
              systematic_thinking: 45,
              decision_quality: 55,
              threat_intuition: 50,
            },
            isOptimal: false,
          },
          {
            id: 'security-awareness',
            text: 'Launch an emergency security awareness training for all executives',
            consequence: `The training is well-received but takes 2 weeks to organize. In the meantime, the fundamental vulnerability (no MFA on executive accounts) remains. Training alone can't prevent all phishing — technical controls are the primary defense.`,
            scoreImpact: {
              systematic_thinking: 40,
              communication_instinct: 70,
              decision_quality: 50,
            },
            isOptimal: false,
          },
        ],
      },
    ],

    completionThreshold: 5,
    parTimeSeconds: 1500, // 25 minutes
  };
}
