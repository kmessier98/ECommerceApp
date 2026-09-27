# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

React 19 + TypeScript SPA (Vite 8, Tailwind CSS 4) for ECommerceApp. It talks to the .NET 10 Web API in `../backend`, which has its own `CLAUDE.md` describing the server-side architecture.

## Commands

Run from this `frontend/` folder:

- `npm run dev` — Vite dev server (proxies `/api` to the .NET API)
- `npm run build` — typecheck (`tsc -b`) then production build to `dist/`
- `npm run typecheck` — TypeScript only
- `npm run lint` — Oxlint (not ESLint)
- `npm run format` / `npm run format:check` — Prettier (no semicolons, single quotes, width 100, Tailwind class sorting)
- `npm test` — Vitest in watch mode; `npm run test:run` — single run
- Single test file: `npx vitest run src/lib/api-client.test.ts`; single test by name: `npx vitest run -t "returns undefined on 204"`

For end-to-end work the backend must be running: `dotnet run --project ECommerceApp.Api --launch-profile https` from `../backend` (serves `https://localhost:7203`).

## Environment

See `.env.example`. In dev, leave `VITE_API_BASE_URL` empty so requests go to relative `/api/...` and the Vite proxy (`vite.config.ts`) forwards them to `API_PROXY_TARGET` (default `https://localhost:7203`, self-signed cert accepted). This is why the backend needs no CORS setup in dev.

## Architecture

The `@/` alias maps to `src/` (defined in both `vite.config.ts` and `tsconfig.app.json` — keep them in sync).

- **`src/app/`** — composition root: `App.tsx` wraps `RouterProvider` in `AppProviders` (TanStack Query). `router.tsx` declares all routes under the shared `Layout`.
- **`src/features/<name>/`** — one folder per domain feature, each a vertical slice: `types.ts` (mirrors the backend DTOs in `ECommerceApp.Application/DTOs`), `api.ts` (TanStack Query hooks + a query-key factory), `components/`, and `index.ts` as the feature's public API. Import features only through `@/features/<name>`, never their internals. `tests` is the example feature matching the backend's `Test` entity — copy it when adding a new entity.
- **`src/lib/`** — `api-client.ts` is the single `fetch` wrapper; `query-client.ts` holds the global `QueryClient` config.
- **`src/shared/`** — cross-feature UI (`components/`), plus `hooks/` and `utils/` placeholders.
- **`src/test/`** — Vitest setup (jest-dom matchers, cleanup) and `renderWithProviders`, which wraps a component in a fresh `QueryClient` with retries disabled.

### Data fetching and errors

All server state goes through TanStack Query hooks in a feature's `api.ts`; mutations invalidate the feature's root query key on success. `zustand` is installed but not yet used — reserve it for client-only state, not server data.

`apiClient` throws `ApiError` (`status`, `errors: string[]`) for any non-2xx response. It normalizes the backend's `ExceptionHandlingMiddleware` shape `{ "errors": ["..."] }` as well as ASP.NET ProblemDetails validation errors. Components display errors by checking `error instanceof ApiError` and rendering `error.errors` (see `TestForm.tsx`). The global `QueryClient` does not retry 4xx `ApiError`s.

### Tests

Tests live next to the code (`*.test.ts(x)`) and run in jsdom. The API is mocked by stubbing the global `fetch` with `vi.stubGlobal` (and `vi.unstubAllGlobals()` in `afterEach`); there is no MSW.

## Conventions

UI text and backend field names are in French (e.g. `nom`); code identifiers and comments are in English.
