# Scaffold — Key File Templates

Reference templates for the `react-scaffold` skill. For ESLint/CSS copies, see `template-files.md`.

## Key File Templates

### `.env.example`

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV_MODE=local
```

### `src/config/env.schema.ts`

```ts
import { z } from 'zod'

export const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_ENV_MODE: z.enum(['local', 'dev', 'production']).default('local'),
})

export type TEnvSchema = z.infer<typeof envSchema>
```

### `src/config/config.ts`

```ts
import { envSchema } from './env.schema'

const env = envSchema.parse(import.meta.env)

export const appConfig = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
  env: {
    mode: env.VITE_APP_ENV_MODE,
  },
} as const
```

### `src/shared/api/httpClient.ts`

Minimal single client for scaffold. For **public/private clients and interceptors**, apply **`react-api-client`** after scaffold.

```ts
import axios from 'axios'

import { appConfig } from '@/config/config'

export const httpClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})
```

### `src/shared/lib/utils.ts`

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `src/app/tanstackSetup.ts`

```ts
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'

import { routeTree } from '@/routeTree.gen'

export const tanstackRouter = createRouter({
  routeTree,
  notFoundMode: 'root',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tanstackRouter
  }
}

export const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: false,
    },
  },
})
```

### `src/app/App.tsx`

```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { tanstackQueryClient, tanstackRouter } from '@/app/tanstackSetup'

export function App() {
  return (
    <QueryClientProvider client={tanstackQueryClient}>
      <RouterProvider router={tanstackRouter} />
    </QueryClientProvider>
  )
}
```

### `src/main.tsx`

```tsx
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import '@/styles/index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement).render(<App />)
```

### `src/app/routes/__root.tsx`

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { StrictMode } from 'react'

function RootLayout() {
  return (
    <StrictMode>
      <Outlet />
    </StrictMode>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
```

### `src/app/routes/index.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '@/features/home'

export const Route = createFileRoute('/')({
  component: HomePage,
})
```

### `src/features/home/pages/HomePage.tsx`

```tsx
export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Home</h1>
    </main>
  )
}
```

### `src/features/home/index.ts`

```ts
export { HomePage } from './pages/HomePage'
```

### `vite.config.ts` (essentials)

```ts
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/app/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/vitest.setup.ts',
  },
})
```

### `tsconfig.json` (essentials)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "types": ["vitest/globals", "@testing-library/jest-dom", "vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx"]
}
```

### `tests/vitest.setup.ts`

Use the template from `react-unit-testing` (jest-dom + localStorage mock).

### `components.json` (when shadcn=yes)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/components/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  },
  "iconLibrary": "lucide"
}
```

After scaffold: `pnpm dlx shadcn@latest init` then add primitives (`button`, `input`, …) as needed.
