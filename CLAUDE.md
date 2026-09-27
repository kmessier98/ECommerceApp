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

In dev the frontend calls relative `/api/...` URLs and the Vite proxy forwards them to the API. The backend also has a CORS policy (`PermettreClient`) allowing `http://localhost:5173`, used only if the frontend calls the API directly via `VITE_API_BASE_URL`.

Only the frontend has tests and linting (`npm run test:run`, `npm run lint`, `npm run typecheck`); the backend has neither.

## Adding a feature end-to-end

`Test` is the reference vertical slice on both sides — copy it:

- **Backend:** entity (`Domain/Entities`) → DTOs + validators + `MappingProfile` entry (`Application`) → repository interface/implementation → service interface/implementation → controller → EF migration. Services and repositories are registered **manually** in `ECommerceApp.Api/Program.cs` (`AddScoped<IXService, XService>()` etc.); forgetting this causes a DI error at runtime.
- **Frontend:** `src/features/<name>/` with `types.ts` mirroring the backend DTOs, `api.ts` (query hooks + key factory), `components/`, `index.ts`, plus a route in `src/app/router.tsx`.

The API contract between the two is the DTO shape and the error shape `{ "errors": ["..."] }` produced by the backend's `ExceptionHandlingMiddleware`, which the frontend's `ApiError` relies on. Keep them in sync when changing either side.

## Conventions

UI text, domain/DTO field names, and some config names (e.g. the CORS policy) are in French; code identifiers and comments are in English.
