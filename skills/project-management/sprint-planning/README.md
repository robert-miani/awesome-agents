# Sprint Planning

## Description

Runs sprint or iteration planning from goal to recorded plan. The skill helps set a single clear Sprint Goal, verify the Definition of Ready on candidate items, confirm the Definition of Done, compute realistic capacity from velocity, focus factor, and team availability, select and dependency-order a commitment that serves the goal, surface risks and blockers up front, and produce a concise Markdown sprint plan. PI/quarter-level planning is supported as a brief extension.

## When to Use

- Planning a sprint or iteration and deciding what the team can realistically commit to
- Writing or sanity-checking a Sprint Goal
- Checking candidate items against a Definition of Ready before committing them
- Confirming the Definition of Done the commitment will be sized against
- Doing capacity planning that accounts for velocity, focus factor, leave, and carryover
- Producing a sprint plan artifact (with an optional parallel commitment CSV)
- Running lightweight program-increment or quarter-level planning

## Usage

Activate this skill and describe the upcoming sprint. Provide as much context as you have:

- Sprint length and dates
- The prioritized backlog and estimates for candidate items
- Recent velocity (last 3–6 sprints)
- Team roster and availability, including leave and shared members
- Carryover from the prior sprint
- Known dependencies, blockers, and the team's Definition of Done

The skill sets the Sprint Goal, filters candidates through the Definition of Ready, computes available capacity, selects a dependency-ordered commitment that serves the goal, lists risks, and records the plan in a fixed structure. It pairs with **backlog-prioritization** (the ordered backlog you pull from), **estimation-support** (sizing used for capacity), **user-story-authoring** (well-formed stories and acceptance criteria the Definition of Ready depends on), and **sprint-progress-reporting** (which tracks the committed work mid-sprint).

## Example

**Input:** "Plan the next 2-week sprint. Team of 4, last sprints did 30/26/28/32 points, one dev on leave half the sprint, focus factor 0.7, 5 points carried over. Backlog top items are about saved-payment checkout."

**Output:** A Markdown sprint plan with:

- A single Sprint Goal (e.g. *Returning customers can check out using a saved payment method*)
- A capacity calculation: velocity 29 × availability 0.875 × focus 0.7 ≈ 17.8, minus 5 carryover ≈ 12.8 points available for new work
- A dependency-ordered commitment table (carryover first, then the goal-serving items) with estimates and owners
- A risks and blockers list, the Definition of Done, and any assumptions

An optional parallel `commitment.csv` can be emitted for import into a tracking tool.

## Requirements

- A prioritized backlog with estimated, well-formed candidate items
- Recent velocity history (or person-day availability for a new team without history)
- Team availability for the sprint, including leave, holidays, and shared members
- Carryover and known dependencies for the upcoming sprint
- An agreed Definition of Done (the skill proposes a default if none exists)
- Optional: companion skills `estimation-support`, `backlog-prioritization`, `user-story-authoring`, and `sprint-progress-reporting`
