/**
 * Redacts sensitive information from log content
 * Ported from web app: app/lib/redact-sensitive.ts
 * @param content - The log content to redact
 * @returns Object with redacted content and flag indicating if redaction occurred
 */
function redactSensitive(content) {
  let redacted = content;
  let hadSensitiveData = false;

  const patterns = [
    // API Keys (long alphanumeric strings, often with prefixes)
    {
      name: 'API Key',
      pattern: /\b(?:api[_-]?key|apikey|api[_-]?secret|access[_-]?token)[=:\s]+['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
      replacement: '$1[REDACTED_API_KEY]',
    },
    // Generic long tokens (40+ alphanumeric chars)
    {
      name: 'Long Token',
      pattern: /\b[a-zA-Z0-9_\-]{40,}\b/g,
      replacement: '[REDACTED_TOKEN]',
    },
    // JWT Tokens
    {
      name: 'JWT Token',
      pattern: /eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g,
      replacement: '[REDACTED_JWT]',
    },
    // Email addresses
    {
      name: 'Email',
      pattern: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g,
      replacement: '[REDACTED_EMAIL]',
    },
    // File paths with usernames (/Users/username or /home/username)
    {
      name: 'User Path',
      pattern: /(?:\/Users\/|\/home\/|C:\\Users\\)[^\s\/\\]+/g,
      replacement: '[REDACTED_PATH]',
    },
    // IP Addresses (IPv4)
    {
      name: 'IP Address',
      pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      replacement: '[REDACTED_IP]',
    },
    // Credit Card Numbers (basic pattern)
    {
      name: 'Credit Card',
      pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      replacement: '[REDACTED_CC]',
    },
    // AWS Access Keys
    {
      name: 'AWS Key',
      pattern: /AKIA[0-9A-Z]{16}/g,
      replacement: '[REDACTED_AWS_KEY]',
    },
    // Private SSH Keys
    {
      name: 'SSH Key',
      pattern: /-----BEGIN (?:RSA |DSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |DSA |EC )?PRIVATE KEY-----/g,
      replacement: '[REDACTED_SSH_KEY]',
    },
    // Database Connection Strings
    {
      name: 'DB Connection',
      pattern: /(?:postgres|mysql|mongodb):\/\/[^\s@]+:[^\s@]+@[^\s]+/gi,
      replacement: '[REDACTED_DB_CONNECTION]',
    },
    // Generic passwords in URLs or assignments
    {
      name: 'Password',
      pattern: /(?:password|passwd|pwd)[=:\s]+['"]?([^\s'"]{4,})['"]?/gi,
      replacement: 'password=[REDACTED_PASSWORD]',
    },
    // Bearer Tokens
    {
      name: 'Bearer Token',
      pattern: /Bearer\s+[a-zA-Z0-9_\-\.]+/gi,
      replacement: 'Bearer [REDACTED_TOKEN]',
    },
  ];

  for (const { pattern, replacement } of patterns) {
    const matches = redacted.match(pattern);
    if (matches && matches.length > 0) {
      hadSensitiveData = true;
      redacted = redacted.replace(pattern, replacement);
    }
  }

  return {
    content: redacted,
    redacted: hadSensitiveData,
  };
}

module.exports = { redactSensitive };
