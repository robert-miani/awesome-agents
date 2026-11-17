# Glossary Management

## Description

Builds and maintains a project glossary, acronym list, and controlled vocabulary. The skill auto-scans a document for acronyms and domain terms, writes consistent glossary entries (term, acronym, definition, source, aliases/avoid), decides whether the glossary should be an embedded section or a standalone Markdown file, and keeps terminology consistent across a set of deliverables. It is industry-neutral: definitions are always grounded in the project's own source material, never invented or pulled from a baked-in dictionary.

## When to Use

- Producing a glossary or acronym list for a document, spec, or project
- Responding to "define these terms" or "explain the jargon in this document"
- Establishing a controlled vocabulary or terminology standard
- Keeping terminology consistent across multiple deliverables (BRDs, user stories, specs)
- Adding a glossary section to any deliverable that contains acronyms or domain terms

## Usage

Activate this skill and provide the document or content to scan, or describe the terms you want defined. Helpful context:

- The source document(s) the terms come from
- The target audience (so definitions are pitched at the right level)
- Whether the glossary should be embedded in a single document or maintained as a standalone master file
- An existing glossary to extend, if one exists

The skill scans for acronyms, domain terms, system names, project-coined terms, and ambiguous words; resolves each definition from the source material; flags any term whose meaning the source does not establish; and produces an alphabetically sorted Markdown glossary in either embedded or standalone form.

## Example

**Input:** "Build a glossary from this spec: *The OMS publishes each confirmed order to the FlowBus. Downstream, the Reconciler performs settlement within the agreed SLA.*"

**Output:** A `## Glossary` section listing OMS, FlowBus, Reconciler, settlement, and SLA — each with a definition derived from the spec, a source reference, and aliases where relevant. The SLA entry carries a `TODO: confirm` marker because the spec mentions an agreed SLA but never states the target, so the gap is surfaced rather than guessed:

```markdown
## Glossary

| Term | Acronym | Definition | Source | Aliases / Avoid |
|---|---|---|---|---|
| FlowBus | — | The internal message bus that carries confirmed orders to downstream services. | Spec excerpt | — |
| Order Management System | OMS | The system that captures and confirms orders. | Spec excerpt | — |
| Settlement | — | The step where a confirmed order is financially reconciled and closed. | Spec excerpt | — |
```

## Requirements

- Source material (a document, spec, transcript, or content) the definitions can be grounded in
- A target location for the glossary — a `CLAUDE.md` path, an existing glossary file, or the default (`docs/glossary.md` or an embedded section)
- Pairs well with `requirements-source-ingestion` (capture terms during ingestion) and `user-story-authoring` (share one controlled vocabulary across deliverables)
