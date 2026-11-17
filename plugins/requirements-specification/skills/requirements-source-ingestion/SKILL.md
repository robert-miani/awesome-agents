---
name: requirements-source-ingestion
description: >
  Turns existing source materials — uploaded documents, prior specs and design
  docs, call or meeting transcripts, wiki/Confluence/Notion exports, and PRDs —
  into structured requirements with full source traceability. Owns inventory and
  assessment, per-source-type extraction patterns, the cross-reference and
  contradiction matrix, confidence levels (Confirmed/Likely/Inferred/Uncertain),
  source-reference citations, change-delta documentation, and a Questions & Gaps
  log. Use when the user uploads or references material and says anything like
  "based on this doc", "use this as input", "here's the existing spec", "here
  are the meeting notes", "build a spec from these", "create requirements from
  this transcript", or "update the existing specification".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Requirements Source Ingestion

## Overview

Analysts rarely start from a blank page. Requirements emerge from existing
documentation, recorded conversations, and accumulated team knowledge. Use this
skill to ingest, assess, and synthesise those source materials into structured
requirements where every requirement traces back to where it came from.

This skill owns the *ingestion* step — turning raw inputs into traceable,
confidence-rated extractions. It does **not** own downstream artifacts:

- Story and acceptance-criteria format is owned by **user-story-authoring**.
- Formal traceability artifacts (RTM, coverage analysis) are owned by
  **requirements-traceability-matrix**.
- Assessing the impact of changes against an existing baseline is owned by
  **gap-impact-analysis** — defer to it when the task is "update this spec".

## When to start ingestion

Trigger this workflow when the user:

- Uploads documents and says "based on this…", "use this as input", "here's the
  existing spec", "build a spec from these", "here are the meeting notes".
- Provides call transcripts, recordings, or interview notes.
- References wiki pages, Confluence/SharePoint/Notion exports, or PRDs.
- Asks to "update" or "build on" an existing specification.
- Provides multiple documents that need to be synthesised into one set.

## The five-step ingestion workflow

Follow these steps in order, regardless of source type.

### Step 1 — Inventory and assess

Before extracting anything, catalogue what you were given. Produce a **Source
Inventory Table** and show it to the user before proceeding:

| # | Document / Source | Type | Date / Version | Length | Relevance | Freshness | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Platform Spec v2.3 | Functional spec | Mar 2024 | 48 pp | High — baseline | 12 mo old — verify currency | Covers core workflow |
| 2 | Discovery Workshop — 15 Jan | Transcript | Jan 2025 | 45 min | High — new needs | Current | Product lead + ops present |
| 3 | Team Wiki — Onboarding | Wiki export | Unknown | 12 pp | Medium — context | Unknown — verify | May be stale |

Flag explicitly: estimated staleness, missing version info, sources that appear
to contradict each other, and gaps (things you would expect but were not given).

### Step 2 — Deep read and extract

Read each source and extract structured information using the pattern that
matches its type (see Extraction Patterns below). Give every extraction a stable
ID (`EXT-001`, `TR-001`, …) so it can be cited later.

### Step 3 — Synthesise and cross-reference

Combine extractions across sources, resolve or flag contradictions, and identify
gaps. When two or more sources are provided, produce a **Cross-Reference Matrix**
before writing the final requirements.

### Step 4 — Produce the structured requirements

Write the requirements with full source traceability — every requirement carries
a Source Reference and a confidence level. Hand story/AC formatting to
**user-story-authoring** and formal coverage tracking to
**requirements-traceability-matrix**.

### Step 5 — Flag gaps and questions

Always close with a **Questions & Gaps Log**: what the sources did not answer,
contradictions needing stakeholder resolution, and assumptions you made.

---

## Extraction Patterns

### Pattern 1 — Existing specs, design docs, prior requirement sets

These represent the current "as-is" state or a previous phase's "to-be" that has
since shipped. Extract into a table:

| Extract ID | Source doc | Section/Page | Category | Content | Status | Carry forward? |
|---|---|---|---|---|---|---|
| EXT-001 | Spec v2.3 | §3.2, p14 | Business rule | "Orders under threshold T auto-approve when validation passes" | Implemented | Yes — verify current threshold |
| EXT-002 | Spec v2.3 | §4.1, p22 | Integration | "Inbound data via REST API and a legacy batch file" | Implemented | Partially — batch to be retired |

