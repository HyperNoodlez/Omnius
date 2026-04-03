import type { OrientationChapter } from './index.js';

export function getChapter10(): OrientationChapter {
  return {
    id: 'ch10-crypto',
    number: 10,
    title: 'Crypto Wars',
    subtitle: 'Cryptography, Protocols, and Their Failures',
    clearanceLevel: 'R1 — ADVANCED',
    tier: 4,
    estimatedMinutes: 30,
    sections: [
      // ═══════════════════════════════════════════
      // SECTION 1: CRYPTOGRAPHIC PRIMITIVES
      // ═══════════════════════════════════════════
      {
        id: 'crypto-primitives',
        title: 'Cryptographic Primitives',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Cryptography is the last line of defense. When every other',
              'control fails — when the perimeter is breached, when the',
              'attacker has the data — encryption is the thing standing',
              'between a breach and a catastrophe.',
              '',
              'But cryptography is also where the most dangerous mistakes',
              'are made. Not because the math is wrong. Because the',
              'implementation is.',
              '',
              'Two families of encryption:',
              '',
              '  SYMMETRIC ENCRYPTION — One key. Same key encrypts and decrypts.',
              '    AES-256   — The standard. Used everywhere: disk encryption,',
              '                VPNs, TLS data transfer. Block cipher, 128-bit blocks.',
              '    ChaCha20  — Stream cipher. Faster on devices without AES',
              '                hardware acceleration. Used in WireGuard, TLS 1.3.',
              '    The problem: both parties need the same key. How do you',
              '    share a secret key securely over an insecure channel?',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  ASYMMETRIC ENCRYPTION — Two keys. Public encrypts, private decrypts.',
              '    RSA       — The classic. Key sizes: 2048-bit minimum, 4096-bit',
              '                recommended. Slower than symmetric by orders of magnitude.',
              '    ECC       — Elliptic Curve Cryptography. Smaller keys, same security.',
              '                A 256-bit ECC key ≈ a 3072-bit RSA key in strength.',
              '    Diffie-Hellman — Key exchange protocol. Two parties generate a',
              '                shared secret over a public channel without ever',
              '                transmitting the secret itself. The foundation of',
              '                how TLS establishes session keys.',
              '',
              'In practice, you use both together. Asymmetric encryption',
              'exchanges a symmetric key. Then symmetric encryption handles',
              'the actual data — because it\'s fast. This is called a',
              'hybrid cryptosystem. Every TLS connection works this way.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  HASH FUNCTIONS — One-way transformations. Input → fixed-size output.',
              '    No key involved. Cannot be reversed.',
              '',
              '    SHA-256  — 256-bit output. The workhorse. Used in digital',
              '               signatures, certificate verification, blockchain.',
              '    SHA-3    — NIST\'s next-generation standard. Different internal',
              '               structure than SHA-2. Defense in depth — if SHA-2',
              '               is ever broken, SHA-3 is the fallback.',
              '    BLAKE3   — Extremely fast. Used in integrity verification',
              '               and modern tooling. Not yet a NIST standard but',
              '               widely adopted in practice.',
              '',
              '  DIGITAL SIGNATURES — Prove authorship and integrity.',
              '    Hash the document → encrypt the hash with your private key.',
              '    Anyone with your public key can verify you signed it and',
              '    that the document hasn\'t been altered.',
              '',
              '  PKI / CERTIFICATE AUTHORITY (CA) SYSTEM',
              '    The trust hierarchy. Root CAs sign intermediate CAs. Intermediate',
              '    CAs sign server certificates. Your browser trusts the root,',
              '    therefore trusts the chain. If a CA is compromised — like',
              '    DigiNotar in 2011 — the entire chain of trust collapses.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Scenario. You need to secure data in each of these situations.',
              'Which primitive fits?',
            ],
            question: 'A server needs to verify that a software update package was genuinely published by the vendor and has not been tampered with in transit. The verification must work without any shared secret between vendor and server.',
            options: [
              { id: 'sig', text: 'Digital signature — vendor signs with private key, server verifies with vendor\'s public key', correct: true },
              { id: 'aes', text: 'AES-256 — encrypt the package so only the server can read it', correct: false },
              { id: 'sha', text: 'SHA-256 hash — publish the hash alongside the package', correct: false },
              { id: 'dh', text: 'Diffie-Hellman — establish a shared secret first', correct: false },
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Next scenario.',
            ],
            question: 'Two servers that have never communicated before need to establish an encrypted channel over the public internet. Neither has a pre-shared key. What mechanism initiates the secure connection?',
            options: [
              { id: 'dh', text: 'Diffie-Hellman key exchange — derive a shared secret over an insecure channel, then use it for symmetric encryption', correct: true },
              { id: 'aes', text: 'AES-256 — just encrypt the traffic directly', correct: false },
              { id: 'rsa', text: 'RSA — encrypt all traffic with the server\'s public key', correct: false },
              { id: 'hash', text: 'BLAKE3 — hash the traffic for integrity', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 2: TLS AND PROTOCOL SECURITY
      // ═══════════════════════════════════════════
      {
        id: 'tls-protocol-security',
        title: 'TLS and Protocol Security',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'TLS 1.3 is the current standard for encrypted communication.',
              'Understanding its handshake tells you what can go right —',
              'and what has gone catastrophically wrong in the past.',
              '',
              '  TLS 1.3 HANDSHAKE (simplified):',
              '',
              '  1. CLIENT HELLO     — Client sends supported cipher suites',
              '                         and a key share (Diffie-Hellman public value)',
              '  2. SERVER HELLO     — Server selects cipher suite, sends its',
              '                         key share and certificate',
              '  3. VERIFY           — Client validates the certificate chain',
              '                         (is it signed by a trusted CA?)',
              '  4. FINISHED         — Both sides derive the session key from',
              '                         the DH exchange. Encrypted channel is live.',
              '',
              'One round trip. TLS 1.2 took two. TLS 1.3 also eliminated',
              'all cipher suites with known weaknesses — no more RC4, no',
              'more CBC mode ciphers, no more RSA key transport.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Certificate validation — the chain of trust:',
              '',
              '  Your browser trusts ~150 root CA certificates.',
              '  The server presents: Server Cert → Intermediate CA → Root CA.',
              '  If any link is invalid, expired, or revoked, the chain breaks.',
              '',
              'Historic protocol attacks:',
              '',
              '  BEAST (2011)  — Exploited CBC mode in TLS 1.0. Allowed',
              '                  decryption of HTTPS cookies.',
              '  POODLE (2014) — Forced protocol downgrade from TLS to SSL 3.0,',
              '                  then exploited padding oracle in SSL 3.0.',
              '  HEARTBLEED (2014) — Buffer over-read in OpenSSL. Leaked server',
              '                  memory including private keys, session tokens,',
              '                  passwords. Affected ~17% of all HTTPS servers.',
              '  DROWN (2016)  — Cross-protocol attack. If the server supported',
              '                  SSLv2 on ANY port, TLS on port 443 was vulnerable.',
              '',
              'The lesson: protocol vulnerabilities compound. Legacy support',
              'creates attack surface. Deprecate aggressively.',
            ],
          },
          {
            type: 'guided-command',
            speaker: 'HANDLER',
            expectedCommand: 'audit --tls=portal.corp.local',
            commandPatterns: ['audit --tls=portal.corp.local', 'audit --tls portal.corp.local'],
            lines: [
              'Examine the TLS configuration on a corporate portal.',
              'Tell me what you find.',
            ],
            commandOutput: `═══ TLS AUDIT: portal.corp.local:443 ═══════════════════

Certificate:
  Subject:    CN=portal.corp.local
  Issuer:     CN=CorpInternal-CA → CN=DigiCert Global Root G2
  Valid:      2025-11-01 to 2026-11-01
  Key:        RSA 2048-bit
  Signature:  SHA-256

Protocol Support:
  TLS 1.3    ✓ ENABLED
  TLS 1.2    ✓ ENABLED
  TLS 1.1    ✗ DISABLED
  TLS 1.0    ✗ DISABLED
  SSLv3      ✗ DISABLED

Cipher Suites (TLS 1.2):
  TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384       ✓ STRONG
  TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256       ✓ STRONG
  TLS_RSA_WITH_AES_256_CBC_SHA256              !! WEAK — no forward secrecy !!
  TLS_RSA_WITH_3DES_EDE_CBC_SHA               !! CRITICAL — 3DES, no PFS !!

Cipher Suites (TLS 1.3):
  TLS_AES_256_GCM_SHA384                       ✓ STRONG
  TLS_CHACHA20_POLY1305_SHA256                 ✓ STRONG

HSTS Header:       MISSING  !! Vulnerable to SSL stripping !!
OCSP Stapling:     ENABLED
Certificate Trans.: NOT LOGGED  !! Certificate not in CT logs !!

Issues Found: 3 CRITICAL, 1 WARNING`,
            explanation: [
              'The TLS 1.3 configuration is solid — only strong ciphers.',
              'The problem is TLS 1.2 backward compatibility.',
              '',
              'Two weak cipher suites in TLS 1.2:',
              '  TLS_RSA_WITH_AES_256_CBC_SHA256 — Uses RSA key transport',
              '  instead of Diffie-Hellman. No forward secrecy. If the',
              '  server\'s private key is ever compromised, all past sessions',
              '  can be decrypted retroactively.',
              '',
              '  TLS_RSA_WITH_3DES_EDE_CBC_SHA — 3DES is deprecated.',
              '  64-bit block size makes it vulnerable to the Sweet32 attack.',
              '',
              'Missing HSTS header means the server doesn\'t enforce HTTPS.',
              'An attacker performing a man-in-the-middle can strip the TLS',
              'connection entirely and downgrade the user to plain HTTP.',
              '',
              'Certificate not in CT logs means compromised certificates',
              'would be harder to detect. Certificate Transparency is a',
              'public audit mechanism — opting out reduces visibility.',
            ],
            hintOnWrong: 'Type: audit --tls=portal.corp.local',
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 3: CRYPTOGRAPHIC FAILURES
      // ═══════════════════════════════════════════
      {
        id: 'crypto-failures',
        title: 'Cryptographic Failures',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Cryptography doesn\'t fail because the algorithms are broken.',
              'It fails because of everything around the algorithms.',
              '',
              '  WEAK RANDOM NUMBER GENERATION',
              '    Encryption keys must be unpredictable. If the random',
              '    number generator is seeded with predictable values (time,',
              '    process ID), the keys it generates are predictable.',
              '    The Debian OpenSSL bug (2008) reduced the keyspace to',
              '    ~32,000 possible keys. Every SSL certificate generated',
              '    by affected Debian systems for two years was breakable.',
              '',
              '  KEY REUSE / NONCE REUSE',
              '    Stream ciphers and GCM mode require unique nonces for',
              '    each encryption operation. Reusing a nonce with the same',
              '    key is catastrophic — it allows XOR-based plaintext recovery.',
              '    This is not theoretical. It has happened in production.',
              '',
              '  IMPLEMENTATION BUGS',
              '    Side-channel attacks exploit timing differences in crypto',
              '    operations. If comparing a MAC takes longer when more bytes',
              '    match, an attacker can deduce the correct MAC byte by byte.',
              '    Constant-time comparison functions exist for this reason.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'REN',
            lines: [
              'From the red team side — we love weak session tokens.',
              '',
              'Web applications that generate session IDs with insufficient',
              'entropy are targets. If a session token is a 6-digit number,',
              'there are only one million possibilities. Brute-forceable in',
              'minutes. If it\'s derived from a timestamp with millisecond',
              'precision, you narrow the window and try every millisecond',
              'around the known login time.',
              '',
              'The Web Application Hacker\'s Handbook calls session tokens',
              '"the keys to the kingdom." They\'re right. A 128-bit',
              'cryptographically random token is the minimum. Anything less',
              'is an invitation.',
              '',
              'Key management is the other failure point. Hardcoded API keys',
              'in source code, encryption keys in plaintext config files,',
              'keys that never rotate. I\'ve pulled AWS credentials from',
              'public GitHub repos and had root access within minutes.',
            ],
          },
          {
            type: 'scenario',
            speaker: 'HANDLER',
            scenarioContext: 'A financial services firm reports that encrypted customer records were exposed in a breach. The encryption used AES-256. The algorithm was not broken — the data was decrypted by the attacker.',
            lines: [
              'Scenario. A financial services firm calls DI7.',
              '',
              'Their customer database was encrypted with AES-256. They did',
              'everything right — or so they thought. The attacker exfiltrated',
              'the encrypted database AND decrypted every record.',
              '',
              'AES-256 was not broken. The algorithm is sound.',
              '',
              'Investigation reveals:',
              '  - Encryption keys stored in a config file on the same server',
              '    as the database',
              '  - The config file had permissions 644 (world-readable)',
              '  - Keys had not been rotated in 3 years',
              '  - No hardware security module (HSM) was in use',
              '  - Backup tapes contained both encrypted data AND the key file',
              '',
              'The encryption was technically flawless. The key management',
              'was a disaster. The attacker didn\'t break AES — they read',
              'the key from a world-readable file on the same machine.',
            ],
          },
          {
            type: 'quiz',
            speaker: 'HANDLER',
            lines: [
              'Based on that scenario — what was the primary failure?',
            ],
            question: 'What was the root cause of the encrypted data being compromised?',
            options: [
              { id: 'key-mgmt', text: 'Key management failure — keys stored alongside data, world-readable, never rotated, no HSM', correct: true },
              { id: 'algo', text: 'AES-256 has a vulnerability that was exploited', correct: false },
              { id: 'backup', text: 'The backup system was the sole point of failure', correct: false },
              { id: 'perms', text: 'File permissions alone caused the breach', correct: false },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════
      // SECTION 4: APPLIED CRYPTO FOR DEFENDERS
      // ═══════════════════════════════════════════
      {
        id: 'applied-crypto',
        title: 'Applied Crypto for Defenders',
        steps: [
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Defensive cryptography. The controls you verify during',
              'every assessment.',
              '',
              '  PASSWORD STORAGE',
              '    bcrypt  — Adaptive cost factor. Increase the work factor',
              '              as hardware gets faster. Industry standard.',
              '    argon2  — Winner of the Password Hashing Competition (2015).',
              '              Memory-hard — resists GPU and ASIC attacks.',
              '              argon2id is the recommended variant.',
              '    scrypt  — Also memory-hard. Used in cryptocurrency mining.',
              '              Good alternative where argon2 isn\'t available.',
              '',
              '  NEVER: MD5, SHA-1, SHA-256 alone for passwords.',
              '  They\'re fast. Fast is bad for password hashing.',
              '  A modern GPU cracks billions of SHA-256 hashes per second.',
              '  bcrypt with cost 12? Maybe 5,000 per second.',
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              '  SECRETS MANAGEMENT',
              '    HashiCorp Vault, AWS Secrets Manager, Azure Key Vault.',
              '    Centralized, audited, access-controlled secret storage.',
              '    Secrets are injected at runtime, never stored in code,',
              '    config files, or environment variables on disk.',
              '',
              '  HSTS (HTTP Strict Transport Security)',
              '    Tells the browser: "only connect to this domain over HTTPS.',
              '    Forever. No exceptions." Prevents SSL stripping attacks.',
              '    One header: Strict-Transport-Security: max-age=31536000',
              '',
              '  CERTIFICATE TRANSPARENCY (CT)',
              '    Public, append-only logs of every certificate issued.',
              '    Allows domain owners to detect unauthorized certificates.',
              '    If a CA issues a rogue cert for your domain, CT logs',
              '    expose it within hours.',
              '',
              '  CERTIFICATE PINNING',
              '    Application hardcodes which certificate or CA it expects.',
              '    Even if a trusted CA is compromised, pinned applications',
              '    reject the rogue certificate. Used in high-security mobile',
              '    apps and internal services.',
            ],
          },
          {
            type: 'decision',
            speaker: 'HANDLER',
            lines: [
              'A client is redesigning their secrets management after an',
              'audit found encryption keys in plaintext config files,',
              'API keys committed to version control, and database passwords',
              'in environment variables. Budget is limited.',
              '',
              'They ask for your recommendation.',
            ],
            question: 'What is the highest-priority remediation?',
            options: [
              {
                id: 'vault',
                text: 'Deploy a centralized secrets manager (Vault/AWS SM) — rotate all compromised keys, remove secrets from code and config files',
                correct: true,
              },
              {
                id: 'hsm',
                text: 'Purchase HSMs for all servers — hardware-backed key storage',
                correct: false,
              },
              {
                id: 'rotate',
                text: 'Rotate all keys manually and add git hooks to prevent future commits of secrets',
                correct: false,
              },
            ],
          },
          {
            type: 'narrative',
            speaker: 'HANDLER',
            lines: [
              'Centralized secrets management is the foundation. HSMs are',
              'important for the highest-value keys but won\'t fix the',
              'systemic problem of secrets scattered across config files',
              'and repositories. Git hooks are a good supplementary control',
              'but they\'re a detection mechanism, not a solution — they',
              'don\'t rotate compromised keys or centralize access control.',
              '',
              'The order: centralize → rotate → enforce → audit.',
              'Everything else builds on having a single source of truth',
              'for secrets.',
              '',
              'Cryptography is a force multiplier for defense. But only',
              'when the entire system — key generation, storage, rotation,',
              'access control — is sound. A single weak link in the chain',
              'renders the strongest algorithm irrelevant.',
              '',
              'Next chapter: the cloud. A different battlefield with its',
              'own rules of engagement.',
            ],
          },
        ],
      },
    ],
  };
}
