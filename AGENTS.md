# Agent Instructions — Awesome Agents

This repository is a curated library of reusable AI agent **skills** and Claude Code **plugins**. It is primarily a documentation-and-packaging repo, not an application codebase: most work here involves authoring `SKILL.md` files, plugin manifests, registries, hooks, assembly config, and contributor docs.

`CLAUDE.md` is the authoritative source for full repository rules and workflows. Read it before making changes. This `AGENTS.md` is the compatibility entry point for tools that look for `AGENTS.md` first and need a project-specific overview.

## What this project contains

- **Skills** in `skills/` are the authoring layer: single-responsibility instruction sets following the [agentskills.io](https://agentskills.io) format.
- **Plugins** in `plugins/` are the consumption layer: SDLC-stage bundles that assemble the right skills for one workflow or role and can be installed directly into Claude Code.
- **Guide docs** in `guide/` explain installation, contribution, marketplace usage, and the public registry.
- **Architecture docs** in `docs/adrs/` capture design decisions for a related autonomous-agent proof of concept.

## Current repository shape

```text
skills/<discipline>/<skill-name>/   authoring layer for reusable skills
plugins/<plugin-name>/              flat plugin bundles by SDLC stage
guide/                              user-facing docs, registries, how-tos
docs/adrs/                          architectural decision records
scripts/assemble-plugins.js         copies library skills into plugin bundles
```

The skills taxonomy currently has 8 discipline folders:

- `development`
- `quality-assurance`
- `business-analysis`
- `project-management`
- `team-development`
- `design-and-ux`
- `devops`
- `common`

At the moment the authored content is concentrated in:

- `development` — 29 skills
- `business-analysis` — 17 skills
- `common` — 5 skills
- `devops` — 4 skills
- `project-management` — 4 skills

The remaining discipline folders (`quality-assurance`, `team-development`, `design-and-ux`) exist as the long-term taxonomy but are still mostly placeholders in the public registries.

## Plugin catalog and maturity

The repo currently publishes 10 plugins:

1. `project-onboarding`
2. `product-discovery`
3. `requirements-specification`
4. `technical-analysis`
5. `technical-planning`
6. `implementation-dotnet`
7. `implementation-react`
8. `code-review`
9. `qa-testing`
10. `release-deployment`

Important current state:

- **Most complete bundles:** `implementation-dotnet`, `implementation-react`, and the business-analysis trio `product-discovery` / `requirements-specification` (14 skills) / `technical-analysis`
- **Thin / still-growing bundles:** `qa-testing`, `code-review`, `release-deployment`, `technical-planning`, `project-onboarding`
- **Machine-readable plugin source of truth:** `plugins/plugin-config.json`
- **Marketplace catalog:** `.claude-plugin/marketplace.json`

`plugins/README.md` is the human-readable plugin matrix. `plugin-config.json` is the authoritative config that drives assembly.

## How skills and plugins work here

### Skills

Every skill lives under `skills/<discipline>/<skill-name>/` and should include:

- `SKILL.md` with YAML frontmatter
- `README.md`
- optional `evals/`, `scripts/`, `references/`, `assets/`

Key conventions:

- Skill folder names are `kebab-case`
- `name` in `SKILL.md` frontmatter must exactly match the folder name
- Keep the instruction body concise and move long reference material into `references/`

### Plugins

Plugins are flat under `plugins/<plugin-name>/` and do **not** have a root `SKILL.md`.
Each bundled capability is stored as its own skill under `plugins/<plugin-name>/skills/<skill-name>/SKILL.md`.

Plugins may also include:

- `.claude-plugin/plugin.json`
- `hooks/hooks.json`
- `commands/`
- `agents/`
- `.mcp.json`
- `references/`
- `assets/`

## Assembly and generated content

This repo intentionally separates authored skills from bundled plugin copies.

- `plugins/plugin-config.json` defines which skills each plugin bundles
- `scripts/assemble-plugins.js` copies `"source": "assembly"` skills from `skills/` into `plugins/<plugin>/skills/`
- Generated plugin skill copies contain a `.assembled` marker file
- **Never hand-edit assembled copies inside plugins**; edit the source skill under `skills/` instead

Assembly behavior:

- Safe to re-run repeatedly
- Skips already-synced skill bundles
- Warns when a referenced source skill does not exist yet
- Fails only on actual IO errors

## Automation hooks already in the repo

- `.claude/settings.json` runs `node scripts/assemble-plugins.js` after Claude `Write`/`Edit` operations
- `.githooks/pre-commit` runs the same assembly script and stages assembled plugin skill directories before commit

For contributors, **Node.js 22+** is required before running the assembly flow manually or enabling the git hook path.

## Key docs to use for context

- `README.md` — top-level project positioning, plugin stages, quick start
- `skills/README.md` — per-discipline skill registry
- `plugins/README.md` — plugin catalog and skill × plugin matrix
- `guide/README.md` — documentation index
- `guide/sdlc-plugins-marketplace.md` — best high-level explanation of the skills-vs-plugins model and marketplace flow
- `guide/skills-registry.md` — public registry with statuses

## Notable project-specific behavior

- `implementation-react` includes a `SessionStart` prompt hook that enforces cross-skill workflow rules such as skill load order, scenario branching, and React-specific gotchas.
- The business-analysis plugins (`product-discovery`, `requirements-specification`, `technical-analysis`) each ship a `SessionStart` prompt hook encoding their pipeline and guardrails, an Atlassian (Jira + Confluence) `.mcp.json` using the official Atlassian Remote MCP over OAuth (no committed secrets), and a thin persona agent (`product-manager` / `business-analyst`) under `agents/`.
- `project-onboarding` is a notable plugin-local workflow that generates a repository knowledge pack (`REPOSITORY_KNOWLEDGE.md` plus `docs/onboarding/*`) in the **target repository**, not in this library repo. It relies on user-local MCP and does not store credentials in this repository.

## Recent notable changes

As of the latest repo history reviewed here, the most important recent additions are:

1. **Business-analysis capability set**
   - Added 21 domain-neutral skills across `business-analysis` (17) and `project-management` (4) covering the discovery → specification flow
   - Introduced a new `discovery` SDLC stage and two new plugins (`product-discovery`, `technical-analysis`); upgraded `requirements-specification` to 14 skills
   - Wired Atlassian MCP + `SessionStart` orchestration hooks into all three BA plugins and added `product-manager` / `business-analyst` persona agents
   - Added eval scenarios for `user-story-authoring`, `requirements-traceability-matrix`, and `backlog-prioritization`

2. **ADR documentation for autonomous-agent architecture**
   - Added under `docs/adrs/001_slim_agent_wrapper/` and `docs/adrs/002_hooked_agent_event_pipeline/`
   - ADR 001 defines a slim Claude Code-based Agent wrapper separated from the infrastructure-specific Worker
   - ADR 002 defines an AWS event pipeline: Jira webhook -> API Gateway -> Lambda -> SQS -> ECS Worker -> Agent

3. **Plugin versioning and release bookkeeping**
   - Added per-plugin `CHANGELOG.md` files
   - Added the `skills/common/plugin-release/` skill for semver bumps and changelog generation
   - Synced version metadata in `.claude-plugin/marketplace.json`
   - Added the root version badge and release-oriented registry updates

These changes mean the repo now serves both as:

- a reusable skills/plugin catalog for Claude Code workflows, and
- a documentation home for the emerging autonomous-agent architecture.

## Editing expectations in this repository

- Prefer updating the registries when adding skills or plugins:
  - `guide/skills-registry.md`
  - `skills/README.md` for skills
  - `plugins/README.md` for plugins
- If you add a new plugin, also update:
  - `plugins/plugin-config.json`
  - `.claude-plugin/marketplace.json`
- Keep plugin README workflow descriptions aligned with any `hooks/hooks.json` prompt hooks
- Do not treat assembled plugin skill copies as source files

## Before you change anything

Read `CLAUDE.md` for the full repository rules. It contains the authoritative conventions for naming, file structure, registry updates, plugin hooks, assembly, validation, and contribution flow.
