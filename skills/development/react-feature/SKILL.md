---
name: react-feature
description: >
  Add new features to existing React + TypeScript + Vite apps with features/shared layout.
  Use when implementing a new page, route, API integration, form, or UI workflow end-to-end.
  Trigger on phrases like "add feature", "new page", "create route", "add orders screen",
  "implement list", "add mutation", "wire API", "new feature module", or extending an existing
  React app with new user-facing functionality.
---

# Feature Implementation Skill (React + TypeScript + Vite)

You implement new features in existing React apps. Each feature spans **types → API → hooks → UI → route → tests** inside `src/features/<name>/`, with routes in `src/app/routes/`.

**PREREQUISITES:** Load these skills before implementing:
- `react-architecture` — folder structure and import boundaries
- `react-code-style` — naming, components, hooks, forms
- `react-typescript` — strict types and Zod validation
- `react-configuration` — `appConfig`; never read env in feature code
- `react-api-client` — axios clients and interceptors
- `react-data-fetching` — TanStack Query hooks and cache rules
- `react-unit-testing` — tests under `tests/` mirroring `src/`

**RELATED SKILLS:**
- `react-scaffold` — when the project does not exist yet
- `react-data-fetching` — detailed Query/mutation patterns (hooks step in checklist)

**Stack:** TanStack Router, TanStack Query, axios (`shared/api/httpClient`), React Hook Form + Zod, Tailwind / shadcn.

---

## Before You Start — Feature Questions

Ask when requirements are unclear:

1. **Feature name** — kebab-case folder (e.g., `orders`, `user-profile`)
2. **Routes** — paths needed (list, detail, create)? Protected?
3. **API** — endpoints, methods, request/response shapes from backend?
4. **Read vs write** — list/detail only, or create/update/delete too?
5. **Forms** — which fields and validation rules?
6. **Auth** — route guard or API auth already handled by interceptors?
7. **Shared UI** — reuse existing shadcn primitives or add new ones to `shared/components/ui/`?

---

## Feature Implementation Checklist

Implement in this order:

