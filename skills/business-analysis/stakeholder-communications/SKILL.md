---
name: stakeholder-communications
description: >
  Draft audience-tuned BA/PM stakeholder communications — status updates, sprint
  and steering-committee briefs, change requests, escalations, decision requests,
  and meeting summaries. Use when the user wants to write a "status update",
  "sprint update", "steering brief", "steering committee update", "change request",
  "escalation email", "decision request", "meeting summary", "workshop follow-up",
  or any "stakeholder update", or asks to tailor a message for sponsors, leadership,
  technical teams, or business stakeholders.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Stakeholder Communications

## Overview

Draft stakeholder communications that lead with the point, are tuned to the
audience, and make every ask owned and dated. Use this skill when the task is to
write, refine, or review a BA/PM message directed at sponsors, leadership,
technical teams, or business stakeholders.

Each communication has one job: inform, request a decision, escalate a blocker,
or record what was agreed. Pick the type that matches that job and fill the
matching template. Do not blend a status update with a decision request — split
them so neither buries the other.

## Communication-Type Selector

| Type | Job | Audience | When to use |
|---|---|---|---|
| Status update | Inform on progress | Team, owner, immediate stakeholders | Recurring cadence (per sprint, weekly) |
| Steering / sponsor brief | Surface risk, request decisions | Sponsors, leadership, steering committee | Periodic governance checkpoint |
| Change request | Request approval for a scope/plan change | Approvers, sponsors | A change to agreed scope, timeline, budget, or resources is proposed |
| Escalation | Unblock something time-critical | Person who can unblock + their manager | A blocker will cause real impact if not resolved by a date |
| Decision request | Get one specific decision made | The named decision-maker | A choice is needed and is blocking or shaping work |
| Meeting summary | Record decisions and actions | Attendees + absent stakeholders | Within 48h of any workshop, review, or key meeting |

If you are unsure who should receive a message or who owns a decision, consult
the **stakeholder-raci-mapping** skill to identify the informed/consulted/
accountable parties before drafting.

## Audience-Awareness Rules

Tune length, language, and the lead to who is reading.

- **Sponsors / executives** — Lead with the outcome or the decision needed.
  Three to five bullets before any detail. Business language, no jargon.
  Quantify impact (cost, %, days, headcount). Always state what you need from
  them.
- **Leadership / steering** — Lead with status and risk. Make decisions
  explicit, each with a recommendation and the cost of delay. Keep detail in an
  appendix or attachment.
- **Technical teams** — Be specific. Reference system, component, and field
  names; link tickets and design docs. State constraints and assumptions.
- **Business stakeholders / SMEs** — Use their process language. Focus on what
  changes in their day-to-day work. Ask specific questions, not open-ended ones;
  respect that they know the domain.

Cross-cutting rules for every type:

- One headline first — the single most important thing, before any detail.
- Every action and ask has a named owner and a date.
- A decision request states the recommendation and the impact of delay.
- Quantify impact where possible.
- Detail goes in an attachment or appendix, not the message body.
- Risk and issue language is factual, not alarmist.

## Templates

### Status Update

**Subject:** [Project] — [Sprint N / Week of DATE] Status

```
Hi [team / stakeholders],

[Sprint N / This week] summary:

COMPLETED
- [ID] [Title] — [one-line outcome]
- [ID] [Title] — [one-line outcome]

IN PROGRESS (carrying to [next period])
- [ID] [Title] — [brief reason for carry-over]

BLOCKED / AT RISK
- [ID] [Title] — Blocked by [reason]. Action: [owner] to [action] by [date].

DECISIONS NEEDED
- [Decision] — needed by [date] to avoid [impact]

METRICS
- [Velocity / throughput]: [actual] of [planned]
- [Quality metric]: [open defects, X critical]

NEXT PERIOD FOCUS
- [Top 2-3 priorities]

[Name]
```

### Steering / Sponsor Brief

**Subject:** [Programme] — Steering Update | [Date]

```
STATUS: [GREEN / AMBER / RED]

HEADLINE
[One sentence — the single most important thing the committee must know]

PROGRESS SINCE LAST UPDATE
- [Milestone or key delivery]
- [Milestone or key delivery]

RISKS & ISSUES (action required)

| # | Risk / Issue | Impact | Likelihood | Mitigation | Owner | Decision? |
|---|---|---|---|---|---|---|
| 1 | [Description] | High | Medium | [Action] | [Name] | Yes / No |

DECISIONS REQUESTED
1. [Decision] — Recommendation: [X]. Impact if delayed: [Y]. Needed by: [date].

BUDGET / FINANCIALS
- Spend to date: [X] of [Y] ([Z]%)
- Forecast: [On track / Overspend risk of X — reason]

NEXT PERIOD PLAN
- [Key deliverable — target date]
- [Key milestone — target date]

APPENDIX: [Link to dashboard / detailed metrics]
```

### Change Request

**Subject:** Change Request [CR-ID] — [Title] | Impact Assessment

