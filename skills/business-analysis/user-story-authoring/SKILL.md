---
name: user-story-authoring
description: >
  Canonical authority for writing user stories, epics, and themes with
  acceptance criteria. Owns the "As a <persona>, I want <goal>, so that
  <benefit>" format, Given/When/Then (Gherkin) acceptance criteria, MoSCoW
  prioritization, INVEST-based story granularity and splitting, and
  out-of-scope/open-questions discipline. Use when writing or refining user
  stories, epics, or themes; writing or reviewing acceptance criteria;
  splitting a story that is too large; prioritizing a backlog; or turning a
  stakeholder request, feature idea, or PRD into a backlog. Triggers include
  "write user stories", "acceptance criteria", "Gherkin", "Given/When/Then",
  "break this feature into stories", "epic", "MoSCoW", "refine the backlog",
  "split this story", "definition of done for this story".
metadata:
  author: awesome-agents
  version: "0.1"
---

# User Story Authoring

## Overview

Write user stories, epics, and themes that a team can estimate, build, and
test without ambiguity. Use this skill whenever the task is to draft, refine,
split, prioritize, or review backlog items and their acceptance criteria.

This skill is the canonical reference for story and acceptance-criteria format.
Other skills defer to it for the "As a / I want / so that" template, Gherkin
acceptance criteria, MoSCoW, and INVEST. Keep stories solution-neutral: they
describe a need and its value, not an implementation.

A story captures one unit of deliverable value. Do not turn it into a feature
spec, a design document, or a bundle of unrelated needs.

## The Hierarchy

```
Theme (strategic goal, spans many epics)
  └── Epic (large body of work, spans multiple sprints)
       └── User Story (smallest unit of deliverable value, fits one sprint)
            └── Acceptance Criteria (independently testable conditions)
                 └── Tasks (implementation work items — out of scope for this skill)
```

Pick the right level before writing:
- Use a **theme** for a strategic objective measured in quarters.
- Use an **epic** when the work is too large for one sprint and needs to be
  decomposed into stories.
- Use a **story** when the work delivers value on its own and fits one sprint.

## Workflow

1. **Clarify the business context.** Identify who is affected, what problem is
   being solved, and what success looks like. If the brief is vague ("make it
   better", "users want export"), ask one focused scope/audience question
   before writing — do not generate a backlog blind.
2. **Identify the personas.** List every actor: end users, administrators,
   support staff, external systems. Each story is written from one persona's
   point of view.
3. **Decompose into independently testable needs.** Break the request into
   discrete pieces of deliverable value. Each piece becomes one story.
4. **Write each story** in the standard format (below), at the right
   granularity (INVEST).
5. **Write acceptance criteria** for each story in Gherkin — 3 to 6 criteria
   covering the happy path, edge cases, and error states.
6. **Assign MoSCoW priority** to every story.
7. **Cross-check.** Are there implicit, unstated requirements? Conflicting
   constraints? Surface them.
8. **List open questions and out-of-scope items** explicitly.
9. **Check the draft** against the Quality Checklist before returning it.

## User Story Format

Use this exact template:

```
[ID] As a <persona>, I want <goal>, so that <benefit>.
```

- `<persona>` — a specific role, not "user" where a sharper role exists.
- `<goal>` — the capability the persona wants, in behavioral terms.
- `<benefit>` — the value or outcome. Never omit the "so that" clause; a story
  without a stated benefit is a feature request, not a user story.

Assign a unique, traceable ID (e.g., `US-001`). For ID conventions and
upstream/downstream tracing, defer to the **requirements-traceability-matrix**
skill.

### Use domain vocabulary for personas

Name personas using the project's own domain vocabulary (e.g., "store manager",
"reviewer", "billing administrator") rather than generic "user". Sharper
personas produce sharper acceptance criteria. If the domain has its own glossary
of roles, use those terms verbatim.

## INVEST — Story Granularity

Every story should satisfy INVEST:

- **I**ndependent — can be built and delivered on its own; minimal ordering
  dependencies on other stories.
