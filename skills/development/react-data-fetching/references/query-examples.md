# Query Examples (react-data-fetching)

Extended examples referenced from the main skill.

## Paginated list

```ts
// features/orders/api/orders.keys.ts
export const orderKeys = {
  all: ['orders'] as const,
  infinite: (filters?: { status?: string }) => [...orderKeys.all, 'infinite', filters] as const,
}
```

```ts
import { useInfiniteQuery } from '@tanstack/react-query'

export function useOrdersInfinite(status?: string) {
  return useInfiniteQuery({
    queryKey: orderKeys.infinite({ status }),
    queryFn: ({ pageParam }) => getOrdersPage({ cursor: pageParam, status }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}
```

## Mutation with detail cache update

```ts
onSuccess: (updated, { id }) => {
  queryClient.setQueryData(orderKeys.detail(id), updated)
  void queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
}
```

## Router context (optional prefetch)

```ts
// src/app/tanstackSetup.ts
export const tanstackRouter = createRouter({
  routeTree,
  context: { queryClient: tanstackQueryClient },
})
```

```tsx
declare module '@tanstack/react-router' {
  interface RouterContext {
    queryClient: QueryClient
  }
}
```
