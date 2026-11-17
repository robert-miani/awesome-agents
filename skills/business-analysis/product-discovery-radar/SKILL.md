---
name: product-discovery-radar
description: >
  Run a product-discovery Radar loop that scans defined lanes (usage, customer/client,
  delivery, market) over a source window, produces evidence-bearing signals only when
  source material crosses a signal threshold, emits signal suggestions, and gates them
  through a human review before they become durable product primitives (problem/opportunity
  candidates and briefs). Optionally scaffolds a lightweight "product brain" directory and
  starter templates. Use for "product discovery", "radar scan", "scan for signals",
  "find product opportunities", "problem/opportunity discovery", "noise vs signal review",
  or "set up a product brain".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Product Discovery Radar

## Overview

Turn raw source-system evidence into durable product understanding through a disciplined
loop. Radar scans a defined lane over a source window, preserves source material as a
**signal** only when it crosses a **signal threshold**, and emits **signal suggestions**.
A human **review gate** then accepts, revises, rejects, or defers each suggestion before any
durable product primitive (problem/opportunity candidate or brief) changes.

This skill owns: the lane model, signal thresholds, the noise-vs-signal review gate, the
candidate to brief lifecycle, and the signal/brief quality bars. It does **not** own runtime
execution (see "Out of Scope").

The maintained product-reference model is generically called a **product brain**: a
synthesized model of current product understanding over source systems, not a data lake,
backlog, wiki, or task tracker. Source systems remain canonical for raw facts; the product
brain stores synthesized understanding with **evidence references** back to those sources.

## The Radar Loop

```text
Radar run -> Signal -> Signal Suggestion -> Review Gate -> Product State Change
```

1. **Pick a lane and source window.** One run targets one lane (or `all`) over an explicit
   date window.
2. **Scan source adapters for that lane.** Read the source handles the lane defines.
3. **Apply signal thresholds.** Preserve a signal only when source material crosses at least
   one threshold. Otherwise treat it as noise.
4. **Write one radar report.** Each run writes exactly one report file under
   `radar/signals/`, even when zero signals crossed threshold (a zero-signal report is a
   valid record that the run happened).
5. **Emit signal suggestions.** Each signal may carry one or more proposed state changes.
   Suggestions are proposals only — they never auto-update durable state.
6. **Route through the review gate.** A human accepts, revises, rejects, or defers each
   suggestion, recording a short rationale in the report.
7. **Apply accepted changes.** Only accepted/revised suggestions create or update candidates,
   briefs, theses, or other primitives.

Use `assets/signal-template.md` for the report. Lead with TLDR, insight, and suggestions;
put sources and caveats last.

## The Four Lanes

A **lane** is a scoped radar focus area defining which sources, thresholds, and
interpretation rules a run uses. The starting four:

| Lane | Detects | Typical suggestions |
|------|---------|---------------------|
| **Usage** | Adoption, engagement, findability, retention, recurring-value changes | Problem/opportunity candidate, discovery question, outcome evidence note |
| **Customer/Client** | Customer, sales, support, discovery, account-facing themes | Problem/opportunity candidate, persona/client update, discovery question |
| **Delivery** | Defects, incidents, product debt, shipped-change behavior | Problem candidate, capability update, development assessment request |
| **Market** | Competitor, category, regulatory, external-expectation movement | Opportunity candidate, strategic thesis, market/positioning update |

Discovery source material flows through the **Customer/Client** lane — do not create a
separate discovery lane. Human-dropped material is routed by topic into an existing lane via
a local-directory source adapter, never as a new lane (lanes are scoped by what evidence is
*about*, not how it arrived).

### Adding a lane

Add a lane only when a genuinely distinct source scope and interpretation rules exist. Copy
`assets/radar-lane-template.md` into `radar/lanes/<lane>.md` and fill in: purpose, cadence,
source adapters (with known bias each), and lane-specific threshold interpretation. Lanes
share the same threshold vocabulary; only interpretation differs per lane.

## Signal Thresholds

Radar creates a signal only when source material crosses at least one threshold. The
threshold that triggered preservation becomes the signal's **type**:

- **pattern** — repeated behavior/theme across users, clients, sessions, or areas
- **anomaly** — material deviation from a recent baseline
- **trend** — repeated movement across multiple source windows
- **high-weight-source** — change affecting a strategically important client/persona/account
- **strategic-relevance** — movement tied to an active outcome, thesis, or product advantage
- **contradiction** — evidence that weakens an existing product interpretation
- **time-sensitive-risk-or-opening** — matters before a launch, renewal, review, or deadline

Use a **signal priority profile** (project-specific, qualitative — not a scoring model) to
decide whether material crosses or elevates a threshold, especially `high-weight-source`,
`strategic-relevance`, and `time-sensitive-risk-or-opening`. State the priority basis in one
short sentence tied to evidence.

## The Review Gate (noise vs signal)

The review gate is the boundary between noise and durable product state. Rules:

- Signals and suggestions **never** auto-update candidates, briefs, theses, or other durable
  primitives. Only the review gate applies changes.
- Every accepted, revised, rejected, or deferred suggestion gets a short **review rationale**.
- Review decisions are recorded **locally inside the reviewed artifact** (the radar report).
  Promote to a separate, durable **product decision** only when the decision outlives the
  artifact.
- The gate optimizes for quality of product judgment; auditability is a required byproduct and
  speed is secondary.

## Candidate to Brief Lifecycle

