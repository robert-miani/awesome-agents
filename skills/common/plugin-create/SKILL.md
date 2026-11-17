---
name: plugin-create
description: >
  Scaffolds a new plugin or adjusts an existing one in this skills library. Given a purpose,
  team role, or SDLC phase, the skill discovers matching library skills, guides skill-selection
  and new-skill creation, analyses cross-skill rules for hooks, and produces a fully structured
  plugin folder with plugin.json, assembled skills, hooks, README, and registry entries.
  Use when asked to create a plugin, bundle skills for a workflow or team role, or when asked
  to add/remove skills or update hooks on an existing plugin.
compatibility: >
  Designed for Claude Code in the awesome-agents repository. Requires read/write
  access to skills/, plugins/, guide/, and plugin-config.json.
metadata:
  author: awesome-agents
  version: "2.0"
allowed-tools: Read Write Edit Glob Grep Bash
---

Read [references/design-guidelines.md](references/design-guidelines.md) before starting.
For hooks format and prompt guidance read [references/how-to-add-plugin-hooks.md](references/how-to-add-plugin-hooks.md).

## Phase 0 — Mode

Ask the user: **create a new plugin** or **adjust an existing one**?

**Adjust:** List all folders under `plugins/` and ask the user to pick one. Then ask what they want to change:
- Add or remove bundled skills → go to Phase 2
- Update hooks (rules/constraints) → go to Phase 4

**Create:** Continue to Phase 1.

---

## Phase 1 — Purpose & type

Ask two questions:

1. **What is the plugin's purpose?** (free text — workflow description, team role, or process name)
2. **Shared or project-scoped?**
   - *Shared* — lives in this `awesome-agents` library, registered, available to all teams
   - *Project-scoped* — lives inside the target project repo only; skip Phase 6 (no registry entries)

For **shared** plugins, map the stated purpose to an SDLC stage and confirm with the user:
`onboarding` · `spec` · `planning` · `implementation` · `review` · `testing` · `deploy`

If the purpose clearly spans multiple stages or none of the above fit, flag it as cross-cutting and confirm before proceeding.

Derive a plugin name: `kebab-case`, max 64 chars, specific. Check `plugins/` to confirm the name is not already taken.

---

## Phase 2 — Skill discovery & suggestion

1. Read `skills/README.md` and `guide/skills-registry.md` to enumerate all available skills.
2. Based on the plugin's purpose, produce a **curated shortlist** — present each candidate with a one-line reason why it fits. Do not list every skill in the library.
3. Present the shortlist to the user. The user may confirm, add, or remove items.
4. Every confirmed existing skill → `"source": "assembly"` entry in `plugin-config.json`.

If adjusting an existing plugin, show current skills alongside candidates — make it clear which are already bundled.

---

## Phase 3 — New skill creation (if gaps exist)

For each capability the user needs that no existing skill covers, ask:

**Should this be a shared skill or a local skill?**
- *Shared* — will live in `skills/<discipline>/` and be reusable across plugins. Create it via the `skill-create` skill before finalising the plugin (or offer to scaffold it inline and register it now). Mark `"source": "assembly"` in `plugin-config.json`.
- *Local* — lives inside this plugin only; will not appear in the shared registry. Create `skills/<skill-name>/SKILL.md` inside the plugin folder. Mark `"source": "local"` in `plugin-config.json`.

Repeat for each gap.

---

## Phase 4 — Cross-skill rules & hooks

1. Read the SKILL.md of each selected and newly created skill.
2. Identify patterns that warrant a `SessionStart` prompt hook — rules Claude must know before invoking any skill:
   - Load order and hard dependencies between skills
   - Scenario branching (when to use skill A vs skill B)
   - Boundary rules that span more than one skill
   - Gotchas that no single SKILL.md owns
3. If patterns exist, draft a hook prompt. Present it to the user for confirmation or refinement.
4. Ask: **are there any additional constraints or rules** not already captured?
5. If confirmed rules exist → plan `hooks/hooks.json`. If none → skip hooks file.

