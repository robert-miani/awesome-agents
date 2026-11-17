# Product Discovery Radar

## Description

Runs a product-discovery Radar loop and, optionally, scaffolds the structure to hold it. Radar
scans defined lanes (usage, customer/client, delivery, market) over a source window and
preserves source material as an evidence-bearing **signal** only when it crosses a **signal
threshold**. Each signal carries **signal suggestions**, which pass through a human **review
gate** before any durable product primitive changes. Accepted suggestions flow into the
candidate to brief lifecycle (problem/opportunity candidates, then briefs).

The skill owns the lane model, the signal thresholds, the noise-vs-signal review gate, the
candidate to brief lifecycle, and the signal/brief quality bars. Runtime execution
(connectors, credentials, scheduling, retries, logs) is deliberately out of scope.

## When to Use

- Running an ad hoc or recurring radar scan over a lane and source window
- Turning analytics, support, sales, delivery, or market evidence into reviewable signals
- Gating signals through a noise-vs-signal review before they change durable product state
- Deriving problem or opportunity candidates from accepted signals
- Advancing candidates toward problem or opportunity briefs
- Setting up a lightweight "product brain" directory and starter templates in a repo

## Usage

Activate the skill and either ask for a radar run or ask to set up the structure.

For a **radar run**, provide: the lane (or `all`), the source window, and the sources or
source handles to scan. The skill applies signal thresholds, writes one radar report under
`radar/signals/` (even with zero signals), emits suggestions, and runs each through the review
gate before applying accepted changes as candidates or brief updates.

For a **scaffold**, ask to "set up a product brain". The skill confirms the root directory name
and lanes to seed, then creates the directory tree, copies the `assets/` templates into place,
seeds lane files, and generates a `CONTEXT.md` glossary stub.

Hand off to `problem-opportunity-brief` (shape candidates into briefs), `prd-authoring`
(settled opportunity to PRD), `backlog-prioritization` (rank opportunities), and
`stakeholder-communications` (signal/report write-ups).

## Example

**Input:** "Run a usage radar scan over the last two days and capture anything worth tracking."

**Output:** A single radar report under `radar/signals/2026-06-16-usage.md` containing a
locally identified signal:

> **SIG-001 — Saved-search usage spike in renewal account.** Saved searches per active user
> rose ~40% WoW, ~70% from one strategic account. **SUG-001:** create a problem candidate.

After the review gate accepts SUG-001 with a rationale, a problem candidate is created at
`problems/candidates/` interpreting the spike as a workaround for weak result recall, with an
evidence reference back to `SIG-001` and one decision-changing discovery question.

## Requirements

- A target repository or working directory to hold the product brain (the skill can scaffold one)
- Access to the source material or source handles for the lanes being scanned
- A human reviewer for the review gate — signals and suggestions never auto-update durable state
- Optional: a project-specific signal priority profile to interpret cross-lane importance
- Out of scope: connectors, credentials, schedulers, retries, and run logs (runtime execution)
