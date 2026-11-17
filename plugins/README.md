# Plugins

Plugins are **SDLC-stage bundles** — each packages the skills needed by a specific agent or
team role at one stage of the pipeline. Skills remain discipline-organised under `skills/`
(authoring layer); plugins are the consumption layer that assembles them.

---

## Pipeline stages

| Plugin | Stage | Purpose | Recommended for |
|--------|-------|---------|-----------------|
| [project-onboarding](project-onboarding/README.md) | onboarding | Generate repository/project knowledge pack to ground agents + new joiners | Anyone new to a project |
| [product-discovery](product-discovery/README.md) | discovery | Fuzzy idea/signal → problem & opportunity briefs, PRD, prioritized scope | Product Manager, Product Owner |
| [requirements-specification](requirements-specification/README.md) | spec | Issue/Jira/docs → structured spec, user stories, acceptance criteria, traceability, diagrams | Business Analyst, Product Owner, Technical Analyst |
| [technical-analysis](technical-analysis/README.md) | spec | Code-grounded feasibility, data mapping, frontend tickets | Technical Analyst |
| [technical-planning](technical-planning/README.md) | planning | Spec → architecture, task breakdown, diagrams | Tech Lead, Architect |
| [implementation-dotnet](implementation-dotnet/README.md) | implementation | Implement backend features on a feature branch | .NET Developer |
| [implementation-react](implementation-react/README.md) | implementation | Full React + Vite stack: architecture, style, TypeScript, config, API clients, data fetching, testing, scaffold, and feature delivery | React Developer |
| [code-review](code-review/README.md) | review | Review diffs — style, clean code, security | Reviewer, Senior Engineer |
| [qa-testing](qa-testing/README.md) | testing | Test generation, bug triage, test planning | QA Automation Engineer |
| [release-deployment](release-deployment/README.md) | deploy | CI/CD, rollout planning, infra diagnostics | DevOps Engineer |

---

## Skill × plugin matrix

`X` = skill is bundled in that plugin. *(local)* = plugin-local skill authored inside the plugin,
not assembled from `skills/`. All other `X` entries are assembled from `skills/<discipline>/`
at build time — see [`plugin-config.json`](plugin-config.json).

Columns: `onboard` = project-onboarding · `disc` = product-discovery · `req-spec` = requirements-specification
· `tech-an` = technical-analysis · `tech-plan` = technical-planning · `impl-net` = implementation-dotnet
· `impl-rx` = implementation-react · `review` = code-review · `qa` = qa-testing · `deploy` = release-deployment.

