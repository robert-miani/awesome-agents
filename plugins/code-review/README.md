# Code Review

## Description

Code Review analyses code changes for style violations, clean code principle breaches,
and security vulnerabilities. It produces a structured review report covering .NET
naming/style conventions, SOLID and clean code issues, and OWASP-aligned security
findings — each with file, line, severity, and a recommended fix.

## When to Use

- Reviewing a pull request diff before approval
- Running a pre-merge security check on a feature branch
- Auditing a module for clean code and style compliance
- Producing a written review report for async review workflows

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [dotnet-code-style](skills/dotnet-code-style/SKILL.md) | `/code-review:dotnet-code-style` | Review .NET naming conventions and style rules |
| [common-clean-code](skills/common-clean-code/SKILL.md) | `/code-review:common-clean-code` | Review for SOLID, DRY, and clean code principle violations |
| [security-review](skills/security-review/SKILL.md) | `/code-review:security-review` | Review for security vulnerabilities (OWASP, secrets, dependencies) |
| [git-commit](skills/git-commit/SKILL.md) | `/code-review:git-commit` | Commit a review report file with a conventional message |

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/code-review
```

Start Claude Code from the target repository root.

### Invoke

```text
/code-review:security-review
```

```text
/code-review:common-clean-code src/Orders/
```

## Example

Full pre-merge review of a feature branch:

1. `/code-review:dotnet-code-style` — flags naming and style violations
2. `/code-review:common-clean-code` — identifies long methods, missing abstractions, duplication
3. `/code-review:security-review` — checks for injection risks, exposed secrets, vulnerable packages
4. `/code-review:git-commit` — commits a `docs/reviews/<branch>.md` review report

## Requirements

- Claude Code for plugin loading
- Read access to the source files or diff being reviewed