See `references/how-to-add-plugin-hooks.md` for the correct JSON format and guidance on keeping the prompt focused.

---

## Phase 5 — Scaffold

Create files in this order:

### 5.1 Plugin folder
```
plugins/<plugin-name>/
```
Flat — no discipline subdirectory.

### 5.2 `plugin.json`
Create `.claude-plugin/plugin.json`:
```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "<plugin-name>",
  "displayName": "...",
  "version": "1.0.0",
  "description": "...",
  "author": { "name": "Awesome Agents" },
  "license": "Proprietary",
  "keywords": ["..."]
}
```

### 5.3 `plugin-config.json`
Add the new plugin entry to `plugins/plugin-config.json` following the existing JSON structure:
```json
{
  "name": "<plugin-name>",
  "displayName": "...",
  "stage": "<sdlc-stage>",
  "purpose": "...",
  "recommendedFor": ["..."],
  "skills": [
    { "name": "<skill>", "source": "assembly", "from": "<discipline>/<skill>" },
    { "name": "<skill>", "source": "local" }
  ]
}
```
Then run the assembly script to populate assembled skill directories:
```bash
node scripts/assemble-plugins.js
```

### 5.4 `hooks/hooks.json`
Create only if Phase 4 produced confirmed rules:
```json
{
  "hooks": {
    "SessionStart": [
      { "hooks": [{ "type": "prompt", "prompt": "<confirmed rules text>" }] }
    ]
  }
}
```

### 5.5 Local skills
For each `"source": "local"` skill, create `skills/<skill-name>/SKILL.md` inside the plugin folder following the agentskills.io format. Keep each under 300 lines.

### 5.6 `README.md`
Required sections:
- **Description** — what the plugin does and its target stack/context
- **When to Use** — scenarios
- **Bundled Skills** — table with load order, skill name, invocation command (`/<plugin-name>:<skill-name>`), and when to load
- **Workflow** — one section per scenario (new project, existing app, etc.) if load order varies
- **Quick Reference** — task → minimum skills table (if 4+ skills)
- **Gotchas** — cross-skill constraints
- **Usage** — install command + invocation examples
- **Example** — concrete step-by-step
- **Requirements** — tooling, stack, templates

If `hooks/hooks.json` was created, add a notice at the bottom of Requirements:
> **Plugin hooks:** This plugin ships a `SessionStart` prompt hook (`hooks/hooks.json`) that automatically injects [describe what] into Claude's context at session start. Run `/reload-plugins` or restart Claude Code after any edit to `hooks/hooks.json`.

Do not create a root `SKILL.md` at the plugin level.

---

## Phase 6 — Register (shared plugins only)

Skip entirely for project-scoped plugins.

### 6.1 `plugins/README.md`
- Add a row to the Pipeline stages table
- Add a column (or rows) to the Skill × Plugin matrix for each bundled skill

### 6.2 `guide/skills-registry.md`
Add a row under the Plugins section with Status `🧪 beta`:
```
| [plugin-name](../plugins/plugin-name/README.md) | `plugins/plugin-name/` | skill-a, skill-b, ... | Description | 🧪 beta |
```

---

## Gotchas

- **No root SKILL.md.** Never create `plugins/<name>/SKILL.md` — it is never loaded. All skills go under `skills/<skill-name>/SKILL.md`.
- **plugin-config.json is the source of truth.** Always update it before scaffolding; assembled copies are overwritten on the next script run.
- **Never hand-edit assembled skills.** Files inside `skills/<name>/` that have a `.assembled` marker are auto-generated. Edit the source in `skills/<discipline>/<name>/`.
- **Hooks don't hot-reload.** Remind the user to run `/reload-plugins` or restart after editing `hooks/hooks.json`.
- **Hook prompt ≠ README.** The hook prompt must stay in sync with the README workflow section — when one changes, update the other.
- **Missing shared skills are a blocker.** If a required shared skill doesn't exist yet, pause at Phase 3 and create it via `skill-create` before scaffolding the plugin.
- **Project-scoped plugins skip Phase 6.** Do not add them to `plugins/README.md` or `guide/skills-registry.md`.
