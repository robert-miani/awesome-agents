# Security Review

## Description

AI-powered codebase security scanner that reasons about code like a security researcher — tracing data flows, understanding component interactions, and catching vulnerabilities that pattern-matching tools miss. Covers injection flaws, authentication bugs, secrets exposure, weak cryptography, insecure dependencies, and business logic issues across multiple languages.

## When to Use

- Scanning a codebase or file for security vulnerabilities
- Running a security audit or vulnerability check
- Checking for SQL injection, XSS, command injection, or other injection flaws
- Finding exposed API keys, hardcoded secrets, or credentials
- Auditing dependencies for known CVEs
- Reviewing authentication, authorization, or access control logic
- Detecting insecure cryptography or weak randomness
- Any request like "is my code secure?", "scan this file", "check for vulnerabilities"

## Usage

Activate with `/security-review` or `/security-review <path>`. The skill:

1. Resolves scan scope (specific path or entire project)
2. Audits dependencies for known CVEs
3. Scans source code tracing data flows from user input to dangerous sinks
4. Self-verifies findings to filter false positives
5. Assigns severity ratings (CRITICAL / HIGH / MEDIUM / LOW / INFO)
6. Proposes targeted patches for each finding

## Example

**Input:** `/security-review src/auth/`

**Output:** A structured security report with findings like:

```
[HIGH] SQL Injection in src/auth/userService.js:42
  → User input `req.query.id` flows directly into SQL query without parameterization
  → Fix: Use parameterized query `db.query('SELECT * FROM users WHERE id = $1', [id])`
```

## Requirements

- Access to the codebase files
- Supports JavaScript, TypeScript, Python, Java, PHP, Go, Ruby, and Rust
- Reference files in `references/` provide language-specific patterns
