import type { OrientationChapter } from './index.js';

export function getChapter01(): OrientationChapter {
  return {
    id: 'ch01-battlefield',
    number: 1,
    title: 'The Digital Battlefield',
    subtitle: 'Understanding What You\'re Protecting and Who\'s Attacking',
    clearanceLevel: 'LEVEL 0 — UNRESTRICTED',
    tier: 1,
    estimatedMinutes: 15,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: WELCOME TO DI7
      // ═══════════════════════════════════════════
      {
        id: 'welcome',
        title: 'Welcome to DI7',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Good. You\'re here.',
              '',
              'I\'m your Handler. You\'ll know me by that and nothing else.',
              'DI7 — Data Intelligence Division Seven — selected you for',
              'the New Observer Orientation Program. That means someone',
              'upstairs believes you have the instincts for this work.',
              '',
              'My job is to find out if they\'re right.',
              '',
              'Before we put you in the field, you need to understand',
              'the landscape. What we protect. Who we protect it from.',
              'And why it matters.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Everything in our world comes down to three principles.',
              'We call them the triad — Confidentiality, Integrity,',
              'and Availability. Every operation you\'ll ever run for DI7',
              'exists to defend one or more of these.',
              '',
              '  CONFIDENTIALITY — Secrets stay secret.',
              '    Only authorized eyes see protected information.',
              '    When this fails: trade secrets leak, personal data',
              '    is exposed, classified intelligence reaches adversaries.',
              '',
              '  INTEGRITY — Truth stays true.',
              '    Data is accurate and unaltered. When this fails:',
              '    financial records are modified, medical data is corrupted,',
              '    evidence is tampered with.',
              '',
              '  AVAILABILITY — Systems stay operational.',
              '    Services remain accessible to those who need them.',
              '    When this fails: hospitals lose patient records,',
              '    power grids go dark, trading platforms freeze.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Let me see how you think. I\'m going to describe five',
              'incidents from DI7\'s case files. For each one, tell me',
              'which principle was violated.',
            ],
            question: 'A ransomware group encrypts a hospital\'s patient database. Doctors cannot access records during emergency surgeries.',
            options: [
              { id: 'c', text: 'Confidentiality — data was exposed', correct: false },
              { id: 'i', text: 'Integrity — data was corrupted', correct: false },
              { id: 'a', text: 'Availability — systems were rendered inaccessible', correct: true },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Next one.',
            ],
            question: 'An insider at a defense contractor copies classified weapons schematics to a USB drive and sells them to a foreign intelligence service.',
            options: [
              { id: 'c', text: 'Confidentiality — classified data reached unauthorized parties', correct: true },
              { id: 'i', text: 'Integrity — the data was modified', correct: false },
              { id: 'a', text: 'Availability — systems were disrupted', correct: false },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'One more.',
            ],
            question: 'Attackers gain access to a bank\'s wire transfer system and modify account balances, moving $2.3M to offshore accounts.',
            options: [
              { id: 'c', text: 'Confidentiality — account data was viewed', correct: false },
              { id: 'i', text: 'Integrity — financial records were deliberately altered', correct: true },
              { id: 'a', text: 'Availability — the banking system went offline', correct: false },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Good instincts. Most people confuse these on their first',
              'day. You\'re already thinking in the right categories.',
              '',
              'Remember: real attacks often violate more than one principle',
              'simultaneously. A ransomware attack might destroy availability',
              'while ALSO exfiltrating data — violating confidentiality.',
              'The world is rarely clean.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: THE ADVERSARY LANDSCAPE
      // ═══════════════════════════════════════════
      {
        id: 'adversaries',
        title: 'Know Your Adversary',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'You can\'t defend against an enemy you don\'t understand.',
              'DI7 categorizes threat actors by capability and motivation.',
              'Each type operates differently — and requires a different',
              'defensive posture.',
              '',
              '  NATION-STATE ACTORS',
              '    The most capable adversaries. State-funded, patient,',
              '    and persistent. Think intelligence agencies — NSA,',
              '    GRU, PLA Unit 61398, Lazarus Group. They have years',
              '    of resources and specific strategic objectives.',
              '    Dwell time in compromised networks: months to years.',
              '',
              '  ORGANIZED CRIME',
              '    Financially motivated. Ransomware gangs, credit card',
              '    fraud rings, business email compromise operations.',
              '    Surprisingly sophisticated — some run like corporations',
              '    with HR departments and customer service. Fast-moving,',
              '    opportunistic, and increasingly professional.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  INSIDER THREATS',
              '    The hardest to detect. Current or former employees',
              '    with legitimate access who abuse it. Motivated by',
              '    money, ideology, coercion, or ego. Your access logs',
              '    look normal because they ARE using normal credentials.',
              '',
              '  HACKTIVISTS',
              '    Politically or ideologically motivated. Less sophisticated',
              '    than nation-states but highly motivated. Website',
              '    defacement, DDoS, data leaks to embarrass targets.',
              '',
              '  SCRIPT KIDDIES',
              '    Low-skill attackers using pre-built tools. Dangerous',
              '    not because they\'re clever, but because they\'re',
              '    numerous and their automated tools don\'t discriminate.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'I\'m going to describe an attack pattern. Tell me which',
              'adversary category most likely fits.',
            ],
            question: 'A group maintains persistent access to a power utility\'s SCADA network for 14 months, mapping control systems but never disrupting operations. Intelligence suggests they\'re pre-positioning for a future geopolitical conflict.',
            options: [
              { id: 'nation', text: 'Nation-state actor — long dwell time, strategic patience, critical infrastructure focus', correct: true },
              { id: 'crime', text: 'Organized crime — they\'re planning a large-scale extortion', correct: false },
              { id: 'insider', text: 'Insider threat — someone at the utility is helping', correct: false },
              { id: 'hacktivist', text: 'Hacktivist — they want to expose the utility\'s vulnerabilities', correct: false },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Another one. Different profile.',
            ],
            question: 'Over a weekend, 47 small businesses receive identical emails with ransomware payloads. The ransom demands are $5,000-$15,000 each — low enough that most pay. The malware is a known variant available on dark web forums.',
            options: [
              { id: 'nation', text: 'Nation-state actor — broad targeting suggests state resources', correct: false },
              { id: 'crime', text: 'Organized crime — mass targeting, financial motive, known tooling, professional operation', correct: true },
              { id: 'script', text: 'Script kiddies — they\'re using known tools', correct: false },
              { id: 'insider', text: 'Insider threat — someone leaked the business email list', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: THE KILL CHAIN
      // ═══════════════════════════════════════════
      {
        id: 'kill-chain',
        title: 'How Attacks Work',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Every sophisticated attack follows a pattern. We call it',
              'the kill chain — a sequence of phases the adversary must',
              'complete to achieve their objective. Break any link in',
              'the chain, and the operation fails.',
              '',
              '  1. RECONNAISSANCE    — Target research, OSINT gathering',
              '  2. WEAPONIZATION     — Building the exploit or payload',
              '  3. DELIVERY          — Sending the weapon (email, web, USB)',
              '  4. EXPLOITATION      — Triggering the vulnerability',
              '  5. INSTALLATION      — Establishing persistence',
              '  6. COMMAND & CONTROL — Remote access channel',
              '  7. ACTIONS ON OBJ.   — Data theft, destruction, disruption',
              '',
              'As an Observer, your job is to detect and disrupt this chain',
              'as early as possible. Catching them at reconnaissance is ideal.',
              'Catching them at exfiltration means the damage is already done.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'There\'s a more granular framework called MITRE ATT&CK that',
              'DI7 uses for operational classification. It maps specific',
              'tactics — what the adversary is trying to accomplish — to',
              'techniques — how they accomplish it.',
              '',
              'You don\'t need to memorize it now. What matters is this:',
              'every technique leaves traces. Log entries. Network anomalies.',
              'File system artifacts. Your terminal gives you the tools to',
              'find those traces.',
              '',
              'The adversary\'s advantage is stealth. Yours is persistence',
              'and methodology. They need to be perfect every time.',
              'You only need to catch them once.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Let me walk you through a declassified DI7 operation.',
              'I\'ll describe events. You tell me which kill chain phase',
              'each belongs to.',
            ],
            question: 'An attacker creates a fake LinkedIn profile posing as a recruiter and connects with 50 engineers at a defense contractor, collecting their email addresses and org chart positions.',
            options: [
              { id: 'recon', text: 'Reconnaissance — gathering target intelligence', correct: true },
              { id: 'delivery', text: 'Delivery — sending the attack to targets', correct: false },
              { id: 'exploit', text: 'Exploitation — triggering a vulnerability', correct: false },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'The operation continues.',
            ],
            question: 'The attacker sends a targeted email to an engineer with a PDF attachment titled "2026 Compensation Review." The PDF exploits a zero-day in the PDF reader, dropping a DLL into the system folder.',
            options: [
              { id: 'delivery', text: 'Delivery + Exploitation — weaponized document delivered and vulnerability triggered', correct: true },
              { id: 'recon', text: 'Reconnaissance — still gathering information', correct: false },
              { id: 'c2', text: 'Command & Control — establishing remote access', correct: false },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Final phase of this operation.',
            ],
            question: 'The dropped DLL creates a scheduled task that beacons to a domain every 4 hours over HTTPS. Six weeks later, encrypted archives of weapons schematics are uploaded to an external server via this channel.',
            options: [
              { id: 'install-c2', text: 'Installation + C2 + Actions on Objectives — persistence, command channel, and data exfiltration', correct: true },
              { id: 'exploit', text: 'Exploitation — still exploiting the vulnerability', correct: false },
              { id: 'weapon', text: 'Weaponization — building more payloads', correct: false },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'You identified every phase correctly. That operation was',
              'real — DI7 tracked it for eight months before we had enough',
              'to attribute and disrupt. The adversary was a nation-state',
              'group. Patient. Disciplined. Difficult to detect.',
              '',
              'In the next chapter, I\'ll put the terminal in front of you.',
              'The concepts you just learned — the triad, adversary',
              'profiles, the kill chain — those are how you think about',
              'the problem. The terminal is how you solve it.',
              '',
              'Take a moment. When you\'re ready, proceed to Chapter 2.',
            ],
          },
        ],
      },
    ],
  };
}
