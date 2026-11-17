# Product Discovery

## Description

Product Discovery turns fuzzy ideas and raw signals — usage data, customer feedback,
delivery friction, market moves — into problem and opportunity briefs, a synthesized
PRD, and a prioritized, spec-ready scope. It pressure-tests the thinking before any
document is written, then sequences what to build next so work enters specification
with a clear rationale.

The plugin also ships a senior **Product Manager** persona agent
([`agents/product-manager.md`](agents/product-manager.md)) — a thin router that picks
the right bundled skill for each task instead of restating methodology.

## When to Use

- Shaping a fuzzy idea into a problem or opportunity brief
- Scanning usage, customer, delivery, and market signals for product candidates
- Pressure-testing assumptions and scope before writing a PRD
- Synthesizing a PRD from settled context
- Prioritizing a backlog before work enters technical specification

## Bundled Skills

| Skill | Invocation | Description |
|-------|-----------|-------------|
| [problem-opportunity-brief](skills/problem-opportunity-brief/SKILL.md) | `/product-discovery:problem-opportunity-brief` | Grill leads into problem and opportunity briefs and discovery questions, one question at a time |
| [product-discovery-radar](skills/product-discovery-radar/SKILL.md) | `/product-discovery:product-discovery-radar` | Radar loop over usage, customer, delivery, and market lanes; signals → candidates → briefs through a human review gate (optional scaffold) |
| [requirements-grilling](skills/requirements-grilling/SKILL.md) | `/product-discovery:requirements-grilling` | One-question-at-a-time interrogation to pressure-test thinking (docs-only mode; routes feasibility to a development assessment) |
| [prd-authoring](skills/prd-authoring/SKILL.md) | `/product-discovery:prd-authoring` | Synthesize a PRD from existing context, with no re-interview |
| [backlog-prioritization](skills/backlog-prioritization/SKILL.md) | `/product-discovery:backlog-prioritization` | Rank a backlog with RICE, ICE, value-effort, MoSCoW, or WSJF |
| [git-commit](skills/git-commit/SKILL.md) | `/product-discovery:git-commit` | Commit discovery artifacts with a conventional message |

## Workflow Orchestration & Integrations

**SessionStart hook** ([`hooks/hooks.json`](hooks/hooks.json)) injects the discovery
workflow rules at load time: the radar → shape → pressure-test → synthesize → sequence
pipeline, problem-before-solution and evidence-over-opinion framing, the **docs-only
grilling guardrail** (never inspect code — route feasibility to `technical-analysis`),
the radar human review gate, explicit prioritization scoring, and the handoff boundary to
`requirements-specification` for downstream spec work. Editing the hook requires
`/reload-plugins` or a restart.

**Atlassian MCP** ([`.mcp.json`](.mcp.json)) connects Confluence (and Jira) through the
official [Atlassian Remote MCP Server](https://www.atlassian.com/platform/remote-mcp-server)
via `mcp-remote`, used to publish briefs and PRDs to Confluence. It authenticates over
OAuth — **no secrets are committed**. When unavailable, discovery artifacts are written as
import-ready Markdown drafts instead.

> **Self-hosted / token auth?** Swap in a token-based Atlassian server in `.mcp.json` and
> map your `ATLASSIAN_BASE_URL` / `ATLASSIAN_EMAIL` / `ATLASSIAN_API_TOKEN` env vars; keep
> secrets in the environment.

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/product-discovery
```

Start Claude Code from the target repository root. Invoke the **product-manager**
agent to route a task automatically, or call a bundled skill directly.

### Invoke

```text
/product-discovery:problem-opportunity-brief authenticated users abandon checkout after adding items
```

```text
/product-discovery:backlog-prioritization rank the discovery backlog with RICE
```

## Example

Input: a fuzzy idea — "users seem to drop off somewhere in onboarding."

1. `/product-discovery:problem-opportunity-brief` grills the idea into a problem
   brief saved as `docs/discovery/onboarding-dropoff-brief.md`
2. `/product-discovery:requirements-grilling` pressure-tests the brief's assumptions
   and scope, one question at a time, before any PRD is written
3. `/product-discovery:prd-authoring` synthesizes `docs/discovery/onboarding-prd.md`
   from the settled brief — no re-interview
4. `/product-discovery:backlog-prioritization` ranks the resulting candidate scope
   with RICE so the highest-value items are spec-ready first

## Requirements

- Claude Code for plugin loading
- Read access to any discovery inputs (notes, data exports, feedback)
- Write access to the target discovery output directory
- For Confluence/Jira publishing: access to the relevant workspaces via the Atlassian MCP
  (or import-ready drafts as fallback)
- `npx` available on PATH for the `mcp-remote` Atlassian bridge (optional)
