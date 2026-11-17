# QA & Testing

## Description

QA & Testing supports test generation, bug triage, and test planning for QA automation
engineers. Additional dedicated skills are planned — see the coverage gap note below.

> **Coverage gap:** No `quality-assurance/` skills have been authored yet. This plugin
> currently bundles only `git-commit`. Skills for test generation, bug triage, and test
> planning are tracked as a separate authoring ticket and will be added when ready.

## When to Use

- Generating automated tests for a feature or module
- Triaging a bug report into a reproducible test case
- Planning a test suite for an upcoming release

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [git-commit](skills/git-commit/SKILL.md) | `/qa-testing:git-commit` | Commit test files with a conventional message |

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/qa-testing
```

Start Claude Code from the target repository root.

## Requirements

- Claude Code for plugin loading
- Write access to the test output directory
