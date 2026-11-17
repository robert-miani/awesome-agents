---
name: common-adr-authoring
description: Draft or refine Architecture Decision Records (ADRs) using a decision-focused structure, repository ADR numbering, and docs/adrs folder conventions. Use when the user wants to write, improve, review, or organize ADRs for architecture, infrastructure, data, deployment, integrations, security, provisioning, authorization, or other technical decisions.
---

# Common ADR Authoring

## Overview

Write ADRs that are decision-focused, grounded in the constraints of the current project, and consistent with nearby ADRs in the repository. Use this skill when the task is to draft, revise, review, or organize an ADR.

The ADR must capture one decision and its reasoning. Do not turn it into a system description, an implementation spec, or a combined design for multiple independent concerns.

## File Placement

### Default location

Resolve the target directory in this order:

1. Path specified in the project's `CLAUDE.md` — always check first
2. `/docs/adrs/` — if it exists in the current repo
3. `/docs/adr/` — if that singular convention already exists in the current repo
4. `/docs/adrs/` — create it if inside a git repo (`git rev-parse --show-toplevel` succeeds)
5. `.claude/drafts/` — fallback when not in a git repo and no CLAUDE.md override

When writing to `.claude/drafts/`, use the same `{number}_{slug}/` folder convention and remind the user to move it to the right place once a repo is established.

### Folder-per-ADR convention

Each ADR is a folder, not a bare file. The folder contains the markdown document and any associated diagram files:

```
docs/
  adrs/
    001_domain_event_publishing/
      001_domain_event_publishing.md
      event-flow.puml
      event-flow.svg
```

### Naming

- Folders and files use the same zero-padded three-digit prefix: `001_`, `002_`, etc.
- The slug is lowercase snake_case derived from the ADR topic.
- To find the next number, use the agent's file-search or glob tool with a pattern such as `docs/adrs/[0-9]*`, inspect the matching directories, and increment the highest numeric prefix.

### Diagram files

PlantUML source (`.puml`) and rendered output (`.svg`) live in the same folder as the ADR markdown file. Follow the **common-plantuml-diagram** skill's conventions for rendering and file naming.

## Workflow

1. Gather the minimum context needed:
   - the decision topic
   - affected services or actors
   - current constraint or failure mode
   - issue tracker ticket(s)
   - related ADRs
2. If the user provided an example ADR file, read it first and mirror its structure and tone.
3. If no example ADR was supplied, prefer the nearest existing ADR in the repo, especially under `docs/adrs/`, when relevant.
4. Separate the concern before drafting. If the request mixes decisions with different drivers, stakeholders, or change cadences, split them into separate ADRs and say so.
5. Identify the problem shape in one sentence before drafting. Examples include dependency, ownership, lifecycle, interoperability, auditability, and scaling problems.
6. Draft the ADR using the exact section order from the template.
7. Check the draft against the rules in this skill before returning it.

## Required Structure

Use this exact structure and headings:

- `# <Topic> Design`
- `## Status`
- `## Context`
- `## Problem`
- `## Options Considered`
- `### Option 1 — ...`
- `**Pros**`
- `**Cons**`
- `## Decision`
- `## Consequences`
- `### Positive`
- `### Negative`
- `## ❓ Open Questions`
- `## ⚙️ Implementation Notes` (optional)
- `## Related`

Do not reorder, omit, or rename sections unless the user explicitly asks for a different format.

## Section Rules

### Context

Write short paragraphs describing where the decision fits.

Include:
- relevant services, components, external providers, or other system actors
- current architectural baseline
- issue tracker ticket(s)
- related ADRs

Do not include the decision here.

### Problem

Write this as a narrative, not as a checklist.

Use the pattern:
`System X needs to do Y, but cannot because of Z. This creates a <type> problem.`

Typical types:
- bootstrap problem
- trust boundary problem
- lifecycle problem
- auditability problem
- scaling problem

Do not introduce the chosen solution here. Do not write requirement bullets such as "any solution must" unless the user explicitly asks for them outside the ADR.

### Options Considered

Every option must be realistic and structurally consistent.

Prefer a set like this when applicable:
- current manual or admin-driven approach
- minimal change to the current approach
- familiar standard pattern and how it fits the actual constraints
- purpose-built design aligned with the project's drivers

For each option:
- add a short description
- list `**Pros**` as bullets
- list `**Cons**` as bullets

If an option already exists in another ADR, state:
`This option is already architected elsewhere and included here for completeness.`

Do not argue for the winning option in this section.

### Decision

State the chosen option directly.

Describe how it works at a high level. If a simple step flow improves clarity, include it as a short numbered list.

If the design resembles a standard pattern but is intentionally narrower or different, state the distinction explicitly.

Do not repeat pros and cons here.

### Consequences

Split strictly into:
- `### Positive`
- `### Negative`

Positive covers what improves and what risk is avoided.
Negative covers added complexity, follow-on work, operational constraints, or residual cost.

Keep each item concrete.

### Open Questions

Include unresolved design, UX, rollout, or extension questions.

Do not invent fake open questions when the design is already settled.

Use the heading `## ❓ Open Questions` so this section is visually easy to spot in longer ADRs.

### Implementation Notes

Keep this section brief and technical.

Good content:
- important invariants
- operational constraints
- validation or compatibility rules
- ownership boundaries
- migration or rollout considerations

Do not turn this into an API contract or low-level implementation guide.

Use the heading `## ⚙️ Implementation Notes` so implementation-specific details are easy to scan without competing with the main decision sections.

### Related

Include where available:
- issue tracker ticket(s)
- related ADR(s)

## Writing Style

- Use short paragraphs.
- Keep tone technical and direct.
- Use bullets for pros and cons.
- Avoid excessive bullets in Context and Problem.
- Avoid unnecessary implementation detail.
- Avoid padding or generic architecture language.

## Common Failure Modes

Correct these before returning a draft:

- The Problem section is a disguised requirement checklist.
- The ADR mixes multiple concerns that should evolve independently.
- The Options section contains strawmen or biased framing.
- The Decision section re-argues the options.
- The ADR proposes a standard by default without a real architectural need.
- The draft ignores relevant ownership boundaries, dependencies, or operational failure modes.
- The Related section omits relevant issue tracker or ADR references.

## Response Pattern

When drafting from sparse input:
1. State any missing facts that materially affect the ADR.
2. Make the minimum reasonable assumptions.
3. Return the ADR in full.
4. End with a short list of assumptions or open inputs only if needed.

When reviewing an existing ADR:
1. Lead with findings.
2. Point out structural issues first, then architectural issues, then wording issues.
3. Suggest concrete rewrites tied to sections.
