# plugin-release

## Description

Bumps a plugin version, generates a `CHANGELOG.md` entry from git commit history, and keeps `marketplace.json` in sync — all in one guided flow. Follows semver conventions and groups commits into Added / Changed / Fixed / Removed sections.

## When to Use

- You are ready to ship a new version of a plugin in this repository
- You want to record what changed since the last release in `CHANGELOG.md`
- You need `plugin.json` and `marketplace.json` to reflect the new version

## Usage

Invoke the skill and provide (or answer when asked):
1. The plugin name (must match a folder under `plugins/`)
2. The bump type: `patch`, `minor`, or `major`

The skill reads git history since the last changelog entry, drafts the changelog section for your review, then updates `plugin.json`, `CHANGELOG.md`, and `marketplace.json` before suggesting a commit.

## Example

```
/plugin-release

> Which plugin? implementation-react
> Bump type? minor

Reading git log since 2026-06-16...

Proposed changelog entry:
## [0.2.0] — 2026-07-01
### Added
- react-unit-testing skill expanded with snapshot testing support
- SessionStart hook updated with new scenario: API-only workflow

Confirm and apply? yes

Updated:
  plugins/implementation-react/.claude-plugin/plugin.json  → 0.2.0
  plugins/implementation-react/CHANGELOG.md               → entry prepended
  .claude-plugin/marketplace.json                         → implementation-react 0.2.0

Suggested commit: chore(release): bump implementation-react to 0.2.0
```

## Requirements

- Git repository with conventional commit messages (`feat:`, `fix:`, `refactor:`, etc.)
- Claude Code with Read, Edit, and Bash tools available
- Plugin must already exist under `plugins/<name>/` with a `.claude-plugin/plugin.json`
