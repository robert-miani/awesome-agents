---
name: sprint-planning
description: Run sprint or iteration planning end to end — set a single clear Sprint Goal, verify Definition of Ready on candidate items and confirm the Definition of Done, compute realistic capacity from velocity, focus factor, and team availability, select and dependency-order a commitment that serves the goal, surface risks and blockers, and record a concise sprint plan. Use when the user wants to plan the sprint, define a sprint goal, check definition of ready or definition of done, do sprint capacity planning, decide what the team can commit to, build a sprint plan, or run iteration or PI planning.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Sprint Planning

## Overview

Plan a sprint so the team commits to a realistic, dependency-ordered set of work that serves one clear Sprint Goal. Use this skill when the task is to run sprint or iteration planning, decide what to commit to, or produce a sprint plan.

A sprint plan is a commitment, not a wish list. Every committed item must be Ready, must fit within honest capacity, and must contribute to the single Sprint Goal. Do not pull items that are not Ready, and do not commit beyond capacity because the backlog "looks important."

This skill owns planning and execution readiness. It does not own backlog ordering (see **backlog-prioritization**), item sizing (see **estimation-support**), story shape and acceptance criteria (see **user-story-authoring**), or mid-sprint tracking (see **sprint-progress-reporting**).

## Inputs to gather

Before planning, collect the minimum context:

- Sprint length and start/end dates
- The ordered, prioritized backlog the team pulls from
- Estimates (story points or item count) for candidate items
- Historical velocity (last 3–6 sprints if available)
- Team roster and availability for the sprint (leave, holidays, part-time, shared members)
- Carryover from the prior sprint (unfinished committed work)
- Known dependencies, external blockers, and the agreed Definition of Done

If any of these are missing, state the assumption you are making and proceed.

## Workflow

Run these steps in order.

1. **Set the Sprint Goal.** Write one sentence describing the single outcome this sprint serves. The goal frames every selection decision below. If the candidate work cannot be summarized as one coherent goal, the sprint is unfocused — flag it and propose the most valuable single goal.
2. **Verify Definition of Ready.** Check each candidate item against the DoR checklist. Items that fail are not eligible for commitment. List what each failing item needs before it can be pulled.
3. **Confirm Definition of Done.** Restate the team's DoD so the commitment is sized against finished work, not just code. If no DoD exists, propose one and note it as an assumption.
4. **Compute capacity.** Use the velocity + focus factor + availability method below to produce a single capacity number for this sprint.
5. **Select and order the commitment.** Pull Ready items from the top of the prioritized backlog that serve the goal, up to capacity, ordered so dependencies and shared people do not stall the team. Account for carryover first.
6. **Surface risks and blockers.** Name dependencies, single points of failure, unknowns, and external waits up front, each with an owner or mitigation.
7. **Record the plan.** Produce the sprint plan in the output structure below.

## Definition of Ready (DoR) checklist

An item is Ready only when all of these hold. Do not commit items that fail any check.

- [ ] Clear, testable value statement (what and why)
- [ ] Acceptance criteria are written and unambiguous
- [ ] Sized / estimated by the team
- [ ] Dependencies identified and either resolved or sequenced
- [ ] No open blocking questions for the developer
- [ ] Small enough to finish within one sprint (split if not)
- [ ] Required design, data, or access is available

Items that are not Ready stay in the backlog. Refining them is a backlog activity, not a planning shortcut.

## Definition of Done (DoD) checklist

Size the commitment against done work. A typical team DoD:

- [ ] Code complete and merged to the target branch
- [ ] Acceptance criteria met and verified
- [ ] Automated tests written and passing
- [ ] Code reviewed
- [ ] Documentation / changelog updated where relevant
- [ ] Deployed to the agreed environment (e.g. staging)
- [ ] Accepted by the product owner

Confirm the actual DoD with the team; the list above is a default, not a mandate.

## Capacity method

Capacity is what the team can realistically finish, not its theoretical maximum.

**Step 1 — Baseline velocity.** Average the points (or items) *completed* in the last 3–6 sprints. Use completed, not committed.

**Step 2 — Availability factor.** Compare available person-days this sprint to a normal sprint. Subtract leave, holidays, onboarding, and shared-member time.

```
availability factor = available person-days / normal person-days
```

**Step 3 — Focus factor.** The share of working time spent on sprint backlog work after meetings, support, interrupts, and context switching. Typical focus factors fall between 0.6 and 0.8; use the team's own historical figure when known.

