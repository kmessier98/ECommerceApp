# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Full-stack e-commerce app split into two independent projects, each with its own detailed `CLAUDE.md`:

- **`backend/`** — .NET 10 ASP.NET Core Web API, layered architecture (Api / Application / Domain / Infrastructure / Shared), EF Core 10 on SQL Server. See `backend/CLAUDE.md`.
- **`frontend/`** — React 19 + TypeScript SPA (Vite, Tailwind CSS 4, TanStack Query, Vitest, Oxlint). See `frontend/CLAUDE.md`.
- **`docs/maquettes/`** — UI mockups (PNG) for the screens to build (e.g. `Catalogue.png`, `Navbar.png`). Consult them when implementing frontend pages.

## Running the full stack

1. Backend, from `backend/`: `dotnet run --project ECommerceApp.Api --launch-profile https` (serves `https://localhost:7203`; requires `ConnectionStrings:DefaultConnection` in `ECommerceApp.Api/appsettings.json` and an up-to-date database).
2. Frontend, from `frontend/`: `npm run dev` (`http://localhost:5173`).

In dev the frontend calls relative `/api/...` URLs and the Vite proxy forwards them to the API, so the frontend and the API share one origin and the auth cookie needs no setup. The backend also has a CORS policy (`PermettreClient`) allowing `http://localhost:5173` with credentials, used only if the frontend calls the API directly via `VITE_API_BASE_URL`. A 502 from `/api/...` in dev means the proxy cannot reach the API: it is not running, or was started with the `http` profile (port 5077) instead of `https`.

Only the frontend has tests and linting (`npm run test:run`, `npm run lint`, `npm run typecheck`); the backend has neither.

## Adding a feature end-to-end

`Test` is the reference vertical slice on both sides — copy it:

- **Backend:** entity (`Domain/Entities`) → DTOs + validators + `MappingProfile` entry (`Application`) → repository interface/implementation → service interface/implementation → controller → EF migration. Services and repositories are registered **manually** in `ECommerceApp.Api/Program.cs` (`AddScoped<IXService, XService>()` etc.); forgetting this causes a DI error at runtime.
- **Frontend:** `src/features/<name>/` with `types.ts` mirroring the backend DTOs, `api.ts` (query hooks + key factory), `components/`, `index.ts`, plus a route in `src/app/router.tsx`.

The API contract between the two is the DTO shape and the error shape `{ "errors": ["..."] }` produced by the backend's `ExceptionHandlingMiddleware`, which the frontend's `ApiError` relies on. Keep them in sync when changing either side.

## Authentication

Accounts use ASP.NET Core Identity with an HttpOnly auth cookie (`EcommerceApp.Auth`, SameSite Strict), not JWT: the browser sends the cookie on its own, so the frontend stores no token. No roles yet. Endpoints live in `AuthController` (`/api/auth`): `inscription` (creates the account and signs in), `connexion`, `deconnexion`, and `moi` (the current user, 401 when signed out).

- **Protecting an endpoint (the real security):** add `[Authorize]` to the controller or action. Unauthenticated calls get a 401 in the usual `{ "errors": [...] }` shape (from the cookie's `OnRedirectToLogin` event in `Program.cs`, not from the middleware).
- **Protecting a page (UX only):** nest its routes under `<RequireAuth />` in `src/app/router.tsx`. Signed-out visitors are sent to `/connexion?retour=<page>` and brought back after logging in. The account pages (`CompteLayout`: `/commandes`, `/compte/*`) are protected this way.
- **Password rules** are defined three times and must stay identical: `InscriptionDtoValidator` (backend), the Identity password options in `Program.cs`, and `REGLES_MOT_DE_PASSE` in `CreerComptePage.tsx` (8+ characters, an uppercase letter, a digit, a non-alphanumeric character; no lowercase rule).

## Conventions

UI text, domain/DTO field names, and some config names (e.g. the CORS policy) are in French; code identifiers and comments are in English.
