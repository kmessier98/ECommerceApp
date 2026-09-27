# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ECommerceApp is a .NET 10 solution with an ASP.NET Core Web API backend using EF Core 10 against SQL Server. It was scaffolded from the same layered architecture as LibraryApp.

## Commands

Run these from the folder containing `ECommerceApp.slnx`:

- `dotnet build ECommerceApp.slnx` — build the whole solution
- `dotnet run --project ECommerceApp.Api --launch-profile https` — run the API (`https://localhost:7203`)

There is no test suite and no lint command configured.

EF Core migrations live in `ECommerceApp.Infrastructure/Data/Migrations`. Configure the connection string in `ECommerceApp.Api/appsettings.json` (`ConnectionStrings:DefaultConnection`) before running migrations against SQL Server:
- `dotnet ef migrations add <Name> --project ECommerceApp.Infrastructure --startup-project ECommerceApp.Api --output-dir Data/Migrations`
- `dotnet ef database update --project ECommerceApp.Infrastructure --startup-project ECommerceApp.Api`

In development, the API exposes Swagger UI (`/swagger`) and Scalar (`/scalar`) via OpenAPI.

## Architecture

Layered/Clean-Architecture style, with dependencies flowing inward:

- **`ECommerceApp.Api`** — ASP.NET Core Web API. Thin `Controllers/` that only call into `Application` services and return `ActionResult`s — no business logic here. `Middlewares/ExceptionHandlingMiddleware` centrally maps `Application.Exceptions` types to HTTP status codes.
- **`ECommerceApp.Application`** — business logic layer. `DTOs/` holds the request/response contracts (`XDto`, `CreateXDto`, `UpdateXDto`) exposed by the API. `Services/` implement `Interfaces/I*Service` (validate input, apply business rules, call repositories, map to DTOs via AutoMapper). `Validators/` are FluentValidation validators for DTOs, registered in `Program.cs` via `AddValidatorsFromAssembly`. `Mapping/MappingProfile` is the single AutoMapper profile for entity↔DTO mapping.
- **`ECommerceApp.Domain`** — POCO entities (`Entities/`) with EF Core `[Table(...)]` attributes, no behavior.
- **`ECommerceApp.Infrastructure`** — EF Core `Data/AppDbContext` and `Data/Migrations`, plus `Repositories/` implementing `Application.Interfaces/I*Repository` (pure data access, no business rules). Relations are configured with the Fluent API in `AppDbContext.OnModelCreating`; seed data goes in `SeedData`.
- **`ECommerceApp.Shared`** — `IGenericInterface<T>` (the base CRUD repository contract). DTOs live in `Application/DTOs`, not here: the frontend is React, so there is no C# client to share them with.

`Test` is the example entity generated with the project: a full vertical slice (entity → DTOs → validators → mapping → repository → service → controller) to copy when adding new entities.

### Error handling convention

Application-layer code throws typed exceptions from `ECommerceApp.Application.Exceptions` (`NotFoundException`, `ConflictException`, `BusinessRuleException`, `UnauthorizedAppException`, all deriving from abstract `AppException`) or lets FluentValidation's `ValidationException` propagate. Do not catch these in controllers — `ExceptionHandlingMiddleware` converts them to 404, 409, 400, 401 with a single JSON error shape `{ "errors": [ "..." ] }`. Follow this pattern for new business rules rather than returning ad-hoc error responses from controllers.
