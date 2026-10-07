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

- **`src/app/`** — composition root: `App.tsx` wraps `RouterProvider` in `AppProviders` (TanStack Query). `router.tsx` declares the routes: `/connexion` and `/inscription` are full-screen pages outside the shared `Layout`; everything else is under it, and the account pages are also under `RequireAuth` and `CompteLayout`.
- **`src/features/<name>/`** — one folder per domain feature, each a vertical slice: `types.ts` (mirrors the backend DTOs in `ECommerceApp.Application/DTOs`), `api.ts` (TanStack Query hooks + a query-key factory), `components/`, and `index.ts` as the feature's public API. Import features only through `@/features/<name>`, never their internals. `tests` is the example feature matching the backend's `Test` entity — copy it when adding a new entity.
- **`src/lib/`** — `api-client.ts` is the single `fetch` wrapper; `query-client.ts` holds the global `QueryClient` config.
- **`src/shared/`** — cross-feature UI (`components/`: `Layout`, `Navbar`, `CompteLayout`, `CompteSidebar`…), `utils/format.ts` (`Intl` formatters for prices and dates, each created once at module level), and a `hooks/` placeholder.
- **`src/test/`** — Vitest setup (jest-dom matchers, cleanup) and `renderWithProviders`, which wraps a component in a fresh `QueryClient` with retries disabled.

### Data fetching and errors

All server state goes through TanStack Query hooks in a feature's `api.ts`. Mutations invalidate the feature's root query key on success, unless the response already holds the new value, in which case they write it with `setQueryData` (as the auth mutations and the cart mutations do). `staleTime` defaults to 30 s (`lib/query-client.ts`), so a cached value a mutation elsewhere has made wrong keeps showing for up to 30 s unless that mutation invalidates it. `zustand` is installed for client-only state, never server data, but nothing uses it at the moment.

`apiClient` sends every request with `credentials: 'include'`, so the auth cookie also goes along when the API is on another origin (`VITE_API_BASE_URL`). It throws `ApiError` (`status`, `errors: string[]`) for any non-2xx response. It normalizes the backend's `ExceptionHandlingMiddleware` shape `{ "errors": ["..."] }` as well as ASP.NET ProblemDetails validation errors. To display a query or mutation error, use `messagesErreur(error)` from `lib/api-client.ts`: it returns the backend's messages for an `ApiError`, and a generic French message for anything else (e.g. a network failure, whose English `error.message` must not reach the user). The global `QueryClient` does not retry 4xx `ApiError`s.

### Authentication (`features/auth`)

- `useUtilisateurCourant()` (`GET /api/auth/moi`, `staleTime: Infinity`) is the single source for "who is signed in". Its `data` is `undefined` while loading, `null` for a visitor (the 401 is turned into `null`, not an error), or a `Utilisateur`. Test it for truthiness (`utilisateur ? … : …`), never `!== null`, or the loading state is taken for a signed-in user.
- `useConnexion` and `useInscription` write the returned user into the cache and invalidate the cart query (`panierKeys.all`), because the backend has just merged the anonymous cart into the account. `useDeconnexion` calls `queryClient.clear()` (so the previous user's data never shows for the next one), then sets the user to `null`.
- `RequireAuth` is a layout route. It renders nothing while `isPending`: without that, a page reload would redirect signed-in users before `/moi` answers. It sends visitors to `/connexion?retour=<encoded path>`. It is only UX; the API's `[Authorize]` is the actual protection.
- After a login or sign-up, pages go to `destinationSure(searchParams.get('retour'))` (`redirection.ts`). It only accepts internal paths (starting with `/`, not `//` or `/\`) and falls back to `/catalogue`, which prevents open redirects. Navigate with `replace: true` so Back does not return to the form.

### Cart (`features/panier`)

The cart works for signed-out visitors too: `/panier` is not under `RequireAuth`, and adding a product from `ProduitCard` needs no account. The backend identifies an anonymous cart with its own HttpOnly cookie (`EcommerceApp.Panier`), so the frontend has nothing to store or send and uses the same hooks for everyone. `usePanier()` (exported from `@/features/panier`) feeds the Navbar count in `Layout` and the "Votre panier (N articles) est conservé" notice on `ConnexionPage`; read the count as `panier?.resumePanier?.nombreArticles ?? 0`, since `resumePanier` is `null` for an empty cart. The cart mutations write the returned `PanierDto` with `setQueryData`.

Because `ConnexionPage` loads the cart, its tests see a `GET /api/panier` before the login call: find calls by URL in `fetchMock.mock.calls`, not by index.
- Form errors are shown with `BandeauErreur` (`role="alert"`). Clear them when a field is edited, with `if (mutation.isError) mutation.reset()`: resetting a pending mutation would drop its `mutate(…, { onSuccess })` callback, and with it the redirect.

### Tests

Tests live next to the code (`*.test.ts(x)`) and run in jsdom. The API is mocked by stubbing the global `fetch` with `vi.stubGlobal` (and `vi.unstubAllGlobals()` in `afterEach`); there is no MSW. When a component may call `fetch` more than once, use `mockImplementation(() => Promise.resolve(new Response(...)))`: a `Response` body can only be read once, so `mockResolvedValue` with a single `Response` breaks on the second call.

Any component that uses a query or mutation hook, including indirectly (e.g. `CompteSidebar` inside `CompteLayout`), must be rendered with `renderWithProviders`. It takes no `wrapper` option, so put the router inside it: `renderWithProviders(<MemoryRouter>…</MemoryRouter>)`. To test redirects, build a `createMemoryRouter` with placeholder destination pages and assert which one renders, or read `router.state.location` (see `RequireAuth.test.tsx` and `ConnexionPage.test.tsx`).

## Conventions

UI text and backend field names are in French (e.g. `nom`); code identifiers and comments are in English.
