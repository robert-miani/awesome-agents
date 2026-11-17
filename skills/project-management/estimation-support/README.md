# Estimation Support

## Description

Supports team estimation of user stories and epics. The skill provides three estimation
approaches — story points (modified Fibonacci), T-shirt sizing, and multi-dimensional complexity
scoring — and derives a **complexity indicator** that gives the team a starting point for relative
estimation and planning poker. It surfaces the complexity factors that drive effort (integration,
data migration, unknowns, cross-team dependencies) so the team can discuss them explicitly.

The complexity indicator informs estimation; it never replaces it. The team, grounded in its own
velocity and reference stories, owns the final number.

## When to Use

- Estimating a refined user story and suggesting a story-point starting point
- Producing a T-shirt size for an epic or roadmap item before refinement
- Scoring a story or epic across complexity dimensions to expose *why* it is large
- Facilitating relative estimation or a planning-poker session
- Surfacing hidden complexity factors (integration, data migration, unknowns, dependencies)
- Deciding whether an item should be decomposed or sent to a spike before it is estimated

## Usage

Activate this skill and describe the story or epic you want to size. Provide as much context as
you have:

- The story or epic title and its acceptance criteria
- Known integrations, data work, dependencies, or unknowns
- The team's reference stories and recent velocity, if available
- Whether you want story points, a T-shirt size, or a full complexity score

The skill scores the item across complexity dimensions, maps the total to a complexity indicator,
suggests a starting-point estimate with a confidence level, and lists the factors the team should
discuss. It then hands the estimate back to the team — typically via planning poker — rather than
deciding the number itself.

Output is a Markdown complexity table; an optional parallel `.csv` can be produced for import into
a tracker. There is no spreadsheet dependency.

## Example

**Input:** "Estimate these two stories: a read-only status field on the account summary screen, and
syncing customer records from an external partner API."

**Output:** A Markdown complexity table scoring each story across the dimensions:

| Story | Score | Indicator | Suggested points | Confidence |
|---|---|---|---|---|
| Add a read-only status field to the account summary screen | 7 | Low | 2 | High |
| Sync customer records from an external partner API | 25 | High | 13 | Low |

With a narrative noting that the second story is driven by an external integration, a data-sync
element, a cross-team dependency, and real unknowns — and a recommendation to run a spike and
decompose it before committing. Both estimates are presented as starting points for planning
poker, not as final numbers.

## Requirements

- A user story or epic to estimate, ideally with acceptance criteria (see **user-story-authoring**)
- Helpful: the team's reference stories and recent velocity for relative estimation
- The team itself for the final estimate — this skill prepares and facilitates, it does not decide
- Related skills: **backlog-prioritization** (effort feeds value-vs-effort prioritization) and
  **sprint-planning** (estimates are compared against team capacity)
