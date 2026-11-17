---
name: glossary-management
description: Build and maintain a project glossary, acronym list, and controlled vocabulary by auto-scanning documents for acronyms and domain terms, then producing consistent Markdown glossary entries. Use when the user wants a glossary, an acronym list, asks to "define these terms", needs a controlled vocabulary or terminology standard, or wants terminology kept consistent across deliverables (BRDs, user stories, specs). Industry-neutral — works for any domain.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Glossary Management

## Overview

Build and maintain a project glossary so that every reader — business sponsor, engineer, tester, compliance reviewer — reads the same term the same way. A glossary removes ambiguity from acronyms, domain jargon, system names, and project-coined terms.

Use this skill to scan a document for terms that need defining, write glossary entries in a consistent format, decide where the glossary lives, and keep terminology consistent across a set of deliverables.

This skill is industry-neutral. It teaches *how* to build and maintain a glossary for any domain — it does not ship a domain dictionary. Definitions always come from the project's own source material, never invented.

## When to use this skill

- The user asks for a glossary, acronym list, or "list of terms".
- The user says "define these terms" or "explain the jargon in this document".
- The user wants a controlled vocabulary or terminology standard for a project.
- The user wants terminology kept consistent across multiple deliverables.
- Any other deliverable (BRD, user stories, spec, impact assessment) contains acronyms or domain terms a non-specialist reader would not know.

## Auto-scan workflow

When given a document or content, scan it for glossary candidates before writing anything.

### Step 1 — Identify candidates

Scan the text for:

- **Acronyms / initialisms** — any uppercase sequence of 2+ letters (`SLA`, `API`, `KYC`). Catch lowercase-internal forms too (`gRPC`, `OAuth`).
- **Domain terms** — words a non-specialist reader in this project would not know, or that carry a specialised meaning here.
- **System / product names** — internal services, tools, platforms, environments.
- **Project-coined terms** — programme names, workstream names, custom labels invented for this effort.
- **Ambiguous terms** — ordinary words used with a narrow project-specific meaning (e.g. "account", "order", "case") where the everyday reading would mislead.

### Step 2 — Resolve each definition from source

Definitions must be grounded in the project's own material — never invented.

1. If the term is already defined in a master glossary for this project, reuse that definition verbatim.
2. Otherwise, derive the definition from how the document uses the term (surrounding sentences, headings, examples).
3. If the source does not make the meaning clear, do **not** guess. Add the entry with a `TODO: confirm definition` marker and surface it as an open question.

When a term is used with a meaning that differs from an existing master-glossary definition, keep the standard definition and note the project-specific usage alongside it — do not silently overwrite.

### Step 3 — Write the glossary

Produce entries using the structure below, sorted alphabetically by term. Place it as an embedded section or a standalone file per the rules in "Where the glossary lives".

### Step 4 — Maintain across deliverables

When producing more than one document for the same project, keep a single master glossary and reference it from each deliverable. Add new terms as they emerge. Flag any term that is used inconsistently across documents so it can be reconciled.

## Glossary entry structure

Each entry has these fields:

| Field | Required | Purpose |
|---|---|---|
| **Term** | yes | The canonical form — the one spelling/casing everyone should use. |
| **Acronym** | when one exists | The short form. Use `—` when there is none. |
| **Definition** | yes | One or two plain sentences for the target audience. No circular definitions. |
| **Source** | yes | Where the definition came from: document name + section, ticket ID, stakeholder, or `project convention`. |
| **Aliases** | when they exist | Other spellings or names seen in source material that map to this term. |
| **Avoid** | when relevant | Deprecated or confusable terms that should **not** be used, with a pointer to the preferred term. |

### Default table format

```markdown
| Term | Acronym | Definition | Source | Aliases / Avoid |
|---|---|---|---|---|
| Service Level Agreement | SLA | A documented commitment to a measurable level of service, such as uptime or response time. | Ops handbook §2 | — |
| Settlement | — | The step where a confirmed order is financially reconciled and closed. | BRD-014 | Avoid: "clearing" (means a different step here) |
```

For glossaries with rich entries (multi-sentence definitions, several aliases), a definition-list form is also acceptable:

```markdown
### Settlement
**Definition:** The step where a confirmed order is financially reconciled and closed.
**Source:** BRD-014
**Aliases:** none
**Avoid:** "clearing" — refers to a different step in this project.
```

Pick one format per glossary and use it consistently.

## Where the glossary lives

Choose based on scope:

