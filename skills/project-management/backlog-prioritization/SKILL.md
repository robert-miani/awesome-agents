---
name: backlog-prioritization
description: >
  Rank a backlog or candidate features for upcoming sprints or PIs using structured
  scoring frameworks (RICE, ICE, value/effort 2x2, MoSCoW, WSJF). Makes scoring inputs
  explicit, produces a ranked and defensible ordering, and frames trade-offs when
  stakeholders disagree. Use when the user wants to "prioritize the backlog", asks
  "what should we build next", mentions "RICE", "ICE", "WSJF", "MoSCoW", "value vs
  effort", or asks to "rank these features" / "sequence the roadmap" for a sprint or PI.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Backlog Prioritization

## Overview

Rank a set of candidate items so the team can decide what to build next. The job is to
pick a framework that fits the decision, make the scoring inputs explicit, apply the
framework's formula consistently, and return a ranked table that the team can defend and
revisit. This is a planning/execution skill: it sequences known candidates. It does not
discover problems, write requirements, or estimate effort from scratch.

Use it when there are more candidate items than capacity and someone needs a defensible
ordering — not just a vibe.

## Scope

Owns:

- Choosing the right framework for the decision at hand
- Making every scoring input explicit and labeled with its source or assumption
- Applying the formula consistently across all items
- Producing a ranked Markdown table (and an optional parallel `.csv`)
- Framing competing goals when stakeholders disagree — without picking a side

Does not own:

- Effort sizing from first principles — that comes from **estimation-support**
- Translating the ranked list into a sprint commitment — that is **sprint-planning**
- Upstream value framing and problem definition — that is **problem-opportunity-brief**

Pull effort numbers from **estimation-support** and value framing from
**problem-opportunity-brief** as inputs rather than inventing them here.

## Workflow

1. Confirm the candidate set. List every item being ranked. If the list is vague
   ("make it faster"), reframe each item as a concrete deliverable before scoring.
2. Confirm the goal. Prioritization is always relative to a metric or objective
   ("activation rate", "support ticket volume", "PI objective X"). State it.
3. Pick a framework using the selector below.
4. Gather inputs. For each item, fill in the framework's fields. Mark each value as
   `measured`, `estimated`, or `assumed`. Pull effort from estimation, not guesswork.
5. Score consistently. Apply the same formula and the same scales to every item.
6. Rank and return a Markdown table sorted by score, plus a short rationale.
7. Surface trade-offs. Where the ranking is close, where guardrails or dependencies
   override the score, or where stakeholders disagree, call it out explicitly.

## Framework Selector

Pick one. Do not blend frameworks in a single ranking.

