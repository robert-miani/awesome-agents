---
name: issue-decomposition
description: >
  Breaks approved product scope (PRDs, briefs, plans, or story breakdowns) into independently
  verifiable tracker issues using tracer-bullet vertical slices, AFK/HITL classification,
  dependency ordering, and an approval checkpoint before publishing. Use when the user says
  "break this into tickets/issues", "decompose this PRD", "create backlog stories", asks for
  "vertical slices", or wants to "split this into Jira, Linear, or GitHub issues".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Issue Decomposition

## Overview

Turn approved product scope into a set of independently verifiable tracker issues. Each issue is a **tracer-bullet vertical slice**: a narrow but complete path through a single user or operator outcome, demoable on its own.

Use this skill when the task is to decompose a PRD, brief, plan, or approved story breakdown into Jira, Linear, GitHub, or backlog issues. This skill owns vertical-slice decomposition; other skills defer to it for slicing.

The decomposition must produce slices, not layers. Do not turn it into a horizontal work plan ("build the backend", "build the UI", "write the tests") and do not publish anything before the approval checkpoint.

## Required Context

Before drafting issues:

- Read the source PRD, brief, plan, ticket, design, or supplied conversation context. The upstream PRD is typically produced by the **prd-authoring** skill.
- Read tracker conventions when available: issue types, statuses, labels, components, epics, fix versions, custom fields, Definition of Ready, and Definition of Done.
- Read local project docs and glossary when present: `AGENTS.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `INDEX.md`, README files, and ADRs.
- If implementation context matters and code is available, inspect the relevant code/docs before naming slices.
- Preserve links and requirement IDs so every issue can trace back to source material.

## Workflow

Follow these six steps in order.

1. **Confirm source and target**
   - Identify the parent artifact and the intended tracker.
   - Identify whether output should be stories only, tasks only, or a two-level story/task breakdown.
   - If the user asks for tasks from unapproved requirements, stop and ask for story approval first.

2. **Draft vertical slices**
   - Prefer many thin slices over a few broad ones.
   - Each story must be demoable or verifiable on its own — see [Vertical-Slice Rules](#vertical-slice-rules).
   - Avoid horizontal slices unless the work is genuinely independent infrastructure or foundation work.
   - Map each slice back to the source requirements and user stories it covers.

3. **Classify work**
   - Mark each issue `AFK` or `HITL` — see [AFK / HITL Classification](#afk--hitl-classification).
   - Identify blockers and put issues in dependency order.

4. **Approval checkpoint — STOP**
   - Do not publish or write full issue bodies yet. Present the proposed breakdown and wait — see [Approval Checkpoint](#approval-checkpoint).

5. **Write issue bodies**
   - For each approved issue, fill in the [Issue Body Template](#issue-body-template).
   - Describe end-to-end behavior, not layer-by-layer implementation.
   - Keep code paths out unless a path is necessary to identify an existing component or system.

6. **Publish or prepare import-ready drafts**
   - If tracker tooling is available and the user approves publishing, create issues in dependency order.
   - If tooling is unavailable, produce import-ready issue drafts the user can paste or upload.
   - For story/task workflows, publish stories first, then tasks linked to the approved parent story.

## Vertical-Slice Rules

A vertical slice cuts through every layer needed to deliver one observable outcome, end to end.

- **Complete, not broad.** A slice delivers a real user/operator outcome, however narrow. "User can submit a single-field form and see a confirmation" is a slice; "build the form API" is not.
- **Independently verifiable.** Someone can demo or test the slice without waiting for a sibling slice.
- **Thin over thick.** Split by outcome, scenario, or input variation — not by component.
- **Horizontal work is the exception.** Layer-only issues ("set up the database schema", "scaffold the service") are allowed only when the work is genuinely shared infrastructure or foundation that multiple slices depend on. Flag these explicitly and keep them rare.
- **Trace to source.** Every slice maps to one or more source requirements; together the slices cover the approved scope with no gaps.

| Horizontal (avoid) | Vertical (prefer) |
|---|---|
| Build the orders database table | Operator can record a single order and see it persisted |
| Build the orders REST API | Customer can view their order history |
| Build the orders UI | Customer can cancel an unshipped order |
| Write order tests | (verification lives inside each slice above) |

## AFK / HITL Classification

Classify every issue so reviewers know where human judgment is required.

- **`AFK` (away-from-keyboard).** An agent or engineer can proceed to completion without further human input. Requirements, acceptance criteria, and design are settled enough to execute unattended.
- **`HITL` (human-in-the-loop).** A human decision is required before or during the work: a design review, architecture call, compliance or security approval, content/legal sign-off, or stakeholder clarification of an ambiguous requirement.

When unsure, mark `HITL` and state the specific decision the human must make.

## Approval Checkpoint

This is a hard stop. Do not write full issue bodies, and never publish, before the breakdown is approved.

Present the proposed breakdown as a list and ask the user to confirm:

- Is the **granularity** right — are slices thin enough and independently verifiable?
- Is the **dependency order** correct?
- Are any **requirements missing or uncovered**?
- Are the **AFK/HITL classifications** accurate?

Iterate on the breakdown until the user approves. Only then proceed to step 5.

## Issue Body Template

Use this structure for each approved issue. Omit tracker fields you do not know rather than inventing them.

```markdown
**Type:** Story | Task | Bug
**Parent / Epic:** <parent artifact or epic>
**Classification:** AFK | HITL
**Source refs:** <requirement IDs, PRD section, link>

