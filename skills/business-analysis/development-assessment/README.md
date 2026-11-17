# Development Assessment

## Description

Produces a codebase-first Development Assessment that routes a product, design,
operations, or planning decision by inspecting repositories and technical
documentation before escalating to human developers. The skill restates the
question implementation-neutrally, maps the likely surfaces (repos, services,
modules, routes, APIs, jobs, data, flags), inspects the code to report current
behavior, constraints, feasibility, risk/complexity, and dependencies, states a
confidence level, and recommends a next route. It answers implementation context
only — not whether the product or business priority is worth pursuing.

## When to Use

- Someone asks "is this feasible", "what does the current code do", or "what would
  it take to ..." about a product, design, or operations change
- A brief, ticket, discovery note, design proposal, incident, or roadmap question
  needs implementation context before it can be scoped
- You need a feasibility check grounded in the actual codebase rather than a guess
- You want to assess implementation impact before committing to delivery
- A question is about to be sent to developers and you want to inspect code and docs
  first

## Usage

Activate this skill and provide the source artifact and the question to assess.
Provide as much relevant context as you have:

- The brief, ticket, or question and the decision it should route
- The products, repos, or services likely involved
- Project instruction files (`AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, `INDEX.md`) and relevant ADRs
- Any docs, specs, or design notes that may already describe the behavior

The skill frames the request, maps likely surfaces, inspects the codebase with `rg`
and file reads (tracing user-facing entry points to services and data), then reports
current behavior, feasibility, risks, and a recommended next route. It uses the
template, confidence rubric, and escalation triggers in
[`references/assessment-template.md`](references/assessment-template.md). It escalates
to human developers only when analysis is blocked, low-confidence, or needs ownership
judgment.

## Example

**Input:** "Can we add a CSV export button to the customer list page, and what would
it take?"

**Output:** A short Development Assessment that traces the customer list page to its
API and data path, finds an existing reusable CSV-export hook, flags the pagination
cap as a non-obvious blocker, reports Medium confidence, and recommends routing the
work to `prd-authoring` to confirm the persona and row-volume expectation, then to
`issue-decomposition` for a tracer-bullet slice — with no human escalation needed.

A full worked version of this example appears in `SKILL.md`.

## Requirements

- Access to the relevant repositories and technical documentation
- A content/code search tool (`rg`) and file reads
- Project instruction and context files when available (`AGENTS.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, `INDEX.md`, ADRs)
- Related skills for hand-off: `requirements-grilling` (routes blocked feasibility
  here in its docs-only mode), `prd-authoring` (when the next route is a PRD), and
  `issue-decomposition` (when the next route is tickets)
