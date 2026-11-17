# Sprint Progress Reporting

## Description

Produces recurring, cadence-based sprint progress updates that summarize meaningful movement of tracked
work (stories/tasks under a parent/roadmap epic) and the code activity explicitly linked to it across a
sprint window. The skill owns the reporting cadence and next-due tracking, compares current tracker and
code state to a saved machine-readable snapshot baseline to detect meaningful movement, filters out
low-signal churn, posts an update even when nothing moved, handles catch-up after missed cadences, and
includes code changes only when they have an explicit link to a work item.

The readable update is Markdown. The snapshot baseline is a separate machine-readable JSON block stored
with the tracking item — diffing always runs against the JSON, never against the previous prose update.

## When to Use

- Posting a recurring sprint progress update at a sprint boundary
- Answering "what changed this sprint" for a tracking item or parent/roadmap epic
- Generating a progress summary or status report that groups movement by linked epic
- Surfacing scope drift, reopened work, or linked code/review-state changes since the last update
- Catching up with one consolidated update after the reporter missed several cadence periods

## Usage

Activate this skill and identify the tracking item (parent/roadmap epic) to report on. Provide what you
have:

- The tracking item and its linked epics
- The reporting cadence and next-due date
- The latest snapshot baseline, if one exists
- Access to current work-item state and explicitly linked code activity

The skill determines the update window from the cadence and last update, loads the snapshot baseline,
diffs current state against it, keeps only meaningful movement, composes the readable update grouped by
epic, then saves a fresh snapshot and advances the schedule. Pair with **sprint-planning** for the
committed work being tracked and **stakeholder-communications** for audience-tuned status formats.

## Example

**Input:** "Post the sprint progress update for the Checkout Revamp roadmap item (ROAD-42)."

**Output:** A Markdown update grouped by linked epic — status changes, new/closed/reopened items,
acceptance-criteria and scope changes, linked PR and review-state movement, and a scope-drift callout when
divergence is detected — plus a short no-movement note when nothing changed. A machine-readable JSON
snapshot baseline (ticket keys, statuses, scope fields, acceptance-criteria hashes, linked code identifiers
and review states, timestamps) is saved with the tracking item for the next diff, replacing the prior one.

## Requirements

- A tracking item (parent/roadmap epic) with an explicit reporting cadence and next-due date
- Explicit links from the tracking item to its epics, and from code changes to work items
- A place to store one latest-only machine-readable JSON snapshot alongside the tracking item
- Read access to current work-item state and linked code/review activity
- Optional: **sprint-planning** for the committed scope and **stakeholder-communications** for tuned formats
