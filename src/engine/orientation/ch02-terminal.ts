import type { OrientationChapter } from './index.js';

export function getChapter02(): OrientationChapter {
  return {
    id: 'ch02-terminal',
    number: 2,
    title: 'The Observer\'s Terminal',
    subtitle: 'Your Tools, Your Weapons',
    clearanceLevel: 'LEVEL 0 — UNRESTRICTED',
    tier: 1,
    estimatedMinutes: 20,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: TERMINAL FUNDAMENTALS
      // ═══════════════════════════════════════════
      {
        id: 'terminal-basics',
        title: 'Terminal Fundamentals',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'The terminal in front of you is your primary instrument.',
              'Every operation you run for DI7 flows through it. GUI tools',
              'have their place, but in the field — when speed matters',
              'and you\'re working through a secure channel — the command',
              'line is what separates a capable Observer from a liability.',
              '',
              'Commands follow a consistent structure:',
              '',
              '  command [subcommand] --flag=value argument',
              '',
              'For example: logs show --source=firewall --search="198.51.100"',
              '',
              'That breaks down as:',
              '  command    = logs',
              '  subcommand = show',
              '  flag       = --source=firewall, --search="198.51.100"',
              '',
              'I\'ll walk you through each tool. Pay attention — in the',
              'field, I won\'t always be on the wire.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: INVESTIGATION COMMANDS
      // ═══════════════════════════════════════════
      {
        id: 'investigation-commands',
        title: 'Investigation Commands — Seeing the Invisible',
        steps: [
          // ── logs ────────────────────────────
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'First tool. The one you\'ll use more than any other.',
              '',
              '"logs" pulls security event records from different systems.',
              'Think of it as reading the surveillance footage — except',
              'instead of video, you\'re reading timestamped text records',
              'of everything that happened on a network.',
              '',
              'Different sources capture different activity:',
              '  email-gateway — what came in and went out via email',
              '  firewall      — what the network allowed and blocked',
              '  auth          — who logged in, who failed, who got MFA\'d',
              '  drive         — who accessed, downloaded, or shared files',
              '  dns           — what domains were looked up',
              '  proxy         — what websites were visited',
              '',
              'Try it. Pull the email gateway logs.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'logs show --source=email-gateway',
            commandPatterns: ['logs show --source=email-gateway', 'logs show --source=email'],
            lines: [
              'Type: logs show --source=email-gateway',
            ],
            commandOutput: `═══ EMAIL GATEWAY LOGS (Training Environment) ═════════

[09:14:23] INBOUND  from: update@acc0unt-verify.com → admin@corp.local
           Subject: "Urgent: Verify Your Account Immediately"
           SPF: SOFTFAIL  DKIM: NONE  DMARC: FAIL

[09:15:01] INBOUND  from: hr@corp.local → all-staff@corp.local
           Subject: "Q4 Benefits Enrollment Reminder"
           SPF: PASS  DKIM: PASS  DMARC: PASS

[09:22:18] OUTBOUND admin@corp.local → https://acc0unt-verify.com/login
           Method: POST  Status: 302 Redirect
           !! Credential submission to external site !!`,
            explanation: [
              'Two emails. Look at the authentication markers on each.',
              '',
              'The first email: SPF SOFTFAIL, DKIM NONE, DMARC FAIL.',
              'These are email authentication protocols. SPF verifies the',
              'sending server is authorized. DKIM verifies the message',
              'wasn\'t tampered with. DMARC combines both.',
              '',
              'All three failing means the email is almost certainly spoofed.',
              '',
              'Also notice "acc0unt-verify.com" — that\'s a zero replacing',
              'the letter O. Called typosquatting. Attackers register domains',
              'that look similar to legitimate ones at a glance.',
              '',
              'The OUTBOUND entry is the worst part. Someone already clicked',
              'the link and submitted credentials to the attacker\'s server.',
            ],
            hintOnWrong: 'Type exactly: logs show --source=email-gateway',
          },

          // ── whois ──────────────────────────
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Good. Now you\'ve identified a suspicious domain in the logs.',
              'The next question: who\'s behind it?',
              '',
              '"whois" performs a domain registration lookup. It tells you',
              'when a domain was created, who registered it, and where',
              'it\'s hosted. In our line of work, a domain registered',
              'three days ago is practically still warm from the printer.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'whois acc0unt-verify.com',
            commandPatterns: ['whois acc0unt-verify.com', 'whois acc0unt-verify'],
            lines: [
              'Run a WHOIS on that domain. Confirm my suspicion.',
            ],
            commandOutput: `═══ WHOIS: acc0unt-verify.com ══════════════════════════

Domain Name: acc0unt-verify.com
Creation Date: 2026-03-30T02:11:45Z   ← REGISTERED 3 DAYS AGO
Expiration Date: 2027-03-30T02:11:45Z
Registrant Organization: REDACTED FOR PRIVACY
Registrant Country: PA (Panama)
Name Servers:
  ns1.bulletproof-dns.net    ← KNOWN BULLETPROOF HOSTING
  ns2.bulletproof-dns.net`,
            explanation: [
              'Suspicion confirmed. Key indicators:',
              '',
              '  • Registered 3 days ago — legitimate services have domains',
              '    that are years or decades old',
              '  • Privacy-protected registrant — hiding their identity',
              '  • Panama — a jurisdiction popular for anonymous registration',
              '  • "Bulletproof hosting" — these providers ignore abuse',
              '    complaints. Criminals use them because their infrastructure',
              '    won\'t get taken down quickly.',
              '',
              'Domain age is one of the fastest threat indicators available',
              'to you. It takes seconds to check and immediately tells you',
              'whether you\'re dealing with legitimate infrastructure.',
            ],
            hintOnWrong: 'Type: whois acc0unt-verify.com',
          },

          // ── nslookup ──────────────────────
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'nslookup acc0unt-verify.com',
            commandPatterns: ['nslookup acc0unt-verify.com', 'nslookup acc0unt-verify'],
            lines: [
              '"nslookup" resolves a domain to its IP address. This is',
              'how you pivot from a domain name to the physical server.',
              'Once you have the IP, you can search for it across every',
              'log source you have access to.',
              '',
              'Resolve the attacker\'s domain.',
            ],
            commandOutput: `═══ DNS: acc0unt-verify.com ═════════════════════════════

Server:  8.8.8.8
Address: 8.8.8.8#53

Non-authoritative answer:
Name:    acc0unt-verify.com
Address: 203.0.113.42

Reverse DNS: no PTR record found
GeoIP: Bucharest, Romania
ASN: AS62904 — Bulletproof VPS provider`,
            explanation: [
              'Now you have the IP: 203.0.113.42.',
              '',
              'This is the power of correlation. The email logs gave you a',
              'suspicious domain. WHOIS told you it\'s freshly registered',
              'with criminal-friendly hosting. DNS gives you the IP address.',
              '',
              'With that IP, you can now search firewall logs, connection',
              'tables, and any other data source to see if this address has',
              'touched your network in other ways. That\'s how you map the',
              'full scope of an intrusion.',
            ],
            hintOnWrong: 'Type: nslookup acc0unt-verify.com',
          },

          // ── connections ───────────────────
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'connections --user=admin',
            commandPatterns: ['connections --user=admin', 'connections --user admin'],
            lines: [
              '"connections" shows active network sessions. This tells you',
              'what\'s happening right now — who\'s connected to what, from',
              'where. If the attacker has stolen credentials, this is where',
              'you\'ll see them using those credentials in real time.',
              '',
              'Check the admin account — the one that clicked the phishing link.',
            ],
            commandOutput: `═══ ACTIVE CONNECTIONS: admin@corp.local ════════════════

Session ID   Source IP        Dest IP        Service    Duration
───────────────────────────────────────────────────────────
SES-001      10.0.1.15        172.16.0.5     Exchange   04:22:10
SES-002      203.0.113.42     172.16.0.5     IMAP       00:18:33  !! EXTERNAL !!
SES-003      203.0.113.42     172.16.0.20    Drive API  00:12:07  !! EXTERNAL !!

!! 2 sessions from known attacker IP 203.0.113.42 !!`,
            explanation: [
              'There it is. Sessions SES-002 and SES-003 — the attacker\'s',
              'IP address, active on the admin\'s email and file storage.',
              '',
              'SES-001 is the legitimate admin — local IP, long session,',
              'normal Exchange usage. SES-002 and SES-003 are the attacker',
              'using stolen OAuth tokens to read email and download files.',
              '',
              'This is a live compromise. The attacker is inside the network',
              'right now, actively operating. The clock is ticking on',
              'whatever data they\'re exfiltrating.',
            ],
            hintOnWrong: 'Type: connections --user=admin',
          },

          // ── analyze ───────────────────────
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'analyze account-verify.pdf',
            commandPatterns: ['analyze account-verify.pdf', 'analyze account-verify'],
            lines: [
              '"analyze" examines files for indicators of compromise.',
              'It performs static analysis — inspecting the file without',
              'executing it — to identify malicious content like embedded',
              'scripts, suspicious URLs, or known malware signatures.',
              '',
              'The phishing email had an attachment. Examine it.',
            ],
            commandOutput: `═══ FILE ANALYSIS: account-verify.pdf ═══════════════════

File: account-verify.pdf
Size: 38,112 bytes
Type: PDF document, version 1.7
SHA256: 4f2b8c9d...a3b7e0f1

Static Analysis:
  - Contains embedded JavaScript
  - JavaScript calls: app.launchURL()
  - URL extracted: https://acc0unt-verify.com/login?uid=admin
  - No executable payload

Classification: PHISHING LURE (credential harvesting)
VirusTotal: 4/72 detections`,
            explanation: [
              'Not traditional malware — it\'s a phishing lure. The PDF',
              'contains JavaScript that redirects to the credential',
              'harvesting page. Only 4 out of 72 antivirus engines detect it.',
              '',
              'This distinction matters for your response. You don\'t need',
              'to quarantine machines for a malware infection — but you',
              'absolutely need to revoke the stolen credentials immediately.',
              '',
              'The "analyze" command is about understanding WHAT happened',
              'so you can choose the RIGHT response. Wrong diagnosis leads',
              'to wrong containment — and wasted time.',
            ],
            hintOnWrong: 'Type: analyze account-verify.pdf',
          },

          // ── scan ──────────────────────────
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'scan network --target=203.0.113.0/24',
            commandPatterns: ['scan network --target=203.0.113.0/24', 'scan network --target=203.0.113.42'],
            lines: [
              'Last investigation tool. "scan" performs network reconnaissance',
              '— probing IP ranges to discover active hosts and open ports.',
              'This is how you map the attacker\'s infrastructure.',
              '',
              'Scan the attacker\'s subnet. See what else they\'re running.',
            ],
            commandOutput: `═══ NETWORK SCAN: 203.0.113.0/24 ═══════════════════════

Scanning... Done. 2 hosts responsive.

HOST              PORT    SERVICE       STATE
203.0.113.42      22      SSH           OPEN
203.0.113.42      443     HTTPS         OPEN (cert: *.acc0unt-verify.com)
203.0.113.42      8443    HTTPS-ALT     OPEN (C2 panel?)

203.0.113.77      22      SSH           OPEN
203.0.113.77      443     HTTPS         OPEN (cert: *.paypa1-secure.net)

!! Second host .77 running different phishing domain !!
!! Same /24 subnet — likely same operator !!`,
            explanation: [
              'Two servers in the same subnet, each running a different',
              'phishing domain. This tells you the attacker is running',
              'multiple campaigns simultaneously — possibly targeting',
              'different organizations with different lures.',
              '',
              'Port 8443 on .42 is particularly interesting — that could',
              'be a command-and-control panel or admin interface.',
              '',
              'Scanning is a powerful tool, but use it judiciously. In some',
              'jurisdictions, unauthorized scanning of external infrastructure',
              'has legal implications. Always operate within your authority.',
            ],
            hintOnWrong: 'Type: scan network --target=203.0.113.0/24',
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: RESPONSE COMMANDS
      // ═══════════════════════════════════════════
      {
        id: 'response-commands',
        title: 'Response Commands — Stopping the Bleeding',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Investigation tells you what happened. Response is what',
              'you do about it. Three containment tools:',
              '',
              '  revoke <user>',
              '    Kill all active tokens and force a password reset.',
              '    Use when credentials have been stolen — phishing,',
              '    brute force, credential stuffing. This is almost always',
              '    your first containment action in an account compromise.',
              '    OAuth tokens persist even after password changes unless',
              '    explicitly revoked. Remember that.',
              '',
              '  isolate <host>',
              '    Cut a machine off the network. Use when malware is',
              '    spreading between hosts or an attacker is using a',
              '    compromised machine as a pivot point. Stops lateral',
              '    movement cold — but also stops the user\'s work.',
              '',
              '  block <ip>',
              '    Firewall rule to deny traffic from an IP address.',
              '    Quick containment for known attacker infrastructure.',
              '    But sophisticated adversaries rotate IPs frequently.',
              '    It\'s a tourniquet, not a cure.',
              '',
              'The principle: proportional response. The minimum action',
              'that stops the threat without breaking more than it fixes.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 4: COMMUNICATION COMMANDS
      // ═══════════════════════════════════════════
      {
        id: 'communication-commands',
        title: 'Communication — The Human Element',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Technical containment is half the job. The other half is',
              'communication — knowing when to document, when to escalate,',
              'and to whom.',
              '',
              '  report <finding>',
              '    Log a finding into the investigation record.',
              '    Document as you go. Incident reports serve as legal',
              '    evidence, post-incident review material, and knowledge',
              '    transfer to other Observers. A finding reconstructed',
              '    from memory is never as accurate as one logged in',
              '    real time.',
              '',
              '  escalate',
              '    Alert leadership. This triggers the organizational',
              '    incident response chain. The judgment call: when.',
              '',
              '    Too early — you\'re crying wolf. Leadership loses trust.',
              '    Too late — damage spreads, regulatory timelines are missed.',
              '    Right time — leadership can prepare while you contain.',
              '',
              '    Certain incidents have mandatory escalation triggers:',
              '    confirmed data breaches, financial data compromise,',
              '    customer data exposure. These aren\'t optional.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'That\'s your toolkit. Twelve commands across three categories:',
              'investigation, response, and communication.',
              '',
              'Type "help" during any operation for a quick reference.',
              'Type "help <command>" for detailed operational guidance.',
              '',
              'In the next chapter, I\'m putting you in a live scenario.',
              'Everything you\'ve just learned — you\'ll need it.',
            ],
          },
        ],
      },
    ],
  };
}
