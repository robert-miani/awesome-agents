# Files to copy from the reference React template

When scaffolding, copy these files from the **reference React template** (or create them from the contents below if you have no template repo) and adjust paths only where noted.

## Copy verbatim (then path tweaks if any)

| File | Notes |
|------|-------|
| `eslint.config.js` | Update shadcn UI path to `src/shared/components/ui/*.tsx` |
| `.prettierrc` | No changes |
| `knip.config.ts` | Ignore `src/routeTree.gen.ts` |
| `.husky/pre-push` | Node 25 + depcruise + lint-staged + test + check |
| `src/styles/index.css` | Tailwind 4 + shadcn CSS variables; keep as starter theme |

## ESLint shadcn path override

Replace duplicate `src/components/ui` blocks with:

```js
{
  files: ['src/shared/components/ui/*.tsx'],
  rules: {
    'unicorn/filename-case': [{ cases: { kebabCase: true } }],
  },
},
```

## styles/index.css

Template uses Tailwind 4 imports:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
```

Include shadcn `:root` / `.dark` CSS variables from template `src/styles/index.css` when shadcn=yes.

## Optional: MSW (when enabled)

From template:

- `src/data/api/msw/handlers.ts` → `src/shared/api/msw/handlers.ts`
- `src/data/api/msw/browser.ts` → `src/shared/api/msw/browser.ts`
- `public/mockServiceWorker.js` via `pnpm exec msw init public`

Dev-only bootstrap in `main.tsx`:

```tsx
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
  const { worker } = await import('@/shared/api/msw/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

Add `VITE_ENABLE_MSW=true` to `.env.local` only.

## Optional: i18n (when enabled)

From template:

- `src/translations/` → `src/shared/i18n/` (or keep `translations/` under shared)
- Wire `I18nextProvider` in `src/app/routes/__root.tsx`
- Add `tests/translations/testUtils.tsx` per `react-unit-testing`

## dependency-cruiser

Template uses CLI without a config file:

```bash
depcruise src --include-only "^src" --output-type err-long
```

Enforces no orphan/circular imports under `src/`.
