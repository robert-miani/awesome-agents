# PRD Grilling (docs-only)

Use this reference when grilling a PRD in **docs-only mode** — a product manager or
product owner is shaping a PRD from product docs and stakeholder input without code
access. The core method (one question at a time, recommended answer + why, scenario
stress-testing) is unchanged; this file adds the PRD-specific section walk and the
Development Assessment request template.

## Frame the PRD first

- Identify what the PM is starting from: a blank PRD, a rough idea, a problem brief, an
  opportunity brief, a Confluence requirement, a Jira epic, a design concept, or an
  approved release scope.
- State the decision the PRD must support.
- Identify the intended audience: Product, Design, Engineering, QA, leadership, the
  customer team, support, or delivery. Audience changes how much detail each section needs.

## Inventory source evidence before asking

- Separate confirmed requirements, user evidence, business rationale, design decisions,
  assumptions, and open questions. Do not let an assumption masquerade as a requirement.
- Identify source gaps: missing persona, missing workflow, missing metric, missing
  non-goal, missing error state, missing dependency, or missing acceptance rule.
- If sources conflict, ask which source should win **before** writing PRD language.
- Preserve source links, page titles, section headings, requirement IDs, quotes, and
  exact phrases that carry product intent.

## Section walk — grill one section at a time

Walk dependencies in this order unless context suggests otherwise. Resolve upstream
sections before downstream ones; do not draft acceptance criteria while the target user
or outcome is still vague.

1. **Problem** — What is broken or missing, for whom, and why now? Reject solution
   statements disguised as problems.
2. **Target user** — Which specific persona, segment, or role? Challenge bare "user",
   "customer", or "admin".
3. **Outcome** — What measurable change defines success? Separate the user outcome from
   the business outcome.
4. **Scope** — What is in this release? Keep it to what the outcome requires.
5. **Non-goals** — What is explicitly out? An empty non-goals list is a red flag.
6. **User stories** — Who does what, to get what value? Route to `user-story-authoring`
   for the story and acceptance-criteria format once the stories are agreed.
7. **Requirements** — Implementation-neutral statements of what must be true. Keep them
   free of implementation detail unless a decision is already documented and approved.
8. **States** — Default, empty, loading, error, permission-denied, and migration states.
9. **Dependencies** — Other teams, services, data, third parties, approvals, or releases.
10. **Risks** — Product, adoption, compliance, and operational risks, with mitigations.
11. **Acceptance criteria** — Observable conditions that prove each requirement is met.
12. **Rollout** — Phasing, flags, cohorts, fallback, and reversibility.
13. **Measurement** — Which metrics and instruments confirm the outcome.

For each section, ask one dependency-resolving question, include your recommended answer
and why (grounded in the docs or the PM's stated goals), then wait.

## Challenge vague terms

Press on overloaded words before they reach the PRD: "user", "customer", "admin",
"value", "workflow", "dashboard", "automation", "integration", "real-time", "MVP",
"phase 1", and "success". Replace each with a precise canonical term the team already
uses.

## Stress-test without code

Use concrete scenarios to probe edge cases, permissions, data visibility, empty states,
errors, retries, approvals, notifications, auditability, localization, accessibility, and
operational handoffs.

**Do not answer feasibility from intuition.** If feasibility, current behaviour,
architecture, data model, API support, migration, or security risk matters, do not guess
— write a Development Assessment request and route it to the `development-assessment`
skill.

## Development Assessment request template

Emit this when code or implementation context is required to unblock a product decision.
Keep the implementation question narrow; never escalate with a vague ask.

```md
## Development Assessment Request

- PRD/source:
- Product decision blocked:
- Implementation question:
- Why Product cannot answer from docs alone:
- Source context:
- Expected routing output:
```

## PRD handoff

When enough decisions are resolved:

- Recommend `prd-authoring` to synthesize the PRD once the decisions are settled.
- Recommend `user-story-authoring` when the approved scope is ready for story breakdown.
- If implementation context is blocking, hand off the Development Assessment request to
  `development-assessment` with the exact question and source context.

At the end of the session, return: resolved PRD decisions, unresolved questions,
assumptions, source references, any Development Assessment requests, and the recommended
next route (PRD synthesis, story breakdown, stakeholder review, design review, or
no-change decision).