- **N**egotiable — captures intent, not a frozen contract of details.
- **V**aluable — delivers observable value to a user or the business.
- **E**stimable — the team has enough clarity to size it.
- **S**mall — fits comfortably within a single sprint.
- **T**estable — has acceptance criteria that can be objectively verified.

### Splitting stories that are too large

If a story fails **S** or **E**, split it. Useful split patterns:

- **By workflow step** — one story per step of a multi-step process.
- **By business rule variation** — separate the simple/standard case from the
  complex/exception case.
- **By data type or input** — one story per input format or entity type.
- **By operation** — separate create, read, update, delete, and export.
- **By happy path vs. error handling** — deliver the success path first, then
  the error and edge-case handling as follow-on stories.
- **By persona** — if one capability serves several roles differently, split
  per role.

Avoid splitting along technical layers (e.g., "build the API", "build the UI").
Each split story should still deliver end-to-end value on its own.

## Acceptance Criteria — Given/When/Then (Gherkin)

Write acceptance criteria in Gherkin so they are unambiguous and testable:

```
Given <precondition / context>
When <action / trigger>
Then <expected, observable outcome>
And <additional outcome, if needed>
```

Rules for good acceptance criteria:
- **Each criterion is independently testable.** One scenario per criterion —
  do not chain unrelated outcomes with "and" to dodge writing a second
  criterion.
- **Use specific values, not vague terms.** "within 3 seconds", not "quickly";
  "shows the 10 most recent", not "shows recent items".
- **Cover happy path, edge cases, and error states.** Every edge case you
  identify becomes a criterion, not a silent assumption.
- **Stay solution-neutral.** Describe observable behavior, not the
  implementation that produces it.
- **Number them** within each story: AC-1, AC-2, …

Anti-patterns to reject:
- "System should be user-friendly" — not testable.
- "Data should be accurate" — define what accuracy means and how it is checked.
- "Performance should be acceptable" — specify the target.

## MoSCoW Prioritization

Assign one MoSCoW level to every story (and to epics where useful):

| Level | Meaning |
|-------|---------|
| **Must have** | Release fails its purpose without it. |
| **Should have** | Important but the release can ship without it if forced. |
| **Could have** | Desirable; included only if time and capacity allow. |
| **Won't have (this time)** | Explicitly out of scope for now — recorded so it is not silently dropped or silently added later. |

Keep "Must have" disciplined: if everything is a Must, the prioritization
carries no information.

## Epic and Theme Format

### Epic

```
Epic: [ID] — [Name]
Theme: [Parent theme, if any]
Description: [What this epic delivers]
Business value: [Measurable outcome]
Acceptance criteria: [High-level, epic-level conditions for "done"]
Stories: [Child stories]
Estimated size: [T-shirt size or points]
```

