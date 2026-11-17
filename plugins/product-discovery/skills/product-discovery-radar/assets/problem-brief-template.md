# Problem Brief Template

Describes a suspected or validated problem, the outcome it affects, the evidence behind it,
and what the product team needs to understand. A problem brief describes a decision-relevant
gap — not an idea, feature request, or ticket. Store in `problems/briefs/`.

```yaml
---
title: "Short problem brief title"
status: draft | active | validated | closed
confidence: weak | moderate | strong
created: "YYYY-MM-DD"
last_reviewed: "YYYY-MM-DD"
linked_candidate: "problems/candidates/<file>.md"
---
```

## Problem Statement

The decision-relevant gap in 1-3 sentences. State who is affected and what breaks for them.

## Affected Outcome

The product or business outcome this problem degrades. Use `unknown` if unclear.

## Affected Personas / Clients

Personas, clients, accounts, or segments affected, and how broadly.

## Evidence

What the evidence directly shows. Cite radar signals and source handles.

- `path-or-url`

## Severity And Cost

How severe, frequent, or costly the problem is. Distinguish confirmed from inferred impact.

## What Product Needs To Understand

Open decision-changing questions, or `None identified` if the evidence is sufficient to act.

-

## Decision Assumptions

Local beliefs supporting the next decision under uncertainty.

-

## Development Assessment (optional)

Embed feasibility, constraints, current behavior, or risk when a decision needs it. Promote to
a standalone artifact only when reusable across decisions.

## Review Notes

Brief review history and local decisions.
