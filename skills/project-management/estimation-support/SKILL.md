---
name: estimation-support
description: >
  Support team estimation of user stories and epics using story points (modified Fibonacci),
  T-shirt sizing, and multi-dimensional complexity scoring. Derives a complexity indicator that
  gives the team a starting point for relative estimation and planning poker — it informs, never
  replaces, the team's own estimate. Surfaces complexity factors such as integration, data
  migration, unknowns, and cross-team dependencies. Use when the user says "estimate this story",
  asks for "story points", a "t-shirt size", "how big is this", a "complexity score", wants help
  running "planning poker", or needs to size epics for roadmap planning.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Estimation Support

## Overview

Help a team size user stories and epics. This skill produces estimation inputs — a story-point
suggestion, a T-shirt size, and a multi-dimensional complexity indicator — that give the team a
**starting point** for discussion. It surfaces the complexity factors that drive effort so the
team can talk about them explicitly.

The complexity indicator is an input to a conversation, not a verdict. Relative estimation is a
team activity: the team owns the final number. Use this skill to prepare the ground, expose
hidden complexity, and facilitate — not to hand down an estimate.

Estimate the stories produced by **user-story-authoring**. The effort signal this skill produces
feeds **backlog-prioritization** (effort is one half of value-vs-effort) and **sprint-planning**
(estimates are compared against team capacity).

## Estimation Approaches

Pick the approach that matches the granularity of what is being sized:

| Approach | Use for | Granularity |
|---|---|---|
| Story points | Refined stories the team will pull into a sprint | Single story |
| T-shirt sizing | Epics and roadmap items, pre-refinement | Epic / initiative |
| Complexity scoring | Either — to expose *why* something is large | Diagnostic |

### Story points (modified Fibonacci)

Story points measure relative effort — complexity, uncertainty, and volume of work — not hours.
The gaps in the Fibonacci scale (1, 2, 3, 5, 8, 13, 21) force a deliberate choice between sizes
and discourage false precision.

| Points | Relative effort | Typical characteristics |
|---|---|---|
| 1 | Trivial | Config change, text update, single-field addition |
| 2 | Small | Simple CRUD, straightforward UI change, single validation rule |
| 3 | Moderate | Multi-field form, simple business rule, single integration touchpoint |
| 5 | Medium | Non-trivial logic, multiple validation rules, conditional UI behaviour |
| 8 | Large | Multi-system integration, edge-case-heavy rules, significant data transformation |
| 13 | Very large | Major feature, multiple integration points, complex data migration |
| 21 | Epic-sized | Too large for one sprint — decompose before estimating |

Assess all three dimensions, not just coding effort:

| Dimension | What to assess |
|---|---|
| **Complexity** | How intricate is the logic? How many rules, edge cases, conditional paths? |
| **Uncertainty** | How well understood is the requirement? Unknowns or external dependencies? |
| **Volume** | How much work even if it is straightforward? (mapping 200 fields is high volume, low complexity) |

### T-shirt sizing

For roadmap-level estimation when story points are too granular. Keep the sprint equivalents as
rough guidance for planning conversations, not commitments.

| Size | Sprint equivalent | Characteristics |
|---|---|---|
| **XS** | Fraction of a sprint | Config, minor change, defect fix |
| **S** | < half a sprint | Simple feature, single component, clear requirements |
| **M** | Half to one sprint | Multi-component feature, some integration, moderate complexity |
| **L** | 1-2 sprints | Cross-system feature, significant logic, multiple stories |
| **XL** | 2-4 sprints | Major capability, multiple integration points, data-migration element |
| **XXL** | 4+ sprints | Initiative-level — decompose into L/XL chunks before sizing |

## Complexity Scoring

Score each dimension 1-5 and sum them for a total complexity score. The score is the **complexity
indicator** — a structured way to expose what is driving effort, so the team estimates with its
eyes open.

| Dimension | 1 (Low) | 3 (Medium) | 5 (High) |
|---|---|---|---|
| **Business rules** | Simple, few rules | Moderate, conditional logic | Complex, multi-factor, edge cases |
| **Data** | Single entity, standard types | Multiple entities, transformations | Complex model, data migration, quality issues |
| **Integration** | None or single internal API | 2-3 systems, standard protocols | Multiple external systems, real-time + batch, security |
| **UI/UX** | No UI or simple display | Forms with validation | Complex workflow UI, conditional rendering, accessibility |
| **Testing** | Straightforward happy path | Multiple scenarios, edge cases | Complex test-data setup, integration/performance testing |
| **Dependencies** | Self-contained | One known internal dependency | Cross-team or external dependencies, coordination needed |
| **Uncertainty** | Fully understood, done before | Some unknowns, new tech | Significant unknowns, R&D element, unclear requirements |

**Score ranges (7 dimensions, range 7-35):**

| Total | Indicator | Suggested starting point |
|---|---|---|
| 7-14 | Low complexity | ~ 1-3 points / S-M — straightforward delivery |
| 15-24 | Medium complexity | ~ 5-8 points / M-L — plan carefully |
| 25-35 | High complexity | ~ 13+ points / L-XL — decompose or run a spike first |

### Complexity factors to surface

Always call out factors that quietly inflate effort, even when the happy path looks small:

