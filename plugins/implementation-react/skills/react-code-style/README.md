# React Code Style

## Description

React and TypeScript code style conventions for feature-based Vite applications: naming, imports, exports, components, hooks, pages, forms, Tailwind/shadcn usage, and axios API modules.

## When to Use

- Generating or reviewing React/TSX code
- Enforcing named exports, import order, and file naming
- Standardizing hooks, pages, and form patterns
- Code review on a React + TypeScript codebase

## Usage

Activate this skill alongside `react-architecture` and `react-typescript`. It provides:

- DO / DON'T rule tables
- Import ordering rules
- Component, hook, page, and form templates
- Tailwind and shadcn import conventions
- Review checklist

## Example

```tsx
type OrderRowProps = {
  id: string;
  total: number;
};

export function OrderRow({ id, total }: OrderRowProps) {
  return (
    <tr className="border-b">
      <td>{id}</td>
      <td>{total}</td>
    </tr>
  );
}
```

```ts
import { httpClient } from "@/shared/api/httpClient";

export async function getOrder(id: string) {
  const response = await httpClient.get(`/orders/${id}`);
  return orderSchema.parse(response.data);
}
```

## Requirements

- React 18+
- TypeScript with `strict: true`
- Recommended: `react-architecture`, `react-typescript`, TanStack Query, React Hook Form, Zod, axios, Tailwind CSS
