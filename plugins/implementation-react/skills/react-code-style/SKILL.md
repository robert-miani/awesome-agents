---
name: react-code-style
description: >
  React and TypeScript code style for feature-based Vite apps. Use whenever generating or
  reviewing React/TSX code to enforce naming, imports, exports, hooks, and component patterns.
  Trigger on any React code generation, refactor, or review, or phrases like "code style",
  "naming convention", "import order", "component pattern", "file naming", or ESLint conventions
  for React + TypeScript projects using features/ and shared/.
---

# Code Style Skill (React + TypeScript)

Apply these conventions to all React and TypeScript code you generate or review. Pair with `react-typescript` for type-level rules and `react-architecture` for folder placement.

**RELATED SKILLS:**
- `react-architecture` — where files live
- `react-typescript` — strict types, Zod, unions
- `react-configuration` — config access patterns
- `react-api-client` — axios clients; features use `httpClient`
- `react-data-fetching` — wrap `useQuery` / `useMutation` in feature hooks
- `react-unit-testing` — test file placement and naming under `tests/`

---

## Key Style Rules Summary

### DO

| Rule | Example |
|------|---------|
| Use function components | `export function UserCard() { ... }` |
| Use named exports for components | `export function OrdersPage()` |
| PascalCase component files | `OrderTable.tsx` |
| camelCase hook files with `use` prefix | `useOrderFilters.ts` |
| kebab-case route files (optional team norm) | `orders.route.tsx` or `orders.tsx` in `app/routes/` |
| Use `@/` path alias for `src/` | `import { httpClient } from "@/shared/api/httpClient"` |
| Colocate feature code under `features/<name>/` | See `react-architecture` |
| Destructure props in the signature | `function UserCard({ name }: UserCardProps)` |
| Type props with a dedicated `*Props` type | `type UserCardProps = { name: string }` |
| Use `type` for props (see `react-typescript`) | `type ButtonProps = { ... }` |
| Keep components focused; extract hooks | `useOrderFilters.ts` in `hooks/` |
| Use Tailwind for layout/spacing when the project uses Tailwind | `className="flex gap-4"` |
| Import shadcn primitives from `shared/components/ui` | `import { Button } from "@/shared/components/ui/button"` |

### DON'T

| Rule | Avoid |
|------|-------|
| `any` in components or hooks | Use `unknown` + validation per `react-typescript` |
| `import.meta.env` outside `config/` | Use `appConfig` |
| Cross-feature deep imports | `from "@/features/users/components/..."` from orders |
| Class components | Legacy pattern |
| Default export for feature pages/components | Prefer named exports |
| Inline anonymous default exports | `export default function()` in feature modules |
| `React.FC` / `React.FunctionComponent` | Explicit props types instead |
| Index files that re-export entire trees blindly | Keep `features/*/index.ts` intentional |
| Business logic in `shared/components/ui` | Primitives only |
| `console.log` left in committed code | Remove or use proper logging |

---

## Import Order

Group imports in this order, with a blank line between groups:

1. React / router / external libraries (`react`, `@tanstack/react-query`, `axios`, `zod`)
2. `@/config/*`
3. `@/shared/*`
4. Same-feature relative imports (`./`, `../` within the feature)
5. Other features only via public API (`@/features/<name>`)
6. Type-only imports last in their group (`import type { ... }`)

```tsx
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { appConfig } from "@/config/config";
import { Button } from "@/shared/components/ui/button";

import { orderKeys } from "../api/orders.keys";
import type { Order } from "../types/order.types";
```

Use `import type` for types that are erased at compile time.

---

## File Naming

| Kind | File name | Export |
|------|-----------|--------|
| Component | `OrderTable.tsx` | `export function OrderTable` |
| Page | `OrdersPage.tsx` | `export function OrdersPage` |
| Hook | `useOrders.ts` | `export function useOrders` |
| API module | `orders.api.ts` | named functions |
| Query keys | `orders.keys.ts` | `export const orderKeys = { ... }` |
| Schema / types | `order.schema.ts`, `order.types.ts` | types + Zod schemas |
| Route module | `orders.route.tsx` (in `app/routes/`) | route config |
| Test | `OrderTable.test.tsx` in `tests/` mirroring `src/` | See `react-unit-testing` |

Use **kebab-case** for non-component modules when the repo already does (`orders.api.ts`). Match existing repo convention if it differs.

---

## Component Pattern