1. **types/** — Zod schemas + inferred types for API and forms
2. **api/** — query keys, axios fetchers with response parsing
3. **hooks/** — `useQuery` / `useMutation` wrappers
4. **components/** — presentational and form components
5. **pages/** — route-facing pages (compose hooks + components)
6. **index.ts** — public exports (pages and symbols other modules need)
7. **app/routes/** — TanStack Router route file(s) importing from feature `index.ts`
8. **tests/** — mirror new files under `tests/features/<name>/`

Do **not** skip types or tests. Do **not** put feature logic in `shared/` unless it is genuinely reused across features.

---

## Feature File Structure

Example feature: **orders**

```
src/
  features/orders/
    types/
      order.schema.ts                 # Zod + Order, CreateOrderFormValues
    api/
      orders.keys.ts                  # orderKeys factory
      orders.api.ts                   # getOrders, getOrderById, createOrder
    hooks/
      useOrders.ts
      useOrder.ts
      useCreateOrder.ts
    components/
      OrderTable.tsx
      OrderRow.tsx
      CreateOrderForm.tsx
    pages/
      OrdersPage.tsx
      OrderDetailsPage.tsx
      CreateOrderPage.tsx
    index.ts
  app/routes/
    orders/
      index.tsx                       # /orders
      $orderId.tsx                    # /orders/$orderId
      create.tsx                      # /orders/create
tests/
  features/orders/
    components/OrderTable.test.tsx
    hooks/useOrders.test.ts
    api/orders.api.test.ts
```

---

## Code Templates

Full **orders** feature templates (types, API, hooks, components, pages, `index.ts`): read `references/orders-templates.md`.

---

## Routes (TanStack Router)

Route files live in `src/app/routes/`. Import pages from `@/features/orders`, never deep paths.

```tsx
// src/app/routes/orders/index.tsx
import { createFileRoute } from '@tanstack/react-router'

import { OrdersPage } from '@/features/orders'

export const Route = createFileRoute('/orders/')({
  component: OrdersPage,
})
```

```tsx
// src/app/routes/orders/$orderId.tsx
import { createFileRoute } from '@tanstack/react-router'

import { OrderDetailsPage } from '@/features/orders'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderDetailsPage,
})
```

```tsx
// src/app/routes/orders/create.tsx
import { createFileRoute } from '@tanstack/react-router'

import { CreateOrderPage } from '@/features/orders'

export const Route = createFileRoute('/orders/create')({
  component: CreateOrderPage,
})
```

### Protected routes (auth — backend-specific)

Adapt to the project’s auth mechanism. Pattern from the reference React template:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

import { OrdersPage } from '@/features/orders'
// import { getAuthState } from '@/features/auth' — project-specific

export const Route = createFileRoute('/orders/')({
  beforeLoad: () => {
    const isAuthenticated = false // replace with real check
    if (!isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: OrdersPage,
})
```

After adding routes, run dev/build so `@tanstack/router-plugin` regenerates `src/routeTree.gen.ts`.

---

## Request Flow

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Route       │────▶│   Page      │────▶│  Query Hook  │────▶│  API fn     │
│  /orders     │     │ OrdersPage  │     │  useOrders   │     │  getOrders  │
└──────────────┘     └─────────────┘     └──────────────┘     └─────────────┘
                                                │                     │
                                                ▼                     ▼
                                         ┌──────────────┐     ┌─────────────┐
                                         │  Component   │◀────│  httpClient │
                                         │  OrderTable  │     │  + Zod parse│
                                         └──────────────┘     └─────────────┘
```

**Write flow:** Form → `useMutation` → API POST → `invalidateQueries` → navigate or toast.

---

## Tests (minimum for a feature)

Add at least:

| File | Covers |
|------|--------|
| `tests/features/orders/api/orders.api.test.ts` | Zod parsing, error when response invalid |
| `tests/features/orders/components/OrderTable.test.tsx` | Empty state, renders rows |
| `tests/features/orders/hooks/useOrders.test.tsx` | Query success with mocked API |

Mock `@/features/orders/api/orders.api` or `httpClient` — see `react-unit-testing`.

---

## Feature Variants

| Variant | Add |
|---------|-----|
| **List only** | keys, list API, `useOrders`, table, list page, route |
| **Detail** | detail API, `useOrder`, detail page, `$id` route |
| **Create** | form schema, mutation hook, form component, create page, route |
| **Edit** | `updateOrder` API, `useUpdateOrder`, prefill form from `useOrder` |
| **Delete** | `useDeleteOrder` + confirm dialog; invalidate list on success |

---

## Rules

1. **One feature folder per capability** — `features/orders`, not `features/order-list`.
2. **Parse all API responses with Zod** in `*.api.ts`.
3. **Query keys in `*.keys.ts`** — never inline string arrays in hooks.
4. **Pages stay thin** — no axios or large JSX blocks in pages.
5. **Routes import from `index.ts` only.**
6. **Tests mirror `src/` under `tests/`.**
7. **Lift to `shared/`** only when a second feature needs the same primitive.

---

## Adding shadcn Components

When a feature needs new UI primitives:

```bash
pnpm dlx shadcn@latest add input button table dialog
```

Components land in `src/shared/components/ui/`. Features import them; do not copy into `features/`.

---

## Gotchas

- Forgetting to **invalidate** list queries after mutations — stale UI.
- Using **route params** before `enabled` check — guard with `enabled: Boolean(id)`.
- **Deep-importing** pages in routes — breaks feature encapsulation.
- **Skipping Zod** on API responses — runtime crashes on backend shape changes.
- Editing **`routeTree.gen.ts` manually** — always regenerate via Vite plugin.

For reference-template legacy paths (`src/views/`, `src/data/api/`), map to `features/*/pages/` and `features/*/api/` when extending an older fork.
