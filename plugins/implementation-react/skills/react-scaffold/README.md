# React Scaffold

## Description

Scaffolds new React + TypeScript + Vite applications using **reference React template** tooling (Vitest, ESLint, Husky, TanStack Router/Query, axios, Tailwind 4) and **features/shared** layout from `react-architecture`.

## When to Use

- Creating a new React frontend from scratch
- Bootstrapping a Vite SPA with TanStack Router and Query
- Setting up testing, linting, and pre-push hooks for a new project
- Migrating from a full reference template to `features/` + `shared/` layout

## Usage

Activate after loading `react-architecture`, `react-code-style`, `react-configuration`, and `react-unit-testing`. The skill:

1. Asks mandatory pre-scaffold questions
2. Generates the folder tree and core file templates
3. Lists dependencies and scripts from the template
4. Documents post-scaffold commands (install, husky, shadcn, MSW, i18n)

For ESLint, Prettier, CSS theme, and optional MSW/i18n file copies, read `references/template-files.md`.

## Example

```bash
# After agent generates the project
pnpm install
pnpm exec husky init
cp .env.example .env.local
pnpm local
pnpm test
```

```
src/
  app/routes/     → TanStack Router
  config/         → appConfig
  features/home/  → sample page
  shared/api/     → axios httpClient
tests/            → Vitest
```

## Requirements

- Node >= 25
- pnpm 11+ (recommended)
- Prerequisites: `react-architecture`, `react-code-style`, `react-configuration`, `react-unit-testing`
