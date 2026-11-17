---
name: requirements-traceability-matrix
description: Build and maintain a Requirements Traceability Matrix (RTM) that links business objectives to requirements, user stories, acceptance criteria, and test cases. Covers forward traceability (objective→requirement→story→AC→test), backward traceability, coverage analysis, gap and orphan detection, and status tracking. Use when the user mentions a traceability matrix or RTM, asks "are all requirements covered by tests", wants coverage analysis, needs to trace requirements to tests, or asks how requirements map to stories and verification.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Requirements Traceability Matrix

## Overview

Build and maintain an RTM that connects every business objective to the requirements, stories, acceptance criteria, and tests that satisfy it. The RTM is the single artifact that answers two questions at any time: *is every objective implemented and verified?* (forward) and *does everything we built trace back to a justified requirement?* (backward).

Use this skill when the task is to create an RTM, add traceability links, run coverage analysis, detect gaps or orphans, or report delivery and test status against requirements.

This skill owns the RTM artifact and the unique-ID scheme. It does not invent story or acceptance-criteria formats — those are owned by **user-story-authoring**. When a gap needs a narrative impact write-up, hand it to **gap-impact-analysis**; this skill detects and lists gaps, it does not analyze their downstream impact.

## Output Format

The canonical RTM is a **Markdown table committed to the repository**, with a **parallel `.csv` file** holding the same rows. Maintain both together.

- `docs/specs/rtm.md` — human-readable Markdown table, reviews cleanly in PRs
- `docs/specs/rtm.csv` — same columns and rows, opens directly in Excel, stays git-diffable

Resolve the target directory in this order:

1. Path specified in the project's `CLAUDE.md` — always check first
2. `docs/specs/` — if it exists in the current repo
3. `docs/` — if that is where specs already live
4. `docs/specs/` — create it if inside a git repo
5. `.claude/drafts/` — fallback when not in a git repo; remind the user to move it once a repo exists

Keep the two files in sync on every change: identical row order, identical IDs, identical cell values. The Markdown table is authoritative for review; the CSV is the machine-readable mirror.

> A dedicated `xlsx` export skill is out of scope for this repository. Do not produce `.xlsx` workbooks or rely on spreadsheet-only features (conditional formatting, pivot tables, charts). Represent status with plain text values that are equally readable in Markdown and CSV.

## RTM Column Structure

Use these columns in this order. Every column appears in both the Markdown table and the CSV header.

