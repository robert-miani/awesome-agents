# PRD Authoring

## Description

Synthesizes a Product Requirements Document (PRD) from existing context — conversation, source docs,
research, requirements, or tracker context — without restarting discovery. The PRD is the project's
single canonical requirements document for a feature or initiative. This skill owns the PRD structure:
title, source references, problem statement, solution, users/personas, goals and success metrics
(primary KPI, secondary, guardrail), non-goals, user stories, requirements and acceptance notes,
implementation decisions, testing decisions, dependencies and risks, open questions, out of scope, and
the recommended next route.

## When to Use

- Turning a conversation, brief, discovery output, research notes, or tracker context into a PRD
- Drafting a feature PRD or product brief conversion before engineering starts
- Producing a tracker-ready PRD draft from material that already exists
- Revising or reviewing an existing PRD for structure, metrics, scope, and missing context
- Defining success metrics (primary KPI, secondary, guardrail) and MVP boundaries for a feature

Do **not** use this skill for formal BRD/FRD/SRS authoring — that is a separate domain-pack skill.

## Usage

Activate this skill and provide the material you want synthesized into a PRD: conversation context,
source documents, tracker issues, research, meeting notes, designs, or code findings.

The skill synthesizes the PRD from what is already known rather than interviewing you. It separates
confirmed requirements from ideas and assumptions, frames the problem and solution from the user's
perspective, defines goals and success metrics, lists the decisions already made, and records what
remains open — marking gaps as assumptions or open questions instead of inventing decisions.

It defers to related skills rather than restating them:

- **requirements-grilling** — run first when open product decisions block the frame (docs-only mode for PMs)
- **user-story-authoring** — owns the user-story format, Gherkin acceptance criteria, and MoSCoW priority
- **development-assessment** — when feasibility is unknown
- **requirements-traceability-matrix** — for tracing requirements to downstream work
- **issue-decomposition** — the usual next route after the PRD is approved

## Example

**Input:** "Here are the support lead's meeting notes and the billing API ticket — turn them into a PRD
for an account context panel in the support console."

**Output:** A single PRD with the required section order — source references, problem statement,
solution, users and personas, goals and success metrics (primary KPI / secondary / guardrail),
non-goals, user stories, requirements and acceptance notes, implementation decisions, testing
decisions, dependencies and risks, open questions, out of scope, and a recommended next route. Gaps in
the source material appear as explicit assumptions and open questions rather than invented decisions,
and the document is not published to a tracker unless you ask and approve.

## Requirements

- Existing source material to synthesize: conversation, docs, research, requirements, or tracker context
- Project instructions and vocabulary when available (`AGENTS.md`, `CONTEXT.md`, README files, ADRs,
  tracker conventions) so the PRD matches local terminology
- Enough context to identify the problem, intended solution, users, and measurable success criteria
- Optional: the `user-story-authoring`, `requirements-grilling`, `development-assessment`,
  `requirements-traceability-matrix`, and `issue-decomposition` skills for the surrounding workflow
