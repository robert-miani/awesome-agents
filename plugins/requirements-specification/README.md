# Requirements Specification

## Description

Requirements Specification is a full business-analysis spec toolkit. It ingests raw
inputs — existing docs, transcripts, wikis, PRDs, and Jira issues — and turns them into
structured, traceable requirements. From there it drives the whole specification flow:
interrogating scope, authoring user stories with acceptance criteria, synthesizing a PRD,
running gap and change-impact analysis, building a requirements traceability matrix,
modelling process flows, decomposing approved scope into tracker issues, and pushing
Confluence requirements into Jira. It also converts `.docx` documents to clean Markdown
and generates ASCII, Mermaid, or PlantUML diagrams to illustrate scope, flows, and data
structures.

It ships a **`business-analyst` persona agent** (`agents/business-analyst.md`) — a thin
router that points at the bundled skills for the right step of the flow.

Recommended for Business Analysts, Product Owners, and Technical Analysts.

## When to Use

- Ingesting stakeholder docs, transcripts, or wikis into structured requirements
- Interrogating open questions to sharpen scope before committing to a spec
- Authoring user stories, epics, and Gherkin acceptance criteria
- Synthesizing a PRD from accumulated context
- Running current-vs-future-state gap and change-impact analysis
- Building a requirements traceability matrix across objectives, stories, and tests
- Modelling process flows and swimlanes
- Decomposing approved scope into vertical-slice tracker issues
- Pushing Confluence requirements into Jira stories and tasks
- Converting a stakeholder Word doc into a versioned Markdown spec
- Producing visual flow or entity diagrams to accompany acceptance criteria

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [requirements-source-ingestion](skills/requirements-source-ingestion/SKILL.md) | `/requirements-specification:requirements-source-ingestion` | Turn existing docs, transcripts, wikis, and PRDs into structured requirements with source traceability |
| [requirements-grilling](skills/requirements-grilling/SKILL.md) | `/requirements-specification:requirements-grilling` | One-question-at-a-time interrogation to sharpen scope (code-aware or docs-only) |
| [prd-authoring](skills/prd-authoring/SKILL.md) | `/requirements-specification:prd-authoring` | Synthesize a PRD from existing context |
| [user-story-authoring](skills/user-story-authoring/SKILL.md) | `/requirements-specification:user-story-authoring` | User stories, epics, and Gherkin acceptance criteria (MoSCoW/INVEST) |
| [gap-impact-analysis](skills/gap-impact-analysis/SKILL.md) | `/requirements-specification:gap-impact-analysis` | Current-vs-future-state gap and change-impact analysis |
| [requirements-traceability-matrix](skills/requirements-traceability-matrix/SKILL.md) | `/requirements-specification:requirements-traceability-matrix` | RTM linking objectives → requirements → stories → AC → tests |
| [process-flow-modelling](skills/process-flow-modelling/SKILL.md) | `/requirements-specification:process-flow-modelling` | Interactive HTML process flow / swimlane visualisations |
| [issue-decomposition](skills/issue-decomposition/SKILL.md) | `/requirements-specification:issue-decomposition` | Break approved scope into vertical-slice tracker issues |
| [confluence-to-jira-stories](skills/confluence-to-jira-stories/SKILL.md) | `/requirements-specification:confluence-to-jira-stories` | Confluence requirements → Jira stories → tasks (after approval) |
| [docx-to-md](skills/docx-to-md/SKILL.md) | `/requirements-specification:docx-to-md` | Convert `.docx` files to structured Markdown |
| [common-ascii-diagram](skills/common-ascii-diagram/SKILL.md) | `/requirements-specification:common-ascii-diagram` | Generate plain-text ASCII diagrams |
| [common-mermaid-diagram](skills/common-mermaid-diagram/SKILL.md) | `/requirements-specification:common-mermaid-diagram` | Generate Mermaid diagrams |
| [common-plantuml-diagram](skills/common-plantuml-diagram/SKILL.md) | `/requirements-specification:common-plantuml-diagram` | Generate PlantUML diagrams as `.puml` + `.svg` |
| [git-commit](skills/git-commit/SKILL.md) | `/requirements-specification:git-commit` | Commit specification files with a conventional message |

## Workflow Orchestration & Integrations

**SessionStart hook** ([`hooks/hooks.json`](hooks/hooks.json)) injects the cross-skill
workflow rules the moment the plugin loads: the intake → grill → synthesize → stories →
analysis → decompose pipeline, the synthesize-before-interview and one-question-at-a-time
rules, approval checkpoints, HITL/AFK classification, traceability-by-default, canonical
skill ownership, and the "never pretend a tracker was updated" guardrail. Editing the hook
requires `/reload-plugins` or a restart (hooks do not hot-reload).

**Atlassian MCP** ([`.mcp.json`](.mcp.json)) wires Confluence + Jira through the official
[Atlassian Remote MCP Server](https://www.atlassian.com/platform/remote-mcp-server) via the
`mcp-remote` bridge — used by `requirements-source-ingestion` (Confluence intake) and
`confluence-to-jira-stories` / `issue-decomposition` (Jira publishing). It authenticates
over OAuth in the browser, so **no secrets are committed**. When the MCP is unavailable the
publishing skills fall back to import-ready drafts.

> **Self-hosted / token auth?** Atlassian Data Center or a token-based community server
> (e.g. `mcp-atlassian`) can be swapped into `.mcp.json`; map your `ATLASSIAN_BASE_URL`,
> `ATLASSIAN_EMAIL`, and `ATLASSIAN_API_TOKEN` env vars (the same set used by the
> `confluence-lambda` reference) into that server's `env` block. Keep secrets in the
> environment, never in the committed file.

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/requirements-specification
```

Start Claude Code from the target repository root.

### Invoke

```text
/requirements-specification:requirements-source-ingestion requirements/stakeholder-brief.docx
```

```text
/requirements-specification:user-story-authoring draft stories for the user registration epic
```

## Example

Input: a stakeholder brief describing a user registration feature.

1. `/requirements-specification:requirements-source-ingestion` reads the brief and produces
   structured requirements with source traceability
2. `/requirements-specification:requirements-grilling` interrogates the open questions
   one at a time to lock down scope
3. `/requirements-specification:user-story-authoring` drafts user stories with Gherkin
   acceptance criteria
4. `/requirements-specification:requirements-traceability-matrix` links objectives →
   requirements → stories → acceptance criteria → tests
5. `/requirements-specification:issue-decomposition` breaks the approved scope into
   vertical-slice tracker issues
6. `/requirements-specification:git-commit` commits the specification files

## Requirements

- Claude Code for plugin loading
- Read access to any source input files (`.docx`, transcripts, wikis, PRDs)
- Write access to the target spec output directory
- For `confluence-to-jira-stories` and `issue-decomposition` publishing: access to the
  relevant Confluence and Jira workspaces via the Atlassian MCP (or import-ready drafts as fallback)
- `npx` available on PATH for the `mcp-remote` Atlassian bridge (optional — only for live tracker access)
