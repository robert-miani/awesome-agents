# Requirements Traceability Matrix

## Description

Builds and maintains a Requirements Traceability Matrix (RTM) that links business objectives to requirements, user stories, acceptance criteria, and test cases. The skill establishes a consistent unique-ID scheme, supports forward and backward traceability, runs coverage and gap analysis, detects orphans, and tracks delivery and test status. The canonical output is a Markdown table committed to the repository alongside a parallel CSV file, so the RTM both reviews cleanly in pull requests and opens directly in a spreadsheet.

## When to Use

- Creating a new RTM at the start of a requirements or backlog effort
- Linking requirements to the stories, acceptance criteria, and tests that satisfy them
- Answering "are all requirements covered by tests?" or "what isn't verified yet?"
- Running coverage analysis to find delivery gaps, quality gaps, and orphan stories
- Tracing forward (objective → requirement → story → AC → test) or backward (test → requirement → objective)
- Tracking delivery and test status of requirements across sprints or releases
- Establishing or enforcing a unique-ID convention (BR-, FR-, US-, AC-, TC-)

## Usage

Activate this skill and describe the requirements set you want to trace. Provide as much as you have:

- Existing requirements, objectives, or a BRD
- The backlog: epics, user stories, and acceptance criteria (with their IDs if any)
- Test cases or a test plan
- Current delivery and test status, if known
- The target location for the RTM, or any project ID convention to reuse

The skill resolves the output location (preferring `docs/specs/`), reuses or mints IDs, builds the matrix incrementally, runs coverage analysis, and writes both `rtm.md` and a matching `rtm.csv`. Story and acceptance-criteria formats are taken from the **user-story-authoring** skill; gap impact narratives are routed to **gap-impact-analysis**.

## Example

**Input:** "Build an RTM for the customer self-service portal and tell me what isn't covered by tests."

**Output:** A new matrix written to:

```text
docs/specs/rtm.md
docs/specs/rtm.csv
```

The Markdown file holds a reviewable table; the CSV holds the identical rows for spreadsheet use. The skill also returns a coverage summary, for example:

```
Coverage analysis (5 requirements, 3 stories, 2 test cases):
- Quality gaps: FR-003 (US-012) has no test case
- Delivery gaps: NFR-001 has no story
- Must-haves: all Must items (BR-001, FR-001) are Done and Passed
```

## Requirements

- A repository with a specs location, preferably `docs/specs/` or a path configured in `CLAUDE.md`
- A set of requirements or objectives to trace, and ideally a backlog and test plan to link them to
- Consistent (or new) unique IDs for requirements, stories, acceptance criteria, and tests
- Optional: the **user-story-authoring** skill for story and acceptance-criteria IDs, and **gap-impact-analysis** for narrative impact assessment of detected gaps
