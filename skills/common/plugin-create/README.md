# plugin-create

## Description

Scaffolds a new plugin or adjusts an existing one in the awesome-agents library. Given a purpose, team role, or SDLC phase, the skill discovers and suggests matching library skills, guides the shared-vs-local decision for any new skills, analyses cross-skill rules to produce a `SessionStart` hooks prompt, and produces a fully structured plugin folder with `plugin.json`, assembled skills, `hooks/hooks.json`, `README.md`, and all registry entries.

## When to Use

- You want to bundle existing skills into a plugin for a specific SDLC stage, team role, or recurring workflow
- You need to create a new project-scoped plugin (not registered in the shared library)
- You want to add or remove skills from an existing plugin
- You want to update the hooks (workflow rules) on an existing plugin
- A team is repeatedly running the same skill sequence and you want to package it with load-order rules

## Usage

```
/plugin-create
```

The skill will ask whether you are creating or adjusting, then guide you through purpose, skill selection, new-skill decisions, hooks analysis, and scaffolding.

You can also provide context upfront:

```
/plugin-create for a React developer doing feature delivery
/plugin-create adjust implementation-react, add react-data-fetching
/plugin-create a sprint planning workflow for project managers
```

## Example

**Input:** "Create a plugin for a QA engineer writing automated tests"

**Conversation flow:**
1. Mode → Create
2. Purpose → "QA automation" → maps to `testing` stage → plugin name `qa-testing`
3. Shared → yes (lives in awesome-agents)
4. Skill shortlist → `react-unit-testing`, `git-commit` suggested; user adds `common-clean-code`
5. Gaps → no existing skill for test-plan generation; user chooses local skill
6. Hooks → agent identifies load-order rule and asks user to confirm
7. Scaffold → files created, assembly run
8. Register → rows added to `plugins/README.md` and `guide/skills-registry.md`

**Generated files:**
```
plugins/qa-testing/
├── .claude-plugin/plugin.json
├── hooks/hooks.json
├── skills/
│   ├── react-unit-testing/   ← assembled from skills/development/
│   ├── common-clean-code/    ← assembled from skills/development/
│   ├── test-plan/            ← local skill
│   │   └── SKILL.md
│   └── git-commit/           ← assembled from skills/common/
└── README.md
```

## Requirements

- Claude Code in the `awesome-agents` repository
- Read/write access to `skills/`, `plugins/`, `guide/`, and `plugins/plugin-config.json`
- Node.js 22+ (for running `scripts/assemble-plugins.js`)
- Any new shared skills must be created via `skill-create` before finalising the plugin
