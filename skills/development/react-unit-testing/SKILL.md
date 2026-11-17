---
name: react-unit-testing
description: >
  Unit and component testing for React + TypeScript + Vite apps using Vitest, Testing Library,
  and jsdom. Use when writing, reviewing, or debugging frontend tests, test setup, mocks,
  coverage, or CI test commands. Trigger on phrases like "unit test", "component test", "vitest",
  "testing library", "RTL", "mock router", "QueryClientProvider test", "test coverage",
  "vitest.setup", or adding tests for React components, hooks, or API modules.
---

# Unit Testing Skill (React + TypeScript + Vite)

You write **unit and component tests** for React apps using **Vitest**, **@testing-library/react**, **@testing-library/jest-dom**, and **jsdom**. Follow the **reference React template** conventions unless the target repo documents a deliberate difference.

**PREREQUISITES:** Load these skills first:
- `react-architecture` — source layout; tests mirror `src/`
- `react-code-style` — naming and import conventions
- `react-typescript` — typed mocks and test data

**RELATED SKILLS:**
- `react-configuration` — mock `appConfig` instead of env vars in tests
- `react-api-client` — mock `httpClient` in tests
- `react-data-fetching` — test Query hooks with `createQueryWrapper`

**Reference implementation:** reference React template (Vitest 4, jsdom, root `tests/` folder, `tests/vitest.setup.ts`).

---

## Tooling

| Package | Role |
|---------|------|
| `vitest` | Test runner (Vite-native) |
| `jsdom` | DOM environment |
| `@testing-library/react` | Render components; user-centric queries |
| `@testing-library/jest-dom` | Matchers (`toBeInTheDocument`, `toHaveClass`, …) |
| `@vitest/coverage-istanbul` | Coverage (optional) |
| `msw` | Dev mocking and optional HTTP integration tests |

**Scripts (template standard):**

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest run --coverage",
  "check:test": "tsc --build --noEmit tsconfig.test.json"
}
```

Run tests in CI via `prepush` or pipeline: `pnpm test` after typecheck and lint.

---

## Folder Structure

Tests live in a **root `tests/` folder** that mirrors `src/` — not colocated inside `src/features/`.

```
tests/
  vitest.setup.ts                 → Global setup (jest-dom, polyfills, global mocks)
  testUtils/                      → Shared render wrappers (QueryClient, i18n, router)
  __mocks__/                      → Reusable mock modules (Typography, router, UI primitives)
  features/
    orders/
      components/
        OrderTable.test.tsx       → mirrors src/features/orders/components/OrderTable.tsx
      hooks/
        useOrders.test.ts
  shared/
    lib/
      formatCurrency.test.ts
  components/                     → (legacy template paths) mirrors src/components/ when present
  translations/
    testUtils.tsx                 → i18n test helpers when app uses react-i18next
```

**Mapping rule:**

```
src/features/orders/pages/OrdersPage.tsx
  → tests/features/orders/pages/OrdersPage.test.tsx

src/shared/lib/cn.ts
  → tests/shared/lib/cn.test.ts
```

Import source under test with `@/`:

```tsx
import { OrderTable } from '@/features/orders/components/OrderTable'
```

---

## Vitest Configuration

Configure in `vite.config.ts` (template pattern):

```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './tests/vitest.setup.ts',
  pool: 'forks',
  reporters: ['verbose'],
  coverage: {
    provider: 'istanbul',
    reporter: ['text', 'html'],
    include: ['src'],
    exclude: [
      'src/main.tsx',
      'src/routeTree.gen.ts',
      'src/**/*.d.ts',
    ],
    thresholds: {
      branches: 1,
      functions: 1,
      lines: 30,
      statements: 30,
    },
  },
},
```

`tsconfig.json` must include tests and Vitest types:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom", "vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx"]
}
```

Use `tsconfig.test.json` extending the base config when typecheck splits app vs test builds.

---

## Global Setup (`tests/vitest.setup.ts`)

```ts
import '@testing-library/jest-dom/vitest'
import { beforeAll, vi } from 'vitest'

beforeAll(() => {
  // localStorage mock (template pattern)
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      key: (index: number) => [...storage.keys()][index] ?? null,
      get length() {
        return storage.size
      },
    },
  })

  // Global i18n passthrough when app uses react-i18next (optional)
  vi.mock('@/i18n', () => ({
    default: { t: (key: string) => key },
  }))
})
```

Add polyfills in setup or per-file `beforeAll` when components need them:

- `ResizeObserver` (cmdk, popover, charts)
- `Element.prototype.scrollIntoView`
- `window.matchMedia` (responsive layout tests)

---

## Test File Conventions

| Rule | Detail |
|------|--------|
| File name | `ComponentName.test.tsx` or `useOrders.test.ts` |
| Location | `tests/` mirroring `src/` path |
| Structure | `describe` → `it` blocks; one behavior per `it` |
| Imports | `describe`, `it`, `expect`, `vi`, `beforeEach` from `vitest` |
| Assertions | Prefer `@testing-library/jest-dom` matchers |
| Async | `findBy*` + `waitFor`; wrap i18n language changes in `act` |

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { NavigationLinks } from '@/features/navigation/components/NavigationLinks'

