# {Lane Name} Radar Lane

Store under `radar/lanes/`. A lane is a scoped radar focus area that defines which sources,
thresholds, and interpretation rules a run uses. Lanes share the same threshold vocabulary;
only interpretation differs per lane. Lane definitions may name baseline/example connectors,
but never secrets or runtime-only details — those live in execution config, outside the
product brain.

## Purpose

What meaningful product intelligence this lane is meant to detect. 1-2 sentences.

## Cadence

- Daily / lightweight pass for: {anomalies, threshold-crossing changes}
- Weekly / synthesis pass for: {trends, cross-window movement}
- Ad hoc pass when: {a launch, incident, renewal, or planning question needs context}

## Source Adapters

For each source the lane reads:

### {Source Name}

- source type: {local repo | external analytics | operational source | public web | ...}
- baseline connector: {example connector, API, or manual export — no secrets}
- example scope: {what to look at}
- execution detail: {direct file read | configured outside the product brain}
- known bias: {what this source over- or under-represents}

## Lane Threshold Interpretation

How each shared threshold applies in this lane:

- Pattern:
- Anomaly:
- Trend:
- High-weight source:
- Strategic relevance:
- Contradiction:
- Time-sensitive risk or opening:

## Common Suggestions

- Create or update a problem candidate.
- Create or update an opportunity candidate.
- Open a discovery question.
- {Lane-specific suggestion, e.g. update persona/client/capability/market understanding}
- Record no state change.
