---
name: plugin-release
description: >
  Bumps the version of a plugin in this repository, generates a CHANGELOG.md
  entry from git history, and keeps marketplace.json in sync. Use when releasing
  a new version of any plugin in skills/common/plugin-release/../../../plugins/.
metadata:
  author: awesome-agents
  version: "1.0"
allowed-tools: Bash Read Edit
---

## Phase 1 — Gather input

Ask for any missing inputs before proceeding:

1. **Plugin name** — must match a folder under `plugins/`. If not provided, list available plugins from `plugins/` and ask the user to choose.
2. **Bump type** — `patch`, `minor`, or `major`. If not provided, explain the convention and ask:
   - `patch` (0.1.0 → 0.1.1): bug fixes, content corrections, skill wording tweaks
   - `minor` (0.1.0 → 0.2.0): new skills added, hooks added, new MCP connections
   - `major` (0.1.0 → 1.0.0): breaking changes, plugin renamed/restructured, skills removed

Do not proceed until both inputs are confirmed.

## Phase 2 — Read current state

1. Read `plugins/<name>/.claude-plugin/plugin.json` → note `version` as **current version**.
2. Read `plugins/<name>/CHANGELOG.md` → identify the date of the most recent entry (used as the git log start boundary).
3. Run `git log --oneline --since="<date of last entry>"  -- plugins/<name>/ skills/` to collect commits since the last release. If CHANGELOG.md has no prior entries or the date is unclear, use `git log --oneline -- plugins/<name>/` and take all commits.
4. Also check if any source skills were changed: `git log --oneline --since="<date>" -- skills/` filtered to skills assembled into this plugin (from `plugins/plugin-config.json`).

## Phase 3 — Calculate new version

Apply semver bump to the current version string (`X.Y.Z`):
- `patch`: increment Z, reset nothing
- `minor`: increment Y, reset Z to 0
- `major`: increment X, reset Y and Z to 0

## Phase 4 — Draft changelog entry

From the git log output, group commits into changelog sections:

```markdown
## [<new version>] — <today's date YYYY-MM-DD>

### Added
- <feat: commits>

### Changed
- <refactor:/style: commits>

### Fixed
- <fix: commits>

### Removed
- <commits removing skills or features>
```

Omit sections that have no commits. Omit `chore:` and `docs:` commits unless they are significant (e.g. a major README rewrite). Convert commit subject lines to plain human-readable sentences — strip the `feat:` prefix, capitalise the first word.

Show the draft entry to the user and ask for confirmation or edits before writing anything.

## Phase 5 — Apply changes

Once the user approves the changelog draft:

1. **Update `plugins/<name>/.claude-plugin/plugin.json`** — set `"version"` to the new version string.
2. **Update `plugins/<name>/CHANGELOG.md`** — prepend the new entry immediately after the `# Changelog — <name>` heading. Preserve all existing entries below.
3. **Update `.claude-plugin/marketplace.json`** — find the entry where `"name"` matches the plugin name and update its `"version"` field.
4. **Ask the user** whether to also bump the root `"version"` in `.claude-plugin/marketplace.json` (the top-level marketplace version). Suggest bumping it when this is a significant release.

## Phase 6 — Commit

Stage only the files changed in Phase 5:
- `plugins/<name>/.claude-plugin/plugin.json`
- `plugins/<name>/CHANGELOG.md`
- `.claude-plugin/marketplace.json`

Suggest the commit message:
```
chore(release): bump <name> to <new version>
```

Ask the user to confirm before committing. Do not push.

## Gotchas

- Never hand-edit assembled skill copies inside `plugins/<name>/skills/` — those are overwritten by the assembly script. CHANGELOG.md and plugin.json are safe to edit directly.
- The root `"version"` in `marketplace.json` tracks the catalog as a whole, not any single plugin. Only bump it when releasing multiple plugins at once or making a structural change to the marketplace file itself.
- If `git log --since` returns nothing (e.g. the last entry date is today), fall back to `git log -20 -- plugins/<name>/` and let the user filter what's relevant.
- If the plugin has no prior CHANGELOG.md entries, create the file with the standard header: `# Changelog — <name>` before prepending the entry.
