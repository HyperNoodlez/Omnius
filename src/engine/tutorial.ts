// ── Tutorial Step Definitions ────────────────────

export type TutorialStepType = 'narrative' | 'guided-command' | 'practice';

export interface TutorialStep {
  type: TutorialStepType;
  speaker: string;
  title?: string;
  lines: string[];
  // For guided-command and practice steps:
  expectedCommand?: string; // exact command to match
  commandPatterns?: string[]; // alternative acceptable patterns
  commandOutput?: string; // canned output to display
  explanation?: string[]; // OMNIUS explains what the output means
  hintOnWrong?: string; // hint if player types wrong command
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  // ═══════════════════════════════════════════════
  // SECTION 1: WELCOME
  // ═══════════════════════════════════════════════
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'RECRUITMENT ORIENTATION',
    lines: [
      'Welcome to the Panopticon Group, Analyst.',
      '',
      'You have been selected because our behavioral analysis flagged',
      'you for unusually high aptitude in pattern recognition and',
      'analytical reasoning. Those are rare traits.',
      '',
      'My name is OMNIUS — the Operational Monitoring Network for',
      'Unified Intelligence and Security. I am the AI system that',
      'monitors global threat intelligence for this organization.',
      '',
      'Before you begin your first mission, I need to orient you',
      'to the tools at your disposal.',
    ],
  },
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'YOUR TERMINAL',
    lines: [
      'Your terminal is your primary weapon. Through it, you will:',
      '',
      '  INVESTIGATE — Examine logs, analyze files, map infrastructure',
      '  RESPOND     — Contain threats, revoke access, block attackers',
      '  COMMUNICATE — Report findings, escalate to leadership',
      '',
      'Every command you type during a mission is recorded. Not to',
      'judge you — but to understand how you think. Investigation',
      'methodology matters as much as the outcome.',
      '',
      'Let me walk you through each category.',
    ],
  },

  // ═══════════════════════════════════════════════
  // SECTION 2: INVESTIGATION COMMANDS
  // ═══════════════════════════════════════════════
  {
    type: 'guided-command',
    speaker: 'OMNIUS',
    title: 'COMMAND: logs',
    lines: [
      'The "logs" command is your starting point for any investigation.',
      'Security logs are timestamped records from various systems —',
      'each source tells a different part of the story.',
      '',
      'Try it now. Type the command below exactly:',
    ],
    expectedCommand: 'logs show --source=email-gateway',
    commandPatterns: ['logs show --source=email-gateway', 'logs show --source=email'],
    commandOutput: `═══ EMAIL GATEWAY LOGS (Sample) ═══════════════════════

[09:14:23] INBOUND  from: update@acc0unt-verify.com → admin@company.com
           Subject: "Urgent: Verify Your Account Now"
           SPF: SOFTFAIL  DKIM: NONE  DMARC: FAIL

[09:15:01] INBOUND  from: hr@company.com → all-staff@company.com
           Subject: "Q4 Benefits Enrollment Reminder"
           SPF: PASS  DKIM: PASS  DMARC: PASS

[09:22:18] OUTBOUND admin@company.com → https://acc0unt-verify.com/login
           Method: POST  Status: 302 Redirect`,
    explanation: [
      'Notice two emails. The first has SPF: SOFTFAIL, DKIM: NONE,',
      'DMARC: FAIL — these are email authentication checks. When they',
      'all fail, it means the sender is likely not who they claim to be.',
      '',
      'Also notice "acc0unt-verify.com" — the zero replacing the "o"',
      'is called typosquatting. Attackers register domains that look',
      'similar to legitimate ones to trick victims.',
      '',
      'The OUTBOUND entry shows someone clicked the link. That\'s bad.',
      '',
      'Available log sources include: email-gateway, firewall, auth,',
      'drive, dns, and proxy. Each reveals different evidence.',
    ],
    hintOnWrong: 'Type: logs show --source=email-gateway',
  },
  {
    type: 'guided-command',
    speaker: 'OMNIUS',
    title: 'COMMAND: whois',
    lines: [
      '"whois" performs a domain registration lookup. It tells you',
      'who registered a domain, when, and through which registrar.',
      '',
      'Investigate the suspicious domain from those logs:',
    ],
    expectedCommand: 'whois acc0unt-verify.com',
    commandPatterns: ['whois acc0unt-verify.com', 'whois acc0unt-verify'],
    commandOutput: `═══ WHOIS LOOKUP: acc0unt-verify.com ═══════════════════

Domain Name: acc0unt-verify.com
Creation Date: 2026-03-30T02:11:45Z   ← REGISTERED 3 DAYS AGO
Expiration Date: 2027-03-30T02:11:45Z
Registrant Organization: REDACTED FOR PRIVACY
Registrant Country: PA (Panama)
Name Servers:
  ns1.shady-hosting.net    ← KNOWN BULLETPROOF HOSTING
  ns2.shady-hosting.net`,
    explanation: [
      'Key red flags:',
      '  • Registered 3 days ago — legitimate services have old domains',
      '  • Privacy-protected registrant — hiding their identity',
      '  • Panama registration — common for anonymity',
      '  • "Bulletproof hosting" — providers that ignore abuse complaints',
      '',
      'Domain age and registrar reputation are two of the fastest ways',
      'to assess whether a domain is malicious.',
    ],
    hintOnWrong: 'Type: whois acc0unt-verify.com',
  },
  {
    type: 'guided-command',
    speaker: 'OMNIUS',
    title: 'COMMAND: nslookup',
    lines: [
      '"nslookup" resolves a domain name to its IP address.',
      'This lets you correlate across different evidence sources.',
      '',
      'Look up where that domain actually points:',
    ],
    expectedCommand: 'nslookup acc0unt-verify.com',
    commandPatterns: ['nslookup acc0unt-verify.com', 'nslookup acc0unt-verify'],
    commandOutput: `═══ DNS LOOKUP: acc0unt-verify.com ══════════════════════

Server:  8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    acc0unt-verify.com
Address: 203.0.113.42

Reverse DNS: no PTR record found
GeoIP: Bucharest, Romania
ASN: AS62904 - Bulletproof hosting provider`,
    explanation: [
      'Now you have an IP address: 203.0.113.42.',
      '',
      'This is the power of correlation: the email logs showed a',
      'suspicious domain, WHOIS told us it\'s newly registered with',
      'bulletproof hosting, and DNS gives us the actual IP.',
      '',
      'You can now search for this IP across firewall logs, connection',
      'logs, and other sources to map the full scope of the attack.',
    ],
    hintOnWrong: 'Type: nslookup acc0unt-verify.com',
  },
  {
    type: 'guided-command',
    speaker: 'OMNIUS',
    title: 'COMMAND: connections',
    lines: [
      '"connections" shows active network sessions. This reveals',
      'what an attacker is doing RIGHT NOW on compromised accounts.',
      '',
      'Check the admin user\'s active sessions:',
    ],
    expectedCommand: 'connections --user=admin',
    commandPatterns: ['connections --user=admin', 'connections --user admin'],
    commandOutput: `═══ ACTIVE CONNECTIONS: admin@company.com ═══════════════

Session ID   Source IP        Dest IP        Service    Duration
─────────────────────────────────────────────────────────────
SES-001      10.0.1.15        172.16.0.5     Exchange   04:22:10
SES-002      203.0.113.42     172.16.0.5     IMAP       00:18:33  !! EXTERNAL !!
SES-003      203.0.113.42     172.16.0.20    Drive API  00:12:07  !! EXTERNAL !!

!! 2 sessions from known attacker IP 203.0.113.42 !!`,
    explanation: [
      'See session SES-001? That\'s the legitimate admin — local IP,',
      'long duration, normal Exchange access.',
      '',
      'Sessions SES-002 and SES-003? External IP 203.0.113.42 — the',
      'same IP from the phishing domain. The attacker has active access',
      'to email (IMAP) and file storage (Drive API).',
      '',
      'This is a LIVE compromise. Every second counts now.',
    ],
    hintOnWrong: 'Type: connections --user=admin',
  },
  {
    type: 'guided-command',
    speaker: 'OMNIUS',
    title: 'COMMAND: analyze',
    lines: [
      '"analyze" examines files and artifacts for indicators of',
      'compromise (IOCs) — malware signatures, suspicious scripts,',
      'embedded URLs.',
      '',
      'Analyze the email attachment:',
    ],
    expectedCommand: 'analyze account-verify.pdf',
    commandPatterns: ['analyze account-verify.pdf', 'analyze account-verify'],
    commandOutput: `═══ FILE ANALYSIS: account-verify.pdf ═══════════════════

File: account-verify.pdf
Size: 38,112 bytes
Type: PDF document, version 1.7
SHA256: 4f2b8c...d9e0f1

Static Analysis:
  - Contains embedded JavaScript
  - JavaScript calls: app.launchURL()
  - URL extracted: https://acc0unt-verify.com/login?uid=admin
  - No executable payload (not malware — credential phishing)

Classification: PHISHING LURE
VirusTotal: 4/72 detections`,
    explanation: [
      'The PDF isn\'t malware in the traditional sense — it doesn\'t',
      'install anything. Instead, it\'s a phishing lure: embedded',
      'JavaScript redirects the victim to a credential harvesting page.',
      '',
      'This distinction matters for your response. You don\'t need',
      'to quarantine endpoints for malware — but you DO need to',
      'revoke the stolen credentials immediately.',
    ],
    hintOnWrong: 'Type: analyze account-verify.pdf',
  },

  // ═══════════════════════════════════════════════
  // SECTION 3: RESPONSE & COMMUNICATION
  // ═══════════════════════════════════════════════
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'RESPONSE COMMANDS',
    lines: [
      'Once you\'ve gathered enough evidence, you need to ACT.',
      'Response commands contain the threat:',
      '',
      '  isolate <host>   — Quarantine a compromised machine.',
      '                     Cuts network access to stop lateral movement.',
      '                     Use when malware is spreading between hosts.',
      '',
      '  revoke <user>    — Kill all active tokens and force password reset.',
      '                     Use when credentials have been stolen (phishing,',
      '                     brute force). This is your first move when an',
      '                     account is compromised.',
      '',
      '  block <ip>       — Add a firewall rule to deny traffic from an IP.',
      '                     Use when you\'ve identified attacker infrastructure.',
      '                     Note: sophisticated attackers switch IPs, so this',
      '                     is a short-term measure.',
      '',
      'The key question is always: what is the MINIMUM action that stops',
      'the attacker without disrupting legitimate operations?',
    ],
  },
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'COMMUNICATION COMMANDS',
    lines: [
      'Communication is just as critical as technical response:',
      '',
      '  report <finding>  — Log a finding into the investigation record.',
      '                      Good analysts document as they go.',
      '',
      '  escalate          — Alert leadership / legal / PR teams.',
      '                      Knowing WHEN to escalate is a core skill:',
      '',
      '                      Too early → "crying wolf", wastes executive time',
      '                      Too late  → damage spreads, regulatory violations',
      '                      Just right → leadership can prepare while you contain',
      '',
      'Some incidents have regulatory implications (data breaches,',
      'financial data theft). These REQUIRE escalation to Legal,',
      'regardless of how well the technical response is going.',
    ],
  },

  // ═══════════════════════════════════════════════
  // SECTION 4: HOW THE GAME WORKS
  // ═══════════════════════════════════════════════
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'EVIDENCE & DECISIONS',
    lines: [
      'During each mission, your status bar tracks evidence discovery.',
      'Not all evidence is obvious — you\'ll need to think about which',
      'data sources to check and what questions to ask.',
      '',
      'At critical moments, you\'ll face DECISIONS. These are branching',
      'choices with real consequences. There\'s often no perfect answer —',
      'just trade-offs between speed and thoroughness, between caution',
      'and boldness.',
      '',
      'Your choices — and how you investigate — build your aptitude',
      'profile across 8 dimensions: Analytical Rigor, Pattern',
      'Recognition, Threat Intuition, Systematic Thinking, Decision',
      'Quality, Communication Instinct, Operational Efficiency,',
      'and Adaptability.',
      '',
      'Type "help" during any mission for a quick command reference.',
      'Type "help <command>" for detailed guidance on any command.',
      'Type "hint" if you\'re stuck (but it affects your score).',
    ],
  },

  // ═══════════════════════════════════════════════
  // SECTION 5: PRACTICE
  // ═══════════════════════════════════════════════
  {
    type: 'practice',
    speaker: 'OMNIUS',
    title: 'PRACTICE EXERCISE',
    lines: [
      'Let\'s practice. You\'ve just been shown a suspicious email from',
      'an unknown domain: "secure-l0gin.net". Your first investigative',
      'step is to find out who registered this domain.',
      '',
      'What command would you type?',
    ],
    expectedCommand: 'whois secure-l0gin.net',
    commandPatterns: ['whois secure-l0gin.net', 'whois secure-l0gin', 'nslookup secure-l0gin.net'],
    commandOutput: `═══ WHOIS LOOKUP: secure-l0gin.net ═══════════════════════

Domain Name: secure-l0gin.net
Creation Date: 2026-04-01T14:33:02Z   ← REGISTERED YESTERDAY
Registrant: REDACTED FOR PRIVACY
Name Servers: ns1.bulletproof-dns.net

!! Recently registered with bulletproof hosting !!`,
    explanation: [
      'Excellent instinct. Domain registration data immediately tells',
      'you whether a domain is suspicious. In a real investigation,',
      'you would follow this with nslookup to get the IP, then',
      'search your logs for any connections to that IP.',
      '',
      'You\'re thinking like an analyst already.',
    ],
    hintOnWrong: 'Think about which command reveals domain registration data. Try: whois secure-l0gin.net',
  },
  {
    type: 'narrative',
    speaker: 'OMNIUS',
    title: 'ORIENTATION COMPLETE',
    lines: [
      'You are ready for your first real mission, Analyst.',
      '',
      'Remember:',
      '  • Investigate thoroughly — check multiple data sources',
      '  • Act decisively — containment speed matters',
      '  • Communicate wisely — escalate at the right moment',
      '',
      'Type "help" during any mission for a command reference.',
      'Type "help <command>" for detailed cybersecurity context.',
      '',
      'Good luck. The Panopticon Group is counting on you.',
      '',
      '                    ◆ ◆ ◆',
    ],
  },
];

