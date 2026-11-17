# 📖 Skills & Plugins — Public Registry

This is the master registry of all publicly available skills and plugins, with usage recommendations for each discipline.

> **Project-specific (private) skills** live inside individual project repositories and are not listed here. See [how-to-create-project-skills.md](how-to-create-project-skills.md).

---

## 🎯 Skills

### 🖥️ Development

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| [common-plantuml-diagram](../skills/development/common-plantuml-diagram/README.md) | `skills/development/common-plantuml-diagram/` | Generates PlantUML diagrams as `.puml` + `.svg`; supports sequence, class, ER, state, component, activity, deployment, Gantt, and more | Claude Code, Copilot, Codex | 🧪 beta |
| [react-architecture](../skills/development/react-architecture/README.md) | `skills/development/react-architecture/` | Feature-based React structure (`features/`, `shared/`, `app/`), dependency rules, app shell; TanStack Router, Query, axios | Claude Code, Copilot, Codex | 🧪 beta |
| [react-code-style](../skills/development/react-code-style/README.md) | `skills/development/react-code-style/` | React/TSX conventions: naming, imports, components, hooks, pages, RHF+Zod, Tailwind/shadcn | Claude Code, Copilot, Codex | 🧪 beta |
| [react-typescript](../skills/development/react-typescript/README.md) | `skills/development/react-typescript/` | Strict TypeScript, Zod, unions, API typing for React apps | Claude Code, Copilot, Codex | 🧪 beta |
| [react-configuration](../skills/development/react-configuration/README.md) | `skills/development/react-configuration/` | Typed Vite `appConfig`, env validation, no secrets in frontend | Claude Code, Copilot, Codex | 🧪 beta |
| [react-unit-testing](../skills/development/react-unit-testing/README.md) | `skills/development/react-unit-testing/` | Vitest, Testing Library, jsdom; `tests/` mirrors `src/`; mocks for Router, Query, i18n, API | Claude Code, Copilot, Codex | 🧪 beta |
| [react-scaffold](../skills/development/react-scaffold/README.md) | `skills/development/react-scaffold/` | Greenfield React app bootstrap; reference React template tooling; features/shared architecture | Claude Code, Copilot, Codex | 🧪 beta |
| [react-feature](../skills/development/react-feature/README.md) | `skills/development/react-feature/` | End-to-end feature workflow: Zod, axios, TanStack Query, routes, RHF forms, tests | Claude Code, Copilot, Codex | 🧪 beta |
| [react-api-client](../skills/development/react-api-client/README.md) | `skills/development/react-api-client/` | axios clients, glob interceptors, auth, 401 refresh, ApiError normalization | Claude Code, Copilot, Codex | 🧪 beta |
| [react-data-fetching](../skills/development/react-data-fetching/README.md) | `skills/development/react-data-fetching/` | TanStack Query v5: query keys, hooks, mutations, invalidation, testing | Claude Code, Copilot, Codex | 🧪 beta |
| [common-mermaid-diagram](../skills/development/common-mermaid-diagram/README.md) | `skills/development/common-mermaid-diagram/` | Generates Mermaid flowcharts, sequence, class, ER, state, and C4 diagrams that render in GitHub and VS Code | Claude Code, Copilot, Codex | 🧪 beta |
| [common-ascii-diagram](../skills/development/common-ascii-diagram/README.md) | `skills/development/common-ascii-diagram/` | Generates plain-text ASCII diagrams for terminals, code comments, and non-rendering environments | Claude Code, Copilot, Codex | 🧪 beta |
| [common-clean-code](../skills/development/common-clean-code/README.md) | `skills/development/common-clean-code/` | Clean code principles: SOLID, naming, DRY, complexity reduction, code-smell removal | Claude Code, Copilot, Codex | 🧪 beta |
| [common-hexagonal-architecture](../skills/development/common-hexagonal-architecture/README.md) | `skills/development/common-hexagonal-architecture/` | Language-agnostic hexagonal (ports/adapters) and clean architecture: layering, dependency rule, use-case boundaries | Claude Code, Copilot, Codex | 🧪 beta |
| [security-review](../skills/development/security-review/README.md) | `skills/development/security-review/` | Security scanner that traces data flows and component interactions to find vulnerabilities pattern-matching tools miss | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-architecture](../skills/development/dotnet-architecture/README.md) | `skills/development/dotnet-architecture/` | Clean architecture for .NET 9/10 layered solutions: structure, layer responsibilities, project references | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-architecture-presentation-rest](../skills/development/dotnet-architecture-presentation-rest/README.md) | `skills/development/dotnet-architecture-presentation-rest/` | REST presentation layer: controllers, OpenAPI/Scalar, middleware pipeline, module registration | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-architecture-infrastructure-db](../skills/development/dotnet-architecture-infrastructure-db/README.md) | `skills/development/dotnet-architecture-infrastructure-db/` | Repository, Unit of Work, and data-access conventions for the Infrastructure.Db layer | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-scaffold](../skills/development/dotnet-scaffold/README.md) | `skills/development/dotnet-scaffold/` | Scaffolds new .NET 9/10 clean architecture solutions from scratch | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-feature](../skills/development/dotnet-feature/README.md) | `skills/development/dotnet-feature/` | Adds endpoints, commands, queries, and entities across all layers of an existing .NET solution | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-module-registration](../skills/development/dotnet-module-registration/README.md) | `skills/development/dotnet-module-registration/` | DI wiring across layers via Module extension methods | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-mediatr](../skills/development/dotnet-mediatr/README.md) | `skills/development/dotnet-mediatr/` | MediatR commands, queries, pipeline behaviours, and ASP.NET Core wiring | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-ef-core](../skills/development/dotnet-ef-core/README.md) | `skills/development/dotnet-ef-core/` | EF Core: DbContext, entity configuration, relationships, migrations, querying, performance | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-fluent-validation](../skills/development/dotnet-fluent-validation/README.md) | `skills/development/dotnet-fluent-validation/` | FluentValidation validators, custom and async rules, pipeline wiring | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-error-handling](../skills/development/dotnet-error-handling/README.md) | `skills/development/dotnet-error-handling/` | Error handling with ProblemDetails (RFC 7807), exceptions, and HTTP status mapping | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-configuration](../skills/development/dotnet-configuration/README.md) | `skills/development/dotnet-configuration/` | Options pattern, appsettings, user secrets, and environment variables | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-api-versioning](../skills/development/dotnet-api-versioning/README.md) | `skills/development/dotnet-api-versioning/` | API versioning with Asp.Versioning.Mvc: URL versioning, per-version controllers | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-infrastructure-http](../skills/development/dotnet-infrastructure-http/README.md) | `skills/development/dotnet-infrastructure-http/` | Typed HttpClients for external service integration in Infrastructure.Http | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-unit-testing](../skills/development/dotnet-unit-testing/README.md) | `skills/development/dotnet-unit-testing/` | Unit tests for entities, MediatR handlers or application services, and validators; xUnit v3 + NSubstitute + Shouldly by default, existing stacks respected | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-integration-testing](../skills/development/dotnet-integration-testing/README.md) | `skills/development/dotnet-integration-testing/` | API integration tests with WebApplicationFactory, Testcontainers (PostgreSQL/SQL Server) and Respawn | Claude Code, Copilot, Codex | 🧪 beta |
| [dotnet-code-style](../skills/development/dotnet-code-style/README.md) | `skills/development/dotnet-code-style/` | C# code style and formatting conventions | Claude Code, Copilot, Codex | 🧪 beta |

