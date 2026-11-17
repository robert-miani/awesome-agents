---
name: frontend-ticket-writing
description: >
  Writes implementation-ready frontend development tickets that treat accessibility as functional
  scope rather than final polish. Use when drafting, refining, splitting, or reviewing a frontend
  ticket, UI ticket, or component/screen ticket for Jira, Linear, GitHub, or any backlog —
  including design-system, app, web, dashboard, responsive, interaction, or frontend integration
  work — and especially when keyboard, focus, semantics, accessible names, screen reader
  announcements, color contrast, forms, motion, or WCAG acceptance criteria need to be concrete and
  testable. Triggers include "frontend ticket", "UI ticket", "write a ticket for this
  component/screen", "accessibility acceptance criteria", and "WCAG".
metadata:
  author: awesome-agents
  version: "0.1"
---

# Frontend Ticket Writing

## Overview

Write a frontend development ticket that an engineer can implement and QA can verify without
losing product intent. Treat accessibility as part of the functional scope, not as a final polish
task. Use this skill when the task is to create, sharpen, split, review, or rewrite a frontend
ticket.

A good ticket has one primary user-facing outcome, explicit scope boundaries, behaviour defined per
state, and accessibility written as testable acceptance criteria. It is not a design brief, a
horizontal "build the UI" task, or a generic "make it accessible" note.

This skill builds on the story and acceptance-criteria format from **user-story-authoring**. For
breaking a larger plan into multiple thin, vertical-slice tickets, use **issue-decomposition** first
and write each resulting ticket with this skill.

## Required Context

Before drafting:

- Read available project context: `AGENTS.md`, README files, product specs, design docs, component
  docs, architecture notes, or tracker issue context.
- If a glossary or context map exists, use the relevant terms and challenge ambiguous ones before
  finalizing.
- Use the project's existing terminology, framework, routing model, design system, and release
  workflow. Stay framework-agnostic unless the repo settles on one.
- If the work touches shared UI or design-system components, inspect the relevant component
  guidelines, token docs, or implementation examples.
- If the user provides a design, screenshot, PRD, meeting note, user quote, tracker issue, or
  research artifact, preserve its language and cite it in the ticket context.
- If product behaviour is unclear and local docs or code can answer it, search first. Do not invent
  workflow details.
- Mark unknowns as open questions or assumptions instead of silently filling gaps.

## Workflow

1. **Frame the work**
   - Identify the user-facing outcome, affected product surface, persona, and workflow step.
   - Classify the ticket: component, page/screen, interaction, data state, bug fix, design-system
     work, or integration work.
   - State the product decision or user need the ticket supports.
   - If starting from a PRD or plan, map the relevant user stories to this ticket.

2. **Constrain implementation scope**
   - Name the surfaces, states, breakpoints, data dependencies, feature flags, analytics, and
     downstream teams involved.
   - Separate in-scope work from follow-ups.
   - Prefer a ticket that can be implemented and verified independently.
   - For multi-ticket work, use **issue-decomposition** to draft a numbered, vertical-slice
     breakdown (title, AFK/HITL type, blockers, user stories covered) and confirm granularity with
     the user before finalizing.

3. **Specify frontend behaviour by state**
   - Describe the relevant states: default, loading, empty, error, disabled/unavailable,
     success/confirmation, permission, and responsive.
   - Include copy, formatting, sorting, filtering, navigation, persistence, telemetry, and API
     expectations only when they affect the frontend.
   - Name local design-system components, tokens, patterns, routes, or existing implementation
     examples when known.
   - Avoid brittle file-path instructions unless a path is needed to identify an existing component,
     route, or pattern.

4. **Make accessibility testable**
   - Add accessibility requirements as acceptance criteria, not generic notes.
   - Cover the checks relevant to the work: keyboard access, visible focus, semantic structure,
     accessible names, screen reader announcements, color contrast, non-color cues, zoom/reflow,
     reduced motion, target size, form labeling, validation, and error recovery.
   - Default to **WCAG 2.2 AA** unless the repo or organization specifies a different target.
   - See `references/ticket-template.md` for the full accessibility checklist and good/bad criteria
     examples. Apply only the checks relevant to the ticket — do not dump the whole list in.

5. **Write verification steps**
   - Include manual QA steps for desktop and mobile widths.
   - Include keyboard-only and screen-reader smoke checks when the interaction changes.
   - Include automated tests where realistic: unit/component tests, Storybook interaction tests, axe
     checks, Playwright/Cypress flows, visual regression, or analytics assertions.

6. **Route unresolved risk**
   - Call out design, product, API, data, permissions, localization, analytics, and
     accessibility-owner questions as specific open questions.
   - If accessibility impact is uncertain, ask a concrete question such as "Should this behave as a
     tablist, menu button, disclosure, or simple link list?"
   - Mark the ticket AFK-ready when its decision surface is settled; mark it HITL when design,
     product, accessibility, or architecture decisions are still required, and name the blocker.

## Ticket Structure

Use the template in `references/ticket-template.md` unless the user or tracker requires a different
format. Every finished ticket should include:

- concise title naming the user-visible change
- context and user need (with source evidence)
- scope and non-goals
- frontend behaviour by state
- accessibility requirements
- acceptance criteria (covering core states and at least one accessibility path)
- QA / test plan
- dependencies
- AFK/HITL classification and blockers, when part of a multi-ticket breakdown
- open questions

Adapt the template to the project's tracker format and release process. Keep the accessibility
criteria explicit even when the tracker uses a compact issue format.

## Verification

Before returning a ticket, confirm it lets a frontend engineer answer:

- What user-visible behaviour changes?
- Which surfaces and states are in scope?
- What accessibility behaviour must be true, and how is it proven?
- How should QA prove the work is done?
- What is explicitly out of scope?

Each accessibility acceptance criterion must be observable and testable — phrased so QA can pass or
fail it without judgement calls.

## Gotchas

- **"Make it accessible" with no testable criteria.** Replace vague lines ("make it accessible",
  "screen readers should work", "use proper ARIA", "pass accessibility") with observable criteria
  tied to a state, control, or announcement.
- **Accessibility as a final-polish task.** Keyboard, focus, semantics, and announcements are part
  of the functional scope. If they are inseparable from the interaction, keep them in the same
  ticket rather than deferring to a follow-up.
- **Horizontal tickets.** Avoid tickets that only say "build the UI", "build the API", or "write
  tests" unless the work is explicitly a shared component, research spike, or foundation task.
- **Dumping the whole checklist.** Apply only the accessibility checks relevant to the ticket.
- **ARIA before native.** Prefer native elements; reach for ARIA only when no native element fits.
- **Silently filling gaps.** Unresolved design/product/API/a11y questions become open questions or
  HITL blockers, not invented behaviour.
