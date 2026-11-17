# Requirements Grilling

## Description

Interrogates any artifact — a plan, requirement, brief, PRD, user story, ticket,
proposal, or fuzzy idea — one question at a time until it is precise enough to route,
document, or implement. Each turn asks exactly one material question, always paired with a
recommended answer and the reasoning behind it, then waits for feedback. The skill
challenges vague or overloaded terms, checks claims against the project's docs and
glossary, and stress-tests with concrete edge-case scenarios.

It runs in two modes that share the same method:

- **Code-aware mode (default)** — for a BA or technical analyst with a repository. Claims
  about current behaviour, permissions, data, and APIs are verified against the docs and
  the code before a question is asked.
- **Docs-only mode** — for a PM or PO without code access. The skill never inspects code
  or claims implementation behaviour; when implementation truth matters it emits a
  Development Assessment request and routes it to the `development-assessment` skill.

## When to Use

- Pressure-testing a plan, requirement, brief, proposal, or fuzzy idea before committing
  to it
- Sharpening a PRD section by section without code access (docs-only mode)
- Challenging overloaded terminology ("user", "real-time", "MVP", "success") against the
  project glossary
- Verifying claims about current behaviour, permissions, or APIs against the repository
  (code-aware mode)
- Surfacing edge cases, failure states, and contradictions before downstream work begins
- Deciding the next route: PRD synthesis, story breakdown, development assessment, or
  no change

Trigger phrases include "grill this", "pressure-test this plan", "interrogate the
requirements", "sharpen this PRD", "challenge my assumptions", and "ask me one question
at a time".

## Usage

Activate the skill and provide the artifact you want grilled plus any context: the draft
itself, the decision it must unlock, relevant project files (`AGENTS.md`, `CONTEXT.md`,
`CONTEXT-MAP.md`, ADRs), and tracker context (Jira, Confluence, Linear, GitHub, Figma).
State whether you have code access — this selects code-aware (default) or docs-only mode.

The skill frames the object, checks local language, then walks a decision tree one
question at a time, each with a recommended answer and why. It stress-tests with concrete
scenarios and, in docs-only mode, hands implementation questions off as Development
Assessment requests. When grilling a PRD in docs-only mode, it follows the section walk in
`references/prd-grilling.md`.

## Example

**Input:** "Grill this: admins should be able to export the dashboard in real time."

**Output (one turn, code-aware mode):**

> The docs define two roles people both call "admin": Org Admin and Workspace Admin, and
> the export endpoint is gated to Org Admin only.
>
> **Question:** Does "admins" mean Org Admins only, or should Workspace Admins also export?
>
> **Recommended answer:** Org Admins only.
>
> **Why:** The export permission and the data it exposes are already scoped to Org Admin in
> the code, and workspace data is tenant-isolated; widening to Workspace Admin crosses that
> boundary and needs its own decision.

The skill then waits for the answer before its next turn (where "real time" — streaming vs.
on-demand — gets the same treatment).

## Requirements

- The artifact to grill (plan, requirement, brief, PRD, story, ticket, proposal, or idea)
- Optional but recommended: project context files (`AGENTS.md`, `CONTEXT.md`,
  `CONTEXT-MAP.md`, ADRs) and tracker context (Jira, Confluence, Linear, GitHub, Figma)
- For code-aware mode: access to the repository so claims can be verified against code
- For docs-only mode: the `development-assessment` skill as the destination for
  implementation questions
- Related skills for routing: `prd-authoring`, `problem-opportunity-brief`,
  `user-story-authoring`
