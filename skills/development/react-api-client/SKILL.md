---
name: react-api-client
description: >
  axios HTTP client setup for React + Vite apps: shared clients, interceptors, auth headers,
  token refresh, and error handling. Use when configuring axios, adding interceptors, wiring
  authentication to API calls, splitting public/private clients, or debugging API errors.
  Trigger on phrases like "axios", "http client", "interceptor", "Bearer token", "401 refresh",
  "API error handling", "private client", "public client", or auth headers on requests.
---

# API Client Skill (React + TypeScript + Vite)

You configure **axios** in `src/shared/api/`. Feature modules call API functions in `features/*/api/` that use these clients — features never create axios instances.

**PREREQUISITES:**
- `react-architecture` — `shared/api` placement
- `react-configuration` — `appConfig.api.baseUrl`; no env reads in clients
- `react-typescript` — typed errors and Zod in feature API layers

**RELATED SKILLS:**
- `react-feature` — feature-level `*.api.ts` fetchers
- `react-data-fetching` — TanStack Query hooks consume API functions
- `react-code-style` — API module conventions

**Reference:** reference React template `src/data/api/` — mapped to `src/shared/api/` below.

---

## Folder Structure

```
src/shared/api/
  clients/
    publicClient.ts           → unauthenticated JSON API
    privateClient.ts          → authenticated JSON API (default for most features)
    fileUploadClient.ts       → (OPTIONAL) multipart uploads
  interceptors/
    request/
      authInterceptor.ts      → attach token / API key (private)
    response/
      errorInterceptor.ts     → log + normalize errors (public + private)
      loggerInterceptor.ts    → dev logging (public + private)
      tokenRefreshInterceptor.ts → 401 retry (private; BE-specific)
  registerInterceptors.ts     → glob-register interceptors by client type
  token.ts                    → get/set/remove token (or delegate to features/auth)
  errors.ts                   → ApiError type + mappers
  types.ts                    → interceptor contracts
```

**Template mapping:**

| Template | Scaffold / architecture |
|----------|-------------------------|
| `src/data/api/clients/` | `src/shared/api/clients/` |
| `src/data/api/interceptors/` | `src/shared/api/interceptors/` |
| `src/utils/env.ts` base URL | `appConfig.api.baseUrl` from `react-configuration` |

---

## Client Types

| Client | Use when | Auth interceptors |
|--------|----------|-------------------|
| **public** | Login, register, public catalog | No auth header |
| **private** | Authenticated app API | Auth + refresh interceptors |
| **fileUpload** | Multipart uploads | Auth; different `Content-Type` |

Export **`httpClient`** as alias to **`privateClient`** for simple apps with one authenticated API.

Features import:

```ts
import { httpClient } from '@/shared/api/clients/privateClient'
// or
import publicClient from '@/shared/api/clients/publicClient'
```

---

## Interceptor Registration (reference template pattern)

Each interceptor file exports `interceptorType`, `onFulfilled`, and/or `onRejected`.

```ts
// src/shared/api/types.ts
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export type InterceptorClient = 'private' | 'public' | 'fileUpload'

export type RequestInterceptorModule = {
  interceptorType: InterceptorClient[]
  onFulfilled?: (
    config: InternalAxiosRequestConfig,
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onRejected?: (error: AxiosError) => unknown
}

export type ResponseInterceptorModule = {
  interceptorType: InterceptorClient[]
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  onRejected?: (error: AxiosError) => unknown
}
```

