---
name: requirements-grilling
description: >
  Interrogates any artifact — plan, requirement, brief, PRD, story, ticket, proposal, or
  fuzzy idea — one question at a time until it is precise enough to route, document, or
  implement. Runs in code-aware mode (verifies claims against repo docs and code) or
  docs-only mode (never inspects code; routes implementation questions to a Development
  Assessment). Use when the user says "grill this", "pressure-test this plan",
  "interrogate the requirements", "sharpen this PRD", "challenge my assumptions", or asks
  to be questioned "one question at a time".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Requirements Grilling

## Overview

Interview the user relentlessly until the artifact is precise enough to route, document,
or implement. The method is constant: ask exactly **one** material question at a time,
always include your recommended answer and why, then wait for feedback before the next
question. Challenge vague or overloaded terms, check claims against the project's docs and
glossary, and stress-test with concrete edge-case scenarios.

The skill grills any artifact: a plan, requirement, brief, PRD, user story, ticket,
proposal, incident, or a fuzzy idea that is not yet any of those.

## Two Modes

Pick the mode at the start of the session and state which one you are in.

### Code-aware mode (DEFAULT)

For a BA or technical analyst working in a repository. When the user makes a claim about
current behaviour, permissions, data, APIs, integrations, or constraints, **inspect the
docs and the code to verify it before asking the next question.** Do not invent product
behaviour when the repo can answer.

### Docs-only mode

For a PM or PO shaping an artifact from product docs and stakeholder input without code
access. Enter this mode when the user says they have no code access, or when grilling a
PRD purely from product docs.

> **HARD GUARDRAIL — docs-only mode:** Never inspect code and never claim implementation
> behaviour. Do not answer feasibility, architecture, data-model, API-support, migration,
> or security questions from intuition. When implementation truth matters, stop guessing,
> emit a **Development Assessment request**, and route it to the `development-assessment`
> skill. When grilling a PRD in docs-only mode, read `references/prd-grilling.md` for the
> PRD section walk and the request template.

## Required Context

Before grilling, in either mode:

- Read project instructions and context files when present: `AGENTS.md`, `CLAUDE.md`,
  `CONTEXT.md`, `CONTEXT-MAP.md`, `INDEX.md`, README files, docs, and ADRs.
- If `CONTEXT-MAP.md` exists, identify the relevant bounded context before relying on or
  updating glossary language.
- Use the project's own vocabulary for users, customers, products, workflows, states,
  systems, and delivery gates.
- Read tracker context where supplied: Jira issues, Confluence pages, Linear tickets,
  GitHub issues, Figma designs, research notes, analytics summaries, transcripts.
- Preserve source links, requirement IDs, quotes, and exact phrases that carry intent.
- In code-aware mode only: search the code when the user claims current behaviour.

## Interview Rules

- Ask **one** material question per turn. Never batch questions.
- Every question carries your **recommended answer** and the **reasoning or evidence**
  behind it. The user should be able to say "yes" and move on.
- After the question, **wait** for the user's feedback. Do not answer your own question
  and continue.
- Prefer questions that remove ambiguity around user, outcome, scope, evidence,
  dependency, state, permission, or acceptance criteria.
- Do not jump to downstream implementation tasks while upstream scope is unresolved.

## Workflow

1. **Frame the object being grilled.** Identify what it is (plan, requirement, brief,
   PRD, story, ticket, proposal, incident, fuzzy idea). State the decision the session
   must unlock. List what is already known from supplied context. Pick the mode.

2. **Check local language and decisions.** Compare the user's terms against `CONTEXT.md`,
   local docs, tracker labels, and ADRs. Challenge conflicts immediately: "The docs define
   X this way, but your plan implies Y — which should win?" Propose a precise canonical
   term whenever the user uses overloaded language ("user", "value", "real-time", "MVP",
   "phase 1", "success", "integration", "automation").

3. **Walk the decision tree.** Ask one dependency-resolving question at a time, with
   recommendation and why. Resolve upstream scope before downstream detail.
   - For a PRD in docs-only mode, follow the section walk in `references/prd-grilling.md`
     (problem → target user → outcome → scope → non-goals → user stories → requirements →
     states → dependencies → risks → acceptance → rollout → measurement).

4. **Stress-test with scenarios.** Use concrete examples and edge cases to test the
   boundaries between concepts, personas, permissions, data states, workflows, and failure
   states. Check default, empty, error, permission-denied, migration, and rollback cases
   when relevant. In code-aware mode, surface contradictions between the proposed behaviour
   and the current code or docs. In docs-only mode, convert any feasibility doubt into a
   Development Assessment request.

5. **Capture durable decisions sparingly.** Update a local glossary or context file only
   when a reusable term is resolved and the user wants it saved; keep glossary entries free
   of implementation detail. Recommend an ADR only when the decision is hard to reverse,
   surprising without context, and the result of a real trade-off.

## Worked Example — one grilling turn

> **User's draft:** "Admins should be able to export the dashboard in real time."
>
> **Grilling turn (code-aware mode):**
>
> The docs (`CONTEXT.md`) define two roles that people both call "admin": **Org Admin**
> and **Workspace Admin**. The export endpoint in the code is gated to `Org Admin` only.
>
> **Question:** Does "admins" here mean Org Admins only, or should Workspace Admins also
> be able to export?
>
> **Recommended answer:** Org Admins only.
>
> **Why:** The current export permission and the data it exposes are already scoped to Org
> Admin in the code, and the docs treat workspace-level data as tenant-isolated. Widening
> to Workspace Admin would cross that isolation boundary and needs its own decision.
>
> *(Then wait for the user's answer before asking the next question. Separately, "real
> time" is overloaded — that becomes the next turn: streaming vs. on-demand-at-click.)*

In docs-only mode, the same turn would not state what the code enforces. It would flag the
two "admin" meanings from the docs, recommend the narrower scope, and — if the permission
boundary actually blocks the product decision — emit a Development Assessment request
rather than assert what the code does.

## End of Session

Return:

- resolved decisions
- unresolved questions and assumptions
- glossary updates made or recommended
- ADR / decision-record recommendations, if any
- Development Assessment requests, if any (docs-only mode)
- next route — see the related skills below

## Related Skills

- `development-assessment` — answers feasibility and code-truth questions; the required
  destination for implementation questions raised in docs-only mode.
- `prd-authoring` — synthesizes a PRD once the grilling has resolved the decisions.
- `problem-opportunity-brief` — shapes the problem during discovery when the idea is still
  fuzzy.
- `user-story-authoring` — owns the story and acceptance-criteria format for breakdown.

## Gotchas

- **Never batch questions.** One material question per turn, then wait — even when several
  feel related.
- **A question without a recommendation is a half-question.** Always supply your proposed
  answer and the reasoning, so the user can confirm in one word.
- **In docs-only mode, do not let a documented requirement masquerade as current product
  behaviour.** What a spec says and what the code does are different claims; only
  `development-assessment` settles the latter.
- **Do not answer feasibility from intuition in docs-only mode.** Convert the doubt into a
  narrow Development Assessment question; never escalate with a vague one.
- **A glossary is not a spec or a scratch pad.** Capture a term only when it is reusable
  and resolved, and keep implementation detail out of it.
- **Do not create an ADR for ordinary, reversible, or obvious choices.**
- **Do not proceed to PRD synthesis or story breakdown until the core decision has enough
  clarity.**
