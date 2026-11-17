# Common ADR Authoring

## Description

Drafts, revises, reviews, and organizes Architecture Decision Records (ADRs) using a decision-focused structure. The skill helps keep ADRs scoped to one architectural decision, placed in the repository's ADR directory, and written with consistent numbering, naming, section order, and tone.

## When to Use

- Writing a new ADR for architecture, infrastructure, data, deployment, integrations, security, provisioning, authorization, or other technical decisions
- Refining an existing ADR so it focuses on the decision and its reasoning
- Reviewing an ADR for structure, scope, options, consequences, and missing context
- Organizing ADR files under the repository's ADR folder convention
- Adding ADR-related PlantUML diagrams alongside the ADR document

## Usage

Activate this skill and describe the decision you want to capture. Provide as much relevant context as you have:

- The decision topic and affected systems or services
- The current constraint, failure mode, or architectural pressure
- Options already considered
- The preferred or chosen decision, if known
- Related issue tracker tickets or existing ADRs
- Any repository-specific ADR template or example to mirror

The skill will resolve the target ADR location, choose the next numbered folder and file name when creating a new ADR, and draft or review the document using the required ADR section order.

## Example

**Input:** "Create an ADR for how an application should publish domain events to external consumers"

**Output:** A new ADR folder and markdown file such as:

```text
docs/adrs/001_domain_event_publishing/
  001_domain_event_publishing.md
```

The ADR includes sections for status, context, problem, options considered, decision, consequences, open questions, optional implementation notes, and related references.

If a diagram is useful, PlantUML files are placed next to the ADR:

```text
docs/adrs/001_domain_event_publishing/
  001_domain_event_publishing.md
  event-flow.puml
  event-flow.svg
```

## Requirements

- A repository with an ADR location, preferably configured in `CLAUDE.md` or under `docs/adrs/`
- Existing ADRs or an example ADR when the new document should match local style
- Enough decision context to identify the problem, realistic options, and consequences
- Optional: the `common-plantuml-diagram` skill plus PlantUML or Docker when ADR diagrams should be rendered as SVG files