```ts
// src/shared/api/registerInterceptors.ts
import type { AxiosInstance } from 'axios'

import type { InterceptorClient, RequestInterceptorModule, ResponseInterceptorModule } from './types'

export async function registerInterceptors(instance: AxiosInstance, clientType: InterceptorClient) {
  const requestModules = import.meta.glob('./interceptors/request/*.ts')
  for (const path in requestModules) {
    const mod = (await requestModules[path]()) as RequestInterceptorModule
    if (mod.interceptorType.includes(clientType)) {
      instance.interceptors.request.use(
        (config) => (mod.onFulfilled ? mod.onFulfilled(config) : config),
        mod.onRejected,
      )
    }
  }

  const responseModules = import.meta.glob('./interceptors/response/*.ts')
  for (const path in responseModules) {
    const mod = (await responseModules[path]()) as ResponseInterceptorModule
    if (mod.interceptorType.includes(clientType)) {
      instance.interceptors.response.use(mod.onFulfilled, mod.onRejected)
    }
  }
}
```

Adding a new interceptor = new file under `interceptors/request/` or `interceptors/response/` — no central edit.

---

## Client Factory

```ts
// src/shared/api/clients/privateClient.ts
import axios from 'axios'

import { appConfig } from '@/config/config'

import { registerInterceptors } from '../registerInterceptors'

export const privateClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

void registerInterceptors(privateClient, 'private')

export const httpClient = privateClient
```

```ts
// src/shared/api/clients/publicClient.ts
import axios from 'axios'

import { appConfig } from '@/config/config'

import { registerInterceptors } from '../registerInterceptors'

const publicClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

void registerInterceptors(publicClient, 'public')

export default publicClient
```

```ts
// src/shared/api/clients/fileUploadClient.ts (optional)
import axios from 'axios'

import { appConfig } from '@/config/config'

import { registerInterceptors } from '../registerInterceptors'

const fileUploadClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: 60_000,
})

void registerInterceptors(fileUploadClient, 'fileUpload')

export default fileUploadClient
```

---

## Auth Interceptor (backend-driven)

Adapt header shape to the backend. Do not hardcode one vendor.

```ts
// src/shared/api/interceptors/request/authInterceptor.ts
import type { InternalAxiosRequestConfig } from 'axios'

import { getToken } from '@/shared/api/token'

import type { RequestInterceptorModule } from '../../types'

export const interceptorType: RequestInterceptorModule['interceptorType'] = ['private', 'fileUpload']

export const onFulfilled = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const token = getToken()
  if (config.headers && token) {
    // Choose ONE pattern for the project:
    config.headers.Authorization = `Bearer ${token}`
    // config.headers['X-Api-Key'] = token
  }
  return config
}
```

**Cookie session:** set `withCredentials: true` on the axios instance and skip Bearer header unless the backend also expects one.

---

## Token Storage

```ts
// src/shared/api/token.ts
const TOKEN_KEY = 'auth_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export async function fetchNewToken(): Promise<void> {
  // Call backend refresh endpoint — implement per project auth API
  // setToken(newToken)
}
```

For HttpOnly cookies, token helpers may be no-ops; auth is handled by the browser + `withCredentials`.

---

## Token Refresh on 401 (private client)

```ts
// src/shared/api/interceptors/response/tokenRefreshInterceptor.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { privateClient } from '@/shared/api/clients/privateClient'
import { fetchNewToken, removeToken } from '@/shared/api/token'

import type { ResponseInterceptorModule } from '../../types'

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const interceptorType: ResponseInterceptorModule['interceptorType'] = ['private']

export const onRejected = async (error: AxiosError) => {
  const originalRequest = error.config as RetryConfig | undefined

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      await fetchNewToken()
      return privateClient.request(originalRequest)
    } catch {
      removeToken()
      // Optional: redirect to login via router event bus or window.location
    }
  }

  return Promise.reject(error)
}
```

Only enable refresh when the backend supports it. Skip this interceptor for API-key-only auth.

---

## Error Interceptor

```ts
// src/shared/api/interceptors/response/errorInterceptor.ts
import type { AxiosError } from 'axios'

import { toApiError } from '@/shared/api/errors'

import type { ResponseInterceptorModule } from '../../types'

export const interceptorType: ResponseInterceptorModule['interceptorType'] = ['private', 'public', 'fileUpload']

export const onRejected = (error: AxiosError) => {
  const apiError = toApiError(error)
  // Dev-only logging; use toast/sonner in UI layer when displaying to users
  if (import.meta.env.DEV) {
    console.error('[API]', apiError.status, apiError.message)
  }
  return Promise.reject(apiError)
}
```

