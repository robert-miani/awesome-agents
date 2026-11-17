---
name: react-data-fetching
description: >
  TanStack Query patterns for React + Vite apps: query keys, custom hooks, mutations,
  cache invalidation, and error handling with axios API layers. Use when wiring useQuery,
  useMutation, prefetch, optimistic updates, or server state in feature hooks. Trigger on
  phrases like "TanStack Query", "react-query", "useQuery", "useMutation", "query key",
  "invalidate queries", "server state", "refetch", "staleTime", or caching API data in features.
---

# Data Fetching Skill (React + TanStack Query)

You manage **server state** with **TanStack Query v5**. axios fetchers live in `features/*/api/`; Query hooks live in `features/*/hooks/`. The app shell owns a single `QueryClient`.

**PREREQUISITES:**
- `react-architecture` — feature folders and hook placement
- `react-api-client` — axios clients; API functions call `httpClient`
- `react-typescript` — typed query data; Zod parsing in API layer

**RELATED SKILLS:**
- `react-feature` — end-to-end feature workflow
- `react-unit-testing` — `QueryClientProvider` in tests
- `react-code-style` — wrap `useQuery` in named hooks

**Reference:** reference React template `tanstackSetup.ts`, `data/api/test/useNotificationQuery.ts`.

---

## Responsibilities

| Layer | Location | Owns |
|-------|----------|------|
| **API fetcher** | `features/*/api/*.api.ts` | axios call + Zod parse; no React |
| **Query keys** | `features/*/api/*.keys.ts` | Stable key factories |
| **Query hook** | `features/*/hooks/use*.ts` | `useQuery` / `useMutation` |
| **Page** | `features/*/pages/` | Calls hooks; handles UI states |
| **QueryClient** | `src/app/tanstackSetup.ts` | Defaults, global config |

**Rule:** Pages and components do **not** call axios or define inline `queryKey` arrays.

---

## QueryClient Setup

```ts
// src/app/tanstackSetup.ts
import { QueryClient } from '@tanstack/react-query'

export const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
})
```

Wire once in `App.tsx`:

```tsx
<QueryClientProvider client={tanstackQueryClient}>
  <RouterProvider router={tanstackRouter} />
</QueryClientProvider>
```

Optional devtools (development only):

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// inside QueryClientProvider
<ReactQueryDevtools initialIsOpen={false} />
```

---

## Query Key Factories

Always use a factory object in `*.keys.ts`:

```ts
// src/features/orders/api/orders.keys.ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: { status?: string }) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}
```

| Rule | Detail |
|------|--------|
| Hierarchy | `all` → `lists` / `details` → parameterized keys |
| `as const` | Required for type-safe invalidation |
| Colocation | Keys live next to API module for the same feature |
| No strings in hooks | Import `orderKeys`, never `['orders']` inline |

Invalidate at the narrowest parent that refreshes the right data:

```ts
queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
```

---

## API + Query Hook Pattern

```ts
// features/orders/api/orders.api.ts — no React imports
import { httpClient } from '@/shared/api/clients/privateClient'
import { orderListSchema, type Order } from '../types/order.schema'

export async function getOrders(): Promise<Order[]> {
  const response = await httpClient.get('/orders')
  return orderListSchema.parse(response.data)
}
```

```ts
// features/orders/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query'

import { getOrders } from '../api/orders.api'
import { orderKeys } from '../api/orders.keys'

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
  })
}
```

Pass **function reference** as `queryFn` when args come from the key; use arrow when the fetcher needs closure args:

```ts
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: orderId.length > 0,
  })
}
```

---

## UI State Mapping (v5)

| Hook field | Use for |
|------------|---------|
| `isPending` | First load — no cached data yet |
| `isFetching` | Background refetch — show subtle indicator |
| `isError` / `error` | Failed fetch — user message |
| `data` | Success — render list/detail |

```tsx
export function OrdersPage() {
  const { data, isPending, isError, error } = useOrders()

  if (isPending) {
    return <p>Loading…</p>
  }

  if (isError) {
    return <p role="alert">{error.message}</p>
  }

  return <OrderTable orders={data} />
}
```

Prefer **`isPending`** over legacy `isLoading` (removed in v5).

Derived data belongs in the hook with `select` or `useMemo`:

```ts
export function useUnreadNotifications() {
  const query = useQuery({
    queryKey: notificationKeys.all(),
    queryFn: fetchNotifications,
    select: (notifications) => notifications.filter((n) => !n.read),
  })

  return {
    ...query,
    unreadCount: query.data?.length ?? 0,
  }
}
```

---

## Mutations

```ts
// features/orders/hooks/useCreateOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createOrder } from '../api/orders.api'
import { orderKeys } from '../api/orders.keys'
import type { CreateOrderFormValues } from '../types/order.schema'

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CreateOrderFormValues) => createOrder(values),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    },
  })
}
```

Page usage:

```tsx
const createOrder = useCreateOrder()