| Use | When |
|-----|------|
| **RICE** | You have rough quantitative inputs (how many users, how big the effect) and want a single comparable score. Default for product feature backlogs. |
| **ICE** | You want RICE's spirit but lack reliable reach data — early-stage or experiment backlogs. Faster, cruder. |
| **Value/Effort (2x2)** | A small set (≤ ~15 items) and you want a fast visual sort into quick-wins / big-bets / fill-ins / time-sinks. Great for a workshop. |
| **MoSCoW** | You need a release/scope cut (Must / Should / Could / Won't), not a fine-grained order — common for MVP scoping or a fixed-date release. |
| **WSJF** | A SAFe/PI context where you want to maximize economic value per unit time. Use when items have comparable job sizes and you care about cost of delay. |

If the user names a framework, use it. If they don't, default to RICE for a feature
backlog, value/effort for a quick workshop sort, MoSCoW for a scope cut, and WSJF in a
SAFe PI-planning context.

## Scoring Methods

### RICE

`Score = (Reach × Impact × Confidence) / Effort`

- **Reach** — number of people/events affected in a fixed period (e.g. users per quarter). Use the same period for every item.
- **Impact** — effect on the goal metric per affected user. Use a fixed scale: `3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal`.
- **Confidence** — how sure you are of the reach and impact: `100% = high, 80% = medium, 50% = low`. Below 50% means do discovery, not delivery.
- **Effort** — person-months (or person-weeks) of total team effort. Keep the unit identical across all items.

Higher score = higher priority.

### ICE

`Score = (Impact × Confidence × Ease) / 1` (often averaged, but the product form ranks the same)

Score each of **Impact**, **Confidence**, **Ease** on the same 1–10 scale. Ease replaces
RICE's effort (high ease = low effort). Use when you cannot defend a reach number.

### Value / Effort (2x2)

Plot each item on two axes — value (to the stated goal) and effort — each rated
`High / Medium / Low`. The four quadrants:

- **High value, low effort → Quick wins** (do first)
- **High value, high effort → Big bets** (plan deliberately)
- **Low value, low effort → Fill-ins** (do if slack)
- **Low value, high effort → Time-sinks** (drop or defer)

Output the items grouped by quadrant, quick-wins first.

### MoSCoW

Bucket each item into **Must**, **Should**, **Could**, or **Won't (this time)**.
"Must" means the release fails without it — keep that bucket small. This produces a
scope cut, not a strict 1-N order; combine with another framework if you need ordering
inside a bucket.

### WSJF

`WSJF = Cost of Delay / Job Size`

where `Cost of Delay = User/Business Value + Time Criticality + Risk Reduction / Opportunity Enablement`.

Score each Cost-of-Delay component and Job Size on a relative scale (the Fibonacci-like
`1, 2, 3, 5, 8, 13, 20` is common). Rank highest WSJF first — it delivers the most value
per unit of effort soonest.

## Making Inputs Explicit

The ranking is only as trustworthy as its inputs. For every score:

- Label each value `measured` (from data), `estimated` (from a sized ticket), or `assumed` (a guess to be validated).
- Cite the source of measured values (analytics event, support volume, A/B result).
- Carry effort from **estimation-support**, not from intuition at the prioritization table.
- Keep scales fixed across all items — the same Impact scale, the same Effort unit, the same period for Reach.

### Avoid false precision

- Round scores. A RICE score of `42` and `41.7` are the same decision; report whole numbers or one decimal at most.
- Treat near-ties as ties. If two items are within ~10% of each other, say so and let a human break the tie on strategy or dependency, not on the second decimal.
- Do not invent reach numbers to fill a column. If reach is unknown, use ICE instead of fabricating RICE precision.
- The score sequences a conversation; it does not end one.

## Output

Return a ranked Markdown table sorted by score, highest first, with a Rank column and
every scoring input shown. Follow it with a 2–4 line rationale and any trade-offs.

When the user wants the data in a spreadsheet, also offer a parallel `.csv` with the same
columns — never an `.xlsx` or any binary format.

### Worked example (RICE)

Goal: increase trial-to-paid conversion. Effort in person-months, pulled from estimation.

| Rank | Feature | Reach (users/qtr) | Impact | Confidence | Effort (pm) | RICE Score | Notes |
|------|---------|-------------------|--------|------------|-------------|-----------|-------|
| 1 | Guided onboarding checklist | 8,000 | 2 | 80% | 2 | **6,400** | Reach measured; impact estimated |
| 2 | In-app upgrade prompt | 5,000 | 2 | 100% | 2 | **5,000** | All inputs measured from A/B test |
| 3 | SSO for enterprise trials | 1,200 | 3 | 80% | 3 | **960** | Reach assumed — small trial segment |
| 4 | Dark mode | 9,000 | 0.5 | 80% | 4 | **900** | High reach, low impact on the goal |

Rationale: the onboarding checklist and upgrade prompt are within ~25% and both clear
quick wins — sequence them first; the team can swap their order on dependencies. SSO and
dark mode score far lower against *this* goal. Dark mode's high reach is a trap: it
touches many users but barely moves conversion.

Trade-off to surface: SSO ranks low here but may be a sales-blocking guardrail for the
enterprise segment — flag it for the stakeholder rather than silently burying it at #3.

Parallel `.csv`:

```csv
rank,feature,reach,impact,confidence,effort_pm,rice_score,notes
1,Guided onboarding checklist,8000,2,0.8,2,6400,reach measured; impact estimated
2,In-app upgrade prompt,5000,2,1.0,2,5000,all inputs measured from A/B test
3,SSO for enterprise trials,1200,3,0.8,3,960,reach assumed — small trial segment
4,Dark mode,9000,0.5,0.8,4,900,high reach low impact on the goal
```

## Gotchas

Correct these before returning a ranking:

- **Vanity precision.** Reporting scores to three decimals implies certainty the inputs do not have. Round, and treat near-ties as ties.
- **Incomparable effort units.** Mixing person-months for one item and story points for another breaks the formula. One unit, every item — reconcile through **estimation-support** first.
- **Ignoring guardrails and dependencies.** A high score does not override "this must not regress" guardrails, a hard release dependency, or a compliance/contractual must. Score, then check the top of the list against these and re-order or annotate.
- **Optimizing the wrong metric.** A high-reach, low-impact item (like dark mode above) can top a list if Impact is under-weighted. Always rank relative to the stated goal, not generic "value".
- **Blending frameworks.** Don't average a RICE score with a MoSCoW bucket. Pick one framework per ranking; use a second only to order within a bucket.
- **Treating the output as final.** The score is an input to a planning decision, not the decision. When stakeholders disagree, frame the competing goals and the trade-off — do not pick a side with the math.
- **Fabricating inputs to fill a column.** If you can't defend Reach, switch to ICE. Don't invent a number so RICE looks complete.