```ts
// src/shared/api/errors.ts
import type { AxiosError } from 'axios'

export type ApiError = {
  status: number | null
  message: string
  code?: string
  details?: unknown
}

export function toApiError(error: AxiosError): ApiError {
  if (error.response) {
    const data = error.response.data as { message?: string; code?: string } | undefined
    return {
      status: error.response.status,
      message: data?.message ?? error.message,
      code: data?.code,
      details: error.response.data,
    }
  }

  if (error.request) {
    return { status: null, message: 'No response from server' }
  }

  return { status: null, message: error.message }
}
```

Features and Query hooks handle `ApiError` for user-facing messages — not raw axios errors.

---

## Logger Interceptor (development)

```ts
// src/shared/api/interceptors/response/loggerInterceptor.ts
import type { AxiosResponse } from 'axios'

import type { ResponseInterceptorModule } from '../../types'

export const interceptorType: ResponseInterceptorModule['interceptorType'] = ['private', 'public']

export const onFulfilled = (response: AxiosResponse) => {
  if (import.meta.env.DEV) {
    console.info('[API]', response.config.method?.toUpperCase(), response.config.url, response.status)
  }
  return response
}
```

---

## Feature API Usage

Feature modules stay thin — parse with Zod, use shared client:

```ts
// src/features/orders/api/orders.api.ts
import { httpClient } from '@/shared/api/clients/privateClient'

import { orderListSchema, type Order } from '../types/order.schema'

export async function getOrders(): Promise<Order[]> {
  const response = await httpClient.get('/orders')
  return orderListSchema.parse(response.data)
}
```

```ts
// src/features/auth/api/login.api.ts
import publicClient from '@/shared/api/clients/publicClient'

import { loginResponseSchema } from '../types/auth.schema'

export async function login(email: string, password: string) {
  const response = await publicClient.post('/auth/login', { email, password })
  return loginResponseSchema.parse(response.data)
}
```

---

## Rules

1. **Only `shared/api/clients/`** creates axios instances.
2. **Base URL from `appConfig`** — never hardcode environment URLs.
3. **Interceptors are composable files** — one concern per file.
4. **Auth shape is project-specific** — Bearer, API key, or cookies; document in `features/auth`.
5. **Normalize errors to `ApiError`** before they reach UI hooks.
6. **Do not parse JSON with Zod inside interceptors** — that belongs in feature `*.api.ts`.
7. **Register order matters** — request: auth first; response: logger → refresh → error (adjust if needed).

---

## Adding Interceptors — Checklist

1. Create file under `interceptors/request/` or `interceptors/response/`.
2. Export `interceptorType` array with target client(s).
3. Export `onFulfilled` and/or `onRejected`.
4. Restart dev server if glob cache causes missing registration (rare).
5. Add unit test mocking axios adapter or mock client in `tests/shared/api/`.

---

## Testing

Mock at feature API boundary (preferred) or axios instance:

```ts
vi.mock('@/shared/api/clients/privateClient', () => ({
  httpClient: { get: vi.fn(), post: vi.fn() },
}))
```

For interceptor unit tests, use axios `adapter` mock or `msw` — see `react-unit-testing`.

---

## Gotchas

- **`errorInterceptor` returning `error.response` instead of `Promise.reject`** — breaks axios error handling (template quirk); always reject normalized errors.
- **Refresh interceptor infinite loop** — guard with `_retry` flag.
- **Multipart + JSON Content-Type** — file upload client must not force `application/json`.
- **Token in localStorage** — acceptable for SPA bearer tokens; prefer HttpOnly cookies when backend supports BFF pattern.
- **Multiple base URLs** — add second client + `appConfig` section, not query-string hacks.
