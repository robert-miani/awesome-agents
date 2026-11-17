# React Data Fetching

## Description

TanStack Query v5 patterns for server state: query key factories, feature hooks, mutations, cache invalidation, optimistic updates, and testing. Works with axios API modules from `react-api-client`.

## When to Use

- Adding `useQuery` or `useMutation` hooks
- Designing query keys and invalidation strategy
- Handling loading, error, and refetch UI states
- Prefetching or caching API data in features

## Usage

Load with `react-architecture`, `react-api-client`, and `react-typescript`. API fetchers stay in `features/*/api/`; Query hooks in `features/*/hooks/`.

## Example

```ts
// features/orders/api/orders.keys.ts
export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
}

// features/orders/hooks/useOrders.ts
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrders,
  })
}
```

## Requirements

- @tanstack/react-query v5+
- axios API layer per `react-api-client`
- Prerequisites: `react-architecture`, `react-api-client`, `react-data-fetching`, `react-typescript`
