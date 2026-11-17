---
name: prd-authoring
description: >
  Synthesizes a Product Requirements Document (PRD) from existing context — conversation, source docs,
  research, requirements, or tracker context — without restarting discovery. This is the project's single
  canonical requirements document for a feature or initiative. Use when the user asks to "write a PRD",
  "create a product requirements document", "turn this into a PRD", "synthesize a spec from these notes",
  "draft a feature PRD", "convert this brief into a PRD", or wants a tracker-ready product spec covering
  problem, success metrics, scope, user stories, requirements, and risks. Do not use for formal BRD/FRD/SRS
  authoring (a separate domain-pack skill).
metadata:
  author: awesome-agents
  version: "0.1"
---

# PRD Authoring

## Overview

Write a PRD that synthesizes what is *already known* into one canonical, implementation-facing
requirements document. Use this skill when the task is to draft, revise, or review a PRD from
existing context: a conversation, source documents, research notes, discovery output, briefs,
tickets, designs, or code findings.

The PRD is the project's single requirements document for one feature or initiative. It captures
the problem, the intended solution, who it serves, how success is measured, what is in and out of
scope, the user stories, the requirements, the decisions already made, and the risks that remain.

**Default behaviour: synthesize, do not interview.** Pull the answers out of the material you were
given. Mark what is missing as an assumption or open question — do not stall the document by
restarting discovery, and do not invent decisions to fill the gaps.

## Required Context

Before writing:

- Read the supplied source material first: conversation context, docs, tracker issues, research,
  meeting notes, designs, or code findings.
- Read project instructions and vocabulary when present: `AGENTS.md`, `CONTEXT.md`, `README` files,
  ADRs, design docs, and the team's tracker conventions.
- Use the project's glossary and documented decisions. Match its terminology.
- Preserve source phrasing where it carries product intent, customer language, or acceptance meaning.
- Mark unresolved assumptions and open questions explicitly instead of filling gaps silently.

## Workflow

1. **Collect source evidence**
   - Identify the source documents, links, excerpts, and decision records you are drawing from.
   - Separate confirmed requirements from ideas, rationale, assumptions, open questions, and
     implementation suggestions.
   - Note contradictions between sources. Ask one blocking question only if a contradiction affects
     the PRD's core direction; otherwise record it as an open question.
   - If open product decisions block the frame, run **requirements-grilling** first to resolve them
     (it offers a docs-only mode for PMs who cannot inspect code). Bring the resolved answers back here.

2. **Define the product frame**
   - Write the problem from the affected user's or operator's perspective: who has the problem, why
     it matters, and the cost of inaction.
   - Write the solution from the same perspective — focus on outcome and behaviour, not internal layers.
   - Identify users and personas, their job-to-be-done, and the business outcome the work drives.
   - Define goals and success metrics: a **primary KPI** (with target and timeframe), **secondary
     metrics**, and **guardrail metrics** (what must NOT regress).
   - Define **non-goals** and MVP boundaries — state what was cut and why, not only what is included.

3. **Describe user stories**
   - Produce a numbered list of user stories covering happy paths, permissions, empty states, errors,
     edge cases, admin/operator needs, data visibility, and recovery workflows when relevant.
   - **Defer to `user-story-authoring`** for the story format, Gherkin acceptance criteria, and MoSCoW
     prioritization. This skill owns the PRD; it does not restate that format.

4. **Capture implementation decisions**
   - List decisions already made about modules, APIs, data, integrations, workflows, permissions,
     analytics, release, or migration.
   - Do not include brittle file paths or code snippets unless a short prototype snippet captures a
     decision more precisely than prose.
   - Flag decisions that still need a grilling session, design review, technical assessment, or
     stakeholder approval. If feasibility is unknown, recommend **development-assessment**.

5. **Capture testing decisions**
   - Define what should be tested from external behaviour, not internal implementation.
   - Identify likely unit, component, integration, E2E, accessibility, analytics, migration, or
     regression coverage.
   - Reference similar tests or project patterns when known.

6. **Prepare handoff**
   - Include out-of-scope items, dependencies, and risks.
   - Recommend the next route: approval, story breakdown, design review, or development assessment.
     After approval, the next route is usually **issue-decomposition**.
   - For traceability between requirements and downstream work, point to
     **requirements-traceability-matrix**.
   - If asked to publish to a tracker and tools are unavailable, produce import-ready content — but
     only when the user asks and approves (see Guardrails).

## PRD Output Structure

Use this section order:

- `# <Feature / Initiative> — PRD`
- `## Source References` — documents, links, tickets, and decision records this PRD synthesizes
- `## Problem Statement` — who has what problem, why it matters, cost of inaction
- `## Solution` — what is being built and why this approach, framed as outcome and behaviour
- `## Users & Personas` — primary user(s), their context, and job-to-be-done
- `## Goals & Success Metrics`
  - `**Primary KPI:**` metric — target by date
  - `**Secondary metrics:**` list
  - `**Guardrail metrics:**` what must not regress