- **Embedded section** — for a single self-contained deliverable, append a `## Glossary` section at the end of that document. Best when the term set is small and specific to that one document.
- **Standalone Markdown file** — for a project with multiple deliverables, maintain one master file (default `glossary.md`, or alongside the deliverables, e.g. `docs/glossary.md`). Each deliverable links to it rather than repeating definitions.

Resolve the target location in this order:

1. A path specified in the project's `CLAUDE.md` or by the user.
2. An existing glossary file already in the repo — extend it, do not create a parallel one.
3. Otherwise: embedded section for a one-off document; `docs/glossary.md` (or repo-root `glossary.md` if there is no `docs/`) for a multi-deliverable project.

When the project graduates from one document to several, promote the embedded section into a standalone file and replace the in-document copies with a link.

## Consistency rules

- **One canonical term per concept.** Pick the preferred spelling/casing and record every variant under **Aliases** so the mapping is explicit.
- **Define on first use, then stay consistent.** Within a deliverable, expand an acronym on first use (`Service Level Agreement (SLA)`) and use the short form thereafter.
- **Same term = same meaning everywhere.** If a term means two things in two documents, that is a defect — flag it and reconcile, do not create two conflicting entries.
- **No circular or self-referential definitions.** Do not define a term using the term itself or another undefined term.
- **Sort alphabetically** by term for easy lookup.
- **Cross-link related terms** where it aids understanding.
- **Audience-appropriate wording.** Write definitions for the least-specialist reader who will use the document.

## Worked example

**Input — a short spec excerpt:**

> The OMS publishes each confirmed order to the FlowBus. Downstream, the Reconciler performs settlement within the agreed SLA. Orders that fail validation are routed to the manual review queue (sometimes called the "exceptions desk").

**Step 1 — candidates:** OMS, FlowBus, Reconciler, settlement, SLA, manual review queue / exceptions desk.

**Step 2 — resolve from source:** "OMS" and "SLA" are standard acronyms; expand them. "FlowBus" and "Reconciler" are project system names — define from context. "settlement" has a project-specific meaning — define from the surrounding sentence. "exceptions desk" is an alias for "manual review queue".

**Step 3 — output glossary:**

```markdown
## Glossary

| Term | Acronym | Definition | Source | Aliases / Avoid |
|---|---|---|---|---|
| FlowBus | — | The internal message bus that carries confirmed orders to downstream services. | Spec excerpt | — |
| Manual review queue | — | The queue holding orders that failed validation, pending human review. | Spec excerpt | Aliases: "exceptions desk" |
| Order Management System | OMS | The system that captures and confirms orders. | Spec excerpt | — |
| Reconciler | — | The downstream service that performs settlement on confirmed orders. | Spec excerpt | — |
| Service Level Agreement | SLA | A documented commitment to a measurable level of service, such as time-to-settle. | Spec excerpt; TODO: confirm exact target | — |
| Settlement | — | The step where a confirmed order is financially reconciled and closed. | Spec excerpt | — |
```

Note the `TODO: confirm` on the SLA entry — the excerpt mentions an "agreed SLA" but never states the target, so the definition is left honest and the gap is surfaced rather than invented.

## Pairs with

- **requirements-source-ingestion** — when building a glossary from uploaded specs, transcripts, or wiki pages, capture terms during ingestion and carry their source references straight into the glossary.
- **user-story-authoring** — share the same controlled vocabulary so stories, acceptance criteria, and the glossary use identical terms.
- Any deliverable-producing skill — the glossary supports them all by keeping terminology consistent.

## Gotchas

- **Never invent a definition.** If the source does not establish the meaning, add a `TODO: confirm definition` entry and raise it as an open question. A wrong definition is worse than a missing one.
- **Casing-only "acronyms".** Not every uppercase token is an acronym (`OK`, `ID`, `URL` may be common knowledge for the audience). Judge by the reader, not by the regex.
- **Aliases are not synonyms to keep.** Recording an alias documents that the variant *exists in source*; it does not bless its continued use. Point readers to the canonical term.
- **Conflicting meanings across documents** are a finding, not two entries. Surface the conflict for reconciliation.
- **Stale master glossary.** When a term's meaning changes, update the master file and note the change — do not leave deliverables pointing at an outdated definition.
- **Over-scanning.** A glossary of fifty trivially obvious terms buries the few that matter. Include only terms a target-audience reader would genuinely need.
- **Output is Markdown by default.** Produce an embedded `## Glossary` section or a standalone `.md` file — not a spreadsheet, unless the user explicitly asks for one.
