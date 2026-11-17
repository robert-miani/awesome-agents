---
name: development-assessment
description: >
  Produces a codebase-first Development Assessment that routes a product, design,
  operations, or planning decision by inspecting repositories and technical docs
  before escalating to human developers. Reports current behavior, constraints,
  feasibility, risk/complexity, dependencies, and confidence, then recommends a
  next route. Use when someone asks "is this feasible", "what does the current
  code do", "what would it take to", "assess implementation impact", or requests a
  development assessment or feasibility check.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Development Assessment

## Overview

Create a **Development Assessment** that routes a product, design, operations, or
planning decision by inspecting repositories and technical documentation first. Do
not default to asking developers. Escalate to humans only when codebase analysis is
blocked, low-confidence, or requires ownership judgment.

Use this skill when given a brief, ticket, discovery question, operational
question, product question, or design proposal that needs implementation context.

This skill answers **implementation context**, not whether the product, design, or
business priority matters. Keep that strategy/implementation boundary intact:
report what the code does and what work would cost; leave the value judgment to the
decision owner.

## Required Context

Before assessing:

- Read project-level instructions first: `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`,
  `INDEX.md`, README files, or equivalent docs when present.
- If a `CONTEXT-MAP.md` exists, identify the relevant bounded context before
  reading glossary or ADR files.
- Use the project's own vocabulary for artifacts, customers, users, workflows,
  services, and decision gates.
- Read tracker context, specs, design docs, and architecture notes before code
  when they may already describe the behavior.
- Search docs before code when product behavior may already be described.
- Search code before escalating to humans.

## Workflow

Follow these five steps in order.

### 1. Frame the request

- Identify the source artifact type using the local project's language: brief,
  ticket, research note, design proposal, incident, roadmap question, or fuzzy
  product question.
- Restate the assessment question in **implementation-neutral** language — describe
  the behavior or capability under question without presuming a solution.
- List the decision assumptions that codebase analysis can confirm, weaken, or
  disprove.
- If the source is enough to assess, do not interview; synthesize from current
  context and evidence.

### 2. Map likely surfaces

- Identify relevant products, repos, services, modules, routes, APIs, jobs, data
  models, permissions, feature flags, analytics events, and configuration surfaces.
- If repo layout is unclear, inspect project indexes, agent instructions, README
  files, package manifests, project files, and directory names.
- Respect ADRs or equivalent decision records in the affected area.

### 3. Inspect the codebase

- Use `rg` and file reads first.
- Trace from the user-facing route/component/API to services, permissions, data,
  jobs, and integration points.
- Prefer concrete file references over broad summaries.
- If product, design, or operations describes behavior that contradicts the code or
  docs, surface the contradiction and ask which source should win.
- Distinguish **direct evidence** (visible in code/trusted docs) from **inference**.
- Stop when the remaining uncertainty is no longer answerable from local artifacts.

### 4. Assess and route

- Explain current behavior, constraints, feasibility, risks, dependencies, and
  effort signals.
- State what is known, inferred, unknown, and contradicted.
- Provide a **recommended next route**, not a full technical design unless
  explicitly requested.
- Use the assessment template, confidence rubric, and "recommended next route"
  examples in `references/assessment-template.md`.
- If the next route is a PRD, hand off to **prd-authoring**: name the problem, the
  user-facing solution, likely user stories, implementation decisions still needed,
  testing decisions, and out-of-scope boundaries.
- If the next route is implementation tickets, hand off to **issue-decomposition**:
  propose tracer-bullet slices that are demoable or verifiable on their own and mark
  unresolved decision work for human review.

### 5. Escalate only if needed

- Pull in human developers only when repository analysis cannot answer with
  sufficient confidence, the answer depends on undocumented ownership context, or a
  technical decision requires accountable approval.
- See the escalation triggers in `references/assessment-template.md`. Do not
  escalate just because the question is technical — first inspect code and docs.

## Output Structure

Return a concise Development Assessment with:

