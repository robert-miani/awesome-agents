# Orders Feature — Code Templates

Reference templates for the `react-feature` skill (example feature: **orders**).

## Code Templates

### Types and schemas

```ts
// src/features/orders/types/order.schema.ts
import { z } from 'zod'

export const orderSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  total: z.number(),
})

export const orderListSchema = z.array(orderSchema)

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  total: z.number().positive(),
})

export type Order = z.infer<typeof orderSchema>
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>
```

### Query keys

```ts
// src/features/orders/api/orders.keys.ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: { customerId?: string }) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
}
```

### API functions

```ts
// src/features/orders/api/orders.api.ts
import { httpClient } from '@/shared/api/httpClient'

import {
  createOrderSchema,
  orderListSchema,
  orderSchema,
  type CreateOrderFormValues,
  type Order,
} from '../types/order.schema'

export async function getOrders(): Promise<Order[]> {
  const response = await httpClient.get('/orders')
  return orderListSchema.parse(response.data)
}

export async function getOrderById(id: string): Promise<Order> {
  const response = await httpClient.get(`/orders/${id}`)
  return orderSchema.parse(response.data)
}

export async function createOrder(payload: CreateOrderFormValues): Promise<Order> {
  const body = createOrderSchema.parse(payload)
  const response = await httpClient.post('/orders', body)
  return orderSchema.parse(response.data)
}
```

### Query hook

```ts
// src/features/orders/hooks/useOrders.ts
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

### Detail query hook (route param)

```ts
// src/features/orders/hooks/useOrder.ts
import { useQuery } from '@tanstack/react-query'

import { getOrderById } from '../api/orders.api'
import { orderKeys } from '../api/orders.keys'

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: orderId.length > 0,
  })
}
```

### Mutation hook

```ts
// src/features/orders/hooks/useCreateOrder.ts
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

### List component

```tsx
// src/features/orders/components/OrderTable.tsx
import type { Order } from '../types/order.schema'

type OrderTableProps = {
  orders: Order[]
}

export function OrderTable({ orders }: OrderTableProps) {
  if (orders.length === 0) {
    return <p>No orders yet.</p>
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.status}</td>
            <td>{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Form component

```tsx
// src/features/orders/components/CreateOrderForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

import { createOrderSchema, type CreateOrderFormValues } from '../types/order.schema'

type CreateOrderFormProps = {
  onSubmit: (values: CreateOrderFormValues) => void
  isSubmitting?: boolean
}

export function CreateOrderForm({ onSubmit, isSubmitting = false }: CreateOrderFormProps) {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { customerId: '', total: 0 },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input {...form.register('customerId')} placeholder="Customer ID" />
      <Input type="number" {...form.register('total', { valueAsNumber: true })} placeholder="Total" />
      {form.formState.errors.customerId ? (
        <p role="alert">{form.formState.errors.customerId.message}</p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        Create order
      </Button>
    </form>
  )
}
```

### List page

```tsx
// src/features/orders/pages/OrdersPage.tsx
import { OrderTable } from '../components/OrderTable'
import { useOrders } from '../hooks/useOrders'

export function OrdersPage() {
  const { data, isLoading, error } = useOrders()

  if (isLoading) {
    return <p>Loading…</p>
  }

  if (error) {
    return <p role="alert">Failed to load orders.</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <OrderTable orders={data ?? []} />
    </main>
  )
}
```

### Create page (mutation + navigation)

```tsx
// src/features/orders/pages/CreateOrderPage.tsx
import { useNavigate } from '@tanstack/react-router'

import { CreateOrderForm } from '../components/CreateOrderForm'
import { useCreateOrder } from '../hooks/useCreateOrder'

export function CreateOrderPage() {
  const navigate = useNavigate()
  const createOrder = useCreateOrder()

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Create order</h1>
      <CreateOrderForm
        isSubmitting={createOrder.isPending}
        onSubmit={(values) => {
          createOrder.mutate(values, {
            onSuccess: (order) => {
              void navigate({ to: '/orders/$orderId', params: { orderId: order.id } })
            },
          })
        }}
      />
    </main>
  )
}
```

### Detail page (route param)

```tsx
// src/features/orders/pages/OrderDetailsPage.tsx
import { useParams } from '@tanstack/react-router'

import { useOrder } from '../hooks/useOrder'

export function OrderDetailsPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' })
  const { data, isLoading, error } = useOrder(orderId)

  if (isLoading) {
    return <p>Loading…</p>
  }

  if (error || !data) {
    return <p role="alert">Order not found.</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Order {data.id}</h1>
      <p>Status: {data.status}</p>
      <p>Total: {data.total}</p>
    </main>
  )
}
```

### Public API

```ts
// src/features/orders/index.ts
export { OrdersPage } from './pages/OrdersPage'
export { OrderDetailsPage } from './pages/OrderDetailsPage'
export { CreateOrderPage } from './pages/CreateOrderPage'
export { orderKeys } from './api/orders.keys'
```

Export **pages** and intentionally shared symbols only.
