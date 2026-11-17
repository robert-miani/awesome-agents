---
name: problem-opportunity-brief
description: >
  Grills product, design, operations, and strategy leads into high-quality problem briefs,
  opportunity briefs, discovery questions, and implementation-context requests, one question
  at a time. Owns the discovery lifecycle (Observation → Problem Candidate → Discovery Question
  → Discovery Activity → Problem Brief; Problem Brief / Strategic Thesis → Opportunity Candidate
  → Opportunity Brief), artifact classification, and the brief quality bar. Use when the user
  says "problem brief", "opportunity brief", "shape this idea", "write a discovery question",
  "is this a real problem", "frame the opportunity", or wants to pressure-test a roadmap input
  or product-to-development request before it becomes scope.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Problem & Opportunity Brief

## Overview

Help a product or strategy lead turn fuzzy thinking into a precise artifact: a problem brief,
an opportunity brief, a discovery question, or an implementation-context request — or the
precursor artifact that should exist first. The method is the same relentless interview as
`requirements-grilling`: ask exactly **one** material question at a time, always include your
recommended answer and why, then wait for feedback before continuing.

This skill is the discovery and shaping front end of the pipeline. It does not produce scope.
A brief states a decision-relevant gap or a distinct advantage; it does not prescribe a feature.
When a brief is settled, hand off to `prd-authoring` for scope.

## Core Model

Use the project's own discovery or planning lifecycle when one exists. If none exists, use this
generic lifecycle:

```text
Observation → Problem Candidate → Discovery Question → Discovery Activity → Problem Brief

Problem Brief or Strategic Thesis
  → Opportunity Candidate
  → Opportunity Brief
```

Problem work is about understanding a decision-relevant **gap**. Opportunity work is about
naming a distinct **advantage**, value thesis, or response direction. An opportunity brief that
merely restates the problem as "solve X" has not done opportunity work — it is still a problem.

## Required Context

Before asking, inspect local context when it can answer the question:

- Read project instructions and context files when present: `AGENTS.md`, `CLAUDE.md`,
  `CONTEXT.md`, `CONTEXT-MAP.md`, `INDEX.md`, README files, docs, and ADRs.
- If a `CONTEXT-MAP.md` exists, identify the relevant bounded context before relying on or
  updating glossary language.
- Use the project's own vocabulary for briefs, strategy artifacts, customers, personas,
  workflows, evidence, and delivery gates.
- Search docs, transcripts, and analytics when the user references existing customers,
  personas, data, product behaviour, goals, or prior decisions.
- If a question can be answered from docs, explore instead of asking.

## Artifact Selection

When someone brings a fuzzy idea, **classify it first** — the artifact type drives every other
question:

- Raw signal → capture or cluster an **Observation** using the project's intake format.
- Clustered pain or possible gap → make a **Problem Candidate**.
- Uncertainty blocking promotion → write a **Discovery Question**.
- Validated decision-relevant gap → write a **Problem Brief** (or the local equivalent).
- Top-down value belief → make or test a **Strategic Thesis**.
- Possible value direction → make an **Opportunity Candidate**.
- Shaped strategic value thesis → write an **Opportunity Brief** (or the local equivalent).
- Need implementation truth → request a **Development Assessment** via `development-assessment`.
- Settled feature scope → hand off to `prd-authoring`; stop discovery.
- Approved PRD or brief → hand off to `issue-decomposition` for vertical-slice tickets.

If unsure, **default earlier** in the lifecycle and ask what decision the artifact must support.

For field templates, promotion tests, anti-patterns, and example questions per artifact, read
`references/brief-templates.md`.

## Interview Rules

- Ask **one** material question per turn. Never batch.
- Every question carries your **recommended answer** and the **reasoning or evidence** behind
  it, so the user can confirm in one word.
- After the question, **wait** for feedback. Do not answer your own question and continue.
- Walk dependencies in order: artifact type → outcome → affected user/client/persona → evidence
  → counter-evidence → uncertainty → decision → implementation-context need.
- Challenge vague terms with concrete language: "user", "client", "value", "engagement",
  "adoption", "analytics", "support", "market", "opportunity".
- Challenge conflicts with the local glossary or docs immediately: "The docs define X this way,
  but the plan implies Y. Which should win?"
- Stress-test boundaries with concrete edge cases that separate personas, workflows,
  permissions, states, or outcomes.
- Separate **capture from promotion**: raw observations are cheap; a promoted brief needs
  evidence and a decision use.
- Treat a Development Assessment as a decision **router**, not a full estimate or technical
  design — route it to `development-assessment`.