```tsx
// features/orders/components/OrderStatusBadge.tsx
import type { OrderStatus } from "../types/order.types";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <span data-status={status}>{status}</span>;
}
```

- One primary component per file unless small private subcomponents stay unexported in the same file.
- Extract non-trivial logic to hooks in `hooks/`.
- Avoid prop drilling across more than two levels — prefer composition or a feature-scoped context.

---

## Hooks

```ts
// features/orders/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";

import { getOrders } from "../api/orders.api";
import { orderKeys } from "../api/orders.keys";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
  });
}
```

| Rule | Detail |
|------|--------|
| Prefix | `use` + PascalCase remainder (`useOrderFilters`) |
| Location | Feature hooks in `features/<name>/hooks/`; generic hooks in `shared/hooks/` |
| TanStack Query | Wrap in custom hooks; do not call `useQuery` inline in large page bodies repeatedly |
| Dependencies | Exhaustive `useEffect` deps when effects are unavoidable; prefer event handlers and query callbacks |

---

## Pages

```tsx
// features/orders/pages/OrdersPage.tsx
import { OrderTable } from "../components/OrderTable";
import { useOrders } from "../hooks/useOrders";

export function OrdersPage() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return <p role="alert">Failed to load orders.</p>;
  }

  return <OrderTable orders={data ?? []} />;
}
```

- Pages compose feature components and hooks; keep them thin.
- Loading/error/empty states are explicit branches or small subcomponents.
- Do not fetch via raw `axios` in the page — use feature API + Query hooks.

---

## Forms (React Hook Form + Zod)

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createOrderSchema, type CreateOrderFormValues } from "../types/order.schema";

export function CreateOrderForm() {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { customerId: "", amount: 0 },
  });

  function onSubmit(values: CreateOrderFormValues) {
    // mutation via feature hook
    void values;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* fields */}
    </form>
  );
}
```

- Schemas live in `features/<name>/types/` (or `*.schema.ts`).
- Infer form types with `z.infer<typeof schema>`.

---

## Tailwind and shadcn

- Prefer Tailwind utility classes on components; avoid inline `style={{}}` except for dynamic values.
- Merge conditional classes with the project’s `cn()` helper from `shared/lib/utils.ts` when present.
- shadcn components: import from `@/shared/components/ui/*`; do not fork primitives into features unless customizing for reuse across features.
- Do not treat shadcn as mandatory — plain semantic HTML + Tailwind is fine when no primitive exists.

---

## API Modules (axios)

```ts
// features/orders/api/orders.api.ts
import { httpClient } from "@/shared/api/httpClient";

import { orderListSchema, type Order } from "../types/order.schema";

export async function getOrders(): Promise<Order[]> {
  const response = await httpClient.get("/orders");
  return orderListSchema.parse(response.data);
}
```

- Parse responses with Zod in the API layer or immediately after fetch.
- No `axios.create()` in feature folders.

---

## Naming Conventions

| Symbol | Convention | Example |
|--------|------------|---------|
| Component | PascalCase | `OrderTable` |
| Page | PascalCase + `Page` suffix | `OrdersPage` |
| Hook | camelCase, `use` prefix | `useOrders` |
| Props type | Component name + `Props` | `OrderTableProps` |
| Event handler | `handle` + action | `handleSubmit`, `handleClick` |
| Boolean prop | `is` / `has` / `can` prefix | `isLoading`, `hasError` |
| Query keys factory | camelCase object | `orderKeys.list()` |
| Zod schema | camelCase + `Schema` | `createOrderSchema` |
| API function | verb + resource | `getOrders`, `createOrder` |

---

## Checklist

When generating or reviewing React code:

- [ ] File lives in the correct folder per `react-architecture`
- [ ] Named exports for components and pages
- [ ] Props typed with `*Props`; no `React.FC`
- [ ] Imports ordered; `@/` alias used; no cross-feature deep imports
- [ ] No `any`; API data validated per `react-typescript`
- [ ] No direct env access outside `config/`
- [ ] axios only via `shared/api/httpClient`
- [ ] TanStack Query wrapped in feature hooks
- [ ] Forms use RHF + Zod when applicable
- [ ] Tailwind/shadcn used consistently with the project

---

## Gotchas

- Default exports break consistent refactors and lazy route imports — use named exports.
- Huge page components — split into `components/` and `hooks/`.
- Typing props inline on the function instead of a reusable `*Props` type — harder to extend and test.
- Re-exporting everything from `features/*/index.ts` — defeats encapsulation.
