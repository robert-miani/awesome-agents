# Backlog Prioritization

## Description

Ranks a backlog or set of candidate features for upcoming sprints or PIs using structured
scoring frameworks — RICE, ICE, value/effort (2x2), MoSCoW, and WSJF. The skill chooses
the framework that fits the decision, makes every scoring input explicit, applies the
formula consistently, and returns a ranked, defensible ordering as a Markdown table. When
stakeholders disagree, it frames the competing goals and trade-offs rather than picking a
side.

This is a sprint-planning/execution skill in the project-management discipline. It
sequences known candidates; it does not discover problems, author requirements, or size
effort from scratch.

## When to Use

- Ordering a backlog when there are more candidate items than capacity
- Deciding what to build next quarter, sprint, or PI
- Applying a specific framework — RICE, ICE, value/effort, MoSCoW, or WSJF
- Cutting scope for an MVP or a fixed-date release (MoSCoW)
- Resolving a "which feature first" disagreement with an explicit, shared rationale
- Producing a ranked table that can be reviewed, defended, and revisited

## Usage

Activate the skill and give it the candidate items plus the goal they should be ranked
against. Provide as much as you have:

- The list of features or backlog items to rank
- The objective or metric they serve (e.g. activation, ticket volume, a PI objective)
- A preferred framework, if you have one (otherwise the skill selects one)
- Known effort sizes (from estimation) and any value framing already done
- Hard constraints: guardrail metrics, dependencies, compliance or contractual musts

The skill picks a framework, fills in the scoring inputs (labeling each as measured,
estimated, or assumed), applies the formula, and returns a ranked Markdown table with a
short rationale and any trade-offs to surface. Effort inputs are best pulled from
**estimation-support**; the resulting ranking feeds **sprint-planning**; upstream value
framing comes from **problem-opportunity-brief**.

## Example

**Input:** "We have 4 features competing for next quarter and want to raise trial-to-paid
conversion. Rank them with RICE."

**Output:** A ranked table sorted by RICE score, every input shown and labeled:

| Rank | Feature | Reach | Impact | Confidence | Effort | RICE Score |
|------|---------|-------|--------|------------|--------|-----------|
| 1 | Guided onboarding checklist | 8,000 | 2 | 80% | 2 | 6,400 |
| 2 | In-app upgrade prompt | 5,000 | 2 | 100% | 2 | 5,000 |
| 3 | SSO for enterprise trials | 1,200 | 3 | 80% | 3 | 960 |
| 4 | Dark mode | 9,000 | 0.5 | 80% | 4 | 900 |

Plus a rationale (the top two are near-ties; dark mode's high reach is a trap because its
impact on conversion is low) and a flagged trade-off (SSO may be a sales guardrail despite
ranking #3). An equivalent `.csv` is offered for spreadsheet use.

## Requirements

- A concrete set of candidate items to rank
- A stated goal or metric the ranking is relative to
- Effort sizes for the items, ideally from **estimation-support** (so units are consistent)
- Optional: value framing from **problem-opportunity-brief** and any guardrails or dependencies that override raw score
- No spreadsheet software needed — output is Markdown, with an optional plain-text `.csv`