Epic acceptance criteria are coarse-grained outcomes ("standard requests are
handled end-to-end within the target time") rather than the detailed Gherkin
scenarios that belong on its child stories.

### Theme

```
Theme: [Name]
Description: [Strategic objective this supports]
Business value: [Why this matters]
Epics: [Child epics]
```

## Recommended Output Structure

When producing a set of stories from a request, structure the output as:

```
## Summary
One paragraph: what is being built and the business value.

## Stories
For each story:
- Story ID
- Story: As a <persona>, I want <goal>, so that <benefit>.
- Acceptance Criteria (Gherkin, numbered AC-1, AC-2, …)
- Priority (MoSCoW)
- Dependencies (other stories or systems, if any)

## Open Questions
Numbered questions needing stakeholder input before development.

## Out of Scope
Explicit list of what is NOT included, to prevent scope creep.
```

## Worked Example

**Request:** "We want logged-in shoppers to be able to save items for later."

```
## Summary
Enable authenticated shoppers to add catalogue items to a personal "saved for
later" list and return to it across sessions, increasing return visits and
conversion on previously viewed items.

## Stories

US-001
Story: As a signed-in shopper, I want to save an item to a "saved for later"
list, so that I can find it again without searching.
Acceptance Criteria:
  AC-1
    Given I am signed in and viewing an item that is not yet saved
    When I select "Save for later"
    Then the item appears in my saved list
    And the item's control changes to "Saved".
  AC-2
    Given I am signed in and viewing an item already in my saved list
    When I select "Saved"
    Then the item is removed from my saved list.
  AC-3
    Given I am not signed in and viewing an item
    When I select "Save for later"
    Then I am prompted to sign in
    And the item is saved automatically after I sign in.
  AC-4
    Given my saved list already contains 100 items (the maximum)
    When I try to save another item
    Then the save is rejected
    And I see a message that the list is full.
Priority: Must have
Dependencies: Authentication (US-000)

US-002
Story: As a signed-in shopper, I want to view my saved list on any device,
so that I can continue shopping where I left off.
Acceptance Criteria:
  AC-1
    Given I have saved items on one device and sign in on another
    When I open my saved list
    Then I see the same items, most recently saved first.
  AC-2
    Given an item in my saved list is no longer available
    When I view the list
    Then the item is shown as "No longer available"
    And I can remove it.
Priority: Should have
Dependencies: US-001

## Open Questions
1. Should saved items reserve stock, or only bookmark the item?
2. What happens to an item's saved state if its price changes?
3. Is there a retention period after which untouched saved items expire?

## Out of Scope
- Sharing a saved list with another shopper (Won't have, this time).
- Saved lists for guest (not signed-in) shoppers beyond the sign-in prompt.
- Price-drop notifications for saved items.
```

Note in the example: each AC is one testable scenario; edge cases (not signed
in, list full, item unavailable) are explicit criteria, not assumptions; the
larger need was split into a "save" story and a "view across devices" story so
each fits a sprint and delivers value on its own.

## Quality Checklist

Before returning any story set, verify:

- [ ] Every story has a unique, traceable ID.
- [ ] Every story states a persona, a goal, AND a benefit ("so that …").
- [ ] Each story is INVEST-compliant; oversized stories are split.
- [ ] Every story has 3–6 acceptance criteria in Given/When/Then format.
- [ ] Each acceptance criterion is independently testable — no chained,
      unrelated outcomes.
- [ ] Acceptance criteria use specific values, not vague terms.
- [ ] Happy path, edge cases, and error states are all covered.
- [ ] No implementation/solution language in stories or criteria.
- [ ] Every story has a MoSCoW priority; "Must have" is used sparingly.
- [ ] Open questions are listed for anything the request didn't resolve.
- [ ] Out-of-scope items are stated explicitly.

## Gotchas

- **A missing "so that" hides a weak story.** If you cannot state the benefit,
  the team cannot judge priority or whether the story is worth doing — push
  back rather than inventing a benefit.
- **"And" in acceptance criteria is a smell.** Chaining unrelated outcomes with
  "and" usually means two criteria masquerading as one. Multiple `Then/And`
  lines describing one coherent outcome are fine; unrelated assertions are not.
- **Technical layers are not stories.** "Build the API" delivers no user value
  on its own. Split by value (workflow step, rule variation, operation), never
  by tier.
- **Inflated Must-haves destroy prioritization.** When a stakeholder marks
  everything Must, ask which items the release could genuinely survive without
  and move them to Should.
- **Vague criteria pass review but fail testing.** "Fast", "accurate",
  "user-friendly" are not criteria. Demand a measurable target or a concrete
  observable outcome.
- **Out-of-scope is a feature, not an omission.** An explicit "Won't have"
  list prevents both silent scope creep and the silent dropping of agreed work.
- **Don't restate sibling-skill rules.** For traceability IDs and matrices use
  **requirements-traceability-matrix**; when building stories from existing
  documents, transcripts, or PRDs use **requirements-source-ingestion**. This
  skill owns only the story and acceptance-criteria format.
- **Edge cases belong in criteria, not assumptions.** If you noticed it, write
  it as an AC or an open question — never leave it as an unverifiable "the
  system will probably handle…".
