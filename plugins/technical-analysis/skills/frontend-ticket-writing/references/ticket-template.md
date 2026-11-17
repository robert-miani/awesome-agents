# Frontend Ticket Reference

Use this reference when drafting or reviewing the final ticket.

## Ticket Template

```md
# {Type}: {clear user-facing change}

## Context

- Product surface:
- Source evidence:
- User / persona:
- User need or problem:
- Business or product outcome:

## Scope

In scope:

-

Out of scope:

-

## Frontend Requirements

- Default state:
- Loading state:
- Empty state:
- Error state:
- Disabled / unavailable state:
- Success / confirmation state:
- Permission state:
- Responsive behavior:
- Copy / content:
- Analytics or instrumentation:

## Accessibility Requirements

- Semantic structure:
- Keyboard interaction:
- Focus management:
- Accessible names and descriptions:
- Screen reader announcements:
- Color, contrast, and non-color cues:
- Motion and animation:
- Forms and validation:
- Zoom, reflow, and responsive behavior:
- Touch target sizing:

## Acceptance Criteria

- [ ] Given {context}, when {action}, then {observable frontend result}.
- [ ] Given keyboard-only navigation, when the user reaches {control}, then focus order is logical and the visible focus indicator is clear.
- [ ] Given a screen reader user, when {state changes}, then {name/role/state/announcement} communicates the change.
- [ ] Given color-blind or low-vision use, then the UI does not rely on color alone and meets contrast expectations.
- [ ] Given 320px, 768px, and 1280px widths, then the layout remains usable without clipped or overlapping content.

## QA / Verification

- Manual:
- Keyboard-only:
- Screen reader smoke check:
- Automated tests:
- Visual regression:
- Browser / device coverage:

## Dependencies

- Design:
- API / data:
- Product / legal / compliance:
- Analytics:
- Feature flag / release:

## Open Questions

-
```

## Accessibility Checklist

Apply only the checks relevant to the ticket. Do not dump this whole list into every ticket.
Default target is WCAG 2.2 AA unless the project specifies otherwise.

### Structure and Semantics

- Use native elements before ARIA.
- Headings follow a logical hierarchy.
- Interactive elements expose correct role, name, value, and state.
- Landmark regions are appropriate for page-level work.
- Tables use headers and captions when the data needs them.

### Keyboard and Focus

- All interactive controls are reachable and operable by keyboard.
- Tab order follows the visual and task order.
- Focus is visible and not hidden behind sticky headers, modals, or overlays.
- Dialogs, drawers, menus, comboboxes, tooltips, and popovers define open, close, escape,
  outside-click, and focus-return behavior.
- Disabled controls are either skipped or announced consistently with the design-system pattern.

### Screen Reader Behavior

- Controls have accessible names that match visible labels where possible.
- Dynamic status changes use appropriate live-region behavior.
- Validation errors are announced and associated with the failing input.
- Loading and empty states are communicated without trapping the user.
- Icon-only controls have non-visual labels.

### Visual Accessibility

- Text and meaningful UI affordances meet WCAG AA contrast expectations.
- Color is not the only indicator of status, error, selection, or priority.
- Hover-only content is also available by focus or click.
- Content remains usable at browser zoom and narrow widths.
- Text can wrap without overlap, clipping, or loss of meaning.

### Motion and Timing

- Motion respects reduced-motion preferences.
- Timeouts, autosaves, and async updates provide clear feedback.
- Animated transitions do not carry the only meaning of a state change.

### Target Size

- Pointer targets meet the minimum target-size expectation (WCAG 2.2 AA: 24×24 CSS px, with spacing
  exceptions), and primary actions remain comfortably tappable on touch.

### Forms

- Every input has a visible or programmatically determinable label.
- Required, optional, help, error, and success text are associated with the field.
- Error messages explain how to recover.
- Date, currency, search, filter, and multi-select patterns specify parsing and validation behavior.

## Acceptance Criteria Patterns

Use observable, testable criteria:

- "The filter drawer traps focus while open and returns focus to the triggering button when closed."
- "Each icon-only action has an accessible name that matches the tooltip label."
- "The selected row is indicated by text, icon, or shape in addition to color."
- "When results refresh, screen readers receive a concise status update with the result count."
- "At 320px width, primary actions remain reachable without horizontal scrolling."

Avoid vague criteria:

- "Make it accessible."
- "Screen readers should work."
- "Use proper ARIA."
- "Mobile should look good."
- "Pass accessibility."

## Ticket Splitting Guidance

Split the ticket when:

- Shared component work and page integration can ship independently.
- Accessibility remediation covers unrelated patterns.
- API / data changes block frontend implementation.
- The design has unresolved interaction rules.
- QA needs separate regression surfaces.

Keep the ticket together when:

- Accessibility behavior is inseparable from the component interaction.
- A state change needs visual, semantic, and analytics updates in the same component.
- Splitting would create duplicate QA work with no delivery benefit.

For systematic multi-ticket breakdown, use the **issue-decomposition** skill.

## Review Rubric

Before finalizing, verify:

- The title names the user-visible change.
- The ticket has one primary outcome.
- Scope boundaries are explicit.
- Accessibility requirements are written as implementation and QA criteria.
- Acceptance criteria cover core states and at least one accessibility path.
- Open questions are specific enough for Product, Design, Engineering, or QA to answer.
