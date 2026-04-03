import type { OrientationChapter } from './index.js';

export function getChapter11(): OrientationChapter {
  return {
    id: 'ch11-cloud',
    number: 11,
    title: 'Cloud Fortress',
    subtitle: 'Cloud Security, Infrastructure, and Modern Attack Surfaces',
    clearanceLevel: 'R1 — ADVANCED',
    tier: 4,
    estimatedMinutes: 30,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: CLOUD ARCHITECTURE & SHARED RESPONSIBILITY
      // ═══════════════════════════════════════════
      {
        id: 'cloud-architecture',
        title: 'Cloud Architecture & Shared Responsibility',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'The perimeter is gone.',
              '',
              'Traditional security assumed a clear boundary — inside the',
              'firewall was trusted, outside was hostile. Cloud erased that',
              'line. Your servers are someone else\'s machines. Your data',
              'lives in regions you\'ve never visited. Your attack surface',
              'is defined by API configurations, not physical topology.',
              '',
              'Three service models. Each shifts the security boundary:',
              '',
              '  IaaS (Infrastructure as a Service) — AWS EC2, Azure VMs',
              '    You control: OS, runtime, application, data, network config',
              '    Provider controls: physical servers, hypervisor, network fabric',
              '    You own most of the security stack.',
              '',
              '  PaaS (Platform as a Service) — AWS Lambda, Azure App Service',
              '    You control: application code, data, identity config',
              '    Provider controls: OS, runtime, patching, infrastructure',
              '    Less surface to defend — but less visibility into what\'s happening.',
              '',
              '  SaaS (Software as a Service) — Microsoft 365, Salesforce',
              '    You control: data, user access, configuration',
              '    Provider controls: everything else',
              '    Your security is entirely about identity, access, and config.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'The shared responsibility model is the single most important',
              'concept in cloud security. The provider secures the cloud.',
              'You secure what you put IN the cloud. The boundary depends',
              'on the service model.',
              '',
              'Where organizations fail:',
              '',
              '  IAM (Identity and Access Management)',
              '    Cloud IAM is more complex than anything on-premises.',
              '    AWS alone has IAM users, roles, policies, groups,',
              '    service-linked roles, permission boundaries, SCPs,',
              '    resource-based policies, session policies.',
              '    A single misconfigured IAM policy can expose your',
              '    entire infrastructure.',
              '',
              '  MISCONFIGURATION — The #1 cloud vulnerability.',
              '    Not zero-days. Not sophisticated exploits.',
              '    Storage buckets left public. Security groups allowing',
              '    0.0.0.0/0 on port 22. Logging disabled. Default',
              '    credentials on managed services. These are configuration',
              '    failures, and they account for the vast majority of',
              '    cloud breaches.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Your organization runs a web application on AWS EC2 instances',
              'behind an Application Load Balancer. A breach occurs: the',
              'EC2 instances were running an unpatched operating system with',
              'a known remote code execution vulnerability.',
            ],
            question: 'Under the shared responsibility model, who is accountable for this failure?',
            options: [
              { id: 'customer', text: 'Your organization — OS patching on EC2 (IaaS) is the customer\'s responsibility', correct: true },
              { id: 'aws', text: 'AWS — they should have patched the instances automatically', correct: false },
              { id: 'shared', text: 'Shared — both parties failed to patch', correct: false },
              { id: 'vendor', text: 'The OS vendor — they released a vulnerable version', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: CLOUD-SPECIFIC ATTACKS
      // ═══════════════════════════════════════════
      {
        id: 'cloud-attacks',
        title: 'Cloud-Specific Attacks',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Cloud introduces attack vectors that don\'t exist in',
              'traditional environments.',
              '',
              '  S3 BUCKET EXPOSURE',
              '    Publicly accessible storage buckets containing sensitive data.',
              '    Capital One (2019): 100M credit applications exposed via',
              '    a misconfigured WAF + overly permissive IAM role.',
              '    The data was in S3. The path there was SSRF.',
              '',
              '  IAM OVER-PERMISSIONING',
              '    The principle of least privilege is harder to enforce',
              '    in cloud. Developers create roles with "Action": "*"',
              '    and "Resource": "*" because it\'s easy. That role can',
              '    do anything to anything. One compromised credential',
              '    gives the attacker full cloud control.',
              '',
              '  SSRF TO IMDS (Instance Metadata Service)',
              '    Cloud instances have a metadata endpoint at 169.254.169.254',
              '    that serves instance credentials, configuration, and secrets.',
              '    If a web application has a Server-Side Request Forgery (SSRF)',
              '    vulnerability, the attacker forces the server to request:',
              '    http://169.254.169.254/latest/meta-data/iam/security-credentials/',
              '    and retrieves temporary AWS credentials. This was the',
              '    Capital One attack vector.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'REN',
            lines: [
              'Container and Kubernetes exploitation — the modern frontier.',
              '',
              '  CONTAINER ESCAPE',
              '    Containers are supposed to isolate workloads. But',
              '    misconfigurations can break that isolation:',
              '    - Privileged containers run with host-level access',
              '    - Mounted Docker sockets let containers spawn siblings',
              '    - Kernel exploits escape the container namespace entirely',
              '',
              '  KUBERNETES EXPLOITATION',
              '    An exposed Kubernetes API server is game over. Attackers',
              '    enumerate pods, read secrets, deploy malicious workloads.',
              '    Common findings in red team engagements:',
              '    - Dashboard exposed without authentication',
              '    - Service account tokens with cluster-admin privileges',
              '    - Secrets stored as base64 in etcd (not encrypted at rest)',
              '    - Pod security policies not enforced — any pod can mount',
              '      the host filesystem',
              '',
              'Cloud environments fail silently. There\'s no alarm when you',
              'misconfigure a policy. The breach happens weeks later when',
              'someone finds the opening.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'audit --cloud=aws --target=s3',
            commandPatterns: ['audit --cloud=aws --target=s3', 'audit --cloud aws --target s3'],
            lines: [
              'Run a cloud audit on the target AWS environment.',
              'Focus on S3 storage configurations.',
            ],
            commandOutput: `═══ CLOUD AUDIT: AWS S3 ═════════════════════════════════

Buckets Scanned: 14

BUCKET                          PUBLIC   ENCRYPTION   LOGGING   VERSIONING
────────────────────────────────────────────────────────────────────────────
corp-website-assets             Yes      None         Disabled  Disabled
corp-app-uploads                No       AES-256      Enabled   Enabled
corp-data-lake                  No       AES-256-KMS  Enabled   Enabled
corp-backup-prod                No       AES-256      Disabled  Disabled
corp-dev-scratch                Yes      None         Disabled  Disabled    !! PUBLIC !!
corp-ml-training-data           No       AES-256      Disabled  Enabled
corp-client-documents           No       AES-256-KMS  Enabled   Enabled
corp-logs-archive               No       AES-256      Enabled   Enabled
corp-temp-migration             Yes      None         Disabled  Disabled    !! PUBLIC !!

Critical Findings:
  [CRITICAL] corp-dev-scratch — Public read access, no encryption
             Contains: development database exports, test credentials
  [CRITICAL] corp-temp-migration — Public read/write, no encryption
             Contains: legacy CRM data, 2.3M customer records
  [HIGH]     corp-backup-prod — No access logging, no versioning
             If data is modified or deleted, no audit trail exists
  [MEDIUM]   corp-website-assets — Public (expected) but no encryption

Policy Violations: 3 CRITICAL, 1 HIGH, 1 MEDIUM`,
            explanation: [
              'Two publicly accessible buckets containing sensitive data.',
              '',
              'corp-dev-scratch — "dev" and "scratch" buckets are the most',
              'common source of cloud data leaks. Developers create them',
              'for quick testing, dump real data in, and forget they exist.',
              'This one contains database exports and test credentials —',
              'those credentials may work in production.',
              '',
              'corp-temp-migration — "temp" is never temporary. This bucket',
              'has public read AND write access with 2.3M customer records.',
              'An attacker could read the data or replace it with malicious',
              'content. This is a regulatory nightmare.',
              '',
              'corp-backup-prod — No logging means no forensic trail. If',
              'an attacker accesses or modifies backups, you won\'t know.',
              '',
              'Remediation: block public access at the account level using',
              'S3 Block Public Access. Then audit each bucket individually.',
            ],
            hintOnWrong: 'Type: audit --cloud=aws --target=s3',
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'A web application running on an EC2 instance has an SSRF',
              'vulnerability. The attacker crafts a request that forces',
              'the application to connect to http://169.254.169.254/latest/',
              'meta-data/iam/security-credentials/app-role.',
            ],
            question: 'What does this SSRF attack achieve?',
            options: [
              { id: 'creds', text: 'Retrieves temporary AWS credentials (access key, secret key, session token) assigned to the instance\'s IAM role', correct: true },
              { id: 'ssh', text: 'Gains SSH access to the EC2 instance', correct: false },
              { id: 'data', text: 'Directly accesses S3 bucket contents', correct: false },
              { id: 'console', text: 'Accesses the AWS Management Console', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: SECURE DEVELOPMENT & DEVSECOPS
      // ═══════════════════════════════════════════
      {
        id: 'devsecops',
        title: 'Secure Development & DevSecOps',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Security must be built in, not bolted on.',
              '',
              '  SECURE SDLC (Software Development Lifecycle)',
              '    Security integrated at every phase:',
              '    Requirements → threat modeling defines what to protect',
              '    Design → security architecture review',
              '    Implementation → secure coding standards, peer review',
              '    Testing → security testing (SAST, DAST, penetration tests)',
              '    Deployment → hardened configurations, secrets management',
              '    Maintenance → patching, monitoring, incident response',
              '',
              '  THREAT MODELING',
              '    Before writing code, answer:',
              '    What are we building? What can go wrong?',
              '    What are we doing about it? Did we do a good enough job?',
              '    Frameworks: STRIDE (Spoofing, Tampering, Repudiation,',
              '    Information Disclosure, Denial of Service, Elevation of',
              '    Privilege) maps threats to the CIA triad.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'KAI',
            lines: [
              'From the defensive tooling side — the testing pipeline.',
              '',
              '  SAST (Static Application Security Testing)',
              '    Analyzes source code without running it. Finds SQL injection,',
              '    XSS, hardcoded secrets, insecure deserialization.',
              '    Runs in CI/CD. Fast. High false-positive rate.',
              '    Tools: Semgrep, SonarQube, CodeQL.',
              '',
              '  DAST (Dynamic Application Security Testing)',
              '    Tests the running application. Sends malicious inputs,',
              '    observes responses. Finds runtime vulnerabilities.',
              '    Slower. Lower false-positive rate.',
              '    Tools: OWASP ZAP, Burp Suite, Nuclei.',
              '',
              '  SUPPLY CHAIN SECURITY',
              '    Your code depends on libraries that depend on libraries.',
              '    A compromised dependency compromises everything built on it.',
              '    SBOMs (Software Bills of Materials) — inventory of every',
              '    component. Dependency scanning — check every library against',
              '    known vulnerability databases. Lock files — pin exact versions.',
              '',
              '  IaC (Infrastructure as Code) SECURITY',
              '    Terraform, CloudFormation, Pulumi. Your infrastructure',
              '    IS code now. Scan it for misconfigurations before deployment.',
              '    Tools: Checkov, tfsec, cfn-lint.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'A development team uses a popular open-source npm package',
              '(10M weekly downloads) as a core dependency. The package',
              'maintainer\'s account is compromised, and a malicious update',
              'is published that exfiltrates environment variables —',
              'including API keys and database credentials — to an external',
              'server.',
            ],
            question: 'Which security control would have been most effective at preventing this?',
            options: [
              { id: 'lock', text: 'Pinned dependencies with lockfile + automated vulnerability scanning in CI/CD pipeline', correct: true },
              { id: 'sast', text: 'SAST scanning of the team\'s own source code', correct: false },
              { id: 'dast', text: 'DAST testing of the running application', correct: false },
              { id: 'review', text: 'Manual code review of every dependency update', correct: false },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'That npm scenario is not hypothetical. Event-stream (2018),',
              'ua-parser-js (2021), colors.js (2022). Supply chain attacks',
              'on package registries are a recurring pattern.',
              '',
              'Pinned dependencies with lockfiles prevent automatic adoption',
              'of malicious updates. Vulnerability scanning catches known',
              'compromised packages. Together, they form the baseline.',
              '',
              'SAST scans your code, not your dependencies\' code.',
              'DAST tests behavior, not supply chain integrity.',
              'Manual review of every dependency update is unscalable —',
              'a mid-size application may have hundreds of transitive',
              'dependencies.',
              '',
              'The secure development pipeline: threat model, code securely,',
              'test automatically, scan dependencies, harden infrastructure,',
              'monitor continuously. Each layer catches what the others miss.',
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 4: ZERO TRUST ARCHITECTURE
      // ═══════════════════════════════════════════
      {
        id: 'zero-trust',
        title: 'Zero Trust Architecture',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '"Never trust, always verify."',
              '',
              'Zero Trust is not a product you buy. It\'s an architecture',
              'philosophy that assumes breach. Every request is treated as',
              'though it originates from an untrusted network.',
              '',
              '  CORE PRINCIPLES:',
              '',
              '  1. Verify explicitly',
              '     Authenticate and authorize every request based on all',
              '     available data: identity, location, device health,',
              '     service/workload, data classification, anomalies.',
              '',
              '  2. Use least-privilege access',
              '     Just-in-time and just-enough access. Time-limited.',
              '     Adaptive policies based on risk assessment.',
              '',
              '  3. Assume breach',
              '     Minimize blast radius. Segment access. Encrypt',
              '     everything end-to-end. Use analytics to detect threats.',
              '',
              '  MICROSEGMENTATION',
              '    Instead of one big trusted network, create granular',
              '    segments with individual access policies. Each workload',
              '    only communicates with specifically authorized peers.',
              '    An attacker who compromises one service can\'t reach others.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  CONTINUOUS AUTHENTICATION',
              '    Traditional: authenticate once, trust for the session.',
              '    Zero Trust: continuously evaluate trust signals.',
              '    If the device posture changes, if the location shifts,',
              '    if the behavior is anomalous — re-authenticate or revoke.',
              '',
              '  IDENTITY-CENTRIC SECURITY',
              '    The perimeter is the identity. Every user, every service,',
              '    every device has an identity that is verified at every',
              '    access request. Network location is irrelevant — being',
              '    "inside the corporate network" grants no implicit trust.',
              '',
              'Real-world adoption is incremental. No organization flips',
              'a switch to Zero Trust overnight. It\'s a migration that takes',
              'years and touches every system, every policy, every workflow.',
            ],
          },
          {
            type: 'decision',
            speaker: 'HANDLER',
            lines: [
              'DI7 is advising a mid-size financial firm on zero-trust',
              'migration. They have 2,000 employees, a mix of on-premises',
              'and cloud workloads, legacy applications that can\'t support',
              'modern authentication, and a limited security team of 5.',
              '',
              'The CTO wants a migration plan. You need to weigh cost,',
              'complexity, disruption, and security improvement.',
            ],
            question: 'What is the most effective first phase of a zero-trust migration?',
            options: [
              {
                id: 'identity',
                text: 'Start with identity: enforce MFA everywhere, deploy an identity provider (Entra ID/Okta), implement conditional access policies based on device and location',
                correct: true,
              },
              {
                id: 'micro',
                text: 'Start with microsegmentation: redesign the entire network into granular segments with per-workload policies',
                correct: false,
              },
              {
                id: 'replace',
                text: 'Replace all legacy applications first to ensure every system supports modern authentication before enforcing Zero Trust',
                correct: false,
              },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Identity is the foundation. Without strong identity verification,',
              'microsegmentation and continuous authentication have nothing',
              'to anchor to. MFA deployment has the highest security impact',
              'per dollar spent and can be implemented incrementally.',
              '',
              'Microsegmentation is the right second phase — but it requires',
              'deep knowledge of every communication path in the environment.',
              'Starting there would stall the project for months in discovery.',
              '',
              'Replacing legacy applications is a multi-year initiative.',
              'Waiting for it would leave the firm unprotected. Instead,',
              'proxy legacy apps behind an identity-aware gateway that',
              'handles modern authentication on their behalf.',
              '',
              'The cloud is where modern operations live. Defending it',
              'requires understanding shared responsibility, cloud-native',
              'attack vectors, secure development practices, and',
              'Zero Trust principles.',
              '',
              'One chapter remains. The edge.',
            ],
          },
        ],
      },
    ],
  };
}