### 🧪 Quality Assurance

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| | | | | |

### 📝 Business Analysis

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| [user-story-authoring](../skills/business-analysis/user-story-authoring/README.md) | `skills/business-analysis/user-story-authoring/` | Canonical authority for user stories, epics, and Gherkin acceptance criteria with MoSCoW and INVEST | Claude Code, Copilot, Codex | 🧪 beta |
| [requirements-source-ingestion](../skills/business-analysis/requirements-source-ingestion/README.md) | `skills/business-analysis/requirements-source-ingestion/` | Turns existing docs, transcripts, wikis, and PRDs into structured requirements with full source traceability | Claude Code, Copilot, Codex | 🧪 beta |
| [gap-impact-analysis](../skills/business-analysis/gap-impact-analysis/README.md) | `skills/business-analysis/gap-impact-analysis/` | Current-vs-future-state gap analysis and multi-dimensional impact assessment with prioritized remediation | Claude Code, Copilot, Codex | 🧪 beta |
| [requirements-traceability-matrix](../skills/business-analysis/requirements-traceability-matrix/README.md) | `skills/business-analysis/requirements-traceability-matrix/` | Build and maintain an RTM linking objectives→requirements→stories→AC→tests, with coverage and gap analysis | Claude Code, Copilot, Codex | 🧪 beta |
| [data-dictionary-mapping](../skills/business-analysis/data-dictionary-mapping/README.md) | `skills/business-analysis/data-dictionary-mapping/` | Author data dictionaries and source-to-target (S2T) mappings with field catalogue, enums, and transformation rules | Claude Code, Copilot, Codex | 🧪 beta |
| [process-flow-modelling](../skills/business-analysis/process-flow-modelling/README.md) | `skills/business-analysis/process-flow-modelling/` | Interactive HTML process flow / workflow / swimlane visualisations with config-driven nodes and gates | Claude Code, Copilot, Codex | 🧪 beta |
| [stakeholder-raci-mapping](../skills/business-analysis/stakeholder-raci-mapping/README.md) | `skills/business-analysis/stakeholder-raci-mapping/` | Identify and analyze stakeholders; build register, power/interest grid, and RACI matrices | Claude Code, Copilot, Codex | 🧪 beta |
| [stakeholder-communications](../skills/business-analysis/stakeholder-communications/README.md) | `skills/business-analysis/stakeholder-communications/` | Draft audience-tuned stakeholder communications — status, briefs, change requests, escalations, summaries | Claude Code, Copilot, Codex | 🧪 beta |
| [glossary-management](../skills/business-analysis/glossary-management/README.md) | `skills/business-analysis/glossary-management/` | Auto-scan documents for acronyms and domain terms; build and maintain a Markdown project glossary | Claude Code, Copilot, Codex | 🧪 beta |
| [problem-opportunity-brief](../skills/business-analysis/problem-opportunity-brief/README.md) | `skills/business-analysis/problem-opportunity-brief/` | Grills leads into problem briefs, opportunity briefs, and discovery questions, one question at a time | Claude Code, Copilot, Codex | 🧪 beta |
| [product-discovery-radar](../skills/business-analysis/product-discovery-radar/README.md) | `skills/business-analysis/product-discovery-radar/` | Run a product-discovery radar over lanes; signals→candidates→briefs via a human review gate (+ optional scaffold) | Claude Code, Copilot, Codex | 🧪 beta |
| [requirements-grilling](../skills/business-analysis/requirements-grilling/README.md) | `skills/business-analysis/requirements-grilling/` | One-question-at-a-time interrogation that sharpens any artifact, in code-aware or docs-only mode | Claude Code, Copilot, Codex | 🧪 beta |
| [prd-authoring](../skills/business-analysis/prd-authoring/README.md) | `skills/business-analysis/prd-authoring/` | Synthesizes a PRD from existing context — the project's single canonical requirements document | Claude Code, Copilot, Codex | 🧪 beta |
| [issue-decomposition](../skills/business-analysis/issue-decomposition/README.md) | `skills/business-analysis/issue-decomposition/` | Breaks approved scope into independently verifiable vertical-slice tracker issues with AFK/HITL and an approval gate | Claude Code, Copilot, Codex | 🧪 beta |
| [confluence-to-jira-stories](../skills/business-analysis/confluence-to-jira-stories/README.md) | `skills/business-analysis/confluence-to-jira-stories/` | Turn Confluence requirements into Jira stories, then break approved stories into tasks after sign-off | Claude Code, Copilot, Codex | 🧪 beta |
| [development-assessment](../skills/business-analysis/development-assessment/README.md) | `skills/business-analysis/development-assessment/` | Codebase-first feasibility and impact assessment that routes decisions before escalating to developers | Claude Code, Copilot, Codex | 🧪 beta |
| [frontend-ticket-writing](../skills/business-analysis/frontend-ticket-writing/README.md) | `skills/business-analysis/frontend-ticket-writing/` | Write implementation-ready frontend tickets with accessibility as testable WCAG 2.2 AA acceptance criteria | Claude Code, Copilot, Codex | 🧪 beta |

