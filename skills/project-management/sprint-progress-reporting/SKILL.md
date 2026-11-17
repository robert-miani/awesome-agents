---
name: sprint-progress-reporting
description: >
  Produce recurring, cadence-based sprint progress updates that summarize meaningful movement of tracked
  work and linked code activity across a sprint window. Compares current tracker and code state to a saved
  machine-readable snapshot baseline to detect status changes, creation, closure, reopen, scope or
  acceptance-criteria changes, linked code activity, review-state changes, and scope drift, while filtering
  out low-signal churn. Use when the user wants a sprint progress update, status report, progress summary,
  or asks "what changed this sprint" or to "report sprint status".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Sprint Progress Reporting

## Overview

Post a recurring **Sprint Progress Update**: a readable summary of meaningful movement in tracked work
(stories/tasks under a parent/roadmap epic) and the code activity explicitly linked to it, across one
sprint window. This skill owns the reporting cadence, the diff against a saved snapshot baseline, the
classification of meaningful movement versus noise, and the saving of a fresh snapshot after each update.

The update is human-readable Markdown. The snapshot baseline is a separate machine-readable JSON block
stored alongside the tracking item. Never diff against the previous prose update — diff against the JSON
snapshot.

This skill reports on the work committed via **sprint-planning**. For audience-tuned status formats
(executive summary, stakeholder digest), pair it with **stakeholder-communications**.

## Core Concepts

- **Tracking item** — the parent/roadmap epic that owns reporting. It carries the cadence, the next-due
  date, and the latest snapshot baseline.
- **Epic** — a delivery-team work container linked to the tracking item by an **explicit link**, not by
  title match or naming convention.
- **Story/task (work item)** — an implementable child of an epic; the unit whose movement is reported.
- **Reporting Cadence** — the sprint-boundary rhythm that decides when the tracking item gets an update.
- **Next Progress Update** — the next due date for an update on the tracking item.
- **Update Window** — the time range an update covers: from the previous successful update to now.
- **Meaningful Movement** — a material change to progress, scope, review state, or drift (see below).
- **Snapshot baseline** — the machine-readable state saved after a successful update, used for the next diff.
- **Catch-up Update** — one consolidated update covering several missed cadence periods.
- **Scope drift** — visible divergence between approved intent and the work emerging through the items.

## Workflow

1. **Determine the update window from cadence.**
   - Read `Reporting Cadence` and `Next Progress Update` from the tracking item.
   - If either is missing or invalid, post one **setup notice** explaining which fields are required, then
     stop. Do not repeat the notice on later runs until those fields change.
   - If `now` is before `Next Progress Update`, the update is not due — stop.
   - The window starts at the timestamp of the previous successful update and ends at `now`. For the very
     first update, start the window one `Reporting Cadence` before `Next Progress Update`.

2. **Load the snapshot baseline.**
   - Read the latest saved JSON snapshot stored with the tracking item.
   - If there is no snapshot, treat current state as the first baseline: report only items created or
     changed inside the first window, then save the snapshot.

3. **Collect current state.**
   - Resolve the epics linked to the tracking item by their **explicit link** only.
   - Collect their child work items and normalize: key, status, type, summary, scope-bearing fields,
     acceptance criteria, updated timestamp.
   - Collect code activity that has an **explicit link** to a work item: identifier, review state,
     timestamp, URL. Code with no explicit link is excluded — never infer a link from branch names,
     file paths, or commit text.

4. **Diff current state against the snapshot.**
   - Compare each item and code link against its snapshot entry deterministically.
   - Classify each difference as meaningful movement or low-signal churn (see below).

5. **Identify meaningful movement and drift.**
   - Keep only meaningful entries. Note any scope drift as evidence — do not rewrite the approved epic.

6. **Compose the update.**
   - Group movement by linked epic. Reference each work item and linked code by key/URL so readers can
     jump to the source.
   - If no meaningful movement was detected, still post a short no-movement update (see rule below).

7. **Save a new snapshot, then advance the schedule.**
   - Post the readable update first.
   - Save the fresh JSON snapshot, replacing the prior one (keep only the latest).
   - Only after both succeed, advance `Next Progress Update` by one `Reporting Cadence`. If posting or
     saving fails, leave the due date unchanged so a later run retries the same window.

## What Counts as Meaningful Movement

Include in the update:

- Material status change (e.g. To Do → In Progress, In Review, Done).
- Work item created.
- Work item closed / completed.
- Work item reopened.
- Scope change (scope-bearing field added, removed, or materially edited).
- Acceptance-criteria change.
- Linked code activity (a new or updated linked PR/change).
- Code-review state change (draft, ready-for-review, approved, changes-requested, merged, closed).
- Scope drift — observed work has visibly diverged from approved intent.

## What Counts as Noise (exclude)