Categories to extract: **business rules** (if-then logic, thresholds,
calculations, validation), **functional requirements** (behaviours, flows,
interactions), **non-functional requirements** (performance, security,
availability), **integration points** (APIs, feeds, upstream/downstream
systems), **data model elements** (entities, attributes, relationships),
**process steps** (stages, routing, exception handling), and **prior
assumptions** (flag each for revalidation — they may no longer hold).

Classify each extraction as **carry-forward**, **changed**, **new**, or
**retired**. Reference carried-forward requirements by source and section rather
than rewriting them. List retired requirements explicitly as out of scope with
rationale.

### Pattern 2 — Call transcripts and meeting notes

The richest but least structured source. Extract in a single pass into these
categories.

**a) Requirement statements** — listen for "we need", "it should", "the system
must", "I want to be able to", "currently we can't", "the problem is":

| Req ID | Speaker / Role | Timestamp / Context | Raw statement | Interpreted requirement | Confidence | Follow-up? |
|---|---|---|---|---|---|---|
| TR-001 | Priya (Product Lead) | 12:34 | "We need everything on one screen, not five tabs" | Consolidated single-screen view | High | No |
| TR-002 | Sam (Ops Manager) | 23:15 | "It would be nice to automate the chasing" | Automated follow-up with configurable rules | Medium | Yes — define "chasing" scope |

**b) Pain points** — problems with the current state, which inform current-state
narrative and gap analysis:

| Pain point | Speaker | Impact | Implied requirement |
|---|---|---|---|
| "We spend hours re-keying the same data" | Team Lead | Productivity loss, bottleneck | Automated data capture |

**c) Decisions made** — what was agreed: decision, made by, context,
implications.

**d) Open questions and action items** — question, raised by, assigned to, due,
status.

**e) Contradictions** — where stakeholders disagreed: the topic, each position,
and what resolution is needed.

**Language translation** — stakeholders speak informally; translate to
requirements language:

- "It would be nice if…" → *should* (desirable, not mandatory).
- "We absolutely need…" → *shall* (mandatory).
- "I hate it when…" → pain point → invert into a requirement.
- "Can we just…" → often hides complexity — flag for estimation.
- "Obviously it should…" → an assumption — document it explicitly.

When **multiple transcripts** are given: process each independently, then
cross-reference for requirements mentioned more than once (stronger signal),
contradictions between calls, and positions that evolved over time. Attribute
the consolidated extraction to specific calls.

### Pattern 3 — Wiki pages and PRDs

Semi-structured: they have headings and some organisation but vary widely in
currency and completeness.

**From PRDs** (which sit above requirement level), extract and decompose:

| PRD element | Extract | Maps to |
|---|---|---|
| Vision / objectives | Strategic goals, success metrics | Executive summary, success criteria |
| User personas | Roles, needs, pain points | Story roles, stakeholder register |
| Feature descriptions | High-level capabilities | Epics and themes |
| User journeys | Step-by-step interactions | Process flows, stories |
| Success metrics / KPIs | Measurable outcomes | Success criteria |
| Constraints / dependencies | Boundaries, external factors | Assumptions & constraints |

Decompose features into epics and stories, keeping each step traceable
(story → epic → feature → objective). Hand the actual story/AC wording to
**user-story-authoring**.

**From wiki pages**: build a page inventory (title, last-modified, author),
identify the canonical page per topic (most recent and authoritative), extract
from canonical pages, and cross-reference to validate currency. Flag any page
older than ~6 months and any topic covered by multiple conflicting pages.

---

## Cross-Reference Matrix

When two or more sources are provided, build this matrix to surface agreement,
contradiction, and gaps:

| Requirement area | Spec doc | Transcript | Wiki / PRD | Consistent? | Notes |
|---|---|---|---|---|---|
| Approval threshold | Spec: T1 | Workshop: T2 proposed | Wiki: T1 | No — increase proposed | Use workshop figure, flag for approval |
| Follow-up process | Spec: manual | Workshop: "automate it" | Wiki: manual | Consistent on as-is, change requested | New automation requirement |
| Fraud-style scoring | Not mentioned | Workshop: "need scoring" | PRD: scoring feature | Consistent — new capability | New, no baseline |

The matrix surfaces **confirmed** requirements (consistent across sources),
**contradictions** (need resolution), **gaps** (covered in some sources but not
others), and the **new / changed / carried-forward** classification.

---

## Citation, Confidence, and Change-Delta Templates

### Source Reference (every requirement carries one)

```
FR-045: Approval Threshold Update
Source(s):
  - Baseline:       Platform Spec v2.3, §3.2 (Mar 2024)
  - Change request: Discovery Workshop transcript, 15-Jan-2025, 23:15 (Priya, Product Lead)
  - Validation:     Steering minutes, 22-Jan-2025
```

