# Technical Analysis

## Description

Technical Analysis grounds feasibility and impact assessment in the actual codebase. It
inspects the repository to judge whether a requirement is feasible, surfaces constraints
and risks, and routes decisions before escalating to developers. Alongside the assessment
it produces data dictionaries and source-to-target (S2T) mappings with transformation
rules, implementation-ready frontend tickets, and PlantUML sketches to communicate the
proposed technical shape.

## When to Use

- Assessing the feasibility of a requirement against the real code, not assumptions
- Mapping integration data flows with a data dictionary and source-to-target rules
- Turning an analyzed requirement into implementation-ready frontend tickets
- Verifying stakeholder claims against the repository before committing to a plan
- Sketching the technical design (sequence, class, ER, component) for handoff

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [development-assessment](skills/development-assessment/SKILL.md) | `/technical-analysis:development-assessment` | Codebase-first feasibility, constraints, and risk assessment that routes decisions before escalating to developers |
| [requirements-grilling](skills/requirements-grilling/SKILL.md) | `/technical-analysis:requirements-grilling` | One-question-at-a-time interrogation; code-aware mode verifies claims against the repo |
| [data-dictionary-mapping](skills/data-dictionary-mapping/SKILL.md) | `/technical-analysis:data-dictionary-mapping` | Data dictionaries and source-to-target (S2T) mappings with transformation rules |
| [frontend-ticket-writing](skills/frontend-ticket-writing/SKILL.md) | `/technical-analysis:frontend-ticket-writing` | Implementation-ready frontend tickets with WCAG 2.2 AA accessibility acceptance criteria |
| [common-plantuml-diagram](skills/common-plantuml-diagram/SKILL.md) | `/technical-analysis:common-plantuml-diagram` | PlantUML diagrams (sequence/class/ER/component) for technical sketches |
| [git-commit](skills/git-commit/SKILL.md) | `/technical-analysis:git-commit` | Commit analysis artifacts with a conventional message |

## Workflow Orchestration & Integrations

**SessionStart hook** ([`hooks/hooks.json`](hooks/hooks.json)) injects the analysis
workflow rules at load time: the clarify → assess → map → ticket → sketch pipeline, the
**code-grounded-not-intuition** rule (every feasibility/constraint/risk claim cites a
`path:line` or is marked UNVERIFIED), code-aware grilling, route-before-escalate,
mandatory WCAG 2.2 AA acceptance criteria on tickets, and canonical skill ownership.
Editing the hook requires `/reload-plugins` or a restart.

**Atlassian MCP** ([`.mcp.json`](.mcp.json)) wires Jira through the official
[Atlassian Remote MCP Server](https://www.atlassian.com/platform/remote-mcp-server) via
`mcp-remote` so `frontend-ticket-writing` can publish tickets directly. It authenticates
over OAuth — **no secrets are committed**; when unavailable, tickets are written as
import-ready drafts.

> **Self-hosted / token auth?** Swap in a token-based Atlassian server in `.mcp.json` and
> map your `ATLASSIAN_*` env vars; keep secrets in the environment.

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/technical-analysis
```

Start Claude Code from the target repository root.

### Invoke

```text
/technical-analysis:development-assessment can we add SSO without changing the existing auth module?
```

```text
/technical-analysis:data-dictionary-mapping map the CRM contact payload to our customer table
```

## Example

A stakeholder asks whether the app can sync customers from an external CRM.

1. `/technical-analysis:development-assessment` inspects the code, confirms the integration
   layer can host the sync, and flags that the customer table lacks an external-id column
2. `/technical-analysis:data-dictionary-mapping` produces the source-to-target mapping from
   the CRM contact payload to the `customer` table, with transformation rules per field
3. `/technical-analysis:frontend-ticket-writing` writes an implementation-ready ticket for
   the sync-status UI, including WCAG 2.2 AA acceptance criteria
4. `/technical-analysis:git-commit` commits the assessment, mapping, and ticket

## Requirements

- Claude Code for plugin loading
- Read access to the target repository for code-grounded assessment
- Write access to the analysis output directory
- For Jira ticket publishing: access to the relevant workspace via the Atlassian MCP
  (or import-ready drafts as fallback)
- `npx` available on PATH for the `mcp-remote` Atlassian bridge (optional)
