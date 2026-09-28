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
- **`ECommerceApp.Domain`** — POCO entities (`Entities/`) with EF Core `[Table(...)]` attributes, no behavior. The one exception is `Utilisateur`, which inherits `IdentityUser<int>` (hence the `Microsoft.Extensions.Identity.Stores` package here) so other entities can reference users by foreign key.
- **`ECommerceApp.Infrastructure`** — EF Core `Data/AppDbContext` and `Data/Migrations`, plus `Repositories/` implementing `Application.Interfaces/I*Repository` (pure data access, no business rules). Relations are configured with the Fluent API in `AppDbContext.OnModelCreating`; seed data goes in `SeedData`. `Identity/AuthService` implements `IAuthService`; it lives here rather than in `Application` because it uses ASP.NET Core's `SignInManager` (hence the `Microsoft.AspNetCore.App` framework reference).
- **`ECommerceApp.Shared`** — `IGenericInterface<T>` (the base CRUD repository contract). DTOs live in `Application/DTOs`, not here: the frontend is React, so there is no C# client to share them with.

`Test` is the example entity generated with the project: a full vertical slice (entity → DTOs → validators → mapping → repository → service → controller) to copy when adding new entities.

### Authentication

ASP.NET Core Identity with cookie authentication, no roles:

- **Data:** `AppDbContext` derives from `IdentityUserContext<Utilisateur, int>`, the Identity base class without role tables (switch to `IdentityDbContext<Utilisateur, IdentityRole<int>, int>` plus a migration when roles are needed). `OnModelCreating` must keep calling `base.OnModelCreating` first, then rename the user table with `ToTable("Utilisateur")`: Identity sets `AspNetUsers` with the Fluent API, which overrides the `[Table]` attribute. The other Identity tables keep their `AspNetUser*` names.
- **Service:** `AuthService` uses `UserManager` (create and find users, hash passwords) and `SignInManager` (check passwords, set or clear the cookie) directly, with no repository: `UserManager` already is the data-access layer for users. The user's email goes in both `UserName` and `Email`, and `UtilisateurDto.Courriel` is mapped from `Email`. Failed `IdentityResult`s are converted to a FluentValidation `ValidationException` (400). Wrong email and wrong password give the same `UnauthorizedAppException` message, so the API does not reveal which emails have accounts. Lockout is on (`lockoutOnFailure: true`).
- **`Program.cs`:** `AddIdentityCore<Utilisateur>(...).AddEntityFrameworkStores<AppDbContext>().AddSignInManager()`, `AddAuthentication(IdentityConstants.ApplicationScheme).AddIdentityCookies()`, and `ConfigureApplicationCookie` (HttpOnly, Secure, SameSite Strict, 14-day sliding expiration when "Rester connecté" is checked, a session cookie otherwise). The cookie's `OnRedirectToLogin` and `OnRedirectToAccessDenied` events return 401 and 403 in the `{ "errors": [...] }` shape instead of redirecting to an MVC login page. `app.UseAuthentication()` must come before `app.UseAuthorization()`. The Identity password options must match `InscriptionDtoValidator` (and the frontend's rules).
- **Controllers:** protect endpoints with `[Authorize]`. Read the current user's id with `int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!)` (see `AuthController.GetUtilisateurCourant`).

### Error handling convention

Application-layer code throws typed exceptions from `ECommerceApp.Application.Exceptions` (`NotFoundException`, `ConflictException`, `BusinessRuleException`, `UnauthorizedAppException`, all deriving from abstract `AppException`) or lets FluentValidation's `ValidationException` propagate. Do not catch these in controllers — `ExceptionHandlingMiddleware` converts them to 404, 409, 400, 401 with a single JSON error shape `{ "errors": [ "..." ] }`. Follow this pattern for new business rules rather than returning ad-hoc error responses from controllers. The one 401 that does not come from the middleware is the `[Authorize]` rejection, written by the auth cookie's events in `Program.cs` (see Authentication above).
