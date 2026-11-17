# Opportunity Brief Template

States a distinct product advantage or value thesis, supported by linked problems, signals,
market context, capabilities, or strategy. Must name a well-formed product advantage and must
be justified by at least one linked problem brief OR one linked strategic thesis. It does not
restate a problem, and it is not a PRD or roadmap item. Store in `opportunities/briefs/`.

```yaml
---
title: "Short opportunity brief title"
status: draft | active | validated | closed
confidence: weak | moderate | strong
created: "YYYY-MM-DD"
last_reviewed: "YYYY-MM-DD"
linked_problem_brief: "problems/briefs/<file>.md"   # or...
linked_strategic_thesis: "<thesis reference>"        # at least one required
---
```

## Value Thesis

The value area this opportunity opens, in 1-3 sentences. Do not restate the problem.

## Product Advantage

A well-formed product advantage names all five:

- **Beneficiary:** who gains
- **Comparison point:** versus what alternative or status quo
- **Advantage type:** more useful / differentiated / defensible / strategically important
- **Timing rationale:** why now
- **Validation path:** what would confirm or weaken the advantage

## Justification

At least one of:

- Linked problem brief(s): `problems/briefs/<file>.md`
- Linked strategic thesis: `<reference>`

Plus supporting signals, market context, or capabilities.

## Affected Outcomes

Outcomes this would improve. Use `unknown` if unclear.

## Affected Personas / Clients

Personas, clients, accounts, or segments.

## Evidence References

Radar signals, docs, source systems, evidence handles.

- `path-or-url`

## Decision Assumptions

Local beliefs supporting the next decision under uncertainty.

-

## Development Assessment (optional)

Feasibility, constraints, or risk when the decision needs it.

## Review Notes

Brief review history and local decisions.
