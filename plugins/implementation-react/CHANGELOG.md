# Changelog — implementation-react

## [0.1.0] — 2026-06-16

### Added
- Initial release
- `react-architecture` — documents and enforces the feature-based React + Vite project structure and layer boundaries
- `react-code-style` — enforces React and TypeScript code style conventions
- `react-typescript` — applies strict TypeScript patterns (no `any`, discriminated unions, typed hooks)
- `react-configuration` — manages Vite, ESLint, Prettier, path aliases, and environment configuration
- `react-api-client` — implements Axios instances, interceptors, and shared API client setup
- `react-data-fetching` — implements TanStack Query hooks for data fetching, mutation, and caching
- `react-unit-testing` — writes Vitest + React Testing Library unit tests for components and hooks
- `react-scaffold` — scaffolds a new React project from the reference template (new projects only)
- `react-feature` — implements a complete React feature module (component, hook, API fetcher, tests)
- `git-commit` — standardised git commit workflow
- `SessionStart` hook — injects cross-skill workflow rules (load order, scenario branching, gotchas) automatically at session start
