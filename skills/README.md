# 🎯 Skills Registry

Skills are self-contained agent instruction sets — a folder with a prompt file and optional supporting assets (examples, templates, context files). Each skill teaches an AI agent how to perform a specific task.

---

## 📋 Registry

### 🖥️ Development
> Path: `skills/development/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| [common-plantuml-diagram](development/common-plantuml-diagram/README.md) | Generates PlantUML diagrams (sequence, class, ER, state, component, Gantt, and more) as `.puml` source with rendered `.svg` | Technical documentation, architecture diagrams, sprint planning |
| [common-mermaid-diagram](development/common-mermaid-diagram/README.md) | Generates Mermaid flowcharts, sequence, class, ER, state, and C4 diagrams that render in GitHub and VS Code | Docs and READMEs rendered on GitHub |
| [common-ascii-diagram](development/common-ascii-diagram/README.md) | Generates plain-text ASCII diagrams for terminals, code comments, and non-rendering environments | Code comments, plain-text docs |
| [common-clean-code](development/common-clean-code/README.md) | Clean code principles: SOLID, naming, DRY, complexity reduction, code-smell removal | Refactoring and code review |
| [common-hexagonal-architecture](development/common-hexagonal-architecture/README.md) | Language-agnostic hexagonal (ports/adapters) and clean architecture: layering, dependency rule, use-case boundaries | System design, architecture reviews |
| [security-review](development/security-review/README.md) | Security scanner that traces data flows and component interactions to find vulnerabilities pattern-matching tools miss | Security review of codebases and diffs |
| [dotnet-architecture](development/dotnet-architecture/README.md) | Clean architecture for .NET 9/10 layered solutions: structure, layer responsibilities, project references | .NET solution design, "where does this code go" |
| [dotnet-architecture-presentation-rest](development/dotnet-architecture-presentation-rest/README.md) | REST presentation layer: controllers, OpenAPI/Scalar, middleware pipeline, module registration | .NET API layer work |
| [dotnet-architecture-infrastructure-db](development/dotnet-architecture-infrastructure-db/README.md) | Repository, Unit of Work, and data-access conventions for the Infrastructure.Db layer | .NET persistence layer |
| [dotnet-scaffold](development/dotnet-scaffold/README.md) | Scaffolds new .NET 9/10 clean architecture solutions from scratch | New .NET projects |
| [dotnet-feature](development/dotnet-feature/README.md) | Adds endpoints, commands, queries, and entities across all layers of an existing .NET solution | New .NET features |
| [dotnet-module-registration](development/dotnet-module-registration/README.md) | DI wiring across layers via Module extension methods | .NET dependency injection setup |
| [dotnet-mediatr](development/dotnet-mediatr/README.md) | MediatR commands, queries, pipeline behaviours, and ASP.NET Core wiring | CQRS in .NET |
| [dotnet-ef-core](development/dotnet-ef-core/README.md) | EF Core: DbContext, entity configuration, relationships, migrations, querying, performance | .NET data access |
| [dotnet-fluent-validation](development/dotnet-fluent-validation/README.md) | FluentValidation validators, custom and async rules, pipeline wiring | .NET input validation |
| [dotnet-error-handling](development/dotnet-error-handling/README.md) | Error handling with ProblemDetails (RFC 7807), exceptions, and HTTP status mapping | .NET API error responses |
| [dotnet-configuration](development/dotnet-configuration/README.md) | Options pattern, appsettings, user secrets, and environment variables | .NET configuration |
| [dotnet-api-versioning](development/dotnet-api-versioning/README.md) | API versioning with Asp.Versioning.Mvc: URL versioning, per-version controllers | Multi-version .NET APIs |
| [dotnet-infrastructure-http](development/dotnet-infrastructure-http/README.md) | Typed HttpClients for external service integration in Infrastructure.Http | .NET external API integration |
| [dotnet-code-style](development/dotnet-code-style/README.md) | C# code style and formatting conventions | .NET implementation and code review |
| [react-architecture](development/react-architecture/README.md) | Feature-based React layout (`features/`, `shared/`, `app/`), dependency rules, TanStack Router/Query boundaries | New React apps, structure reviews |
| [react-code-style](development/react-code-style/README.md) | React/TSX naming, imports, components, hooks, forms, Tailwind/shadcn conventions | React implementation and code review |
| [react-typescript](development/react-typescript/README.md) | Strict TypeScript, Zod validation, discriminated unions | Typing React and API code |
| [react-configuration](development/react-configuration/README.md) | Centralized Vite `appConfig` and env validation | Environment and feature flags |
| [react-api-client](development/react-api-client/README.md) | axios clients, interceptors, auth, ApiError normalization | HTTP layer setup |
| [react-data-fetching](development/react-data-fetching/README.md) | TanStack Query v5: keys, hooks, mutations, cache | Server state in features |
| [react-unit-testing](development/react-unit-testing/README.md) | Vitest + Testing Library; `tests/` mirrors `src/` (reference React template) | Unit and component tests |
| [react-scaffold](development/react-scaffold/README.md) | Greenfield bootstrap; reference React template tooling + features/shared | New React projects |
| [react-feature](development/react-feature/README.md) | Add features: types, API, Query hooks, pages, routes, tests | New pages and workflows |

**Recommendations:** Use development skills early in a feature branch for code generation, review, and refactoring. Pair with QA skills for best coverage.

---

### 🧪 Quality Assurance
> Path: `skills/quality-assurance/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| _(add skills here)_ | | |

