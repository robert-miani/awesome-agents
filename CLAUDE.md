# Claude Code Instructions — Awesome Agents

This repository is a curated collection of AI agent **skills** and **plugins**. Skills are pure documentation; plugins bundle assembled copies of skills for direct Claude Code installation. The only build step is `node scripts/assemble-plugins.js` — see the Skill Assembly section.

> **Installing plugins:** When the user asks how to install, add, update, or activate a plugin (or how to use the marketplace), follow and point them to [`guide/sdlc-plugins-marketplace.md`](guide/sdlc-plugins-marketplace.md) — it is the canonical install guide (marketplace flow plus the local `--plugin-dir` alternative). Do not improvise install commands.

## Repository Architecture

```
skills/<discipline>/<skill-name>/   ← individual skills (authoring layer)
plugins/<plugin-name>/              ← SDLC-stage bundles of skills (consumption layer)
guide/                              ← how-to documentation
```

`skills/` uses 8 discipline folders as its authoring taxonomy:
`development`, `quality-assurance`, `business-analysis`, `project-management`, `team-development`, `design-and-ux`, `devops`, `common`

`plugins/` is **flat** — each plugin represents one SDLC stage or agent persona, not a discipline.

**Skills** = single-responsibility agent instruction sets.  
**Plugins** = SDLC-stage bundles assembling skills for one pipeline stage or team role.  
**`common/`** = cross-cutting skills reusable across all disciplines.

---

## Required File Structure

### Skill
Follows the [agentskills.io](https://agentskills.io) open standard.

```
skills/<discipline>/<skill-name>/
├── SKILL.md        ← required: YAML frontmatter + instructions
├── README.md       ← required: human-readable description, usage, example
├── evals/          ← optional: eval scenarios for validating the skill
├── scripts/        ← optional: executable scripts agents can run
├── references/     ← optional: detailed reference docs, loaded on demand
└── assets/         ← optional: templates, schemas, static resources
```

### Plugin
Follows the [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference).

```
plugins/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json          ← required: Claude Code manifest (name must match folder)
├── commands/                ← optional: slash commands for user interaction
├── agents/                  ← optional: specialized agents
├── skills/
│   └── <skill-name>/
│       └── SKILL.md         ← one per bundled skill, agentskills.io format
├── hooks/
│   └── hooks.json           ← optional: event handlers (SessionStart+prompt for workflow rules)
├── .mcp.json                ← optional: external tool / MCP server configuration
├── README.md                ← required: Description, Bundled Skills, Usage, Requirements
├── references/              ← optional: shared reference docs
└── assets/                  ← optional: templates, schemas, static resources
```

A plugin does **not** have a root `SKILL.md`. Each bundled capability is a standalone
skill under `skills/<skill-name>/` following the agentskills.io format.

#### `plugin.json` fields

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "plugin-name",          // required — must match folder name exactly
  "displayName": "Plugin Name",   // optional — human-readable label
  "version": "1.0.0",             // optional — semantic versioning
  "description": "...",           // optional — shown in plugin listings
  "author": { "name": "..." },    // optional
  "license": "...",               // optional
  "keywords": ["..."]             // optional
}
```

---

## Key Conventions

### Naming
- Skill/plugin folder names: `kebab-case`, specific (e.g., `api-endpoint-generator` not `helper`)
- `name` in `SKILL.md` frontmatter **must exactly match the folder name**
- Branch names: `skill/<skill-name>` or `plugin/<plugin-name>`
- Commit messages: `feat(skills): add <skill-name> to <discipline>` or `feat(plugins): ...`

### SKILL.md format
Every `SKILL.md` must start with YAML frontmatter:

```markdown
---
name: skill-name          # required — max 64 chars, lowercase, hyphens only, matches folder name
description: >            # required — max 1024 chars; describe WHAT it does AND WHEN to use it
  Extracts and formats X. Use when working with Y or when the user mentions Z.
license: Proprietary      # optional
compatibility: >          # optional — only if specific environment/tools are required
  Requires Python 3.11+ and access to internal APIs
metadata:                 # optional
  author: awesome-agents
  version: "1.0"
allowed-tools: Bash Read  # optional, experimental
---

<!-- Markdown body: step-by-step instructions, examples, gotchas -->
```

**Body guidelines** (agentskills.io best practices):
- Keep under **500 lines / 5 000 tokens** — move reference material to `references/`
- Include only what the agent *wouldn't* know without the skill (project-specific facts, non-obvious edge cases)
- Prefer step-by-step checklists and concrete examples over prose descriptions
- Add a `## Gotchas` section for non-obvious pitfalls the agent will hit without being told
- For detailed content loaded conditionally, reference files explicitly: `"If the API returns non-200, read references/api-errors.md"`