createOrder.mutate(values, {
  onSuccess: (order) => {
    void navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
  },
})
```

### Optimistic update (when UX requires it)

```ts
onMutate: async (newOrder) => {
  await queryClient.cancelQueries({ queryKey: orderKeys.lists() })
  const previous = queryClient.getQueryData<Order[]>(orderKeys.list())
  queryClient.setQueryData<Order[]>(orderKeys.list(), (old = []) => [...old, newOrder])
  return { previous }
},
onError: (_err, _vars, context) => {
  if (context?.previous) {
    queryClient.setQueryData(orderKeys.list(), context.previous)
  }
},
onSettled: () => {
  void queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
},
```

Use optimistic updates sparingly — default to **invalidate on success**.

---

## Errors

API layer throws **normalized `ApiError`** (see `react-api-client`). Query hooks surface `error: Error`.

Do **not** catch and swallow in `queryFn` — let Query mark the query as failed:

```ts
// ❌ Avoid — hides failure from TanStack Query
queryFn: async () => {
  try {
    return await getOrders()
  } catch (e) {
    console.error(e)
    return []
  }
}
```

Map `ApiError` to user-facing copy in the page or a small helper in the feature.

---

## Dependent & Conditional Queries

```ts
export function useOrderLines(orderId: string) {
  return useQuery({
    queryKey: orderKeys.lines(orderId),
    queryFn: () => getOrderLines(orderId),
    enabled: Boolean(orderId),
  })
}
```

For auth-gated data, combine `enabled` with auth state from your backend-driven auth feature.

---

## Router Prefetch (optional)

Prefetch in TanStack Router `loader` when list data is needed before paint:

```tsx
export const Route = createFileRoute('/orders/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: orderKeys.list(),
      queryFn: getOrders,
    }),
  component: OrdersPage,
})
```

Requires passing `queryClient` on router context in `tanstackSetup.ts`. Use only when measurable benefit — hooks alone are the default.

---

## Remote Config / Feature Flags (template pattern)

```ts
// features/flags/hooks/useFeatureFlags.ts
import { useQuery } from '@tanstack/react-query'

import { fetchFeatureFlags } from '../api/flags.api'
import { flagKeys } from '../api/flags.keys'

export function useFeatureFlags() {
  return useQuery({
    queryKey: flagKeys.all(),
    queryFn: fetchFeatureFlags,
    staleTime: 5 * 60_000,
  })
}
```

Long `staleTime` for rarely changing server config.

---

## Testing

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrders } from '@/features/orders/hooks/useOrders'
import { createQueryWrapper } from '../../../testUtils/render'

vi.mock('@/features/orders/api/orders.api', () => ({
  getOrders: vi.fn().mockResolvedValue([{ id: '1', total: 10 }]),
}))

describe('useOrders', () => {
  it('loads orders', async () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
  })
})
```

Use a **fresh `QueryClient` per test** — see `react-unit-testing`.

---

## Rules

1. **One hook per query/mutation** — `useOrders`, `useCreateOrder`.
2. **Keys in `*.keys.ts`** — never magic strings in components.
3. **Fetchers in `*.api.ts`** — Zod parse before return.
4. **Invalidate after mutations** — keep lists and details consistent.
5. **No axios in hooks** — hooks call API functions only.
6. **No server state in Zustand/context** — unless it is purely client UI state.
7. **Default `retry: false`** for API errors — auth/404 won't succeed on retry.

---

## Checklist — New Query

1. Add Zod schema + API function in `features/<name>/api/`.
2. Add key factory in `features/<name>/api/*.keys.ts`.
3. Add `use*` hook in `features/<name>/hooks/`.
4. Use hook in page; handle `isPending` / `isError`.
5. Add mutation hook + `invalidateQueries` if writes exist.
6. Test hook with mocked API module.

---

## Gotchas

- **Stale list after create** — forgot `invalidateQueries` on `lists()`.
- **`enabled: false` still mounting** — hook runs but skips fetch; guard UI separately.
- **Same key, different fetchers** — cache corruption; one key shape per query type.
- **Putting `useQuery` in shared/** — server state is feature-owned unless truly global (e.g. feature flags).
- **Infinite queries** — use `useInfiniteQuery` only for paginated APIs; separate skill pattern applies.

For full feature file trees and page templates, read `react-feature` and `references/query-examples.md`.