### 📅 Project Management

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| [backlog-prioritization](../skills/project-management/backlog-prioritization/README.md) | `skills/project-management/backlog-prioritization/` | Ranks a backlog with RICE, ICE, value/effort, MoSCoW, or WSJF into a defensible ordering | Claude Code, Copilot, Codex | 🧪 beta |
| [estimation-support](../skills/project-management/estimation-support/README.md) | `skills/project-management/estimation-support/` | Sizes stories and epics with points, T-shirt sizes, and a complexity indicator for the team | Claude Code, Copilot, Codex | 🧪 beta |
| [sprint-planning](../skills/project-management/sprint-planning/README.md) | `skills/project-management/sprint-planning/` | Run sprint planning: set goal, check DoR/DoD, compute capacity, commit dependency-ordered work | Claude Code, Copilot, Codex | 🧪 beta |
| [sprint-progress-reporting](../skills/project-management/sprint-progress-reporting/README.md) | `skills/project-management/sprint-progress-reporting/` | Recurring cadence-based sprint progress updates that diff tracker/code state against a saved snapshot baseline | Claude Code, Copilot, Codex | 🧪 beta |

### 👥 People Management

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| | | | | |

### 🎨 Design

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| | | | | |

### ⚙️ DevOps

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| [azure-devops-cli](../skills/devops/azure-devops-cli/SKILL.md) | `skills/devops/azure-devops-cli/` | Manage Azure DevOps projects, repos, pipelines, builds, PRs, work items, and service endpoints via the `az devops` CLI | Claude Code, Copilot, Codex | 🧪 beta |
| [azure-resource-health-diagnose](../skills/devops/azure-resource-health-diagnose/SKILL.md) | `skills/devops/azure-resource-health-diagnose/` | Analyzes Azure resource health from logs and telemetry and produces a remediation plan | Claude Code, Copilot, Codex | 🧪 beta |
| [azure-resource-visualizer](../skills/devops/azure-resource-visualizer/SKILL.md) | `skills/devops/azure-resource-visualizer/` | Generates Mermaid architecture diagrams of Azure resource groups and resource relationships | Claude Code, Copilot, Codex | 🧪 beta |
| [devops-rollout-plan](../skills/devops/devops-rollout-plan/SKILL.md) | `skills/devops/devops-rollout-plan/` | Rollout plans with preflight checks, deployment steps, verification signals, rollback, and comms | Claude Code, Copilot, Codex | 🧪 beta |

