# SDLC Plugins — Skills, Bundles, and the Claude Marketplace

This document describes how this library structures AI-agentic capabilities across the software delivery lifecycle: starting from a curated library of skills, assembling them into SDLC-phase plugins, and distributing those plugins through the Claude Marketplace.

---

## Skills — The AI-Agentic Baseline

The foundation of the agent suite is the **[`skills/`](../skills/README.md)** library — a curated collection of single-responsibility agent instruction sets, organised by discipline:

| Discipline | Coverage |
|------------|----------|
| `development` | Coding, architecture, APIs, code style |
| `quality-assurance` | Testing, test generation, bug triage |
| `business-analysis` | Requirements, user stories, acceptance criteria |
| `project-management` | Planning, estimation, retrospectives, status |
| `team-development` | 1-on-1s, feedback, career development |
| `design-and-ux` | UX/UI review, accessibility, design systems |
| `devops` | CI/CD, infrastructure-as-code, monitoring, deployments |
| `common` | Cross-cutting capabilities reusable across all disciplines |

Each skill is an independently installable, versioned instruction set following the [agentskills.io](https://agentskills.io) open standard. Skills can be used standalone in any project or composed into plugins. They represent the **competency baseline** — the authoritative source of what the agent knows about a given discipline.

See the [full Skills Registry](skills-registry.md) for the complete catalogue.

---

## Plugins — SDLC-Phase Bundles

**Plugins** are the consumption layer. Each plugin packages the skills relevant to a specific delivery stage and team role into a single installable unit — ready to load into Claude Code without additional setup.

Plugins assemble skills from the `skills/` library (and may include plugin-local skills not shared anywhere else). The assembly is defined in [`plugins/plugin-config.json`](../plugins/plugin-config.json) and driven by `scripts/assemble-plugins.js`.

This separation means:
- Skills evolve independently and stay discipline-coherent
- Plugins stay stage-coherent — bundling only what a given role needs in a given phase
- Updates to a shared skill propagate to every plugin that uses it on the next assembly run

### SDLC Phases Covered

| Stage | Plugin | Primary Users | What It Does | Status |
|-------|--------|---------------|--------------|--------|
| **Onboarding** | [`project-onboarding`](../plugins/project-onboarding/README.md) | New joiners, reviewers, AI agents | Analyses a repository's code, configuration, and connected context sources (Jira, Confluence) to generate a focused knowledge pack that grounds both humans and AI agents in the project | 🚧 In Progress |
| **Discovery** | [`product-discovery`](../plugins/product-discovery/README.md) | Product Manager, Product Owner | Turns fuzzy ideas and signals into problem & opportunity briefs, a PRD, and a prioritized, spec-ready scope; ships a `product-manager` persona agent | ✅ Ready |
| **Specification** | [`requirements-specification`](../plugins/requirements-specification/README.md) | Business Analyst, Product Owner, Technical Analyst | Converts raw inputs — Word documents, Jira issues, stakeholder notes — into structured specifications with acceptance criteria, user stories, traceability, and supporting diagrams; ships a `business-analyst` persona agent | ✅ Ready |
| **Specification** | [`technical-analysis`](../plugins/technical-analysis/README.md) | Technical Analyst | Code-grounded feasibility and impact assessment, data dictionary / source-to-target mapping, and implementation-ready frontend tickets | ✅ Ready |
| **Planning** | [`technical-planning`](../plugins/technical-planning/README.md) | Tech Lead, Architect | Translates a specification into architecture documents, component and sequence diagrams, and a task breakdown ready for sprint planning | 🚧 In Progress |
| **Implementation — .NET** | [`implementation-dotnet`](../plugins/implementation-dotnet/README.md) | .NET Developers | Scaffolds and implements backend features following clean architecture, MediatR, EF Core, and Fluent Validation conventions on a feature branch | ✅ Ready |
| **Implementation — React** | [`implementation-react`](../plugins/implementation-react/README.md) | React / Frontend Developers | Full React + TypeScript + Vite skill stack: architecture, code style, API clients, data fetching, unit testing, scaffolding, and feature delivery — with a `SessionStart` hook that automatically enforces cross-skill workflow rules | ✅ Ready |
| **Code Review** | [`code-review`](../plugins/code-review/README.md) | Senior Engineers, Reviewers | Reviews code diffs against style guides, clean-code principles, and a security checklist; produces a structured review report with actionable findings | 🚧 In Progress |
| **Testing** | [`qa-testing`](../plugins/qa-testing/README.md) | QA Automation Engineers | Dedicated QA skills for test generation, bug triage, and test planning — plugin is registered and installable; dedicated skills are being authored as separate work items | 🚧 In Progress |
| **Release & Deployment** | [`release-deployment`](../plugins/release-deployment/README.md) | DevOps Engineers | CI/CD pipeline operations, Azure resource management, rollout planning, and infrastructure health diagnostics | 🚧 In Progress |

---

## Plugin Extensibility

A plugin is more than a bundle of skills. The [Claude Code plugin system](https://code.claude.com/docs/en/plugins-reference) supports the following components, all of which can be combined in a single plugin:

| Component | Location | Purpose |
|-----------|----------|---------|
| Skills | `skills/<name>/SKILL.md` | Agent instruction sets invoked via `/<plugin>:<skill>` |
| Agent commands | `commands/` | Markdown-based user-invokable commands |
| Subagents | `agents/` | Specialised agents with their own system prompt, tool restrictions, and model |
| Event hooks | `hooks/hooks.json` | Handlers for Claude Code lifecycle events (e.g. `SessionStart`, `PostToolUse`) — used in this repo to inject cross-skill workflow rules automatically |
| MCP servers | `.mcp.json` | Connections to external tools and data sources via the [Model Context Protocol](https://code.claude.com/docs/en/mcp) — e.g. Jira, Confluence, GitHub, Figma |
| LSP servers | `.lsp.json` | Language server connections for real-time code intelligence (jump-to-definition, type errors after every edit) |
| Background monitors | `monitors/monitors.json` | Processes that watch logs, files, or external state and stream events into the session |
| Default settings | `settings.json` | Plugin-level defaults applied on activation (e.g. activating a custom agent as the main thread) |
| Executables | `bin/` | Binaries added to `PATH` while the plugin is active |
| Plugin manifest | `.claude-plugin/plugin.json` | Identity metadata: `name`, `version`, `description`, `author`, `keywords` |

For complete specifications of each component, see the [Plugins reference](https://code.claude.com/docs/en/plugins-reference).

### Hooks in this repository

The `implementation-react` plugin uses a `SessionStart` prompt hook (`hooks/hooks.json`) to inject cross-skill orchestration rules the moment a session opens — skill load order, scenario branching (new project vs. add feature vs. tests only), and known gotchas. This ensures Claude follows the correct workflow without requiring the user to invoke a setup command.

Rules specific to a single skill stay in that skill's `SKILL.md`. The hook is reserved for orchestration logic that spans multiple skills.

See [`how-to-add-plugin-hooks.md`](../skills/common/plugin-create/references/how-to-add-plugin-hooks.md) for a walkthrough.

---

## Installing from the Claude Marketplace

All plugins are published through a Claude Marketplace catalog hosted in this repository. The marketplace manifest is at [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json).

For background on how marketplaces work, see [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins) and [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).

### Step 1 — Add the marketplace (one time per machine)

From within a Claude Code session:

```shell
/plugin marketplace add <github-owner>/awesome-agents
```

Replace `<github-owner>` with the GitHub user or organization that hosts your copy of this repository. This registers the `awesome-agents` catalog. No plugins are installed yet.

### Step 2 — Install a plugin for your role

```shell
# Onboarding — anyone new to a project
/plugin install project-onboarding@awesome-agents

# Discovery — Product Manager / Product Owner
/plugin install product-discovery@awesome-agents

# Specification — Business Analyst / Product Owner / Technical Analyst
/plugin install requirements-specification@awesome-agents

# Technical Analysis — Technical Analyst
/plugin install technical-analysis@awesome-agents

# Planning — Tech Lead / Architect
/plugin install technical-planning@awesome-agents

# Implementation — .NET Developer
/plugin install implementation-dotnet@awesome-agents

# Implementation — React / Frontend Developer
/plugin install implementation-react@awesome-agents

# Code Review — Senior Engineer / Reviewer
/plugin install code-review@awesome-agents

# QA — Automation Engineer
/plugin install qa-testing@awesome-agents

# Deployment — DevOps Engineer
/plugin install release-deployment@awesome-agents
```

Plugins install to user scope by default (`~/.claude/plugins/`), making them available across all projects. To install at project scope (shared with all repo collaborators), use the interactive UI: run `/plugin`, open the **Discover** tab, select a plugin, and choose **Project scope**.

### Step 3 — Activate in a session

Navigate to your project root and start Claude Code with the plugin:

```bash
cd <your-project-root>
claude --plugin implementation-react
```

Skills are available as `/<plugin-name>:<skill-name>` commands:

```shell
/implementation-react:react-scaffold
/implementation-react:react-feature
/code-review:security-review
```

### Step 4 — Keep plugins up to date

```shell
# Update all installed plugins
/plugin marketplace update awesome-agents

# Or update all marketplaces and plugins at once
claude plugin update --all
```

### Alternative — Load directly from the repository (development / evaluation)

If you have the repository cloned locally, load a plugin without marketplace registration using `--plugin-dir`:

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/implementation-react
```

This is the recommended approach when evaluating unreleased changes or contributing to the repo. Node.js is not required for end users loading pre-assembled plugins this way.

---

## References

| Resource | URL |
|----------|-----|
| Claude Code — Plugins overview | https://code.claude.com/docs/en/plugins |
| Claude Code — Plugins reference (full technical spec) | https://code.claude.com/docs/en/plugins-reference |
| Claude Code — Discover and install plugins | https://code.claude.com/docs/en/discover-plugins |
| Claude Code — Plugin marketplaces | https://code.claude.com/docs/en/plugin-marketplaces |
| agentskills.io — Skill format standard | https://agentskills.io |
| Skills Registry | [skills-registry.md](skills-registry.md) |
| Plugins Registry | [../plugins/README.md](../plugins/README.md) |
| Plugin Design Guidelines | [../skills/common/plugin-create/references/design-guidelines.md](../skills/common/plugin-create/references/design-guidelines.md) |
| How to add plugin hooks | [../skills/common/plugin-create/references/how-to-add-plugin-hooks.md](../skills/common/plugin-create/references/how-to-add-plugin-hooks.md) |
