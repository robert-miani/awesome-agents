---
name: react-typescript
description: >
  Expert guidance for TypeScript code quality, strict typing, reusable types, type safety,
  generics, type narrowing, discriminated unions, utility types, runtime validation, and avoiding
  unsafe patterns. Use this skill whenever the user is writing or refactoring TypeScript code,
  improving type safety, removing `any`, designing shared types, typing React props/hooks,
  typing API responses, configuring TypeScript strictness, or validating external data.
  Trigger on phrases like "TypeScript", "types", "interface", "type alias", "generic",
  "unknown", "any", "strict mode", "tsconfig", "utility types", "discriminated union",
  "type guard", "React props", "API response", or any question about how to type code safely.
---

# TypeScript Skill (React)

TypeScript must be used to make invalid states impossible, improve refactoring confidence, and keep runtime behavior aligned with compile-time types.

This skill is intentionally restrictive. It should enforce one team-wide style for safer TypeScript.

**RELATED SKILLS:**
- `react-architecture` — folder structure and feature boundaries
- `react-code-style` — component, hook, and import conventions
- `react-configuration` — typed config and env validation
- `react-api-client` — shared axios clients for API modules
- `react-unit-testing` — Vitest tests for typed components and schemas

---

## Guiding Principles

1. **Strict mode is mandatory**.
2. **`any` is forbidden** unless explicitly justified.
3. **Prefer `unknown` over `any`** for untrusted data.
4. **Validate external data at runtime** before trusting it.
5. **Prefer discriminated unions over boolean status flags**.
6. **Prefer string literal unions over enums**.
7. **Prefer `type` for most declarations**.
8. **Use `interface` only when extension or declaration merging is intentional**.
9. **Avoid type assertions** unless unavoidable.
10. **Keep business types close to the feature that owns them**.
11. **Export only types that are reused outside the module**.
12. **Prefer `readonly` for immutable domain data**.
13. **Do not over-engineer generics**.

---

## `tsconfig.json` Baseline

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Rules

1. `strict: true` is required.
2. New code must not introduce `any`.
3. Use `unknown` for API responses, localStorage, URL params, and external data.
4. Validate external data with Zod or a dedicated type guard.
5. Prefer `type` over `interface` unless extension is needed.
6. Use discriminated unions for async state and complex UI state.
7. Avoid optional fields when a union models the state better.
8. Avoid enums; use literal unions instead.
9. Avoid `as SomeType` for external data.
10. Use utility types to derive types instead of duplicating them.
11. Keep feature-specific types inside the feature folder.
12. Shared types must be genuinely reused by multiple modules.

---

## Forbidden Patterns

```ts
// ❌ Do not use any
const data: any = await response.json();
```

```ts
// ❌ Do not blindly assert API data
const user = (await response.json()) as User;
```

```ts
// ❌ Do not model state with unrelated booleans
type RequestState<T> = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data?: T;
  error?: string;
};
```

```ts
// ❌ Avoid enums
enum UserStatus {
  Active,
  Inactive,
}
```

```ts
// ❌ Avoid broad object types
function save(value: object) {
  // ...
}
```

```ts
// ❌ Avoid non-null assertions unless unavoidable
const user = users.find((x) => x.id === id)!;
```

---

## Preferred Patterns

```ts
// ✅ Use unknown for untrusted data
const data: unknown = await response.json();
```

```ts
// ✅ Validate external data
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

const user = userSchema.parse(data);
```

```ts
// ✅ Use literal unions instead of enums
type UserStatus = "active" | "inactive";
```

```ts
// ✅ Use discriminated unions for state
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

```ts
// ✅ Prefer readonly domain data
type User = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
};
```

---

## Type vs Interface

Prefer `type` by default.

```ts
type UserRole = "admin" | "manager" | "viewer";

type UserSummary = Pick<User, "id" | "name" | "email">;
```

Use `interface` only when extension is intentional.

```ts
interface BaseUser {
  id: string;
  name: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
}
```

---

## Type Guard Pattern

Use type guards when validation is simple and local.

```ts
type User = {
  readonly id: string;
  readonly name: string;
};

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value
  );
}
```

Use Zod when validating API responses or larger schemas.

---

## Generic Function Pattern

Use generics only when they preserve a useful relationship between input and output.

```ts
function getById<T extends { readonly id: string }>(
  items: readonly T[],
  id: string,
): T | undefined {
  return items.find((item) => item.id === id);
}
```

Avoid generics when a simple concrete type is clearer.

---

## React Props Pattern

```tsx
type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  readonly variant: ButtonVariant;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
};

export function Button({
  variant,
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

---

## API Response Pattern

Never trust API responses automatically.

```ts
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof userSchema>;

async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data: unknown = await response.json();

  return userSchema.parse(data);
}
```

---

## Utility Types

Use utility types to derive types instead of duplicating shapes.

```ts
type CreateUserRequest = Pick<User, "name" | "email">;

type UpdateUserRequest = Partial<Pick<User, "name" | "email">>;

type UserId = User["id"];
```

---

## Exhaustive Switch Pattern

```ts
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function getRequestMessage<T>(state: RequestState<T>): string {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return "Loading...";
    case "success":
      return "Loaded";
    case "error":
      return state.error;
    default:
      return assertNever(state);
  }
}
```

---

## Adding a New Type — Checklist

1. Define the type close to the feature that owns it.
2. Prefer `type` unless `interface` extension is needed.
3. Use a union when the value has limited valid options.
4. Use discriminated unions for state.
5. Avoid optional fields when a union is clearer.
6. Avoid `any`.
7. Use `unknown` for untrusted input.
8. Add runtime validation for API, localStorage, URL params, and external data.
9. Use `readonly` for immutable data.
10. Export only types that are reused outside the module.
