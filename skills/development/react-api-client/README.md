# React API Client

## Description

axios setup for React + Vite apps: public/private/upload clients, glob-registered interceptors, auth headers, 401 token refresh, and normalized `ApiError` types. Follows **reference React template** patterns under `src/shared/api/`.

## When to Use

- Creating or extending axios clients and interceptors
- Wiring Bearer token, API key, or cookie auth to requests
- Handling 401 refresh flows
- Normalizing API errors for TanStack Query hooks and UI

## Usage

Load with `react-architecture`, `react-configuration`, and `react-typescript`. Feature code in `features/*/api/` consumes clients from this skill — never creates axios instances.

## Example

```
src/shared/api/
  clients/privateClient.ts
  interceptors/request/authInterceptor.ts
  interceptors/response/tokenRefreshInterceptor.ts
  registerInterceptors.ts
```

```ts
import { httpClient } from '@/shared/api/clients/privateClient'

const response = await httpClient.get('/orders')
```

## Requirements

- axios
- `appConfig` from `react-configuration`
- Prerequisites: `react-architecture`, `react-configuration`, `react-typescript`
