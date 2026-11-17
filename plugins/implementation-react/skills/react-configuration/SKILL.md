---
name: react-configuration
description: >
  Expert guidance for configuration in React applications using environment variables,
  typed config objects, schema validation, and runtime-safe access patterns. Use this skill
  whenever the user is setting up React app configuration, environment variables, Vite env files,
  feature flags, API base URLs, authentication config, analytics config, or build-time/runtime
  configuration. Trigger on phrases like "VITE_", "import.meta.env", "process.env",
  "env variables", "React config", "API URL", "feature flags", "environment config",
  "runtime config", or any question about how to read or structure config in a React project.
  Components and services must never read environment variables directly.
---

# Configuration Skill (React)

React configuration must be centralized, typed, validated, and accessed only through a dedicated config module.

This skill is intentionally restrictive. It should enforce one team-wide way of handling frontend configuration.

**RELATED SKILLS:**
- `react-architecture` — `config/` placement and import boundaries
- `react-code-style` — no env access outside `config/`
- `react-typescript` — Zod schemas and inferred types
- `react-api-client` — mock `httpClient` in tests
- `react-unit-testing` — mock `appConfig` in tests

---

## Guiding Principles

1. **Centralize config access** — only `src/config/config.ts` may access `import.meta.env`.
2. **Validate config at startup** — fail fast when required values are missing or invalid.
3. **Never read env variables inside components** — components import typed config only.
4. **Never read env variables inside services** — services consume `appConfig`.
5. **Use build-time env vars for frontend-safe values only** — never expose secrets.
6. **Use explicit prefixes** — Vite exposes only variables prefixed with `VITE_`.
7. **Feature flags belong under `appConfig.features`**.
8. **API URLs must come from configuration** — never hardcode them.
9. **Configuration must be initialized before React renders**.
10. **Runtime config is allowed only when values must change without rebuilding**.

---

## Rules

1. Only `src/config/config.ts` may read `import.meta.env`.
2. `process.env` must not be used in React application code.
3. Every environment variable must be validated with Zod.
4. Every config value must be mapped into `appConfig`.
5. Components and services must import `appConfig`, not raw env variables.
6. `.env.example` must document all required variables.
7. Secrets must never be placed in `.env`, `.env.local`, or frontend config.
8. Public API keys are allowed only if they are intentionally browser-safe.
9. Feature flags must be booleans under `appConfig.features`.
10. Config values must be grouped by domain: `api`, `auth`, `features`, `analytics`, etc.

---

## Forbidden Patterns

```ts
// ❌ Do not read env variables in components
export function UsersPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
}
```

```ts
// ❌ Do not read env variables in services
export async function getUsers() {
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/users`);
}
```

```ts
// ❌ Do not use process.env in Vite React app code
const apiUrl = process.env.API_BASE_URL;
```

```ts
// ❌ Do not hardcode environment-specific URLs
const response = await fetch("https://api.production.example.com/users");
```

```ts
// ❌ Do not expose backend secrets
VITE_DATABASE_PASSWORD=secret
VITE_PRIVATE_API_KEY=secret
VITE_JWT_SIGNING_KEY=secret
```

---

## Preferred Pattern

```ts
// ✅ src/config/env.schema.ts
import { z } from "zod";

export const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_AUTH_DOMAIN: z.string().min(1),
  VITE_AUTH_CLIENT_ID: z.string().min(1),
  VITE_ENABLE_ANALYTICS: z.enum(["true", "false"]).default("false"),
});

export type EnvSchema = z.infer<typeof envSchema>;
```

```ts
// ✅ src/config/config.ts
import { envSchema } from "./env.schema";

const env = envSchema.parse(import.meta.env);

export const appConfig = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
  auth: {
    domain: env.VITE_AUTH_DOMAIN,
    clientId: env.VITE_AUTH_CLIENT_ID,
  },
  features: {
    analytics: env.VITE_ENABLE_ANALYTICS === "true",
  },
} as const;
```

```ts
// ✅ src/api/httpClient.ts
import { appConfig } from "@/config/config";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${appConfig.api.baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
```

```tsx
// ✅ src/features/analytics/AnalyticsProvider.tsx
import { appConfig } from "@/config/config";

export function AnalyticsProvider() {
  if (!appConfig.features.analytics) {
    return null;
  }

  return <script src="/analytics.js" />;
}
```

---

## Recommended Folder Structure

```text
src/
  config/
    env.schema.ts
    config.ts
    runtimeConfig.ts
```

---

## Configuration Priority

```text
Environment variables in hosting/CI
.env.production
.env.development
.env.local
.env
```

Anything exposed to React is visible in the browser bundle.

---

## Environment Files

```bash
# .env.example
VITE_API_BASE_URL=
VITE_AUTH_DOMAIN=
VITE_AUTH_CLIENT_ID=
VITE_ENABLE_ANALYTICS=false
```

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH_DOMAIN=dev-auth.example.com
VITE_AUTH_CLIENT_ID=local-client-id
VITE_ENABLE_ANALYTICS=false
```

```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH_DOMAIN=auth.example.com
VITE_AUTH_CLIENT_ID=prod-client-id
VITE_ENABLE_ANALYTICS=true
```

---

## Runtime Configuration

Use runtime configuration only when values must change without rebuilding the frontend.

```json
// public/config.json
{
  "apiBaseUrl": "https://api.example.com",
  "authDomain": "auth.example.com",
  "authClientId": "prod-client-id"
}
```

```ts
// src/config/runtimeConfig.ts
import { z } from "zod";

const runtimeConfigSchema = z.object({
  apiBaseUrl: z.string().url(),
  authDomain: z.string().min(1),
  authClientId: z.string().min(1),
});

export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const response = await fetch("/config.json");

  if (!response.ok) {
    throw new Error("Failed to load runtime config");
  }

  const data: unknown = await response.json();

  return runtimeConfigSchema.parse(data);
}
```

---

## Adding a New Config Value — Checklist

1. Add the variable to `.env.example`.
2. Add validation to `env.schema.ts`.
3. Add mapping to `config.ts`.
4. Group the value under the correct `appConfig` section.
5. Consume through `appConfig`.
6. Configure real values in CI/CD or hosting.
7. Confirm the value is safe to expose in the browser.
8. Never expose backend secrets, API secrets, private keys, JWT signing keys, or database credentials.