```
CHANGE REQUEST

CR ID: [CR-ID]
Title: [Descriptive title]
Requested by: [Name, Role]
Date raised: [Date]
Priority: [Critical / High / Medium / Low]

WHAT'S CHANGING
[2-3 sentences in business terms]

WHY
[Rationale — stakeholder request, defect, regulatory or market driver]

IMPACT ASSESSMENT

| Dimension  | Impact | Detail |
|------------|--------|--------|
| Scope      | [H/M/L] | [Added / removed / changed] |
| Timeline   | [H/M/L] | [Delay risk] |
| Budget     | [H/M/L] | [Cost estimate if known] |
| Resources  | [H/M/L] | [Additional effort or skills] |
| Risk       | [H/M/L] | [New risks introduced] |
| Downstream | [H/M/L] | [Impact on other workstreams] |

RECOMMENDATION
[Accept / Reject / Defer / Accept with conditions]
[If accept] Estimated effort: [X]. Proposed schedule: [period].

DECISION REQUIRED BY: [Date]

Attached: [Full impact assessment if applicable]
```

For the impact rows, derive content from the **gap-impact-analysis** skill when a
structured impact assessment already exists, rather than estimating ad hoc.

### Escalation

**Subject:** ESCALATION: [Issue] — [Impact if not resolved by DATE]

```
Hi [Decision-maker],

I'm escalating [issue] because it will [specific impact] if not resolved by
[date].

SITUATION
[2-3 sentences — what was expected, what is happening]

IMPACT
- [Delivery impact — delay, milestone risk]
- [Business impact — SLA, client, or compliance risk]
- [Cost impact if applicable]

WHAT WE'VE TRIED
- [Action — outcome]
- [Action — outcome]

WHAT WE NEED
[Specific ask — decision, resource, access, prioritisation]
From: [Name / Team]   By: [Date]

Happy to discuss — available [times].

[Name]
```

Escalation rules: be factual not emotional; show you have already tried to
resolve it; make the ask specific; state the deadline and the consequence of
missing it; copy the person who can unblock plus your own manager.

### Decision Request

**Subject:** Decision Needed by [DATE]: [Decision in one line]

```
Hi [Decision-maker],

I need a decision on [topic] by [date] to keep [work / milestone] on track.

CONTEXT
[1-2 sentences — why this decision is needed now]

THE DECISION
[The single choice to be made, stated plainly]

OPTIONS
- Option A: [description] — Pros: [...] Cons: [...]
- Option B: [description] — Pros: [...] Cons: [...]

RECOMMENDATION
[Option X], because [reason].

IMPACT IF DELAYED
[What slips, breaks, or costs more after the date]

[Name]
```

### Meeting Summary

**Subject:** [Meeting / Workshop] Summary: [Topic] | [Date] — Decisions & Actions

```
Hi all,

Thank you for [the session]. Summary below.

DECISIONS MADE
1. [Decision] — Agreed by [names]
2. [Decision] — Agreed by [names]

ACTION ITEMS

| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| 1 | [Action] | [Name] | [Date] | Open |
| 2 | [Action] | [Name] | [Date] | Open |

OPEN QUESTIONS (to resolve offline)
- [Question] — Owner: [Name] — Due: [Date]

NEXT STEPS
- [What happens next]
- Next session: [Date] — Topic: [X]

Please flag corrections by [date]. Silence = agreement.

[Name]
```

## Worked Example

**Input:** "Draft a sprint status update for Sprint 7 of the customer portal
project. Two stories done, one carrying over because a third-party API was late,
and we need a decision on the payment provider by Friday."

**Output:**

```
Subject: Customer Portal — Sprint 7 Status

Hi all,

Sprint 7 summary:

COMPLETED
- PORTAL-142 Account self-registration — live in staging, ready for UAT
- PORTAL-148 Profile edit screen — merged, behind feature flag

IN PROGRESS (carrying to Sprint 8)
- PORTAL-151 Address lookup — third-party address API access arrived 4 days
  late; integration resumes Monday

BLOCKED / AT RISK
- None this sprint

DECISIONS NEEDED
- Payment provider selection (Provider A vs Provider B) — needed by Fri 27 Jun
  to start integration in Sprint 8; a slip pushes checkout out of the Q3 release

METRICS
- Velocity: 18 of 21 points completed
- Defects: 2 open (0 critical)

NEXT SPRINT FOCUS
- Complete address lookup
- Begin payment integration once provider is confirmed

Thanks,
Alex
```

Note how the carry-over names the cause, the decision states a deadline and the
cost of delay, and the metrics are quantified.

## Gotchas

- **Burying the ask or decision.** If a reply or decision is needed, it goes near
  the top with a deadline — not in a closing paragraph.
- **Actions without an owner or date.** "We should follow up on X" is not an
  action. Name a person and a due date for every item.
- **Wrong altitude for the audience.** Sponsors do not want ticket IDs; technical
  teams do not want a one-line headline with no specifics. Match the audience-
  awareness rules.
- **Decision request with no recommendation.** Always state your recommended
  option and why; do not offload an unframed choice.
- **Status disguised as escalation.** Only escalate when there is a real impact
  and a date. Routine "at risk" items belong in the status update.
- **Detail dumped in the body.** Long tables, logs, and full assessments go in an
  attachment or appendix; the message stays scannable.
- **No clear recipient logic.** If unsure who to inform versus consult, resolve it
  with **stakeholder-raci-mapping** before sending.
- **Sending an escalation cold.** Show what was already tried, or it reads as
  passing the problem up untouched.
```
