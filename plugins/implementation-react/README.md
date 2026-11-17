# Implementation — React

## Description

Curated bundle of React frontend skills for feature-based Vite applications. Orchestrates load order and workflows for new projects, feature delivery, API/auth work, and testing. Covers the full React + TypeScript + Vite stack: architecture, coding style, TypeScript, configuration, API clients, data fetching, unit testing, scaffolding, and feature delivery.

**Stack:** feature/shared layout, TanStack Router, TanStack Query, axios, Zod, React Hook Form, Vitest, Tailwind/shadcn (optional). Tooling aligns with the **reference React template**.

## When to Use

- Onboarding to the reference React stack
- New project bootstrap plus first features
- End-to-end frontend feature delivery
- Tasks that span architecture, API clients, and tests
- Implementing a single UI feature or page in an existing app
- Setting up or updating project-level React/TypeScript configuration

## Bundled Skills

Load skills in the order below unless the task clearly needs a subset.

| Order | Skill | Invocation | When to load |
|------:|-------|------------|--------------|
| 1 | [react-architecture](skills/react-architecture/SKILL.md) | `/implementation-react:react-architecture` | Always — structure and boundaries |
| 2 | [react-code-style](skills/react-code-style/SKILL.md) | `/implementation-react:react-code-style` | Always — naming, imports, components |
| 3 | [react-typescript](skills/react-typescript/SKILL.md) | `/implementation-react:react-typescript` | Always — types and Zod |
| 4 | [react-configuration](skills/react-configuration/SKILL.md) | `/implementation-react:react-configuration` | Config, env, feature flags |
| 5 | [react-api-client](skills/react-api-client/SKILL.md) | `/implementation-react:react-api-client` | HTTP clients, interceptors, auth |
| 6 | [react-data-fetching](skills/react-data-fetching/SKILL.md) | `/implementation-react:react-data-fetching` | TanStack Query, keys, mutations |
| 7 | [react-unit-testing](skills/react-unit-testing/SKILL.md) | `/implementation-react:react-unit-testing` | Tests, mocks, coverage |
| 8 | [react-scaffold](skills/react-scaffold/SKILL.md) | `/implementation-react:react-scaffold` | **New project only** |
| 9 | [react-feature](skills/react-feature/SKILL.md) | `/implementation-react:react-feature` | **Add feature to existing app** |
| — | [git-commit](skills/git-commit/SKILL.md) | `/implementation-react:git-commit` | Commit changes with a conventional message |

Optional cross-stack: `common-clean-code`, `security-review` (frontend security review).

## Workflow: New Project

1. Load skills **1–6** (foundation).
2. Load **`react-scaffold`** — ask pre-scaffold questions; generate app.
3. Load **`react-api-client`** — wire public/private clients if auth API exists.
4. Run post-scaffold verification: `pnpm local`, `pnpm test`, `pnpm check`.
5. Load **`react-feature`** for first business feature after shell exists.

## Workflow: Add Feature (existing app)

1. Load skills **1–6**.
2. Load **`react-feature`** — follow checklist: types → api → hooks → UI → routes → tests.
3. Load **`react-api-client`** when the feature adds interceptors, new client type, or auth changes.
4. Run `pnpm test` and `pnpm check:test`.

## Workflow: API / Auth Only

1. Load **1, 3, 4, 5** (`react-architecture`, `react-typescript`, `react-configuration`, `react-api-client`).
2. Do not load scaffold/feature unless routes or pages also change.

## Workflow: Tests Only

1. Load **1, 2, 7** (`react-architecture`, `react-code-style`, `react-unit-testing`).
2. Add **`react-feature`** context if testing a specific feature module.

## Quick Reference

| Task | Minimum skills |
|------|----------------|
| Where does file go? | `react-architecture` |
| Code review / generate TSX | + `react-code-style`, `react-typescript` |
| Env / API URL | + `react-configuration` |
| axios / 401 / interceptors | + `react-api-client` |
| Server state / useQuery | + `react-data-fetching` |
| Unit test | + `react-unit-testing` |
| New repo | + `react-scaffold` |
| New screen + API | + `react-feature` |

## Gotchas

- Do not load **`react-scaffold`** when modifying an existing codebase — use **`react-feature`**.
- **`react-api-client`** owns axios instances; **`react-feature`** owns feature `*.api.ts` fetchers.
- Tests always live in root **`tests/`**, mirroring **`src/`** — not inside `src/features/`.
- If your organization maintains a reference React template, prefer forking it, then applying the architecture mapping in `react-scaffold`.

## Usage

### Install

```bash
claude --plugin-dir <path-to-awesome-agents>/plugins/implementation-react
```

Start Claude Code from the target repository root.

### Invoke

```text
/implementation-react:react-architecture
/implementation-react:react-typescript implement OrderList component
/implementation-react:react-feature
/implementation-react:git-commit
```

## Example

Implementing an orders module with list and create form:

1. `/implementation-react:react-architecture` — confirm feature folder placement
2. `/implementation-react:react-typescript` — implement `OrderList` with typed props
3. `/implementation-react:react-api-client` — wire axios client with auth interceptor
4. `/implementation-react:react-data-fetching` — add `useOrders` TanStack Query hook
5. `/implementation-react:react-feature` — wire routes, RHF form, loading/error states
6. `/implementation-react:react-unit-testing` — write component and hook tests
7. `/implementation-react:git-commit` — commit the feature branch

## Requirements

- Claude Code for plugin loading
- Node.js and pnpm/npm in the target repository environment
- Target stack: React 18+, TypeScript, Vite, TanStack Router/Query, axios
- Reference template: optional — the tooling files to copy are documented in `react-scaffold/references/template-files.md`

---

> **Plugin hooks:** This plugin ships a `SessionStart` prompt hook (`hooks/hooks.json`) that automatically injects the skill load order, scenario rules, quick reference, and gotchas above into Claude's context at session start. You do not need to invoke any skill manually to ground Claude in these rules. Run `/reload-plugins` or restart Claude Code after any edit to `hooks/hooks.json`.
