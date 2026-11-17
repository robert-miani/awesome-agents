# Plugin Design Guidelines

> Sources: [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference) · [awslabs/agent-plugins DESIGN_GUIDELINES.md](https://github.com/awslabs/agent-plugins/blob/main/docs/DESIGN_GUIDELINES.md)

---

## Core principles

| Principle | Rule |
|-----------|------|
| **Single responsibility** | One clear purpose per plugin. If the description uses "and" more than once, split it. |
| **Minimize context** | Keep each skill under 300 lines. Move tables and reference data to `references/` files (max 100 lines each). |
| **Write for agents** | Instructions must be explicit and unambiguous. No vague qualifiers ("probably", "maybe", "appropriate"). |
| **Focused bundling** | Bundle only related skills. A plugin that covers every skill is not a plugin. |

---

## Plugin directory structure

```
plugins/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json          ← required: Claude Code manifest; `name` must match folder exactly
├── commands/                ← optional: slash commands for user interaction
├── agents/                  ← optional: specialized agents
├── skills/
│   └── <skill-name>/
│       └── SKILL.md         ← one per bundled skill, agentskills.io format
├── hooks/
│   └── hooks.json           ← optional: SessionStart prompt for cross-skill workflow rules
├── .mcp.json                ← optional: external tool / MCP server configuration
├── README.md                ← human docs (Description · Bundled Skills · Usage · Requirements)
├── references/              ← on-demand detail docs (≤100 lines each)
└── assets/                  ← templates, schemas, examples
```

No discipline subdirectory — all plugins live directly under `plugins/<plugin-name>/`.
No root `SKILL.md` — all skills live under `skills/<skill-name>/SKILL.md`.

---

## Plugin manifest (`plugin.json`)

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "plugin-name",          // required — kebab-case, matches folder name exactly
  "displayName": "Plugin Name",   // optional — human-readable label (requires v2.1.143+)
  "version": "1.0.0",             // optional — semver; omit to use git SHA (good during dev)
  "description": "...",           // optional — shown in plugin listings
  "author": { "name": "...", "email": "..." },
  "license": "Proprietary",
  "keywords": ["..."]             // optional — 3–7 discovery tags
}
```

Unrecognized top-level fields are warnings, not errors — unless `--strict` is used. Do not add
custom fields (`stage`, `recommended-for`) when running `--strict` in CI.

---

## `plugin-config.json` entry

Every shared plugin must have an entry in `plugins/plugin-config.json` — this is the source of truth for the Skill × Plugin matrix and drives `scripts/assemble-plugins.js`:

```json
{
  "name": "plugin-name",
  "displayName": "Plugin Name",
  "stage": "implementation",
  "purpose": "...",
  "recommendedFor": ["Role"],
  "skills": [
    { "name": "skill-a", "source": "assembly", "from": "discipline/skill-a" },
    { "name": "skill-b", "source": "local" }
  ]
}
```

- `"source": "assembly"` — copied from `skills/<from>/` at build time; never hand-edit the copy
- `"source": "local"` — authored inside the plugin; not in the main `skills/` tree

---

## Bundled skill frontmatter (`skills/<name>/SKILL.md`)

```yaml
name: skill-name   # required — 1-64 chars, lowercase, hyphens only, matches skills/<name>/ dir
description: >     # required — 1-1024 chars — WHAT it does + WHEN to use it + trigger keywords
  ...
```

Optional: `license`, `compatibility`, `metadata` (author, version), `allowed-tools`.

Body: action-oriented numbered steps, explicit defaults (exact values), error handling, output
contract. Link reference files explicitly: `"For details, read references/xyz.md"`.

---

## File size limits

| File | Limit |
|------|-------|
| Each bundled skill `SKILL.md` | 300 lines max |
| Plugin `README.md` | 300 lines max |
| Each file in `references/` | 100 lines max |
| Total token load on activation | < 5 000 tokens |

---

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Root `SKILL.md` at the plugin folder level | Always use `skills/<name>/SKILL.md`; root file is never loaded |
| Plugin path with discipline prefix (`plugins/development/...`) | Plugins are flat — `plugins/<name>/` only |
| Monolithic skill body (1000+ lines) | Burns context on every activation |
| Vague language ("handle appropriately") | Agents execute literally; need exact instructions |
| Implicit defaults | Creates inconsistent, unpredictable behaviour |
| Missing error handling | Plugin silently fails when a dependency is absent |
| Custom top-level `plugin.json` fields | Fails `claude plugin validate --strict` in CI |
| Bundling unrelated skills | Violates single responsibility; harder to maintain |
| Hand-editing assembled skill copies | Changes are overwritten on the next assembly run |
| Workflow rules only in README | Claude does not read README automatically; use a hooks prompt |

---

## Pre-submission checklist

- [ ] `plugin.json` has `name` (matches folder), `version`, and `description`
- [ ] Plugin folder is flat: `plugins/<name>/` — no discipline subdirectory
- [ ] Skills in `skills/<name>/SKILL.md`; each `name` matches its directory
- [ ] No root `SKILL.md` at the plugin folder level
- [ ] `plugins/plugin-config.json` has an entry for the plugin with all skills listed
- [ ] Assembly script ran clean: `node scripts/assemble-plugins.js`
- [ ] Each skill's description uses "and" at most once (single responsibility)
- [ ] Each skill body ≤ 300 lines; heavy content moved to the skill's own `references/`
- [ ] README has Bundled Skills table listing each skill with its invocation command
- [ ] If cross-skill workflow rules exist → `hooks/hooks.json` created; README has hooks notice
- [ ] Hook prompt stays in sync with README workflow section
- [ ] Output contract explicit in each skill (exact file paths or artifact names)
- [ ] Error handling covers: dependency missing, skill returns no output
- [ ] Registered in `plugins/README.md` (Pipeline stages table + matrix) and `guide/skills-registry.md`
- [ ] All `references/` files ≤ 100 lines; no vague language in any instruction step
- [ ] `claude plugin validate ./plugins/<name> --strict` passes (run before opening PR)
