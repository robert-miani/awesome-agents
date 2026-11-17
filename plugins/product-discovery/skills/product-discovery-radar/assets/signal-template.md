# Radar Signal Report Template

One file per radar run. Store under `radar/signals/`. Radar is a lightweight processing
function: cite source handles clearly, but do not import every source into the product brain
just because a run reviewed it. Lead with TLDR, insight, and suggestions; put sources and
caveats last.

```yaml
---
title: "Radar Signals - YYYY-MM-DD - Lane Name"
lane: all | usage | customer-client | delivery | market
lanes: []
cadence: daily | weekly | ad-hoc
source_window: "YYYY-MM-DD to YYYY-MM-DD"
radar_run: "YYYY-MM-DDTHH:MM:SSZ"
status: unreviewed | reviewed
---
```

## Scope

Lane, source window, reviewed sources, exclusions. 1-3 bullets.

## TLDR

- SIG-001: signal in one line.
- Suggested action: SUG-001 -> target artifact/change.
- Review state: unreviewed | reviewed | no signals.

## Suggestions

### SUG-001

- signal: SIG-001
- action:
- why:
- target:

## Review Decisions

Filled in by the review gate.

### SUG-001

- decision: accepted | revised | rejected | deferred | no-change
- rationale:
- applied changes:

## Signal Details

### SIG-001: Short signal title

```yaml
lane: usage | customer-client | delivery | market
signal_type: pattern | anomaly | trend | high-weight-source | strategic-relevance | contradiction | time-sensitive-risk-or-opening
secondary_types: []
confidence: weak | moderate | strong
priority_basis: "Short explanation using the signal priority profile when relevant."
```

#### Insight

One or two short bullets. Lead with what matters.

-

#### Why It Matters

One short bullet tied to an outcome, account, strategy, or risk.

-

## Sources Cited

Use source links where available.

- `path-or-url`

If source links are unavailable, include short quotes/data and explain the source.

## Caveats / Unprocessed

-

## No-Signal Note

If no source material crossed threshold, the report is still valid. Use:

```md
## TLDR

No signals crossed threshold.

## Scope

Reviewed:

Excluded:

## Caveats / Unprocessed

-
```