## What to build
End-to-end behavior this slice delivers, described as an outcome — not a layer plan.

## Acceptance criteria
- Given/When/Then or checklist criteria. (For Gherkin-style criteria, follow the
  user-story-authoring skill's format.)

## Verification
How the slice is demoed or tested on its own.

## Blocked by
<issue IDs or "none">

## Open questions
<unresolved items, or "none">

Labels / Components / Fix version: <only if known from tracker conventions>
```

## Worked Example

**Source scope (PRD excerpt):** "Logged-in customers need a saved-addresses feature. They can add a shipping address, see their saved addresses, and set one as default. Addresses must be validated against the postal-format rules already used at checkout."

**Proposed breakdown (presented at the approval checkpoint, in dependency order):**

| # | Title | Type | Class | Blocked by | Source |
|---|---|---|---|---|---|
| 1 | Customer can add a shipping address and see it saved | Story | AFK | none | REQ-ADDR-1 |
| 2 | Customer can view their list of saved addresses | Story | AFK | #1 | REQ-ADDR-2 |
| 3 | Customer can set a saved address as default | Story | HITL | #1 | REQ-ADDR-3 |

Issue #3 is `HITL` because the PRD does not define what happens to a previously-set default — a product decision is needed before the slice can be completed. Note that no issue says "build the address table" or "build the address API"; persistence and API work live inside slice #1, the first slice that needs them.

After approval, each row is expanded into the full [Issue Body Template](#issue-body-template), then published in order 1 → 2 → 3.

## Gotchas

- **Horizontal slicing.** The most common failure is splitting by layer ("backend", "frontend", "tests"). These issues are not independently verifiable and hide integration risk. Re-slice by outcome unless the work is genuinely shared foundation.
- **Publishing before approval.** Never create tracker issues, and do not write full issue bodies, before the user approves the breakdown at the checkpoint. The checkpoint is step 4, before step 5.
- **Inventing tracker fields.** Use only labels, components, statuses, epics, and custom fields that the tracker conventions confirm. If a field is unknown, omit it or mark it unknown — do not guess field names or values.
- **Breaking stories into tasks too early.** Do not decompose a story into tasks until the story-level granularity is approved.
- **Mutating the source.** Do not modify or close the source PRD, brief, or plan unless explicitly asked.
- **Coverage gaps.** Confirm every source requirement maps to at least one slice; call out anything left uncovered at the checkpoint.

## Related Skills

- **prd-authoring** — produces the upstream PRD this skill decomposes.
- **user-story-authoring** — owns story shape and Gherkin acceptance-criteria format; use it when writing issue acceptance criteria.
- **confluence-to-jira-stories** — a channel-specific variant for the Confluence → Jira path; it depends on this skill for the vertical-slice decomposition.