- `## Non-Goals` — explicit MVP boundaries and what was deliberately cut
- `## User Stories` — numbered list (format and AC via `user-story-authoring`)
- `## Requirements & Acceptance Notes` — confirmed requirements with acceptance meaning
- `## Implementation Decisions` — decisions already made; flag ones needing review/approval
- `## Testing Decisions` — coverage expectations from external behaviour
- `## Dependencies & Risks` — including assumptions and how they could be validated
- `## Open Questions` — unresolved decisions; do not invent fake ones
- `## Out of Scope` — items explicitly excluded
- `## Recommended Next Route` — approval, decomposition, design review, or assessment

Do not reorder, omit, or rename sections unless the user explicitly asks for a different format.

## Synthesize, Don't Interview — Guardrails

- **Do not interview by default.** Synthesize the PRD from the material you were given first.
- **Do not turn unresolved questions into fake decisions.** A question with no answer belongs in
  Open Questions or Assumptions, never disguised as an Implementation Decision.
- **Do not collapse the PRD into tasks.** This is a requirements document, not a task breakdown.
  Hand off to `issue-decomposition` for that.
- **Do not publish or create tracker items unless the user asks and approves.** Produce import-ready
  content on request; do not push to a tracker on your own initiative.
- **Do not include internal implementation detail** unless it changes product behaviour, feasibility,
  risk, or acceptance.
- **Do not restate the user-story or BRD/FRD/SRS formats** — defer to `user-story-authoring` for
  stories; formal requirements specs are a separate domain-pack skill.

## Worked Example

**Source snippet A (support lead, meeting note):** "Agents waste ~10 min per ticket re-asking the
customer for their plan tier and last invoice. We have all of it in billing already."

**Source snippet B (eng note in tracker):** "Billing API exposes `/account/{id}/summary`; read-only;
PII fields require the `billing:read` scope."

Synthesized PRD (abridged):

```markdown
# Support Console — Account Context Panel — PRD

## Source References
- Support lead meeting note (2026-06-18)
- Tracker issue ENG-412 (billing summary endpoint)

## Problem Statement
Support agents spend ~10 minutes per ticket re-asking customers for plan tier and last invoice,
even though billing already holds this data. The cost is slower resolution and avoidable customer
friction.

## Solution
Show a read-only account context panel inside the support console that surfaces plan tier and the
last invoice when an agent opens a ticket, so they never have to ask for data the system already has.

## Users & Personas
Support agent resolving an inbound ticket; job-to-be-done is to answer the customer without
back-and-forth on account facts.

## Goals & Success Metrics
- **Primary KPI:** median time-to-first-response — reduce by 25% within 60 days of launch.
- **Secondary metrics:** tickets reopened for missing account info; agent CSAT.
- **Guardrail metrics:** billing API error rate must not regress; no PII exposure to unauthorized roles.

## Non-Goals
Editing billing data from the console; surfacing usage analytics (Phase 2).

## User Stories
1. As a support agent, I want to see the customer's plan tier on the ticket, so that I can tailor my
   answer without asking. *(format and AC: see `user-story-authoring`)*
2. As a support agent without billing access, I want PII fields hidden, so that we stay compliant.

## Requirements & Acceptance Notes
- Panel loads plan tier and last invoice on ticket open.
- PII fields render only for roles holding `billing:read`.

## Implementation Decisions
- Read from the existing `/account/{id}/summary` endpoint (ENG-412). Read-only.

## Testing Decisions
- Integration test: panel populates from a stubbed billing summary.
- Permission test: PII hidden for roles lacking `billing:read`.

## Dependencies & Risks
- Depends on billing API availability. Assumption: latency is acceptable for inline display —
  validate with a timing spike.

## Open Questions
1. What is shown when the billing summary is unavailable — cached value or empty state?

## Out of Scope
Editing account data; usage analytics.

## Recommended Next Route
Approve, then `issue-decomposition`. Run `development-assessment` if billing latency is a concern.
```

## Gotchas

- A PRD is **one feature or initiative**. If the input mixes several unrelated initiatives with
  different drivers, split them and say so — do not merge them into one bloated PRD.
- The Problem Statement is a narrative, not a requirements checklist. "Any solution must…" bullets
  belong in Requirements, not here.
- Metrics must be specific and time-bound. A goal with no measurable target is an aspiration, not a KPI.
- "We should probably…" and "maybe we could…" are not decisions. Route them to Open Questions.
- Guardrail metrics are easy to forget. Always ask what must *not* regress, not only what should improve.
- When the source material is sparse, state the missing facts, make the minimum reasonable
  assumptions, return the full PRD, and list those assumptions at the end — do not block on an interview.
