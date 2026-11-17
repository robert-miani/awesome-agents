# TypeScript

## Description

Restrictive TypeScript guidance for writing safer, stricter, and more maintainable code. Covers strict typing, type aliases, interfaces, generics, discriminated unions, utility types, type guards, React props, API response typing, runtime validation, and avoiding unsafe TypeScript patterns.

## When to Use

- Writing or refactoring TypeScript code
- Removing `any`
- Creating reusable domain types
- Typing React props, hooks, and components
- Typing API responses
- Designing discriminated unions
- Writing type guards
- Improving `tsconfig.json`
- Using TypeScript utility types
- Working with generics
- Validating external data

## Usage

Activate this skill when working with TypeScript. It provides:

- Strict TypeScript conventions
- Forbidden and preferred patterns
- Rules for avoiding `any`
- Rules for using `unknown`
- Guidelines for `type` vs `interface`
- Discriminated union examples
- Type guard examples
- Generic function examples
- React typing examples
- Runtime validation guidance
- API response typing rules

## Example

```ts
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function getMessage<T>(state: RequestState<T>) {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading...";
    case "success":
      return "Loaded";
    case "error":
      return state.error;
  }
}
```

```ts
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof userSchema>;

const data: unknown = await response.json();
const user = userSchema.parse(data);
```

## Requirements

- TypeScript
- `strict: true`
- Recommended: `zod` for runtime validation