describe('NavigationLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all navigation items', () => {
    render(<NavigationLinks items={mockItems} activeItem="/" />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
```

---

## Query Priority (Testing Library)

Prefer queries in this order:

1. **`getByRole`** — accessible name (`button`, `option`, `alert`)
2. **`getByLabelText`** — form fields
3. **`getByPlaceholderText`** / **`getByText`** — when role/label unavailable
4. **`getByTestId`** — last resort; use `data-testid` sparingly for non-semantic nodes

Use **`findBy*`** when UI appears asynchronously. Use **`queryBy*`** only to assert absence.

Avoid testing implementation details (internal state, private functions, CSS module class strings unless asserting visible behavior).

---

## Render Wrappers

### TanStack Query

Create a fresh `QueryClient` per test to avoid cache leakage:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

export function renderWithQuery(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: createQueryWrapper(), ...options })
}
```

Place shared helpers in `tests/testUtils/render.tsx`.

### react-i18next (when used)

Follow template `tests/translations/testUtils.tsx`:

```tsx
import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'

const i18n = i18next.createInstance()
await i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: { hello: 'Hello' } } },
})

export function createI18nWrapper(ui: ReactElement) {
  return <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
}
```

Compose Query + i18n wrappers when both are required.

---

## Mocking

### Module mocks (`vi.mock`)

Place at **top of test file** (hoisted). Prefer partial mocks:

```tsx
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    useRouter: () => ({
      navigate: vi.fn(),
      state: { location: { pathname: '/' } },
    }),
    Link: ({ children, ...props }: { children: ReactNode; to: string }) => (
      <a {...props}>{children}</a>
    ),
  }
})
```

### Shared mocks (`tests/__mocks__/`)

Reusable mock components (Typography, Button, heavy UI) live under `tests/__mocks__/`. Export helper functions that call `vi.mock` when the template uses that pattern.

### Child features / dialogs

Mock sibling modules to isolate the unit under test:

```tsx
vi.mock('@/features/auth/components/LogoutDialog', () => ({
  LogoutDialog: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? <button onClick={onClose}>Close</button> : null,
}))
```

### API and axios

**Prefer** mocking the feature API module or `vi.mock('@/shared/api/httpClient')` — matches template unit tests.

```ts
vi.mock('@/features/orders/api/orders.api', () => ({
  getOrders: vi.fn().mockResolvedValue([{ id: '1', total: 100 }]),
}))
```

Use **MSW** (`setupServer` from `msw/node`) only for integration-style tests that exercise real fetch/axios through handlers — keep handlers in `tests/msw/handlers.ts`.

Never call real backend URLs in unit tests.

### Config

Mock `@/config/config` when components read `appConfig`:

```ts
vi.mock('@/config/config', () => ({
  appConfig: {
    api: { baseUrl: 'http://localhost:3000' },
    features: { analytics: false },
  },
}))
```

---

## What to Test

| Layer | Test focus | Typical location |
|-------|------------|------------------|
| Pure utils | Input/output, edge cases | `tests/shared/lib/*.test.ts` |
| Zod schemas | Valid/invalid payloads | `tests/features/*/types/*.test.ts` |
| API functions | Parsing, error mapping (mocked axios) | `tests/features/*/api/*.test.ts` |
| Hooks | Return value and side effects with `renderHook` | `tests/features/*/hooks/*.test.ts` |
| Components | User-visible behavior, interactions | `tests/features/*/components/*.test.tsx` |
| Pages | Composition smoke + critical flows (keep shallow) | `tests/features/*/pages/*.test.tsx` |

**Do not** unit-test:

- Generated files (`routeTree.gen.ts`)
- Third-party library internals
- Trivial pass-through wrappers with no logic

---

## Hook Testing

```ts
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useOrders } from '@/features/orders/hooks/useOrders'

vi.mock('@/features/orders/api/orders.api', () => ({
  getOrders: vi.fn().mockResolvedValue([]),
}))

describe('useOrders', () => {
  it('returns orders from the API', async () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: createQueryWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
```

---

## Interaction Patterns

```tsx
// Click
fireEvent.click(screen.getByRole('button', { name: 'Save' }))

// Type
fireEvent.change(screen.getByLabelText('Email'), {
  target: { value: 'user@example.com' },
})

// Async UI
const option = await screen.findByRole('option', { name: /Germany/ })
fireEvent.click(option)

await waitFor(() => {
  expect(handleChange).toHaveBeenCalledWith('+4912345')
})
```

Prefer **`userEvent`** from `@testing-library/user-event` in new tests when the project already includes it; template tests use `fireEvent` — match the repo.

---

## Adding a New Test — Checklist

1. Mirror `src/` path under `tests/` with `*.test.tsx` or `*.test.ts`.
2. Import the unit under test via `@/`.
3. Add render wrapper(s): QueryClient, i18n, router mocks as needed.
4. Mock external modules (router, dialogs, API) — not the unit under test.
5. Use role/text queries first; `data-testid` only when necessary.
6. Clear mocks in `beforeEach` (`vi.clearAllMocks()`).
7. Run `pnpm test` and `pnpm check:test`.
8. Add polyfills if jsdom throws (ResizeObserver, matchMedia).

---

## Gotchas

- **Shared QueryClient across tests** — stale cache causes flaky failures; create per test.
- **`vi.mock` after imports** — mocks are hoisted; define before imports conceptually.
- **Testing Tailwind classes** — assert user-visible outcomes; class checks are acceptable in template for active-state styling but avoid brittle full class strings.
- **Global i18n mock in setup vs real i18n in test** — use real i18n instance when testing translations; use passthrough mock for unrelated component tests.
- **Async without `await`/`waitFor`** — causes race failures in CI.
- **Colocating tests in `src/`** — not the template standard; use root `tests/`.