**Recommendations:** Run QA skills after implementation is complete. Combine test-generation skills with bug-triage skills in CI pipelines.

---

### 📝 Business Analysis
> Path: `skills/business-analysis/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| [user-story-authoring](business-analysis/user-story-authoring/README.md) | Canonical authority for user stories, epics, and Gherkin acceptance criteria with MoSCoW and INVEST | Backlog refinement, story writing, acceptance criteria |
| [requirements-source-ingestion](business-analysis/requirements-source-ingestion/README.md) | Turns existing docs, transcripts, wikis, and PRDs into structured requirements with full source traceability | Building requirements from existing source materials |
| [gap-impact-analysis](business-analysis/gap-impact-analysis/README.md) | Current-vs-future-state gap analysis and multi-dimensional impact assessment with prioritized remediation | As-is/to-be gap and change-impact analysis |
| [requirements-traceability-matrix](business-analysis/requirements-traceability-matrix/README.md) | Build and maintain an RTM linking objectives→requirements→stories→AC→tests, with coverage and gap analysis | Tracing requirements to tests, coverage tracking |
| [data-dictionary-mapping](business-analysis/data-dictionary-mapping/README.md) | Author data dictionaries and source-to-target (S2T) mappings with field catalogue, enums, and transformation rules | Defining data elements and S2T mappings |
| [process-flow-modelling](business-analysis/process-flow-modelling/README.md) | Interactive HTML process flow / workflow / swimlane visualisations with config-driven nodes and gates | As-is/to-be process and workflow modelling |
| [stakeholder-raci-mapping](business-analysis/stakeholder-raci-mapping/README.md) | Identify and analyze stakeholders; build register, power/interest grid, and RACI matrices | Stakeholder analysis, responsibility mapping |
| [stakeholder-communications](business-analysis/stakeholder-communications/README.md) | Draft audience-tuned stakeholder communications — status, briefs, change requests, escalations, summaries | Status updates, steering briefs, change requests |
| [glossary-management](business-analysis/glossary-management/README.md) | Auto-scan documents for acronyms and domain terms; build and maintain a Markdown project glossary | Terminology consistency across deliverables |
| [problem-opportunity-brief](business-analysis/problem-opportunity-brief/README.md) | Grills leads into problem briefs, opportunity briefs, and discovery questions, one question at a time | Discovery and idea shaping |
| [product-discovery-radar](business-analysis/product-discovery-radar/README.md) | Run a product-discovery radar over lanes; signals→candidates→briefs via a human review gate (+ optional scaffold) | Product discovery, opportunity scanning |
| [requirements-grilling](business-analysis/requirements-grilling/README.md) | One-question-at-a-time interrogation that sharpens any artifact, in code-aware or docs-only mode | Pressure-testing plans, requirements, PRDs |
| [prd-authoring](business-analysis/prd-authoring/README.md) | Synthesizes a PRD from existing context — the project's single canonical requirements document | Turning notes/briefs into a feature PRD |
| [issue-decomposition](business-analysis/issue-decomposition/README.md) | Breaks approved scope into independently verifiable vertical-slice tracker issues with AFK/HITL and an approval gate | Decomposing PRDs/plans into backlog issues |
| [confluence-to-jira-stories](business-analysis/confluence-to-jira-stories/README.md) | Turn Confluence requirements into Jira stories, then break approved stories into tasks after sign-off | Confluence → Jira backlog conversion |
| [development-assessment](business-analysis/development-assessment/README.md) | Codebase-first feasibility and impact assessment that routes decisions before escalating to developers | Technical Analyst feasibility checks |
| [frontend-ticket-writing](business-analysis/frontend-ticket-writing/README.md) | Write implementation-ready frontend tickets with accessibility as testable WCAG 2.2 AA acceptance criteria | Writing/reviewing frontend/UI tickets |

**Recommendations:** Use BA skills at the start of a sprint to refine stories and define acceptance criteria before development begins.

---

### 📅 Project Management
> Path: `skills/project-management/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| [backlog-prioritization](project-management/backlog-prioritization/README.md) | Ranks a backlog with RICE, ICE, value/effort, MoSCoW, or WSJF into a defensible ordering | Sequencing a backlog for sprints/PIs |
| [estimation-support](project-management/estimation-support/README.md) | Sizes stories and epics with points, T-shirt sizes, and a complexity indicator for the team | Backlog refinement and sprint planning |
| [sprint-planning](project-management/sprint-planning/README.md) | Run sprint planning: set goal, check DoR/DoD, compute capacity, commit dependency-ordered work | Running sprint/iteration planning |
| [sprint-progress-reporting](project-management/sprint-progress-reporting/README.md) | Recurring cadence-based sprint progress updates that diff tracker/code state against a saved snapshot baseline | Posting recurring sprint status updates |