**Step 4 — Capacity.**

```
capacity = baseline velocity × availability factor × focus factor
```

**Step 5 — Reserve for carryover.** Subtract committed carryover from capacity before selecting new work.

```
available capacity = capacity − carryover
```

When the team has no velocity history (new team), plan by available person-days × focus factor and treat the first 2–3 sprints as calibration.

## Sprint plan output structure

Produce a Markdown document with these sections, in this order:

```markdown
# Sprint <n> Plan — <dates>

## Sprint Goal
<one sentence>

## Capacity
- Baseline velocity: <x> pts
- Availability factor: <a>
- Focus factor: <f>
- Carryover: <c> pts
- Available capacity: <result> pts

## Commitment
| Item | Summary | Est | Serves goal | Depends on | Owner |
|------|---------|-----|-------------|-----------|-------|
| ...  | ...     | ... | yes/partial | ...       | ...   |
Total committed: <sum> pts (within <available capacity> pts)

## Stretch (optional, only if room)
| Item | Summary | Est |

## Risks & Blockers
- <risk> — owner / mitigation

## Definition of Done
<the DoD the commitment is sized against>

## Assumptions
- <only if any inputs were missing>
```

Optionally also emit the commitment table as a parallel `.csv` file with the columns
`item,summary,est,serves_goal,depends_on,owner` for import into tracking tools. Do not
introduce an xlsx or spreadsheet-library dependency.

## Worked example

**Context:** A 2-week sprint, team of 4 developers. Last four sprints completed 30, 26, 28, 32 points. One developer is on leave for half the sprint; the team's historical focus factor is 0.7. Carryover from the prior sprint is 5 points.

**Capacity:**

- Baseline velocity = (30 + 26 + 28 + 32) / 4 = **29 pts**
- Normal person-days = 4 devs × 10 days = 40; available = 40 − 5 (half a dev) = 35 → availability factor = 35 / 40 = **0.875**
- Focus factor = **0.7**
- Capacity = 29 × 0.875 × 0.7 ≈ **17.8 pts**
- Available capacity = 17.8 − 5 carryover ≈ **12.8 pts** for new work

**Sprint Goal:** *Returning customers can check out using a saved payment method.*

**Commitment:**

| Item   | Summary                                   | Est | Serves goal | Depends on | Owner |
|--------|-------------------------------------------|-----|-------------|-----------|-------|
| CARRY  | Finish saved-card storage (carryover)     | 5   | yes         | —         | Ana   |
| PAY-12 | Show saved cards at checkout              | 5   | yes         | CARRY     | Ben   |
| PAY-15 | One-click pay with selected saved card    | 3   | yes         | PAY-12    | Cleo  |

Total committed: **13 pts** against ~12.8 available — at the line, accepted because estimates are conservative and the goal is coherent. PAY-18 (saved-card management UI) stays in the backlog as it does not serve this sprint's goal.

**Risks:** Payment-gateway sandbox access is the single dependency for PAY-15 — owner Cleo to confirm credentials on day 1.

## Iteration / PI-level planning (extension)

For quarter or program-increment planning, the same shape applies at a coarser grain: set 1–3 PI objectives instead of one sprint goal, plan capacity per sprint across the increment, and sequence features by dependency rather than individual stories. Keep the artifact lightweight — objectives, a sprint-by-sprint capacity outline, cross-team dependencies, and top risks. Detailed story-level commitment still happens in each sprint's planning. This is a brief extension, not the focus of the skill.

## Gotchas

Correct these before returning a plan:

- **Overcommitting.** Committing to baseline velocity while ignoring leave or focus factor. Always discount capacity for availability and reserve for carryover first.
- **No single goal.** A list of unrelated items with no Sprint Goal is a task dump. Insist on one coherent goal; if the work cannot form one, that is a finding to report.
- **Pulling NOT-Ready items.** Committing items that fail the DoR "because they're important." Not-Ready work belongs in refinement, not the commitment.
- **Ignoring carryover and leave.** Planning as if the sprint starts empty and fully staffed. Subtract carryover and reduce availability explicitly.
- **Sizing against code, not DoD.** Treating "code written" as done. Size the commitment against the full Definition of Done, including review, tests, and acceptance.
- **Unordered commitment.** Listing items without dependency order or owners, so the team blocks itself mid-sprint. Sequence by dependency and name an owner per item.
- **Stretch goals treated as commitment.** Counting stretch items toward capacity. Stretch is only pulled when committed work finishes early.
