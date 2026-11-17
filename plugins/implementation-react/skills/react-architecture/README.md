# React Architecture

## Description

Feature-based architecture for React + TypeScript + Vite applications. Defines the `app/`, `features/`, `shared/`, and `config/` layout, dependency rules, feature public APIs, and integration points for TanStack Router, TanStack Query, and axios.

## When to Use

- Deciding where new files belong in a React project
- Setting up or reviewing `features/` and `shared/` boundaries
- Preventing cross-feature imports
- Wiring the app shell (routes, providers)
- Questions about TanStack Router placement or TanStack Query ownership

## Usage

Activate this skill when working with React project structure. It provides:

- Full `src/` folder layout
- Dependency matrix (what may import what)
- Placement table for routes, pages, API, hooks, and UI
- Feature `index.ts` public API pattern
- App shell and data-access boundaries
- Light guidance for Tailwind, shadcn, and backend-driven auth
- `tests/` folder mirroring `src/` (see `react-unit-testing`)

## Example

```
src/
  app/routes/           → TanStack Router
  app/providers/        → QueryClientProvider, etc.
  config/config.ts      → appConfig
  features/orders/
    pages/OrdersPage.tsx
    api/orders.api.ts
    index.ts            → export { OrdersPage }
  shared/api/httpClient.ts
```

**Dependency rule:** `features/orders` → `shared/`, never `features/users/` internals.

## Requirements

- React 18+
- TypeScript
- Vite
- Recommended: TanStack Router, TanStack Query, axios