**Recommendations:** Apply PM skills during sprint planning, retrospectives, and status reporting cycles.

---

### 👥 Team Development
> Path: `skills/team-development/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| _(add skills here)_ | | |

**Recommendations:** Use team-development skills to structure 1-on-1 agendas, draft feedback, and support career development conversations.

---

### 🎨 Design & UX
> Path: `skills/design-and-ux/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| _(add skills here)_ | | |

**Recommendations:** Pair design skills with development skills during frontend implementation to enforce accessibility and design-system compliance.

---

### ⚙️ DevOps
> Path: `skills/devops/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| [azure-devops-cli](devops/azure-devops-cli/SKILL.md) | Manage Azure DevOps projects, repos, pipelines, builds, PRs, work items, and service endpoints via the `az devops` CLI | Azure DevOps automation, CI/CD |
| [azure-resource-health-diagnose](devops/azure-resource-health-diagnose/SKILL.md) | Analyzes Azure resource health from logs and telemetry and produces a remediation plan | Incident diagnosis on Azure |
| [azure-resource-visualizer](devops/azure-resource-visualizer/SKILL.md) | Generates Mermaid architecture diagrams of Azure resource groups and resource relationships | Documenting Azure infrastructure |
| [devops-rollout-plan](devops/devops-rollout-plan/SKILL.md) | Rollout plans with preflight checks, deployment steps, verification signals, rollback, and comms | Planning infra and app releases |

**Recommendations:** Use DevOps skills when writing or reviewing infrastructure-as-code, CI/CD pipelines, and runbooks.

---

### 🔗 Common
> Path: `skills/common/`

| Skill | Description | Recommended for |
|-------|-------------|-----------------|
| [common-adr-authoring](common/common-adr-authoring/README.md) | Drafts, refines, reviews, and organizes Architecture Decision Records using a consistent decision-focused structure | Architecture decisions, technical design records, ADR reviews |
| [git-commit](common/git-commit/SKILL.md) | Stages changes and creates a git commit with an AI-generated commit message | Every plugin; committing work |
| [skill-create](common/skill-create/SKILL.md) | Creates new agent skills with proper structure, progressive disclosure, and bundled resources | Contributors adding skills to this library |
| [docx-to-md](common/docx-to-md/README.md) | Converts `.docx` files to clean, structured Markdown with auto-numbered headings, TOC, tables, and code blocks | Documentation migration, Markdown-based workflows, Word-to-repo conversion |
| [plugin-create](common/plugin-create/README.md) | Scaffolds a new plugin by selecting library skills for a team role or workflow description; updates both registry files | Contributors adding plugins to this library |
| [plugin-release](common/plugin-release/README.md) | Bumps a plugin version, generates a CHANGELOG.md entry from git history, and syncs marketplace.json | Contributors releasing a new plugin version |

**Recommendations:** Common skills are cross-cutting and can be loaded alongside any discipline-specific skill. Good candidates: documentation, commit-message formatting, code-comment style.

---

## 📁 Skill Folder Convention

Skills follow the [agentskills.io](https://agentskills.io) open standard. Each skill lives in its own sub-folder:

```
skills/<discipline>/<skill-name>/
├── SKILL.md          ← required: YAML frontmatter + agent instructions
├── README.md         ← required: human-readable description, usage, example
├── scripts/          ← optional: executable scripts agents can run
├── references/       ← optional: detailed docs loaded on demand by the agent
└── assets/           ← optional: templates, schemas, static resources
```

### SKILL.md frontmatter

```yaml
---
name: skill-name        # max 64 chars · lowercase · hyphens only · must match folder name
description: >          # max 1024 chars · describe WHAT it does AND WHEN to use it
  One or two sentences covering what the skill does and the trigger conditions.
license: Proprietary    # optional
compatibility: ...      # optional — only if specific tools/env are required
metadata:               # optional
  author: awesome-agents
  version: "1.0"
---
```

See [how-to-create-project-skills.md](../guide/how-to-create-project-skills.md) for a full authoring guide.