### README.md for skills/plugins must include
`Description` · `When to Use` · `Usage` · `Example` · `Requirements`

### Registry updates (required when adding any skill or plugin)
Every new skill/plugin must be registered in **two places**:
1. `guide/skills-registry.md` — master public registry (with Status column)
2. `skills/README.md` — discipline table (for skills); or `plugins/README.md` — Pipeline stages table + skill × plugin matrix (for plugins)

### Status values in registry tables
| Value | Meaning |
|-------|---------|
| ✅ stable | Production-ready, maintained |
| 🧪 beta | Works but may change |
| 🚧 wip | Not ready for general use |
| ⚠️ deprecated | Prefer the replacement listed in its README |

### Discipline placement
If the right discipline is ambiguous, use `common/` and note it in the PR description.

---

## Skill Authoring Workflow

When asked to create a new skill, follow these steps in order:

1. **Choose a name** — `kebab-case`, max 64 chars, specific (e.g. `dotnet-ef-core` not `database`)
2. **Create the folder** — `skills/<discipline>/<skill-name>/`
3. **Write `SKILL.md`** — YAML frontmatter (`name`, `description`) followed by instructions; keep under 500 lines
4. **Write `README.md`** — sections: Description, When to Use, Usage, Example, Requirements
5. **Register in `skills/README.md`** — add a row to the discipline table with name, description, and recommended-for
6. **Register in `guide/skills-registry.md`** — add a row with name, path, description, supported tools, and status (`🧪 beta` for new skills)
7. **Add evals (optional but encouraged)** — create `evals/<scenario>/` with `fixture.md`, `prompt.md`, `expected.puml`, and `expected.svg`

Do not skip steps 5 and 6 — unregistered skills are invisible to other contributors.

---

## Plugin Authoring Workflow

> **⛔ Skills-first gate — STOP before scaffolding a plugin.** In this repo a plugin is **not** authored from scratch: it is an SDLC-stage **bundle of skills that already exist** under `skills/<discipline>/`, assembled via `plugins/plugin-config.json` (`"source": "assembly"`). When a user asks to "create a plugin", do **not** start creating plugin files. First stop and explain the repo standard:
>
> 1. Capabilities are authored as **skills** first — one skill per single responsibility (see the Skill Authoring Workflow above).
> 2. A **plugin** then *assembles* those existing skills for one SDLC stage or team role; it adds only packaging (`plugin.json`), optional orchestration (`hooks/hooks.json`), integrations (`.mcp.json`), and a persona agent.
> 3. So the only correct path is: **identify the needed capabilities → create any missing skills → bundle them into one SDLC plugin.**
>
> Confirm with the user which capabilities are needed and which already exist as skills. If a required skill does not exist yet, create it first via the Skill Authoring Workflow — a plugin must never hand-author a duplicate of an assembly skill.

The authoritative, interactive procedure is the **`plugin-create`** skill (`skills/common/plugin-create/SKILL.md`) — load and follow it. The plan below is its condensed form:

