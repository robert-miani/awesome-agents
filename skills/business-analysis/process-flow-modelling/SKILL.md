---
name: process-flow-modelling
description: >
  Produce Business Analysis process flow and workflow visualisations, with an interactive HTML
  process-flow template as the primary deliverable. Use when the user asks for a process flow,
  workflow diagram, swimlane, BPMN, as-is/to-be process, end-to-end flow, or wants to visualise
  how a process moves across automated, AI, human, decision, and output steps. This skill owns the
  interactive HTML template (building its JSON config and substituting placeholders) and delegates
  generic inline diagrams to common-mermaid-diagram and common-plantuml-diagram.
metadata:
  author: awesome-agents
  version: "0.1"
---

# Process Flow Modelling

## Overview

Produce process flow, workflow, and swimlane visualisations for Business Analysis work. The
**primary, standout deliverable** is an interactive HTML process flow built from the template at
`assets/process-flow-template.html`. It renders a vertical sequence of phases, clickable nodes
typed by who performs the step, decision gates with branch labels, a stats bar, and a slide-out
detail panel — usable directly in stakeholder reviews, presentations, and documentation.

This skill **owns** the interactive HTML template. For generic, inline, or markdown-embeddable
diagrams it **delegates** to other skills — it does not restate how to write those notations.

## When to use the interactive HTML vs delegate

| You need | Use | Skill |
|---|---|---|
| A standalone, presentable process flow with clickable step detail | Interactive HTML | **this skill** (`assets/process-flow-template.html`) |
| An as-is / to-be end-to-end workflow a stakeholder reads top-to-bottom | Interactive HTML | **this skill** |
| A quick flowchart, swimlane, or sequence diagram embedded in a markdown doc, BRD, or chat reply | Mermaid | **common-mermaid-diagram** |
| A diagram living beside an ADR or rendered to SVG for a repo | PlantUML | **common-plantuml-diagram** |

Default to the interactive HTML when the user asks for a process flow or workflow visualisation as
a deliverable. Reach for Mermaid or PlantUML only for lightweight inline diagrams, and invoke those
skills by name rather than hand-writing the notation here.

## Generation workflow

1. **Read the template** at `assets/process-flow-template.html`.
2. **Build the JSON config** object matching the structure below — `stats`, `phases` (with
   `nodes` and optional `branches`), and `details`.
3. **Substitute the placeholders** by copying the template to a new file and replacing:
   - `{{TITLE}}` — the process name (e.g. `Order Fulfilment`)
   - `{{SUBTITLE}}` — one-line description of scope and purpose
   - `{{BADGE_TEXT}}` — short uppercase label (e.g. `AS-IS PROCESS` or `TO-BE FLOW`)
   - `{{FOOTER}}` — attribution / version line
   - `{{FLOW_CONFIG_JSON}}` — the entire config object, inlined as valid JSON
4. **Save** the result as a `.html` file (in the user's output directory, or alongside the related
   BA deliverable). Never edit the template in `assets/` — copy it.

## Config structure

The config drives the whole render. Concrete neutral example (an order-fulfilment workflow):

```json
{
  "stats": [
    { "value": "85%", "label": "Orders Auto-Approved" },
    { "value": "< 2h", "label": "Target Cycle Time" },
    { "value": "3", "label": "Systems Integrated" }
  ],
  "phases": [
    {
      "label": "Order Intake",
      "type": "entry",
      "nodes": [
        { "id": "capture", "type": "auto", "icon": "📥", "title": "Capture Order", "sub": "Web + API intake" },
        { "id": "validate", "type": "gate", "icon": "⚖️", "title": "Stock & Credit OK?", "sub": "Validation gate" }
      ],
      "branches": { "yes": "Yes → Fulfilment", "no": "No → Manual review" }
    },
    {
      "label": "Fulfilment",
      "type": "orchestrate",
      "nodes": [
        { "id": "pick", "type": "human", "icon": "📦", "title": "Pick & Pack", "sub": "Warehouse team" },
        { "id": "ship", "type": "output", "icon": "🚚", "title": "Dispatch", "sub": "Carrier handoff" }
      ]
    }
  ],
  "details": {
    "capture": {
      "epic": "Order Intake",
      "epicColor": "var(--accent-blue)",
      "title": "📥 Capture Order",
      "desc": "Receives orders from the web storefront and partner API into a single queue.",
      "sections": [
        { "title": "Steps", "items": ["Normalise payload", "Assign order ID", "Enqueue for validation"] },
        { "title": "Systems", "tags": ["Storefront", "Order API", "Queue"] },
        { "title": "Stories", "items": ["US-101 Web order capture", "US-102 Partner API ingest"] }
      ]
    }
  }
}
```

- `stats` — 3 to 5 headline metrics shown in the top bar.
- `phases[].nodes[].id` must be unique and match a key in `details` for the click-through panel.
- `branches` is optional; add it to any phase whose gate routes conditionally (`yes` / `no`).
- `details` is keyed by node `id`; each panel supports a description plus `sections` that hold
  either bullet `items` or `tags` (rendered as monospace chips).

### Node types

| `type` | Colour | Use for |
|---|---|---|
| `auto` | Green | Automated / deterministic steps (rules engines, system processing) |
| `ai` | Purple | AI / ML / probabilistic steps |
| `human` | Blue | Human-in-the-loop steps (manual review, overrides, approvals) |
| `gate` | Amber | Decision points, quality gates, routing logic |
| `output` | Cyan | Outputs, integrations, external-facing results |

### Phase types (label colour)

Set `phase.type` to one of: `entry`, `input`, `extract`, `map`, `decide`, `orchestrate`,
`output`. Use `default` (or omit) if none fit. The value only tints the phase label.

## Design principles

- Each phase is a logical stage — a workstream, functional area, or swimlane.
- Keep 2–4 nodes per phase: enough to show the key steps without clutter.
- Add a `gate` node and `branches` wherever routing logic exists; show every outcome.
- Stats bar carries 3–5 metrics relevant to the process (cycle time, automation rate, volume).
- The flow must read top-to-bottom as a story a stakeholder follows without narration.
- Detail panels should include: what the step does, its steps/capabilities, the systems involved,
  SLAs where relevant, and **traceable user story references** (see **user-story-authoring**) so a
  reader can link a node back to its backlog item.
- Keep a single flow to roughly 15–20 nodes; break a larger process into sub-process flows.

## Gotchas

- `{{FLOW_CONFIG_JSON}}` is inlined into a `const config = …;` JavaScript assignment. It must be
  **valid JSON** — double-quoted keys, no trailing commas, no comments. A malformed object renders
  a blank page.
- Every node `id` referenced by a click must exist in `details`; a missing key silently opens
  nothing. Keep `id`s unique across the whole flow, not just within a phase.
- Node and detail text is injected as raw HTML. Avoid stray `<` / `>` / `&` in titles and
  descriptions, or escape them, to prevent broken markup.
- The template loads Google Fonts from a CDN; the flow still renders with fallback fonts offline,
  but appearance differs. Do not rely on network access for correctness.
- Never hand-edit `assets/process-flow-template.html` to customise a single output — always copy it
  first, then substitute placeholders in the copy.
- Do not restate Mermaid or PlantUML syntax here. For inline diagrams, delegate to
  **common-mermaid-diagram** or **common-plantuml-diagram**.