| Column | Description |
|---|---|
| Req ID | Unique requirement identifier (`BR-001`, `FR-012`, `NFR-003`) |
| Title | Short descriptive name of the requirement |
| Type | `Business` / `Functional` / `Non-Functional` |
| Priority | MoSCoW (`Must` / `Should` / `Could` / `Won't`) or numeric |
| Objective | Business objective this traces up to (`OBJ-001`) |
| Parent | Parent requirement for decomposed items (an FR's parent BR) |
| Epic | Backlog grouping (`EP-001`) |
| Stories | User story ID(s) that implement this (`US-045`, comma-separated) |
| Acceptance Criteria | AC ID(s) that define done (`AC-045-1`, comma-separated) |
| Test Cases | Test case ID(s) that verify this (`TC-101`, comma-separated) |
| Test Status | `Not started` / `In progress` / `Passed` / `Failed` / `Blocked` |
| Delivery Status | `Backlog` / `In development` / `In QA` / `Done` / `Deferred` / `Descoped` |
| Release | Sprint or release the item is scheduled for |
| Owner | BA or product owner accountable for the row |
| Source | Where the requirement originated (stakeholder, document, session) |
| Notes | Dependencies, risks, deferral rationale, or other context |

Keep the column set stable. If a project genuinely needs an extra column, add it to the right of `Notes` and document it in the file header so the Markdown and CSV stay aligned.

## ID Conventions

Use consistent, zero-padded IDs so cross-references are unambiguous and sortable:

- Business objectives: `OBJ-001`, `OBJ-002`
- Business requirements: `BR-001`, `BR-002`
- Functional requirements: `FR-001`, `FR-002`
- Non-functional requirements: `NFR-001`, `NFR-002`
- Epics: `EP-001`, `EP-002`
- User stories: `US-001`, `US-002`
- Acceptance criteria: `AC-<story>-<n>` (e.g. `AC-045-1`, `AC-045-2`)
- Test cases: `TC-001`, `TC-002`

Story and AC IDs follow whatever scheme **user-story-authoring** already established in the project — adopt it rather than redefining it. If no scheme exists yet, the formats above are the default.

Relationships are many-to-many: one FR may decompose into several stories, and one story may satisfy parts of several FRs. Capture this with comma-separated IDs in a single cell, or with multiple rows when one row would become unreadable. Be consistent within a file.

## Build Workflow

1. **Confirm the output location** using the resolution order above, and check whether an RTM already exists. If it does, extend it; do not start over.
2. **Establish the ID scheme.** Reuse existing IDs from the backlog and spec docs. Only mint new IDs for items that have none.
3. **Seed objectives and requirements.** Add one row per requirement with `Req ID`, `Title`, `Type`, `Priority`, `Objective`, `Parent`, `Source`. Start the RTM *with* the requirements, not retrospectively.
4. **Link the backlog.** Fill `Epic`, `Stories`, and `Acceptance Criteria` as stories are written. Pull story and AC IDs from the artifacts owned by **user-story-authoring**.
5. **Link verification.** Fill `Test Cases` as test planning proceeds. A row with stories but no test cases is a coverage gap (see below).
6. **Track status.** Update `Test Status`, `Delivery Status`, and `Release` at sprint boundaries — not daily, not only at milestones.
7. **Run coverage analysis** (next section) and record findings.
8. **Write both files.** Emit the Markdown table to `rtm.md` and the identical rows to `rtm.csv`. Verify the two match before finishing.

Build incrementally — add and enrich columns phase by phase rather than waiting until the end:

| Phase | Columns to populate |
|---|---|
| Requirements | Req ID, Title, Type, Priority, Objective, Parent, Source |
| Backlog | Epic, Stories, Acceptance Criteria, Release |
| Test planning | Test Cases |
| Execution | Test Status, Delivery Status |
| Sign-off | Final status in Notes |

## Coverage and Gap Analysis

Coverage analysis is the reason the RTM exists. Run these checks and report what each one finds.

**Forward traceability — is everything implemented and verified?**
- Objectives with no requirement → strategic gap (an objective no one is building toward)
- Requirements with no story → delivery gap (agreed but not in the backlog)
- Stories or requirements with no test case → quality gap (built but not verified)
- `Must` priority with `Delivery Status = Backlog` → schedule risk

**Backward traceability — does everything trace to a justification?**
- Stories with no parent requirement → orphan (scope creep or undocumented work)
- Requirements with no objective → unjustified scope (why does this exist?)
- Test cases that map to no requirement → testing something unspecified

**Status hygiene**
- `Delivery Status = Done` but `Test Status ≠ Passed` → delivered but unverified
- `Deferred` / `Descoped` rows missing a rationale in `Notes`

Report findings as a short list grouped by check, each line naming the offending ID(s):

```
Coverage analysis (12 requirements, 18 stories, 24 test cases):
- Delivery gaps: FR-008, FR-011 have no stories
- Quality gaps: US-045, US-051 have no test cases
- Orphan stories: US-060 (no parent requirement)
- Unverified: FR-003 is Done but test TC-014 is Failed
- Must-have at risk: FR-011 (Must, still in Backlog)
```

Status is expressed in plain text values so the same signal reads identically in the Markdown table, the CSV, and the analysis summary. Do not rely on colour or cell formatting to convey gaps — name them in text.

When a gap warrants a written impact assessment (who is affected, what breaks, what it costs to close), produce the list here and hand the narrative to **gap-impact-analysis**.

## Worked Example

A small RTM for a neutral domain (a customer self-service portal).

`docs/specs/rtm.md`:

```markdown
# Requirements Traceability Matrix

| Req ID | Title | Type | Priority | Objective | Parent | Epic | Stories | Acceptance Criteria | Test Cases | Test Status | Delivery Status | Release | Owner | Source | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| BR-001 | Self-service account management | Business | Must | OBJ-001 | — | EP-001 | US-010, US-011 | AC-010-1, AC-011-1 | TC-101, TC-102 | Passed | Done | R1 | Stakeholder workshop | — |
| FR-001 | Reset password via email link | Functional | Must | OBJ-001 | BR-001 | EP-001 | US-010 | AC-010-1 | TC-101 | Passed | Done | R1 | BR-001 | — |
| FR-002 | Update contact details | Functional | Should | OBJ-001 | BR-001 | EP-001 | US-011 | AC-011-1 | TC-102 | In progress | In QA | R1 | BR-001 | — |
| FR-003 | Download account statement | Functional | Could | OBJ-001 | BR-001 | EP-001 | US-012 | AC-012-1 | — | Not started | In development | R2 | BR-001 | No test case yet — quality gap |
| NFR-001 | Page load under 2s | Non-Functional | Should | OBJ-002 | — | EP-002 | — | — | — | Not started | Backlog | R2 | Architecture review | No story yet — delivery gap |
```

`docs/specs/rtm.csv` (identical rows):

```csv
Req ID,Title,Type,Priority,Objective,Parent,Epic,Stories,Acceptance Criteria,Test Cases,Test Status,Delivery Status,Release,Owner,Source,Notes
BR-001,Self-service account management,Business,Must,OBJ-001,,EP-001,"US-010, US-011","AC-010-1, AC-011-1","TC-101, TC-102",Passed,Done,R1,,Stakeholder workshop,
FR-001,Reset password via email link,Functional,Must,OBJ-001,BR-001,EP-001,US-010,AC-010-1,TC-101,Passed,Done,R1,,BR-001,
FR-002,Update contact details,Functional,Should,OBJ-001,BR-001,EP-001,US-011,AC-011-1,TC-102,In progress,In QA,R1,,BR-001,
FR-003,Download account statement,Functional,Could,OBJ-001,BR-001,EP-001,US-012,AC-012-1,,Not started,In development,R2,,BR-001,No test case yet — quality gap
NFR-001,Page load under 2s,Non-Functional,Should,OBJ-002,,EP-002,,,,Not started,Backlog,R2,,Architecture review,No story yet — delivery gap
```

Coverage analysis of this RTM:

```
Coverage analysis (5 requirements, 3 stories, 2 test cases):
- Quality gaps: FR-003 (US-012) has no test case
- Delivery gaps: NFR-001 has no story
- Status: FR-002 is In QA, test still In progress — acceptable
- Must-haves: all Must items (BR-001, FR-001) are Done and Passed
```

CSV notes: quote any cell containing a comma (multi-ID cells); leave empty cells blank (consecutive commas), not `—`. Use `—` only in the Markdown table for readability.

## Gotchas

- **Build it forward, never retrospectively.** An RTM reconstructed at the end always contains invented traceability and missed gaps. Add rows as requirements are written.
- **Keep `rtm.md` and `rtm.csv` byte-for-byte consistent in content.** Same rows, same order, same IDs. A divergence makes both untrustworthy. The only formatting difference is empty-cell convention (`—` in Markdown, blank in CSV) and comma-quoting in CSV.
- **Empty cell ≠ missing data.** A blank `Test Cases` cell is a finding (quality gap), not an oversight to silently leave. Surface it in the analysis.
- **Do not redefine story or AC formats.** Adopt the IDs from **user-story-authoring**; this skill references them, it does not own them.
- **Don't write impact narratives here.** List the gaps and orphans; route the "what does this gap cost us" write-up to **gap-impact-analysis**.
- **Quote multi-ID CSV cells.** `"US-010, US-011"` must be quoted or the comma breaks the column count. Validate the CSV column count matches the header before finishing.
- **No spreadsheet-only features.** Conditional formatting, pivots, and charts do not survive in Markdown or CSV. Express every signal as plain text.
- **Many-to-many is normal.** A story serving two FRs is not an error. Use comma-separated IDs or split rows — just be consistent within the file.
