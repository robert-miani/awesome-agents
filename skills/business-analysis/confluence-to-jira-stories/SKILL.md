---
name: confluence-to-jira-stories
description: >
  Turns Confluence product requirements into Jira-ready stories, then — only after explicit approval — breaks approved stories into Jira tasks. Owns Confluence intake (pages, child pages, inline comments, decision tables, attachments, source links), preserving Confluence and Jira conventions (issue types, statuses, components, labels, fix versions, epics, custom fields, DoR/DoD), the two-phase approval, and publishing via MCP tooling or producing import-ready drafts. Use for "Confluence to Jira", "turn this Confluence page into stories", "create Jira stories from requirements", or "break into Jira tasks". Defers vertical-slice decomposition to issue-decomposition and story/AC format to user-story-authoring.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Confluence To Jira Stories

## Overview

Convert product requirements captured in Confluence into a reviewed Jira story breakdown, then — only after explicit approval — break the approved stories into Jira tasks. This skill owns the channel-specific work: Confluence intake, preserving Confluence and Jira conventions, the two-phase approval checkpoint, and either publishing through Jira/Confluence MCP tooling or producing import-ready Jira drafts when that tooling is unavailable.

This skill does **not** restate slicing rules. For how to split work into thin vertical slices, defer to the **issue-decomposition** skill. For story and acceptance-criteria wording, defer to the **user-story-authoring** skill. Reference them by name and follow their output, rather than re-deriving their logic here.

Two hard rules govern everything below:

1. Stories first, tasks only after approval. Never draft or publish tasks before the story breakdown is explicitly approved.
2. Never pretend a channel was updated. If Jira or Confluence cannot be reached, produce import-ready drafts and say so.

## Channels

- **Confluence** — source of product requirements, decisions, context, attachments, page comments, and source links.
- **Jira** — destination for approved stories and the follow-on tasks.
- **Other channels** — pull in only when they add evidence the current phase needs: Figma (design states and visual acceptance), Slack / email / meeting notes / support tickets (stakeholder evidence), GitHub / code / ADRs / docs (feasibility and current behavior), analytics or customer data (prioritization).

## Required Context

Before decomposing anything:

- Read the Confluence page, its child pages, inline comments, decision tables, diagrams, and attachments when available.
- Capture source references at the section or requirement level so every story can be traced back.
- Read Jira project conventions when available: issue types, statuses, components, labels, fix versions, epics, custom fields, and Definition of Ready / Definition of Done.
- Read project docs such as `AGENTS.md`, `README` files, ADRs, design docs, and tracker context when available.
- If Confluence or Jira access is unavailable, ask for the page text or export, or produce import-ready drafts — do not pretend the channel was updated.
- Mark missing product, design, data, compliance, analytics, or dependency details as assumptions or open questions rather than inventing them.

## Workflow

### 1. Intake Confluence requirements
- Identify the product goal, the user or persona, the workflow, the business outcome, constraints, and explicit non-goals.
- Separate confirmed requirements from rationale, ideas, assumptions, and unresolved questions.
- Preserve Confluence page titles, URLs, section headings, requirement IDs, and decision references for source mapping.

### 2. Normalize into story candidates
- Group related requirements into thin vertical slices, each describing a user-visible or operator-visible outcome.
- Apply the slicing logic from **issue-decomposition** — do not split by backend / frontend / QA / docs layers unless the work is genuinely independent.
- Map each candidate to its source requirements and flag any requirement not yet represented.

### 3. Draft the story breakdown
- Write each story using the format from **user-story-authoring** (title, user story, acceptance criteria).
- Add source references, scope, dependencies, risks, assumptions, and open questions per story.
- Classify each story as **AFK** (can move forward without more human input) or **HITL** (Product, Design, Architecture, Compliance, or another owner must decide first).
- If a Jira epic or parent already exists, map stories under it. If not, propose the epic title without creating it unless asked.

### 4. Approval checkpoint
- **Stop here.** Present the story breakdown and explicitly ask the user to approve: story granularity, any missing requirements, dependency order, and the AFK/HITL classification.
- Do not break stories into tasks until approval is explicit. This is the gate between the two phases.

