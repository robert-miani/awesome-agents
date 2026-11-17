# React Unit Testing

## Description

Unit and component testing guidance for React + TypeScript + Vite applications using Vitest, Testing Library, jest-dom, and jsdom. Follows **reference React template** conventions: root `tests/` folder mirroring `src/`, global setup, render wrappers, and module mocks.

## When to Use

- Writing or reviewing Vitest / Testing Library tests
- Setting up `vitest.setup.ts` or coverage
- Mocking TanStack Router, TanStack Query, i18n, or API modules
- Adding tests for components, hooks, utils, or API parsers
- Debugging flaky or failing frontend tests in CI

## Usage

Load after `react-architecture` and `react-code-style`. The skill provides:

- Tooling and npm scripts
- `tests/` folder layout mirroring `src/`
- Vitest + Vite configuration baseline
- Global setup and polyfill patterns
- Query priority and interaction examples
- QueryClient and i18n render wrappers
- Mocking patterns (router, API, config)
- Checklist for new tests

## Example

```
src/features/orders/components/OrderTable.tsx
tests/features/orders/components/OrderTable.test.tsx
```

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OrderTable } from '@/features/orders/components/OrderTable'

describe('OrderTable', () => {
  it('renders order rows', () => {
    render(<OrderTable orders={[{ id: '1', total: 99 }]} />)
    expect(screen.getByText('99')).toBeInTheDocument()
  })
})
```

## Requirements

- Vitest 4+
- jsdom
- @testing-library/react
- @testing-library/jest-dom
- React 18+
- TypeScript
- Recommended prerequisites: `react-architecture`, `react-code-style`, `react-typescript`
