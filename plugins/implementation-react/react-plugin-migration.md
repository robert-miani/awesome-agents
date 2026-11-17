# React Plugin Migration Record

**Date:** 2026-06-15  
**Migration:** `plugins/react/` → `plugins/implementation-react/`

## Summary

The `plugins/react/` plugin was retired and its full skill stack absorbed into `implementation-react`. The `react` plugin was non-compliant with the repository plugin convention: it had a root `SKILL.md` (not permitted), lacked a `plugin.json` manifest, was absent from `plugin-config.json`, and its skills were referenced but not bundled inside the plugin folder. `implementation-react` already had the correct structure; this migration expanded it from 3 skills to the full 10-skill React stack and migrated all workflow documentation into the README.

## Skills added (migrated from `react`)

| Skill | Source path | Load order |
|-------|-------------|:----------:|
| `react-architecture` | `skills/development/react-architecture` | 1 |
| `react-code-style` | `skills/development/react-code-style` | 2 |
| `react-api-client` | `skills/development/react-api-client` | 5 |
| `react-data-fetching` | `skills/development/react-data-fetching` | 6 |
| `react-unit-testing` | `skills/development/react-unit-testing` | 7 |
| `react-scaffold` | `skills/development/react-scaffold` | 8 |
| `react-feature` | `skills/development/react-feature` | 9 |

## Skills already present before migration

| Skill | Source path | Load order |
|-------|-------------|:----------:|
| `react-typescript` | `skills/development/react-typescript` | 3 |
| `react-configuration` | `skills/development/react-configuration` | 4 |
| `git-commit` | `skills/common/git-commit` | — |

## Structural changes

- Root `SKILL.md` removed — plugins do not have a root skill file; workflow documentation moved into `README.md`
- `plugin.json` manifest was already present; description updated to reflect full stack
- All skills now assembled via `plugin-config.json` (`"source": "assembly"`) rather than referenced externally
- `plugins/README.md` Pipeline stages table updated: `react` row removed, `implementation-react` description expanded
- `plugins/README.md` Skill × Plugin matrix updated: 7 new `react-*` rows added under `impl-rx`
- `guide/skills-registry.md` Plugins section updated: `react` entry replaced with `implementation-react`

## Files removed

- `plugins/react/` — entire directory deleted. Original content:
  - `SKILL.md` — workflow orchestration (content preserved in `implementation-react/README.md`)
  - `README.md` — plugin description (superseded by `implementation-react/README.md`)
