# Issue Decomposition

## Description

Breaks approved product scope — a PRD, brief, plan, or story breakdown — into independently verifiable tracker issues using tracer-bullet **vertical slices**. Each issue delivers a narrow but complete path through one user or operator outcome rather than a horizontal layer of work. The skill classifies each issue as `AFK` (no further human input needed) or `HITL` (a human decision is required), orders issues by dependency, enforces an approval checkpoint before anything is published, and then writes structured issue bodies or import-ready drafts for Jira, Linear, GitHub, or any backlog.

This skill owns vertical-slice tracer-bullet decomposition; other skills defer to it for slicing.

## When to Use

- Turning an approved PRD, brief, plan, or story breakdown into tracker issues
- Asking to "break this into tickets/issues", "decompose this PRD", or "create backlog stories"
- Splitting scope into Jira, Linear, or GitHub issues
- Producing vertical slices instead of horizontal "build backend / build UI / write tests" tasks
- Needing AFK/HITL classification, dependency ordering, or an approval checkpoint before publishing
- Producing import-ready issue drafts when no tracker tooling is available

## Usage

Activate this skill and point it at the approved scope. Provide as much context as you have:

- The source artifact (PRD, brief, plan, story breakdown) and its requirement IDs
- The target tracker and whether you want stories only, tasks only, or a story/task breakdown
- Tracker conventions when available: issue types, labels, components, epics, fix versions, custom fields, Definition of Ready, Definition of Done
- Any local project docs, glossary, or ADRs that affect how slices should be named

The skill drafts vertical slices, classifies them AFK/HITL, orders them by dependency, and **stops at an approval checkpoint** so you can confirm granularity, dependencies, coverage, and classifications. After approval it writes full issue bodies and either publishes them in dependency order or produces import-ready drafts.

## Example

**Input:** "Decompose the saved-addresses section of this PRD into Linear issues."

**Output (presented for approval before publishing):**

| # | Title | Type | Class | Blocked by |
|---|---|---|---|---|
| 1 | Customer can add a shipping address and see it saved | Story | AFK | none |
| 2 | Customer can view their list of saved addresses | Story | AFK | #1 |
| 3 | Customer can set a saved address as default | Story | HITL | #1 |

No issue is a horizontal layer — persistence and API work live inside slice #1. Issue #3 is `HITL` because the PRD leaves the "previous default" behavior undecided. After the user confirms granularity, order, coverage, and classifications, each issue is expanded into a full body (what to build, acceptance criteria, verification, blockers, open questions) and published in order 1 → 2 → 3.

## Requirements

- An approved source artifact: a PRD, brief, plan, or story breakdown (typically from the `prd-authoring` skill)
- Tracker conventions when issues should carry correct labels, components, epics, or custom fields
- The `user-story-authoring` skill when acceptance criteria should follow the standard Gherkin format
- Optional: tracker tooling (Jira/Linear/GitHub access) for direct publishing; otherwise the skill produces import-ready drafts