### 🔗 Common

| Skill | Path | Description | Tools | Status |
|-------|------|-------------|-------|--------|
| [common-adr-authoring](../skills/common/common-adr-authoring/README.md) | `skills/common/common-adr-authoring/` | Drafts, refines, reviews, and organizes Architecture Decision Records using a consistent decision-focused structure | Claude Code, Copilot, Codex | 🧪 beta |
| [docx-to-md](../skills/common/docx-to-md/README.md) | `skills/common/docx-to-md/` | Converts `.docx` files to clean, structured Markdown with auto-numbered headings, TOC, tables, and fenced code blocks | Claude Code | 🧪 beta |
| [plugin-create](../skills/common/plugin-create/README.md) | `skills/common/plugin-create/` | Scaffolds a new plugin by selecting library skills for a team role or workflow description; writes SKILL.md, README.md, and updates both registry files | Claude Code | 🧪 beta |
| [plugin-release](../skills/common/plugin-release/README.md) | `skills/common/plugin-release/` | Bumps a plugin version, generates a CHANGELOG.md entry from git history, and syncs marketplace.json | Claude Code | 🧪 beta |
| [git-commit](../skills/common/git-commit/SKILL.md) | `skills/common/git-commit/` | Stages changes and creates a git commit with an AI-generated commit message; bundled in every plugin | Claude Code | 🧪 beta |
| [skill-create](../skills/common/skill-create/SKILL.md) | `skills/common/skill-create/` | Creates new agent skills with proper structure, progressive disclosure, and bundled resources | Claude Code | 🧪 beta |

---

## 🔌 Plugins