Filter out low-signal churn:

- Assignee-only changes.
- Label-only changes.
- Sprint-field moves.
- Timestamp-only changes.
- Cosmetic text edits (whitespace, typo fixes with no scope effect).
- Code activity with no explicit link to a work item.
- Human blockers, unless they are visible as ticket or code state.

## Snapshot Baseline Contents

Store one latest-only JSON snapshot with the tracking item, separate from the readable update. It must
hold enough state for a deterministic next-diff:

- `tracking_item` — key of the parent/roadmap epic.
- `snapshot_at` — ISO timestamp the snapshot was taken (= end of the window just reported).
- `items[]` — per work item: `key`, `status`, `type`, `summary`, `acceptance_criteria` (or a hash),
  scope-bearing fields, `updated_at`.
- `code_links[]` — per linked code change: `id`, `item_key`, `review_state`, `updated_at`, `url`.

Keep only the latest snapshot. Readable updates are the human audit trail; do not retain snapshot history,
and never parse a prior prose update to reconstruct state.

## The "Post Even If Nothing Changed" Rule

When an update is due and the diff finds no meaningful movement, still post a short update stating that the
scan ran and no ticket or linked code movement was detected this window. Silence is not an acceptable
no-movement signal — stakeholders must know the cadence is alive. Save the snapshot and advance the
schedule exactly as with a movement update.

## Catch-up Handling

If the tracking item is overdue by several cadence periods (e.g. the runner was down):

- Post one **Catch-up Update** covering one consolidated window from the last successful update to now.
- Do not post one update per missed period.
- After posting and saving the snapshot, advance `Next Progress Update` by `Reporting Cadence` repeatedly
  until it lands in the future.

## Code-Link Requirement

Include a code change in the update only when it has an explicit link to a work item (e.g. an item key in
the PR, or tracker-native development metadata). This keeps roadmap reporting from guessing which work a
change belongs to. Unlinked commits, branches, and PRs are out of scope for the update.

## Worked Example

**Readable update (Markdown):**

```markdown
## Sprint Progress Update — Checkout Revamp (ROAD-42)
Window: 2026-06-10 → 2026-06-24 · Cadence: 2 weeks

### Epic: Payment Flow (PAY-7)
- **PAY-7-12** Apply discount codes — In Progress → **Done** ([PR #841](…) merged)
- **PAY-7-19** Saved cards — **reopened** after QA found a token-refresh regression
- **PAY-7-23** Currency rounding — **new** story created, Ready for Dev

### Epic: Checkout UI (UI-3)
- **UI-3-8** Address autocomplete — acceptance criteria changed (now requires unit-level entry)

### ⚠️ Scope drift
- Observed work on **PAY-7-12** added a stored-payment-profile flow not in the approved epic.
  Flagged for discussion; approved scope unchanged.

_No movement on 4 other linked items this window._
```

**Snapshot baseline (machine-readable JSON, stored separately):**

```json
{
  "tracking_item": "ROAD-42",
  "snapshot_at": "2026-06-24T00:00:00Z",
  "items": [
    {
      "key": "PAY-7-12",
      "status": "Done",
      "type": "Story",
      "summary": "Apply discount codes",
      "acceptance_criteria_hash": "a1b2c3",
      "scope_fields": { "story_points": 5 },
      "updated_at": "2026-06-23T14:02:00Z"
    },
    {
      "key": "PAY-7-19",
      "status": "Reopened",
      "type": "Story",
      "summary": "Saved cards",
      "acceptance_criteria_hash": "d4e5f6",
      "scope_fields": { "story_points": 8 },
      "updated_at": "2026-06-22T09:11:00Z"
    }
  ],
  "code_links": [
    {
      "id": "PR-841",
      "item_key": "PAY-7-12",
      "review_state": "merged",
      "updated_at": "2026-06-23T13:50:00Z",
      "url": "https://example/pr/841"
    }
  ]
}
```

## Gotchas

- **Diff the snapshot, never the prose.** The previous readable update is for humans; reconstructing state
  from it is fragile and non-deterministic.
- **Explicit links only — both ways.** Resolve epics by explicit link to the tracking item, and include
  code only by explicit link to a work item. Title/branch/path inference is a bug, not a fallback.
- **Advance the schedule last.** `Next Progress Update` advances only after both the post and the snapshot
  save succeed; a failed run must retry the same window.
- **No-movement still posts.** An empty diff is a short update, not a skipped run.
- **Catch-up is one update.** Overdue by N periods → one consolidated window, then fast-forward the due date.
- **Report drift, don't fix it.** Record scope drift as evidence in the update; never mutate the approved
  epic or scope to resolve it.
- **Keep only the latest snapshot.** No snapshot history — readable updates are the audit trail.
- **Don't report human blockers** unless they show up as ticket or code state.
