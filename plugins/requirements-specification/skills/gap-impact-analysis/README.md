# Gap & Impact Analysis

## Description

Performs current-state vs future-state gap analysis and assesses the impact of a proposed change across
systems, processes, people, and data. The skill models the as-is and to-be states, identifies and
classifies every gap between them, scores gaps on impact and complexity, assesses the change across
multiple dimensions, and recommends a prioritized remediation path. Tabular outputs (the gap register and
impact matrix) are produced as Markdown tables committed to the repo plus a parallel `.csv`; the impact
assessment itself is Markdown narrative.

## When to Use

- Comparing how a system or process works today against a desired future state ("as-is vs to-be")
- Identifying, classifying, and prioritizing the gaps between current and future state
- Assessing the impact of a change across people, process, system, and data dimensions
- Answering "what changes if we...?" and producing a change-delta
- Recommending and prioritizing remediation actions to close gaps
- Tracing gaps to the requirements that drive them

## Usage

Activate this skill and describe the change or target that defines the future state. Provide as much
context as you have:

- The change or initiative driving the future state, and why
- The scope boundary — what is in scope and what is explicitly out
- A description of the current state (interviews, observation, or existing documents)
- A description of the desired future state (vision, requirements, or design)
- Constraints such as timeline, budget, mandated platforms, or dependencies

The skill confirms scope, models the as-is and to-be states, builds the as-is/to-be comparison, fills the
gap register and impact matrix, prioritizes on impact x complexity, and returns a remediation
recommendation. When the current state comes from existing documents, pair it with the
`requirements-source-ingestion` skill first; to connect gaps to the requirements they satisfy, pair it
with the `requirements-traceability-matrix` skill.

## Example

**Input:** "We're replacing our spreadsheet-based expense approval with a workflow tool. What's the gap and
what's the impact?"

**Output:** An as-is/to-be comparison, a classified gap register, and an impact narrative. The gap register
is committed as both a Markdown table and a parallel CSV:

```text
skills/business-analysis/gap-impact-analysis/  (output lands in the user's repo)
  gap-register.md
  gap-register.csv
  impact-assessment.md
```

A trimmed gap register:

| Gap ID | Dimension | Area | Gap description | Impact | Complexity | Priority |
|---|---|---|---|---|---|---|
| GAP-001 | Process | Intake | No structured intake; data re-keyed | High | Low | Quick Win |
| GAP-002 | Governance | Approval | No second approval or audit trail | High | Medium | Major Project |
| GAP-003 | Data | Reporting | No structured data to report on | Medium | Medium | Schedule |

With a recommendation such as: *Proceed with conditions — deliver GAP-001 first (low-risk, unblocks the
others), then GAP-002 with training, then GAP-003.*

## Requirements

- A described or discoverable current state and a defined future state
- An agreed scope boundary for what is in and out of the analysis
- Enough context to rate impact and complexity per gap
- Optional: the `requirements-source-ingestion` skill when the current state must be reconstructed from
  existing documents
- Optional: the `requirements-traceability-matrix` skill to trace gaps to requirements