1. **Phase 0 — Mode.** Confirm: create a new plugin, or adjust an existing one? (Adjust → pick a folder under `plugins/` and jump to skill-selection or hooks.)
2. **Phase 1 — Purpose & stage.** Capture the purpose (workflow / team role / process) and whether the plugin is *shared* (lives in this library, registered) or *project-scoped* (target repo only — skip registration). For shared plugins, map the purpose to one SDLC stage — `onboarding` · `discovery` · `spec` · `planning` · `implementation` · `review` · `testing` · `deploy` (`discovery` = product shaping, upstream of `spec`) — and confirm. Derive a `kebab-case` name (≤64 chars) not already under `plugins/`.
3. **Phase 2 — Skill discovery.** Read `skills/README.md` and `guide/skills-registry.md`; present a curated shortlist of existing skills that fit the purpose (one-line reason each). The user confirms/adds/removes. Each confirmed skill → `"source": "assembly"` entry in `plugin-config.json`.
4. **Phase 3 — Fill skill gaps (skills-first).** For each needed capability with no existing skill, decide *shared* (author under `skills/<discipline>/` via the Skill Authoring Workflow, then `"source": "assembly"`) or *local* (`skills/<skill-name>/SKILL.md` inside the plugin, `"source": "local"`). Create missing shared skills **before** scaffolding the plugin.
5. **Phase 4 — Cross-skill rules & hooks.** Read the selected skills; if load order, scenario branching, or cross-skill boundaries exist, draft a `SessionStart` prompt hook and confirm it with the user. Keep the hook prompt in sync with the README. See [Plugin Hooks](#plugin-hooks) and `skills/common/plugin-create/references/how-to-add-plugin-hooks.md`.
6. **Phase 5 — Scaffold.** Create `plugins/<plugin-name>/` (flat) with `.claude-plugin/plugin.json`; add the entry to `plugins/plugin-config.json`; run `node scripts/assemble-plugins.js` to populate assembled skills; add `hooks/hooks.json` (only if Phase 4 produced rules), any local skills, and a `README.md` (Description · When to Use · Bundled Skills · Usage · Example · Requirements). No root `SKILL.md`.
7. **Phase 6 — Register (shared plugins only).** Update `plugins/README.md` (pipeline table + matrix), `guide/skills-registry.md` (Plugins row, Status `🧪 beta`), and `.claude-plugin/marketplace.json` (new entry; `source` = folder name only — `metadata.pluginRoot` is already `./plugins`).

Do not skip Phase 6 for shared plugins — the matrix and registries must stay in sync. Project-scoped plugins skip Phase 6 entirely.

---

## Plugin Hooks

Plugin hooks are event-driven handlers that fire automatically without user invocation. The most useful hook type for plugins is **`prompt`** on the **`SessionStart`** event — it injects a prompt into Claude's context the moment the plugin loads, making it the right place for cross-skill orchestration rules that Claude must know before any skill is invoked.

### When to use a SessionStart prompt hook

Use it when the plugin bundles multiple skills and the README contains workflow rules that Claude needs to follow automatically:
- Skill load order and dependencies
- Scenario branching ("use `react-scaffold` only for new projects, never on existing codebases")
- Cross-skill gotchas that span more than one skill file

Rules that belong to a single skill (e.g. "never use `any` in TypeScript") stay in that skill's `SKILL.md`. The hook is for orchestration logic that sits above individual skills.

### File location and format

```
hooks/
└── hooks.json
```

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "You have the implementation-react plugin loaded. Always follow these rules when working on React tasks:\n\n1. Load skills in this order: react-architecture → react-code-style → react-typescript → react-configuration → react-api-client → react-data-fetching → react-unit-testing.\n2. For new projects: load react-scaffold before react-feature.\n3. Never load react-scaffold on an existing codebase — use react-feature instead.\n4. react-api-client owns axios instances; react-feature owns feature-level *.api.ts fetchers.\n5. Tests always live in root tests/, mirroring src/ — never inside src/features/."
          }
        ]
      }
    ]
  }
}
```

The `prompt` field is plain text injected into context. Keep it focused — list only rules that Claude would not infer from the individual skill files.

> **Note:** Changes to `hooks/hooks.json` do not hot-reload. Run `/reload-plugins` or restart Claude Code after editing.

See `skills/common/plugin-create/references/how-to-add-plugin-hooks.md` for a full walkthrough.

---

## Contributing Flow

1. Fork → branch `skill/<name>` or `plugin/<name>`
2. Create folder under `skills/<discipline>/<name>/` (skills) or `plugins/<name>/` (plugins)
3. Add `SKILL.md` (YAML frontmatter + body) + `README.md`
4. Update both registry files (`guide/skills-registry.md` and `skills/README.md` or `plugins/README.md`)
5. PR against `main`

### First-time setup (run once per clone)

```bash
git config core.hooksPath .githooks
```

This activates the pre-commit hook that auto-assembles skills into plugins before every commit.

---

## Skill assembly

Plugins bundle skills from `skills/` via a build step rather than duplicating files by hand.
The mapping is defined in `plugins/plugin-config.json` (`"source": "assembly"`).

**Node.js is required.** Before running the assembly script or activating the git hook,
verify Node.js 22+ is installed:

```bash
node --version
```

If the command is not found or the version is below 22, ask the user to install Node.js
before proceeding: `https://nodejs.org/` (LTS release recommended). Do not attempt to
run the assembly script or activate the pre-commit hook until Node.js is confirmed.

**Run manually:**
```bash
node scripts/assemble-plugins.js
```

**Automatic triggers:**
- **Claude Code** — runs after every `Write`/`Edit` tool call (`.claude/settings.json` hook)
- **Git pre-commit** — runs before every commit and stages any updated assembled copies

Assembled skill directories contain a `.assembled` marker file (holds the source path).
Never hand-edit files inside an assembled directory — changes will be overwritten on the next run.
To change an assembled skill, edit its source in `skills/<discipline>/<skill-name>/`.

---

## Validation

The agentskills.io reference validator can check frontmatter correctness:
```bash
skills-ref validate ./skills/<discipline>/<skill-name>
```