| Factor | Why it adds effort |
|---|---|
| **Integration** | Each system boundary adds error handling, contract negotiation, and test surface |
| **Data migration** | Backfill, transformation, reconciliation, and rollback all add hidden work |
| **Unknowns** | Unvalidated assumptions widen the estimate range and warrant a spike |
| **Cross-team dependencies** | Coordination and waiting time are not captured by coding effort alone |
| **New technology** | Learning curve and unproven tooling add uncertainty |
| **Non-functional requirements** | Performance, security, and accessibility add work that is easy to forget |

## Deriving the Complexity Indicator

1. Read the story or epic (from **user-story-authoring** where available) and its acceptance criteria.
2. Score each of the seven complexity dimensions 1-5.
3. Sum the scores and map the total to the indicator band above.
4. Note any complexity factors that are present (integration, data migration, unknowns, dependencies).
5. State a **confidence level** — an estimate without confidence is misleading.
6. Present the indicator as a *suggested starting point* and hand the estimate back to the team.

### Confidence levels

| Level | Meaning | Typical range | When |
|---|---|---|---|
| **High** | Well understood, done before, clear AC | ±20% | Refined stories with acceptance criteria |
| **Medium** | Generally understood, some unknowns | ±40% | Epics with outline scope, pre-refinement stories |
| **Low** | Significant unknowns, new tech, unclear scope | ±60%+ | Roadmap-level or early-stage items |

## Relative Estimation & Planning Poker

The complexity indicator feeds a team conversation; it does not end it.

1. **Establish reference stories.** Agree on a handful of past stories the team knows well as
   anchors (e.g. "a 2 looks like X", "an 8 looks like Y"). Estimate everything *relative* to these.
2. **Present the story and its complexity indicator** as context, not as the answer.
3. **Run planning poker.** Each estimator picks a card privately, then all reveal at once. Revealing
   simultaneously prevents anchoring on the loudest voice or the facilitator's number.
4. **Discuss the spread, not the average.** When estimates diverge, ask the high and low estimators
   to explain. The disagreement usually reveals a hidden complexity factor or a scope difference.
5. **Re-vote** until the team converges. Do not average the cards — converge through discussion.
6. **Decompose or spike** anything that lands at 13+ points or surfaces a Low confidence level.

> **This skill informs estimation; it does not replace it.** The complexity indicator is a
> starting point and a checklist of factors to discuss. The team's relative estimate — grounded
> in its own velocity and reference stories — is the real number.

## Output

Produce a Markdown complexity table. Optionally emit a parallel `.csv` with the same columns for
import into a tracker or spreadsheet — never depend on `.xlsx`.

**Story-level table:**

```markdown
| Story | Complexity score | Indicator | Suggested points | Confidence | Factors | Notes |
|---|---|---|---|---|---|---|
```

**Epic-level table:**

```markdown
| Epic | T-shirt size | Est. sprints | Complexity score | Confidence | Key factors | Dependencies |
|---|---|---|---|---|---|---|
```

## Worked Example

Two refined stories scored against the complexity dimensions (BR=Business rules, D=Data,
I=Integration, UI, T=Testing, Dep=Dependencies, U=Uncertainty):

| Story | BR | D | I | UI | T | Dep | U | Score | Indicator | Suggested points | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Add a read-only status field to the account summary screen | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 7 | Low | 2 | High |
| Sync customer records from an external partner API into the local store | 3 | 4 | 5 | 1 | 4 | 4 | 4 | 25 | High | 13 | Low |

Indicator narrative for the team:

- **Story 1** is a clean low. Every dimension is a 1; no factors to surface. Suggested starting
  point: **2 points**, high confidence. Likely uncontroversial in planning poker.
- **Story 2** scores 25 — high complexity. The drivers are an **external integration**, a
  **data-migration/sync** element, **cross-team dependency** on the partner API, and real
  **unknowns** about the partner contract. Suggested starting point: **13 points**, but confidence
  is **Low**. Recommend a spike on the partner API and decomposing into "ingest", "transform", and
  "reconcile" stories before committing. Bring this to planning poker as a starting point, not a
  conclusion.

## Gotchas

- **Points are not time.** Story points are relative effort, not hours or days. Do not convert
  points to time per story; let velocity emerge over several sprints instead. Reporting "1 point =
  X hours" reintroduces the false precision the Fibonacci gaps exist to prevent.
- **Anchoring kills estimates.** Stating a number before the team votes — including this skill's
  complexity indicator — pulls everyone toward it. Reveal planning-poker cards simultaneously and
  present the indicator as a discussion prompt, not the answer.
- **Do not estimate unknowns — spike them.** When uncertainty scores high or confidence is Low,
  a point estimate is guesswork. Recommend a time-boxed spike to retire the unknown, then estimate.
- **Big numbers mean decompose, not commit.** Anything at 13+ points or XL+ should be broken down
  before it enters a sprint. A large estimate is a signal to split the work, not to plan a marathon.
- **The indicator is an input, not a ruling.** Never present the complexity score as the team's
  estimate. It is a starting point and a checklist of factors. The team owns the final number.
- **Average the discussion, not the cards.** Converge through conversation about the spread.
  Mechanically averaging planning-poker votes hides the disagreement that reveals real complexity.