- request being answered
- current behavior
- relevant files/systems
- constraints and dependencies
- feasibility read
- risk/complexity read
- decision assumptions challenged
- confidence level
- recommended next route
- human escalation question, if needed
- suggested PRD or issue-slicing follow-up, if implementation work is likely

Use the full section-by-section template in
[`references/assessment-template.md`](references/assessment-template.md).

## Confidence Rubric

Report one confidence level and say why. Full rubric is in
`references/assessment-template.md`.

- **High** — the relevant behavior is directly visible in code or trusted docs, the
  flow has been traced across the main affected surfaces, and the answer does not
  depend on undocumented operational judgment.
- **Medium** — the main path is supported by code evidence, but one or more
  integrations, configs, flags, deployments, or data assumptions remain unverified.
- **Low** — the relevant repo/service/config/data/runtime behavior cannot be
  located, evidence is contradictory, or the answer depends on intent, production
  behavior not represented locally, or ownership judgment. Escalate before the
  decision owner relies on the assessment.

## Escalation Triggers

Escalate to a human developer only when one or more apply (full list in
`references/assessment-template.md`):

- Codebase search cannot locate the owning system.
- The repo shows multiple plausible owners or behaviors.
- Runtime configuration, tenant data, or production flags determine the answer.
- The question requires intent behind prior implementation decisions.
- Security, compliance, migration, or data-loss risk requires accountable approval.
- Feasibility depends on services or repos not available locally.
- Confidence is Low after reasonable codebase exploration.

## Worked Example

**Input:** "Can we add a CSV export button to the customer list page, and what
would it take?"

**Output:**

```md
# Development Assessment: CSV export on customer list

## Request
- Source artifact: product question in planning channel
- Assessment question: Does the customer list expose a data path that could feed a
  CSV export, and what work would adding one require?
- Decision this should route: whether to scope CSV export as a delivery candidate.

## Current Behavior
- The customer list renders from `web/src/pages/CustomerList.tsx`, which calls
  `GET /api/customers` (`api/src/routes/customers.ts`).
- The endpoint already returns the full row set the table displays; there is no
  export route today. (direct evidence)
- A reusable `useExportCsv` hook exists in `web/src/lib/export.ts` and is used on
  the invoices page. (direct evidence)

## Constraints and Dependencies
- `/api/customers` paginates at 50 rows; a full export needs an all-rows path or
  client-side aggregation. (direct evidence)
- Access is gated by the `customers:read` permission; no separate export
  entitlement exists. (inferred)

## Feasibility Read
- Plausible path: reuse `useExportCsv` against the existing endpoint with a
  `?pageSize=all` or paged fetch loop. Easier than expected — the hook and data
  already exist.
- Non-obvious blocker: the pagination cap means a naive single call truncates data.

## Risk and Complexity
- Complexity: low. Main risk: large tenants could time out on an unbounded query.

## Confidence
- Medium — UI and data paths are traced and verified; the all-rows query behavior
  at scale is unverified locally.

## Recommended Next Route
This is a plausible low-complexity delivery candidate. Route to prd-authoring to
confirm the affected persona and the row-volume expectation, then to
issue-decomposition for a tracer-bullet slice (button → paged fetch → CSV).

## Human Escalation
- Needed: No.
```

## Gotchas

- Do not produce a full technical design when the decision owner only needs routing
  context. Stop at feasibility, constraints, and a recommended route.
- Do not treat a developer conversation as the first step. Inspect code and docs,
  then escalate only against the triggers above.
- Never report "not found" without listing the searched terms and surfaces — an
  empty search is itself evidence only if the search was thorough.
- Do not collapse product/business value into engineering feasibility. "Feasible"
  is not the same as "worth doing."
- Do not use confidence language without explaining what evidence supports it.
- Adapt every artifact name in the template to the project's local vocabulary.
- When a feasibility question arrives already blocked or contradictory, it may have
  been routed here from **requirements-grilling** in its docs-only mode; resolve the
  contradiction from code before answering.