### 5. Break approved stories into tasks
- Only after approval, create implementation tasks for each approved story.
- Apply **issue-decomposition** slicing again at the task level; keep each task tied to a parent story and its acceptance criteria, not to a generic work bucket.
- Tasks may cover engineering, design, QA, analytics, documentation, release, migration, or operational readiness. Each task needs a parent story, an observable done condition, dependencies, and an owner discipline.

### 6. Prepare Jira output
- If Jira/Confluence MCP tooling is available **and** the user approves publishing, create or update issues using the project's Jira conventions.
- If tooling is unavailable, produce import-ready Jira drafts with issue type, summary, description, parent/epic, labels/components, acceptance criteria, dependencies, and open questions.
- Publish stories first, then tasks in dependency order, so task parent links can reference real story IDs.

## AFK vs HITL

Classify every story and surface it at the approval checkpoint:

- **AFK** — requirements are clear enough to draft and decompose without waiting on a human decision.
- **HITL** — a material decision is unresolved (scope ambiguity, conflicting sources, missing design, compliance question, prioritization call). Name the owner and the specific decision needed.

When sources disagree, preserve the conflict and ask which source should win before creating stories or tasks that depend on the answer. Raise one material question at a time and include your recommended answer.

## Source Mapping

Every story and task must trace back to its origin so reviewers can verify coverage:

- Reference the Confluence page title and URL, the section heading, and any requirement ID or decision-table row.
- For each story, list the source requirements it satisfies.
- Maintain a "requirements not yet covered" list until every confirmed requirement maps to at least one story.

## Tooling Note

Jira and Confluence may be reachable via MCP tooling. When it is available and the user approves publishing, write directly. When it is not available — or the user has not approved publishing — produce import-ready Jira drafts (story phase and, after approval, task phase) instead of claiming the tracker was updated.

## Worked Example

**Confluence source** — page *"Saved Payment Methods"* (`/wiki/spaces/PAY/pages/4412`), section *Checkout*:

> R1. Returning customers can save a card during checkout and reuse it next time.
> R2. Saved cards show only the last four digits and the card brand.
> R3. A customer can delete a saved card from their account settings.
> Decision (comment, 2026-06-10): PCI scope stays with the payment provider; we store only the provider token.

**Story drafts (story phase output):**

| Story | User story | Source | AFK/HITL |
|-------|-----------|--------|----------|
| Save a card at checkout | As a returning customer, I can save my card during checkout so I can reuse it next time. AC: card is tokenized via the provider; only the provider token is stored. | R1, Decision 2026-06-10 | AFK |
| Reuse a saved card | As a returning customer, I can select a saved card at checkout, shown as brand + last four digits. AC: full PAN is never displayed. | R1, R2 | AFK |
| Delete a saved card | As a customer, I can delete a saved card from account settings. AC: deleted card no longer appears at checkout. | R3 | HITL — Product to confirm whether deletion needs a confirmation step |

**Requirements not yet covered:** none.

**Approval checkpoint:** "Above are 3 story drafts mapped to R1–R3 and the PCI decision. Please approve the granularity, the dependency order (Save → Reuse → Delete), and the HITL flag on *Delete a saved card* before I break these into Jira tasks. I have not drafted any tasks yet."

## Gotchas

- **Tasks before approval.** The single most common failure. Do not produce tasks — not even "draft" tasks — until the story breakdown is explicitly approved.
- **Horizontal slicing.** Splitting into backend / frontend / QA stories instead of thin vertical slices. Defer to **issue-decomposition**; only split by layer when the work is genuinely independent.
- **Restating decomposition rules.** Do not re-derive slicing logic here — reference **issue-decomposition**. Do not re-derive story/AC format — reference **user-story-authoring**.
- **Silent channel failure.** Claiming Jira was updated when MCP tooling was unavailable. Always say whether you published or produced import-ready drafts.
- **Lost traceability.** Stories with no source mapping, or confirmed requirements left off the "not yet covered" list.
- **Dropped Confluence signal.** Inline comments and decision-table rows often hold the binding decision. Read them, not just the page body.
- **Inventing fields.** Do not guess Jira issue types, components, fix versions, or custom fields. Read the project conventions or mark them as open questions.
- **Publishing tasks before stories.** Task parent links need real story IDs — publish stories first, then tasks in dependency order.
