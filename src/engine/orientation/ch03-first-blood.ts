import type { OrientationChapter } from './index.js';

export function getChapter03(): OrientationChapter {
  return {
    id: 'ch03-first-blood',
    number: 3,
    title: 'First Blood',
    subtitle: 'Your First Investigation — A Guided Operation',
    clearanceLevel: 'LEVEL 0 — UNRESTRICTED',
    tier: 1,
    estimatedMinutes: 25,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: THE BRIEFING
      // ═══════════════════════════════════════════
      {
        id: 'briefing',
        title: 'Operational Briefing',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'We have a live situation.',
              '',
              'OMNIUS flagged a phishing campaign targeting Hargrove & Mills,',
              'a mid-size law firm with sensitive M&A client data. Three',
              'partners received targeted emails in the last hour. At least',
              'one appears to have engaged.',
              '',
              'You\'re running point on this. I\'ll be on the wire, but the',
              'decisions are yours. Work the evidence, build the picture,',
              'contain the threat.',
              '',
              'Your terminal is live. Start by checking what came in.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: INVESTIGATION PHASE
      // ═══════════════════════════════════════════
      {
        id: 'investigation',
        title: 'Building the Evidence Chain',
        steps: [
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'logs show --source=email-gateway',
            commandPatterns: ['logs show --source=email-gateway', 'logs show --source=email'],
            lines: [
              'Start with the email gateway. See what OMNIUS flagged.',
            ],
            commandOutput: `═══ EMAIL GATEWAY LOGS ══════════════════════════════════

[10:41:12] INBOUND  from: service@d0cusign-verify.net → m.hargrove@hm-law.com
           Subject: "DocuSign: Merger Agreement Ready for Signature"
           Attachment: Agreement_Final_Review.pdf (38KB)
           SPF: FAIL  DKIM: NONE  DMARC: FAIL

[10:41:35] INBOUND  from: service@d0cusign-verify.net → j.mills@hm-law.com
           Subject: "DocuSign: Merger Agreement Ready for Signature"
           SPF: FAIL  DKIM: NONE  DMARC: FAIL

[10:41:52] INBOUND  from: service@d0cusign-verify.net → a.chen@hm-law.com
           Subject: "DocuSign: Merger Agreement Ready for Signature"
           SPF: FAIL  DKIM: NONE  DMARC: FAIL

[10:47:33] OUTBOUND  m.hargrove@hm-law.com → https://d0cusign-verify.net/sign
           Method: POST  Status: 302 Redirect
           !! Managing partner clicked and submitted credentials !!`,
            explanation: [
              'Three partners targeted with the same lure. Notice the',
              'domain: d0cusign-verify.net — zero replacing the O in',
              '"DocuSign." All three emails fail every authentication check.',
              '',
              'The critical entry: Hargrove clicked and submitted credentials.',
              'That means the attacker likely has working credentials for',
              'the managing partner of a law firm with M&A client data.',
              '',
              'Your next move: investigate the attacker\'s infrastructure.',
              'What do we know about that domain?',
            ],
            hintOnWrong: 'Check the email logs: logs show --source=email-gateway',
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'whois d0cusign-verify.net',
            commandPatterns: ['whois d0cusign-verify.net', 'whois d0cusign-verify'],
            lines: [
              'Good. Now identify who\'s behind that domain.',
            ],
            commandOutput: `═══ WHOIS: d0cusign-verify.net ═════════════════════════

Domain Name: d0cusign-verify.net
Creation Date: 2026-04-01T08:22:11Z   ← REGISTERED YESTERDAY
Registrant: WHOIS PRIVACY CORP
Registrant Country: PA (Panama)
Name Servers:
  ns1.bulletproof-dns.net
  ns2.bulletproof-dns.net`,
            explanation: [
              'Registered yesterday. Privacy-masked. Bulletproof hosting.',
              'Every red flag we discussed in Chapter 1.',
              '',
              'Now get the IP. You\'ll need it to check if this address',
              'has already penetrated the firm\'s network.',
            ],
            hintOnWrong: 'Type: whois d0cusign-verify.net',
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'nslookup d0cusign-verify.net',
            commandPatterns: ['nslookup d0cusign-verify.net', 'nslookup d0cusign-verify'],
            lines: [
              'Resolve it.',
            ],
            commandOutput: `═══ DNS: d0cusign-verify.net ════════════════════════════

Name:    d0cusign-verify.net
Address: 198.51.100.88

Reverse DNS: no PTR record
GeoIP: Bucharest, Romania
ASN: AS62904 — Known bulletproof hosting`,
            explanation: [
              '198.51.100.88. Bucharest. Same hosting provider you saw in',
              'the training scenario. Now — is this IP already active on',
              'Hargrove\'s account?',
            ],
            hintOnWrong: 'Type: nslookup d0cusign-verify.net',
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'connections --user=m.hargrove',
            commandPatterns: ['connections --user=m.hargrove', 'connections --user=hargrove', 'connections --user m.hargrove'],
            lines: [
              'Check Hargrove\'s active sessions. See if the attacker',
              'is already using those stolen credentials.',
            ],
            commandOutput: `═══ ACTIVE CONNECTIONS: m.hargrove@hm-law.com ══════════

Session    Source IP        Dest IP        Service       Duration
──────────────────────────────────────────────────────────────
SES-1101   10.10.5.20       172.16.0.8     Exchange      06:14:22
SES-1102   10.10.5.20       172.16.0.15    SharePoint    03:47:11
SES-1103   198.51.100.88    172.16.0.8     IMAP/OAuth    00:08:44  !! EXTERNAL !!
SES-1104   198.51.100.88    172.16.0.15    Drive API     00:06:33  !! EXTERNAL !!
SES-1105   198.51.100.88    172.16.0.12    Calendar API  00:06:30  !! EXTERNAL !!

!! 3 active sessions from attacker IP 198.51.100.88 !!
!! Accessing email, document storage, and calendar !!`,
            explanation: [
              'The attacker is live. Three sessions from 198.51.100.88',
              '— the phishing domain\'s IP — accessing Hargrove\'s email,',
              'document storage, and calendar. The OAuth tokens granted',
              'during the phishing attack are being used right now.',
              '',
              'This is a managing partner at a law firm handling mergers.',
              'The calendar alone could reveal deal timelines. The document',
              'storage could contain client financials. Every second of',
              'access is potential data exfiltration.',
            ],
            hintOnWrong: 'Check Hargrove\'s sessions: connections --user=m.hargrove',
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'logs show --source=drive --user=m.hargrove',
            commandPatterns: ['logs show --source=drive', 'logs show --source=drive --user=m.hargrove', 'logs show --source=drive --user=hargrove'],
            lines: [
              'Check what the attacker has accessed in document storage.',
              'We need to know the blast radius.',
            ],
            commandOutput: `═══ DRIVE ACTIVITY: m.hargrove@hm-law.com ══════════════

[10:49:12] FILE_VIEW  /Clients/Meridian-Apex-Merger/LOI-Draft-v3.docx
           Source: 198.51.100.88 (EXTERNAL)
[10:49:45] FILE_VIEW  /Clients/Meridian-Apex-Merger/Valuation-Model.xlsx
           Source: 198.51.100.88 (EXTERNAL)
[10:50:22] FILE_DOWNLOAD /Clients/Meridian-Apex-Merger/LOI-Draft-v3.docx
           Source: 198.51.100.88  Size: 890KB
[10:50:48] FILE_DOWNLOAD /Clients/Meridian-Apex-Merger/Valuation-Model.xlsx
           Source: 198.51.100.88  Size: 2.1MB
[10:51:33] FILE_VIEW  /Clients/Meridian-Apex-Merger/Board-Resolution.pdf
           Source: 198.51.100.88 (EXTERNAL)

!! 3MB of M&A documents downloaded to external IP !!
!! Material non-public information potentially compromised !!`,
            explanation: [
              'Merger documents. Letters of intent, valuation models,',
              'board resolutions. This is material non-public information.',
              'If this reaches the market, it could be used for insider',
              'trading — which makes this a potential securities violation,',
              'not just a breach.',
              '',
              'You now have the full picture. Time to make a decision.',
            ],
            hintOnWrong: 'Check the drive logs: logs show --source=drive --user=m.hargrove',
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: DECISION POINT
      // ═══════════════════════════════════════════
      {
        id: 'first-decision',
        title: 'Decision Point',
        steps: [
          {
            type: 'decision',
            speaker: 'HANDLER',
            lines: [
              'Two options, Observer. Both have consequences.',
              '',
              'The attacker has active sessions on Hargrove\'s email,',
              'documents, and calendar. M&A files are being exfiltrated.',
              'What\'s your immediate response?',
            ],
            question: 'How do you contain this breach?',
            options: [
              {
                id: 'revoke-now',
                text: 'Revoke Hargrove\'s tokens immediately — kill the attacker\'s access',
                correct: true,
              },
              {
                id: 'isolate-network',
                text: 'Isolate the entire executive network segment to prevent lateral movement',
                correct: false,
              },
              {
                id: 'monitor-first',
                text: 'Monitor the attacker\'s activity for 30 more minutes to map their full infrastructure',
                correct: false,
              },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'The right call here was immediate token revocation. Here\'s why.',
              '',
              'This is a credential-based compromise — not malware on a host.',
              'The attacker is using stolen OAuth tokens remotely. Revoking',
              'tokens kills their access in seconds. Hargrove gets locked',
              'out temporarily, but the bleeding stops.',
              '',
              'Isolating the network segment would have been disproportionate.',
              'The attacker has no presence on the local network — they\'re',
              'operating entirely through cloud APIs. Isolating the segment',
              'would disrupt 30+ lawyers and their clients for a threat that',
              'exists in the cloud, not on the wire.',
              '',
              'Monitoring is tempting — more intelligence is always valuable.',
              'But with M&A documents actively downloading, every minute of',
              'monitoring is another minute of data loss. The cost of waiting',
              'exceeds the intelligence value.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 4: ESCALATION DECISION
      // ═══════════════════════════════════════════
      {
        id: 'escalation',
        title: 'Escalation',
        steps: [
          {
            type: 'decision',
            speaker: 'HANDLER',
            lines: [
              'The immediate threat is contained. Now — the firm\'s',
              'managing partner had M&A documents exfiltrated. Material',
              'non-public information about an active merger.',
              '',
              'Who needs to know?',
            ],
            question: 'Who do you escalate to?',
            options: [
              {
                id: 'legal-and-director',
                text: 'Legal counsel and Director Vasquez immediately — this has regulatory implications',
                correct: true,
              },
              {
                id: 'director-only',
                text: 'Director Vasquez only — keep the circle small until we know more',
                correct: false,
              },
              {
                id: 'full-response',
                text: 'Full incident response activation — notify all department heads',
                correct: false,
              },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Legal and Director Vasquez. Correct.',
              '',
              'Material non-public information theft has mandatory reporting',
              'requirements. The SEC has specific notification timelines for',
              'potential insider trading exposure. Legal needs to be involved',
              'immediately — not because you did anything wrong, but because',
              'the regulatory clock starts ticking the moment you confirm',
              'the data was compromised.',
              '',
              'Director-only would have delayed legal involvement. In some',
              'jurisdictions, that delay itself creates liability. Full',
              'incident response activation is overkill for a contained,',
              'scoped breach — and risks the incident leaking to the press',
              'before the firm controls the narrative.',
              '',
              'Proportional response. Minimum force. Maximum effect.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 5: DEBRIEF
      // ═══════════════════════════════════════════
      {
        id: 'debrief',
        title: 'Operational Debrief',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Debrief.',
              '',
              'You identified the phishing campaign through email',
              'authentication failures. Mapped the infrastructure via',
              'WHOIS and DNS. Confirmed the active compromise through',
              'connection analysis. Assessed the blast radius through',
              'drive activity logs. Contained the threat through token',
              'revocation. Escalated appropriately given the regulatory',
              'implications.',
              '',
              'That\'s the methodology. Evidence chain → correlation →',
              'containment → communication. Every operation follows',
              'this pattern, regardless of complexity.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'KAI',
            lines: [
              'Not bad for your first operation. One thing I\'d have',
              'done differently — I would have checked the auth logs',
              'for the other two partners sooner. Mills and Chen also',
              'received the same phishing email. Even though they didn\'t',
              'click, you want to verify that with evidence, not assume it.',
              '',
              'Always verify. Assumptions in this line of work are how',
              'you miss the second compromise while chasing the first.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'DIRECTOR VASQUEZ',
            lines: [
              'Observer.',
              '',
              'Your Handler tells me you performed adequately on your',
              'first operational exercise. I\'ve reviewed the timeline.',
              '',
              'You\'ve completed Tier 1 of the New Observer Orientation',
              'Program. I\'m authorizing your access to DI7 field',
              'operations — effective immediately.',
              '',
              'Your clearance has been elevated. Additional chapters',
              'will become available as you demonstrate readiness.',
              '',
              'Stay sharp. The real work starts now.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'You heard the Director. Field operations are unlocked.',
              '',
              'The Operations Center has active situations that need',
              'your attention. Everything you learned in orientation',
              'applies — but the scenarios will be more complex, the',
              'stakes will be higher, and I won\'t always be able to',
              'guide you through every step.',
              '',
              'When you\'re ready, report to the Operations Center.',
              'And Observer — good work today.',
            ],
          },
        ],
      },
    ],
  };
}
