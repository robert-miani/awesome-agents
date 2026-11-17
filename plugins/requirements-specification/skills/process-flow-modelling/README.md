# Process Flow Modelling

## Description

Produces Business Analysis process flow, workflow, and swimlane visualisations. The primary
deliverable is an interactive HTML process flow built from a bundled template
(`assets/process-flow-template.html`): a vertical sequence of phases, clickable nodes typed by who
performs each step (automated, AI, human, decision gate, output), branch labels for routing logic,
a headline stats bar, and a slide-out detail panel for each step. This skill owns the template —
building its JSON config and substituting placeholders — and delegates generic, inline diagrams to
the `common-mermaid-diagram` and `common-plantuml-diagram` skills.

## When to Use

- Producing a standalone, presentable process flow or workflow visualisation for stakeholders
- Modelling an as-is or to-be end-to-end process across multiple systems, teams, and decision points
- Visualising a workflow with mixed automated, AI, human, and integration steps
- Showing routing logic (gates, branches) and per-step detail a reader can click into
- Linking process steps back to backlog items via traceable user story references

For a quick flowchart, swimlane, or sequence diagram embedded in a markdown doc, BRD, or chat
reply, use `common-mermaid-diagram`. For a diagram rendered to SVG beside an ADR or in a repo, use
`common-plantuml-diagram`.

## Usage

Activate this skill and describe the process you want to visualise. Provide as much as you have:

- The process name, scope, and whether it is as-is or to-be
- The stages or swimlanes and the key steps within each
- Which steps are automated, AI-driven, human, decision gates, or outputs
- Routing logic at any decision point (the yes/no outcomes)
- Headline metrics (cycle time, automation rate, volume) for the stats bar
- Related user story or epic IDs to surface in step detail panels

The skill reads the template, builds the JSON config (`stats`, `phases`, `nodes`, `branches`,
`details`), substitutes the `{{TITLE}}`, `{{SUBTITLE}}`, `{{BADGE_TEXT}}`, `{{FOOTER}}`, and
`{{FLOW_CONFIG_JSON}}` placeholders, and saves a ready-to-open `.html` file.

## Example

**Input:** "Create an interactive process flow for our order-fulfilment workflow — capture,
validation gate, pick & pack, dispatch."

**Output:** A standalone `order-fulfilment-flow.html` produced from
`assets/process-flow-template.html`, with:

- A stats bar (e.g. `85% Orders Auto-Approved`, `< 2h Target Cycle Time`)
- An `Order Intake` phase with an `auto` capture node and a `gate` validation node, plus
  `yes → Fulfilment / no → Manual review` branch labels
- A `Fulfilment` phase with a `human` pick & pack node and an `output` dispatch node
- Click-through detail panels per node listing steps, systems, and referenced user stories

## Requirements

- The bundled template `assets/process-flow-template.html` (do not edit it in place — copy it)
- A web browser to open the generated `.html` file; a network connection improves typography but
  is not required for rendering
- Enough process context to identify phases, node types, decision gates, and headline metrics
- Optional: `common-mermaid-diagram` or `common-plantuml-diagram` for inline secondary diagrams,
  and `user-story-authoring` for traceable story references in node detail panels