```text
Signal -> Problem/Opportunity Candidate -> Problem/Opportunity Brief
```

- A **problem candidate** is a provisional interpretation that a real problem may exist — not
  an intake record. Use `assets/problem-candidate-template.md`. Store in
  `problems/candidates/`.
- An **opportunity candidate** is a provisional interpretation that a value area may exist,
  carrying a possibly incomplete **product advantage**. Use
  `assets/opportunity-candidate-template.md`. Store in `opportunities/candidates/`.
- Candidates carry evidence references, current interpretation, confidence, remaining
  uncertainty, freshness, and a review trigger. Add a **discovery question** only when its
  answer would materially change the next product decision (vague "research more" questions
  do not qualify).
- A **problem brief** describes a decision-relevant gap and the outcome it affects. Use
  `assets/problem-brief-template.md`. Store in `problems/briefs/`.
- An **opportunity brief** states a distinct **product advantage** (beneficiary, comparison
  point, advantage type, timing rationale, validation path) and must be justified by at least
  one linked problem brief **or** one linked strategic thesis. Use
  `assets/opportunity-brief-template.md`. Store in `opportunities/briefs/`.

Hand off to **`problem-opportunity-brief`** to shape candidates into briefs (the radar feeds
it), **`prd-authoring`** once an opportunity is settled, **`backlog-prioritization`** to rank
opportunities, and **`stakeholder-communications`** for signal/report write-ups.

## Optional Scaffold

When the user asks to set one up, scaffold a lightweight product brain into the repo. Confirm
the root directory name first (default `product-brain/`), then create:

```text
product-brain/
  radar/lanes/          (lane definitions — seed usage, customer-client, delivery, market)
  radar/signals/        (radar run outputs / reports)
  problems/{candidates,briefs}/
  opportunities/{candidates,briefs}/
  decisions/            (durable product decisions only)
  CONTEXT.md            (project product glossary — generated from a stub)
```

Steps:

1. Confirm the root directory name and which lanes to seed (default: all four).
2. Create the directory tree above.
3. Copy the matching `assets/` templates into place: `signal-template.md` and
   `radar-lane-template.md` under `radar/`, the candidate/brief templates under
   `problems/` and `opportunities/`.
4. Seed one lane file per chosen lane from `radar-lane-template.md`, prefilled with the
   lane's purpose and starter threshold interpretation from "The Four Lanes" above.
5. Generate a `CONTEXT.md` stub holding the project's product glossary (product brain, signal,
   threshold, review gate, candidate, brief, product advantage, strategic thesis, discovery
   question) — terms only; the team fills in project specifics. Do not maintain a separate
   glossary category.

Keep the scaffold minimal: do not pre-create empty candidate/brief files or import source data.

## Out of Scope

Runtime **execution config** lives **outside** the product brain and outside this skill:
connectors and connector IDs, credentials/secrets, schedules and cadence automation, retries,
and run logs. Lane definitions may name a *baseline/example* connector for context, but never
secrets or runtime-only details. This skill defines the discovery methodology and (optionally)
the static scaffold; wiring and scheduling are a separate concern.

## Worked Example

A daily Usage lane run over `2026-06-15 to 2026-06-16` finds saved-search creation up ~40%
week-over-week, concentrated in a high-weight account.

Signal (in the radar report):

```yaml
lane: usage
signal_type: anomaly
secondary_types: [high-weight-source]
confidence: moderate
priority_basis: "Spike concentrated in a top renewal account ahead of a Q3 renewal review."
```

> **SIG-001 — Saved-search usage spike in renewal account.** Saved searches per active user
> rose ~40% WoW, ~70% of it from one strategic account. Suggests users are working around weak
> result recall rather than finding answers directly.
>
> **SUG-001** action: create a problem candidate · target: `problems/candidates/` · why:
> recurring workaround behavior in a renewal-critical account before a review window.

Review gate accepts SUG-001 (rationale: "Pattern is account-concentrated and renewal-timed;
worth a tracked candidate"). The accepted suggestion creates:

```markdown
---
title: "Users save searches to compensate for weak result recall"
status: active
confidence: moderate
created: "2026-06-16"
last_reviewed: "2026-06-16"
review_trigger: "Saved-search rate change, or renewal-account feedback on search."
---

## Current Interpretation
Users in a strategic account create saved searches as a workaround because primary search
results do not reliably surface what they need.

## Evidence References
- `product-brain/radar/signals/2026-06-16-usage.md#SIG-001`

## Discovery Questions
- Are saved searches a workaround for poor recall, or an intended power-user behavior?
```

## Gotchas

- **Radar auto-deciding.** Radar emits suggestions; it must never promote candidates, edit
  briefs, or change theses on its own. The review gate is the only path to durable state.
- **One file per signal.** A run produces one radar report containing zero or more locally
  identified signals (`SIG-001`, `SIG-002`, …) — not a file per signal.
- **Opportunity that just restates a problem.** "Improve search recall" restates the problem.
  A valid opportunity names a **product advantage** (e.g., "own renewal-event content discovery
  as a repeat-engagement loop") with beneficiary, comparison point, and timing.
- **Importing all source data.** Radar is a processing function. Cite source handles and short
  excerpts; do not copy entire exports, transcripts, or analytics dumps into the product brain.
- **Discovery-question padding.** Do not add a discovery question just because the template has
  a section. Add one only when its answer changes the next decision.
- **Zero-signal runs are not failures.** Still write the report so the scan is on record.