- End discovery only with a project artifact, a clear next discovery action, or an explicit
  no-change decision.

## Brief Quality Bar

A good **Problem Brief** states the gap **without prescribing the response**. It names the
affected outcome, affected persona / client segment, evidence, counter-evidence, decision
assumptions, and the next decision needed. It distinguishes evidence from interpretation.

A good **Opportunity Brief** names the **product advantage or value thesis**, not just the
problem it addresses. It links to a Problem Brief or Strategic Thesis, explains why now, names
target users / clients / outcomes, includes evidence and counter-evidence, and frames multiple
possible response directions — not a single predetermined feature.

## Worked Example — classifying a fuzzy idea, then a Problem Brief skeleton

> **User's idea:** "Customers keep emailing support to ask where their report went. We should
> build a notifications centre."
>
> **Turn 1 — classify before shaping:**
>
> **Question:** Is what we're holding a *Problem Brief* (a validated gap), or still a *Problem
> Candidate* built from support signals we haven't sized yet?
>
> **Recommended answer:** A Problem Candidate. "Customers keep emailing" is a signal cluster,
> not yet evidence of a sized, decision-relevant gap — and "build a notifications centre" is a
> solution, which a brief must not assume.
>
> **Why:** We don't yet know how many customers, which persona, or what outcome is harmed. We
> have a solution in search of a problem. Promote to a Problem Brief once we name the outcome,
> the segment, and the evidence.
>
> *(Wait. Then the next turn challenges "report went" — is the gap "report not produced",
> "report produced but not discoverable", or "no signal that it's ready"? Different gaps, different
> briefs.)*
>
> **Once promoted, the Problem Brief skeleton (gap, not solution):**
>
> ```markdown
> # Problem Brief — Report-ready status is invisible to the customer
>
> **Problem statement:** After a report is generated, customers have no in-product signal that
> it is ready, so they fall back to emailing support to confirm. The gap is *status visibility*,
> not the absence of any specific feature.
> **Affected outcome:** Time-to-first-view of a finished report; support load per report run.
> **Affected persona / segment:** Self-serve account owners on the standard tier.
> **Evidence:** N support tickets/month tagged "where is my report"; M of them within 24h of a run.
> **Counter-evidence:** Power users on the API never ask — they poll the status endpoint.
> **Decision assumptions:** Customers want to be told, not to poll.
> **Next decision needed:** Is this worth shaping into an opportunity, or is it a content/ops fix?
> ```
>
> Note what the skeleton does **not** contain: no "notifications centre", no UI, no channel
> choice. Those are response directions that belong to an Opportunity Brief or a PRD — not here.

## Handoff

When discovery is settled:

- **To a PRD** — hand off to `prd-authoring`. Synthesize from what is already known; do not
  reopen resolved questions to fill a template. Carry the brief's problem, outcome, personas,
  evidence, decision assumptions, and non-goals forward as inputs.
- **To tickets** — hand off to `issue-decomposition` once a PRD or brief is approved; it owns
  the vertical-slice breakdown and HITL/AFK classification.
- **To implementation truth** — when current product behaviour, existing capability, or
  feasibility could change the decision, emit a narrow Development Assessment request and route
  it to `development-assessment`. Never settle code-truth from intuition.

## Documentation

When reusable project language is resolved or changed, update the local glossary or context file
only if one exists and the user wants the result saved. Keep that file as vocabulary and routing
context — not a spec, scratch pad, or artifact store. Save a resulting brief only when the user
asks, or when the repo has an obvious location for discovery or product artifacts.

## Gotchas

- **An opportunity that just restates the problem is not an opportunity.** "Customers can't find
  reports" → "Improve report findability" names no advantage. The brief must state what value or
  edge the response creates, and be capable of generating more than one solution option.
- **Capturing is not promoting.** Raw observations and candidates are cheap and should stay
  cheap; a Problem Brief is a promotion that requires evidence, a named harmed party, and a
  decision it supports. Don't let a single support ticket masquerade as a validated gap.
- **A Problem Brief that prescribes a solution has skipped a step.** "Build X so users can Y" is
  a feature, not a gap. Strip the solution back out and name the gap.
- **A request is not a problem.** "The client asked for X" is a signal, not "the problem is the
  lack of X." Find the outcome behind the request.
- **Never batch questions.** One material question per turn, then wait — even when several feel
  related. A question without a recommended answer is a half-question.
- **A Development Assessment is a router, not an estimate.** Keep the request narrow enough to
  unblock one decision; don't ask for a full technical design.