### 🖥️ Development

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| [implementation-react](../plugins/implementation-react/README.md) | `plugins/implementation-react/` | react-architecture, react-code-style, react-typescript, react-configuration, react-api-client, react-data-fetching, react-unit-testing, react-scaffold, react-feature, git-commit | Full React + Vite workflow; reference React template stack | 🧪 beta |
| [technical-planning](../plugins/technical-planning/README.md) | `plugins/technical-planning/` | common-ascii/mermaid/plantuml-diagram, dotnet-architecture, dotnet-architecture-infrastructure-db, dotnet-architecture-presentation-rest, common-hexagonal-architecture, git-commit | Spec → architecture documents, component diagrams, and a task breakdown ready for implementation | 🧪 beta |
| [implementation-dotnet](../plugins/implementation-dotnet/README.md) | `plugins/implementation-dotnet/` | dotnet-architecture, dotnet-architecture-infrastructure-db, dotnet-architecture-presentation-rest, common-hexagonal-architecture, dotnet-scaffold, dotnet-feature, dotnet-module-registration, dotnet-mediatr, dotnet-ef-core, dotnet-fluent-validation, dotnet-error-handling, dotnet-configuration, dotnet-api-versioning, dotnet-infrastructure-http, dotnet-unit-testing, dotnet-integration-testing, dotnet-code-style, common-clean-code, git-commit | Scaffolds, implements and tests .NET backend features with clean architecture (MediatR or application services) and EF Core on a feature branch | 🧪 beta |
| [code-review](../plugins/code-review/README.md) | `plugins/code-review/` | dotnet-code-style, common-clean-code, security-review, git-commit | Reviews diffs for style, clean code, and security; produces a structured review report | 🧪 beta |

### 🧪 Quality Assurance

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| [qa-testing](../plugins/qa-testing/README.md) | `plugins/qa-testing/` | git-commit | Test generation, bug triage, and test planning for QA automation engineers; QA skills not yet authored | 🚧 wip |

### 📝 Business Analysis

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| [product-discovery](../plugins/product-discovery/README.md) | `plugins/product-discovery/` | problem-opportunity-brief, product-discovery-radar, requirements-grilling, prd-authoring, backlog-prioritization, git-commit | Product discovery & shaping: fuzzy idea/signal → problem & opportunity briefs, PRD, prioritized scope (ships a `product-manager` persona agent) | 🧪 beta |
| [requirements-specification](../plugins/requirements-specification/README.md) | `plugins/requirements-specification/` | requirements-source-ingestion, user-story-authoring, prd-authoring, requirements-grilling, gap-impact-analysis, requirements-traceability-matrix, process-flow-modelling, issue-decomposition, confluence-to-jira-stories, docx-to-md, common-ascii/mermaid/plantuml-diagram, git-commit | Inputs → structured spec: user stories, acceptance criteria, traceability, diagrams, issue breakdown (ships a `business-analyst` persona agent) | 🧪 beta |
| [technical-analysis](../plugins/technical-analysis/README.md) | `plugins/technical-analysis/` | development-assessment, requirements-grilling, data-dictionary-mapping, frontend-ticket-writing, common-plantuml-diagram, git-commit | Code-grounded feasibility & impact assessment, data mapping, and accessible frontend tickets | 🧪 beta |

### 📅 Project Management

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| | | | | |

### 👥 People Management

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| | | | | |

### 🎨 Design

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| | | | | |

### ⚙️ DevOps

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| [release-deployment](../plugins/release-deployment/README.md) | `plugins/release-deployment/` | azure-devops-cli, devops-rollout-plan, azure-resource-health-diagnose, azure-resource-visualizer, git-commit | CI/CD operations, Azure resource management, rollout planning, and infrastructure diagnostics | 🧪 beta |

### 🔗 Common

| Plugin | Path | Skills Bundled | Description | Status |
|--------|------|---------------|-------------|--------|
| [project-onboarding](../plugins/project-onboarding/README.md) | `plugins/project-onboarding/` | `repository-knowledge` | Generates focused onboarding documentation from code, configuration, docs, and configured external context | 🧪 beta |

---

## ✅ Usage Recommendations

### When to use Skills vs Plugins

| Scenario | Recommendation |
|----------|----------------|
| Single focused task (write tests, review code) | Use a **skill** |
| End-to-end workflow (full feature delivery, sprint kickoff) | Use a **plugin** |
| Exploring a new tool or practice | Start with a **common skill** |
| Team onboarding | Use a **plugin** that bundles multiple disciplines |

### Discipline pairing recommendations

| Primary discipline | Pair with |
|-------------------|-----------|
| Development | quality-assurance, devops, common |
| QA | development, business-analysis |
| Business Analysis | project-management, development |
| Project Management | team-development, business-analysis |
| DevOps | development, common |
| Design | development, quality-assurance |

---

## 🏷️ Status Legend

| Status | Meaning |
|--------|---------|
| ✅ stable | Production-ready, maintained |
| 🧪 beta | Works but may change |
| 🚧 wip | Work in progress, not ready for general use |
| ⚠️ deprecated | Will be removed; prefer the replacement listed in its README |
