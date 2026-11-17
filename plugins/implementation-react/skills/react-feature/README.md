# React Feature

## Description

End-to-end workflow for adding features to existing React + TypeScript + Vite apps: types, API, TanStack Query hooks, components, pages, TanStack Router routes, and tests — all within `src/features/<name>/`.

## When to Use

- Adding a new page or screen to an existing React app
- Wiring list/detail/create flows to backend APIs
- Implementing forms with React Hook Form + Zod
- Adding routes and query/mutation hooks for a business capability

## Usage

Load after `react-architecture`, `react-code-style`, `react-typescript`, `react-configuration`, `react-api-client`, and `react-unit-testing`. The skill provides:

- Pre-implementation questions
- Ordered checklist (types → api → hooks → UI → routes → tests)
- Full templates for orders-style CRUD
- Route and auth guard patterns
- Minimum test matrix

## Example

```
features/orders/
  types/order.schema.ts
  api/orders.api.ts + orders.keys.ts
  hooks/useOrders.ts
  pages/OrdersPage.tsx
  index.ts
app/routes/orders/index.tsx  → imports OrdersPage from @/features/orders
tests/features/orders/...    → mirrors src
```

## Requirements

- Existing project scaffolded per `react-scaffold` or equivalent
- TanStack Router, TanStack Query, axios, Zod, React Hook Form
- Prerequisites: `react-architecture`, `react-code-style`, `react-typescript`, `react-configuration`, `react-api-client`, `react-data-fetching`, `react-unit-testing`