| Skill | onboard | disc | req-spec | tech-an | tech-plan | impl-net | impl-rx | review | qa | deploy |
|-------|:-------:|:----:|:--------:|:-------:|:---------:|:--------:|:-------:|:------:|:--:|:------:|
| `repository-knowledge` *(local)* | X | | | | | | | | | |
| `common/docx-to-md` | X | | X | | | | | | | |
| `development/common-ascii-diagram` | X | | X | | X | | | | | |
| `development/common-mermaid-diagram` | X | | X | | X | | | | | |
| `development/common-plantuml-diagram` | X | | X | X | X | | | | | |
| `business-analysis/problem-opportunity-brief` | | X | | | | | | | | |
| `business-analysis/product-discovery-radar` | | X | | | | | | | | |
| `business-analysis/prd-authoring` | | X | X | | | | | | | |
| `business-analysis/requirements-grilling` | | X | X | X | | | | | | |
| `project-management/backlog-prioritization` | | X | | | | | | | | |
| `business-analysis/requirements-source-ingestion` | | | X | | | | | | | |
| `business-analysis/user-story-authoring` | | | X | | | | | | | |
| `business-analysis/gap-impact-analysis` | | | X | | | | | | | |
| `business-analysis/requirements-traceability-matrix` | | | X | | | | | | | |
| `business-analysis/process-flow-modelling` | | | X | | | | | | | |
| `business-analysis/issue-decomposition` | | | X | | | | | | | |
| `business-analysis/confluence-to-jira-stories` | | | X | | | | | | | |
| `business-analysis/development-assessment` | | | | X | | | | | | |
| `business-analysis/data-dictionary-mapping` | | | | X | | | | | | |
| `business-analysis/frontend-ticket-writing` | | | | X | | | | | | |
| `development/dotnet-architecture` | | | | | X | X | | | | |
| `development/dotnet-architecture-infrastructure-db` | | | | | X | X | | | | |
| `development/dotnet-architecture-presentation-rest` | | | | | X | X | | | | |
| `development/common-hexagonal-architecture` | | | | | X | X | | | | |
| `development/dotnet-scaffold` | | | | | | X | | | | |
| `development/dotnet-feature` | | | | | | X | | | | |
| `development/dotnet-module-registration` | | | | | | X | | | | |
| `development/dotnet-mediatr` | | | | | | X | | | | |
| `development/dotnet-ef-core` | | | | | | X | | | | |
| `development/dotnet-fluent-validation` | | | | | | X | | | | |
| `development/dotnet-error-handling` | | | | | | X | | | | |
| `development/dotnet-configuration` | | | | | | X | | | | |
| `development/dotnet-api-versioning` | | | | | | X | | | | |
| `development/dotnet-infrastructure-http` | | | | | | X | | | | |
| `development/dotnet-code-style` | | | | | | X | | X | | |
| `development/common-clean-code` | | | | | | X | | X | | |
| `development/react-architecture` | | | | | | | X | | | |
| `development/react-code-style` | | | | | | | X | | | |
| `development/react-typescript` | | | | | | | X | | | |
| `development/react-configuration` | | | | | | | X | | | |
| `development/react-api-client` | | | | | | | X | | | |
| `development/react-data-fetching` | | | | | | | X | | | |
| `development/react-unit-testing` | | | | | | | X | | | |
| `development/react-scaffold` | | | | | | | X | | | |
| `development/react-feature` | | | | | | | X | | | |
| `development/security-review` | | | | | | | | X | | |
| `common/git-commit` | X | X | X | X | X | X | X | X | X | X |
| `devops/azure-devops-cli` | | | | | | | | | | X |
| `devops/devops-rollout-plan` | | | | | | | | | | X |
| `devops/azure-resource-health-diagnose` | | | | | | | | | | X |
| `devops/azure-resource-visualizer` | | | | | | | | | | X |

> **Coverage gaps (known):** `qa-testing` has no dedicated skills authored yet — it remains a thin
> bundle (git-commit only) until QA skills are created as separate tickets.

---

## plugin-config.json

[`plugin-config.json`](plugin-config.json) is the machine-readable source of truth for the
matrix above. It defines every plugin with its stage, purpose, recommended roles, and the
assembly source for each skill:

- `"source": "assembly"` — copied from `skills/<from>/` at build time
- `"source": "local"` — authored inside the plugin; not in the main `skills/` tree

The schema is validated by [`plugin-config.schema.json`](plugin-config.schema.json).

**When modifying the matrix**, update `plugin-config.json` first — then regenerate assembled
`skills/` directories via the build script. Do not hand-edit assembled skill copies inside plugins.

---

## Folder convention

Plugins live at the **flat** path `plugins/<plugin-name>/` — no discipline subdirectory.

```
plugins/<plugin-name>/
├── .claude-plugin/
│   └── plugin.json              ← required: Claude Code manifest; `name` must match folder
├── commands/                    ← optional: slash commands for user interaction
├── agents/                      ← optional: specialized agents
├── skills/
│   └── <skill-name>/
│       └── SKILL.md             ← one per bundled skill, agentskills.io format
├── hooks/
│   └── hooks.json               ← optional: event handlers (SessionStart+prompt for workflow rules)
├── .mcp.json                    ← optional: external tool / MCP server configuration
├── README.md                    ← required: Description · Bundled Skills · Usage · Requirements
├── references/                  ← optional: shared reference docs (≤100 lines each)
└── assets/                      ← optional: templates, schemas, examples
```

No root `SKILL.md`. All skills live under `skills/<skill-name>/SKILL.md`.

---

## Install a plugin

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/<plugin-name>
```

Start Claude Code from the **target repository root**. Skills become available as
`/<plugin-name>:<skill-name>` commands.

See the full [Installation Guide](../guide/how-to-install-skill.md).