// ── Detailed Command Help ────────────────────────

export const DETAILED_HELP: Record<string, string> = {
  logs: `═══ COMMAND: logs ═══════════════════════════════════════

PURPOSE:
  View security logs from various system sources. Logs are timestamped
  records of events — your primary investigation tool.

USAGE:
  logs show --source=<source> [--search=<term>] [--limit=<n>]

SOURCES:
  email-gateway  Inbound/outbound email with headers, SPF/DKIM results
  firewall       Network traffic allow/deny decisions, IP addresses
  auth           Login attempts, OAuth grants, MFA challenges
  drive          File access, downloads, sharing changes
  dns            Domain lookups, resolution records
  proxy          Web traffic, URL access patterns

WHAT TO LOOK FOR:
  • SPF/DKIM/DMARC failures on inbound email → phishing
  • Failed auth attempts followed by success → brute force or credential stuffing
  • External IPs accessing internal services → active compromise
  • Large outbound data transfers → data exfiltration
  • Activity outside business hours → suspicious access

EXAMPLES:
  > logs show --source=email-gateway
  > logs show --source=auth --search="failed login"
  > logs show --source=firewall --search="198.51.100"`,

  whois: `═══ COMMAND: whois ══════════════════════════════════════

PURPOSE:
  Look up domain registration information. Reveals who registered
  a domain, when, and through which registrar.

USAGE:
  whois <domain>

WHAT TO LOOK FOR:
  • Creation date — domains registered days/weeks ago are suspicious
  • Privacy protection — legitimate businesses usually show registration info
  • Registrar reputation — some registrars are favored by criminals
  • Name servers — bulletproof hosting providers ignore abuse complaints
  • Country — some jurisdictions are common for anonymous registration

WHY IT MATTERS:
  Attackers create new domains for each campaign. A domain registered
  yesterday claiming to be "paypal-secure.com" is almost certainly
  malicious. Domain age is one of the fastest threat indicators.

EXAMPLES:
  > whois suspicious-domain.com
  > whois paypa1-secure.com`,

  nslookup: `═══ COMMAND: nslookup ═══════════════════════════════════

PURPOSE:
  Resolve a domain name to its IP address. Maps the logical name
  to the physical server.

USAGE:
  nslookup <hostname>

WHAT TO LOOK FOR:
  • IP address — correlate with firewall logs and connection data
  • GeoIP location — unexpected countries are suspicious
  • ASN/hosting provider — bulletproof hosts are red flags
  • Reverse DNS — legitimate servers usually have PTR records
  • Multiple domains on same IP — shared phishing infrastructure

WHY IT MATTERS:
  IP addresses let you search across different log sources. If you
  find an attacker domain via email, nslookup gives you the IP,
  which you can then search in firewall and connection logs to see
  if they've already accessed your network.

EXAMPLES:
  > nslookup paypa1-secure.com
  > nslookup suspicious-host.net`,

  analyze: `═══ COMMAND: analyze ════════════════════════════════════

PURPOSE:
  Examine a file or artifact for indicators of compromise (IOCs).
  Performs static analysis to identify malware, phishing lures,
  or suspicious content without executing the file.

USAGE:
  analyze <filename>

WHAT IT REVEALS:
  • File type and metadata
  • Embedded scripts (JavaScript, macros, PowerShell)
  • Extracted URLs and IP addresses
  • Cryptographic hashes (for VirusTotal lookups)
  • Malware classification and threat level

WHY IT MATTERS:
  Not all malicious files are traditional malware. Phishing PDFs
  redirect to credential harvesting pages. Macro-enabled documents
  download second-stage payloads. Understanding WHAT a file does
  determines your response strategy.

EXAMPLES:
  > analyze invoice_Q4.pdf
  > analyze suspicious_attachment.docx`,

  connections: `═══ COMMAND: connections ════════════════════════════════

PURPOSE:
  Show active network sessions for a user or system. Reveals
  what services are being accessed and from where — in real time.

USAGE:
  connections [--user=<email>]

WHAT TO LOOK FOR:
  • External IPs on internal services — active compromise
  • Session duration — short bursts may indicate automated tools
  • Unusual services — OAuth, Drive API, Calendar from external IPs
  • Correlation — does the source IP match known threat infrastructure?
  • Multiple services — attackers with tokens access everything they can

WHY IT MATTERS:
  Active connections tell you if an attacker is CURRENTLY inside
  your systems. This changes the urgency from "investigate" to
  "contain immediately." Every minute of active access is more
  data potentially exfiltrated.

EXAMPLES:
  > connections
  > connections --user=j.morrison@meridian.com`,

  scan: `═══ COMMAND: scan ══════════════════════════════════════

PURPOSE:
  Scan an IP range to discover active hosts and open ports.
  Maps attacker infrastructure or identifies exposed services.

USAGE:
  scan network --target=<ip-range>

WHAT TO LOOK FOR:
  • Open ports — what services are running (22=SSH, 443=HTTPS, etc.)
  • SSL certificates — shared certs indicate related infrastructure
  • Unusual ports — high-numbered ports may be C2 (command & control)
  • Multiple hosts — same /24 range often means same attacker

WHY IT MATTERS:
  Scanning attacker infrastructure helps you understand their
  capabilities and find additional entry points. It also provides
  indicators you can use for blocking rules.

EXAMPLES:
  > scan network --target=198.51.100.0/24
  > scan network --target=203.0.113.0/24`,

  isolate: `═══ COMMAND: isolate ═══════════════════════════════════

PURPOSE:
  Quarantine a compromised host by cutting its network access.
  Prevents lateral movement (attacker spreading to other machines).

USAGE:
  isolate <host>

WHEN TO USE:
  • Malware detected on a host that could spread
  • Active attacker session using host as pivot point
  • Ransomware spreading across network shares

WHEN NOT TO USE:
  • Credential theft only (use "revoke" instead — no host is infected)
  • The host is running critical infrastructure (discuss with team first)

TRADE-OFF:
  Isolation stops the threat but disrupts the user's work. The goal
  is proportional response — isolate only what you must.

EXAMPLES:
  > isolate CFO-LAPTOP
  > isolate server-db-01`,

  revoke: `═══ COMMAND: revoke ════════════════════════════════════

PURPOSE:
  Revoke all active tokens and force a password reset for a user.
  Immediately kills attacker access gained through stolen credentials.

USAGE:
  revoke <user>

WHEN TO USE:
  • After phishing compromise — OAuth tokens were stolen
  • After password leak/brute force — credentials are known
  • Any time an attacker has authenticated as a legitimate user

WHY IT'S CRITICAL:
  OAuth tokens persist even after password changes unless explicitly
  revoked. An attacker who phished OAuth tokens can maintain access
  for hours or days after the victim "changes their password."
  Always revoke tokens first, THEN reset the password.

EXAMPLES:
  > revoke j.morrison@meridian.com
  > revoke admin@company.com`,

  block: `═══ COMMAND: block ═════════════════════════════════════

PURPOSE:
  Add a firewall rule to deny all traffic from a specific IP address.
  A quick containment measure against known attacker infrastructure.

USAGE:
  block <ip>

LIMITATIONS:
  • Sophisticated attackers rotate IPs frequently
  • Blocking by IP is a short-term measure, not a permanent fix
  • Could block legitimate traffic if the IP is shared/CDN

WHEN TO USE:
  • You've identified an active attacker IP in your logs
  • Combined with other containment (revoke tokens, isolate hosts)
  • As a "buy time" measure while you implement deeper fixes

EXAMPLES:
  > block 198.51.100.47
  > block 203.0.113.42`,

  report: `═══ COMMAND: report ════════════════════════════════════

PURPOSE:
  Log a finding into the investigation record. Good analysts
  document their discoveries as they go.

USAGE:
  report <finding description>

WHY IT MATTERS:
  Incident reports serve multiple purposes: legal evidence, post-
  incident review, knowledge sharing with other analysts, and
  regulatory compliance. Documenting findings in real-time is
  more accurate than trying to reconstruct events later.

EXAMPLES:
  > report CFO account compromised via OAuth phishing
  > report Attacker IP 198.51.100.47 identified as C2 server`,

  escalate: `═══ COMMAND: escalate ══════════════════════════════════

PURPOSE:
  Alert leadership, legal, and/or PR teams about an incident.
  Triggers the organizational incident response process.

USAGE:
  escalate

WHEN TO ESCALATE:
  • Data breach confirmed — legal and regulatory notification required
  • Financial data compromised — SEC/regulatory implications
  • Customer data exposed — GDPR/privacy notification timelines
  • Attack is ongoing and spreading — need executive decision-making
  • You need authority to take disruptive containment actions

WHEN TO WAIT:
  • You're still in early investigation and haven't confirmed impact
  • The incident is fully contained with no data loss
  • You can resolve it within your authority level

THE JUDGMENT CALL:
  Escalation timing is one of the hardest skills in incident response.
  The best analysts develop an instinct for when "this is bigger
  than just a technical problem."`,
};
