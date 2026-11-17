# Frontend Ticket Writing

## Description

Drafts, sharpens, splits, and reviews implementation-ready frontend development tickets that treat
accessibility as functional scope rather than final polish. The skill frames the user-facing
outcome, constrains scope, specifies behaviour per state (default, loading, empty, error, disabled,
success, permission, responsive), and turns accessibility into testable acceptance criteria
defaulting to WCAG 2.2 AA. It also adds verification/QA steps, routes unresolved design/API/a11y
questions, and classifies tickets as AFK-ready or HITL.

## When to Use

- Writing a new frontend, UI, or component/screen ticket for Jira, Linear, GitHub, or any backlog
- Adding concrete accessibility acceptance criteria (keyboard, focus, semantics, names, screen
  reader announcements, contrast, non-color cues, zoom/reflow, reduced motion, target size, forms)
- Refining a vague ticket ("make it accessible", "match the design", "handle mobile") into testable
  criteria
- Reviewing a ticket for scope, state coverage, accessibility, and QA completeness
- Specifying frontend behaviour by state for design-system, app, web, dashboard, or integration work

## Usage

Activate this skill and describe the frontend work. Provide as much relevant context as you have:

- The product surface, persona, and user need
- Any design, screenshot, PRD, tracker issue, or research artifact to preserve and cite
- The design system, framework, routing model, and release workflow in use
- The states that matter (loading, empty, error, permission, responsive, etc.)
- The target accessibility level if it differs from WCAG 2.2 AA

The skill frames the work, constrains scope, specifies behaviour per state, writes accessibility as
acceptance criteria, adds a QA plan, and surfaces open questions. It builds on the story and
acceptance-criteria format from **user-story-authoring**; for breaking a larger plan into multiple
vertical-slice tickets, run **issue-decomposition** first and write each ticket with this skill.

The full ticket template, accessibility checklist, and good/bad criteria examples live in
`references/ticket-template.md`.

## Example

**Input:** "Write a ticket for adding a status filter dropdown to the orders table, with
accessibility acceptance criteria."

**Output:** A ticket such as:

```md
# Interaction: Filter the orders table by status

## Context

- Product surface: Orders dashboard, table toolbar
- Source evidence: Design "orders-filter-v2", PM note 2026-06-10
- User / persona: Operations agent triaging open orders
- User need: Narrow a long order list to one status without scanning manually
- Outcome: Faster triage; fewer mis-handled orders

## Scope

In scope:
- Status filter control in the table toolbar (single select)
- Filtered, loading, empty-result, and error states for the table
Out of scope:
- Multi-select filtering; saved filter presets (follow-up)

## Frontend Requirements

- Default: filter shows "All statuses"; table unfiltered
- Loading: table shows skeleton rows while results refresh
- Empty: "No orders match this status" with a clear-filter action
- Error: inline retry message; filter control stays usable
- Responsive: at 320px the filter collapses into the toolbar without clipping

## Accessibility Requirements (WCAG 2.2 AA)

- Native <select> or design-system combobox with correct role, name, and state
- Filter has an accessible name "Filter by status"
- Result count change announced via a polite live region
- Selected status indicated by text, not color alone
- Focus returns to the filter control after the table refreshes

## Acceptance Criteria

- [ ] Given a status is chosen, when results refresh, then only matching orders show.
- [ ] Given keyboard-only use, when the user tabs to the filter, then it is reachable, operable, and shows a clear visible focus indicator.
- [ ] Given a screen reader user, when results refresh, then a polite announcement states the new result count.
- [ ] Given no matching orders, then the empty state and a clear-filter action are shown and announced.
- [ ] Given 320px width, then the filter and table remain usable without horizontal scrolling.

## QA / Verification

- Manual: desktop + mobile widths, each status value
- Keyboard-only: open, select, clear filter without a mouse
- Screen reader smoke check: NVDA/VoiceOver announce name and result count
- Automated: component test for filtering logic; axe check on the table view

## Dependencies

- API: orders endpoint must accept a status query param
- Design: confirm empty-state copy

## Open Questions

- Should the chosen filter persist across navigation or reset on reload?
```

## Requirements

- Access to project context (AGENTS.md, README, product/design docs, component or token docs, tracker
  issues) to ground the ticket in real terminology and patterns
- A target accessibility level (defaults to WCAG 2.2 AA when unspecified)
- Optional: **user-story-authoring** for the underlying story/acceptance-criteria format, and
  **issue-decomposition** for multi-ticket vertical-slice breakdown