For transcripts, always include speaker role and approximate timestamp/context so
stakeholders can verify their input was interpreted correctly.

### Confidence levels

| Confidence | Criteria | Action |
|---|---|---|
| **Confirmed** | Stated in 2+ sources, or formally approved | Include as-is |
| **Likely** | Stated clearly by an authoritative stakeholder in one source | Include, flag for validation |
| **Inferred** | Not stated but logically implied by other requirements | Include as assumption, flag for confirmation |
| **Uncertain** | Contradictory sources, or a casual mention without commitment | Send to Questions & Gaps Log; do not include as confirmed |

### Change delta (when a requirement changes from a prior spec)

```
FR-045: Approval Threshold
Source:   Platform Spec v2.3, §3.2
Previous: Orders under T1 auto-approve when validation passes
Proposed: Orders under T2 auto-approve when validation passes AND risk score < N
Rationale: Threshold increase approved by Product Lead (Workshop 15-Jan-2025);
           risk gate added per operations request.
Impact:   New dependency on a scoring service.
```

For deep impact analysis of such changes against the existing baseline, defer to
**gap-impact-analysis**.

---

## Worked Example

**Input:** the user uploads "Platform Spec v2.3" (an old functional spec) and a
"Discovery Workshop — 15 Jan" transcript, and says *"Build a requirements set
from these — we're refreshing the platform."*

**Step 1 — Inventory:**

| # | Source | Type | Date | Relevance | Freshness |
|---|---|---|---|---|---|
| 1 | Platform Spec v2.3 | Functional spec | Mar 2024 | High — baseline | 12 mo — verify |
| 2 | Discovery Workshop 15-Jan | Transcript | Jan 2025 | High — new needs | Current |

**Step 2 — Extract:**

- `EXT-001` (Spec §3.2): "Orders under T1 auto-approve when validation passes" —
  business rule, Implemented, carry-forward (verify threshold).
- `TR-001` (Workshop 12:34, Priya): "everything on one screen" → consolidated
  single-screen view — High confidence.
- `TR-002` (Workshop 23:15, Sam): "automate the chasing" → automated follow-up —
  Medium confidence, follow-up needed.

**Step 3 — Cross-reference matrix:**

| Area | Spec | Transcript | Consistent? | Notes |
|---|---|---|---|---|
| Approval threshold | T1 | T2 proposed | No | Use workshop figure, flag for approval |
| Screen layout | Multi-tab | Single screen wanted | Change requested | New requirement |
| Follow-up | Manual | "Automate it" | As-is agrees, change requested | New requirement |

**Step 4 — Structured requirements** (each with Source Reference + confidence):

- `FR-045` Approval threshold update — *changed* (delta documented), Likely.
- `FR-046` Consolidated single-screen view — *new*, Confirmed.
- `FR-047` Automated follow-up — *new*, Likely (scope follow-up open).

**Step 5 — Questions & Gaps Log:**

- New threshold T2 not formally approved — confirm with Product Lead.
- "Chasing" scope undefined (email only? other channels?) — clarify with Sam.
- No source covers error/exception handling — gap, request input.

---

## Gotchas

- **Show the inventory before extracting.** Users often hand over a stale or
  wrong-version document; surfacing freshness early prevents wasted work.
- **Never silently merge contradictions.** If two sources disagree, record both
  positions in the matrix and route the conflict to the Questions & Gaps Log —
  do not pick a winner on the user's behalf.
- **Keep "from source" separate from "interpretation."** Every requirement must
  show whether it was stated in a source or inferred by you; Inferred and
  Uncertain items must be flagged, never presented as Confirmed.
- **Cite to the smallest unit.** Section and page for docs; speaker role and
  timestamp for transcripts; page title and last-modified date for wikis. "It's
  in the spec somewhere" is not a citation.
- **Prior-phase assumptions expire.** Assumptions carried from an old spec may no
  longer hold — flag each for revalidation rather than carrying it forward as
  fact.
- **Don't reinvent neighbouring skills.** Story/AC wording → user-story-authoring;
  formal coverage/RTM → requirements-traceability-matrix; change-impact analysis
  against a baseline → gap-impact-analysis.
- **Decompose PRDs; don't paste them.** PRD feature language is too coarse to be
  a requirement — break features into epics and stories with traceability intact.
- **A single casual mention is not a requirement.** "Obviously it should…" is an
  assumption and "it would be nice…" is a *should*, not a *shall* — translate
  before recording.
