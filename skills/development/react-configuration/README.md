# React Configuration

## Description

Configuration guidance for React applications using typed config modules, Vite environment variables, schema validation, and runtime-safe configuration patterns. Covers `import.meta.env`, `VITE_` variables, feature flags, API URLs, auth configuration, analytics configuration, and runtime configuration.

This skill is intentionally restrictive. It enforces one consistent way of handling frontend configuration.

## When to Use

- Setting up React environment variables
- Creating a centralized config module
- Configuring API base URLs
- Working with Vite `.env` files
- Adding feature flags
- Validating configuration at startup
- Avoiding direct `import.meta.env` usage in components and services
- Preventing secrets from being exposed in frontend code

## Usage

Activate this skill when working with React configuration. It provides:

- Typed configuration object pattern
- Zod-based environment validation
- Centralized configuration access
- Environment variable conventions for Vite
- Runtime configuration patterns
- Forbidden and preferred patterns
- Rules: only `src/config/config.ts` reads `import.meta.env`
- Rules: never expose secrets in frontend configuration
- Rules: never hardcode environment-specific URLs

## Example

```ts
// src/config/config.ts
import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
});

const env = envSchema.parse(import.meta.env);

export const appConfig = {
  api: {
    baseUrl: env.VITE_API_BASE_URL,
  },
} as const;
```

```ts
// src/api/httpClient.ts
import { appConfig } from "@/config/config";

export const apiBaseUrl = appConfig.api.baseUrl;
```

## Requirements

- React
- TypeScript
- Vite
- zod
