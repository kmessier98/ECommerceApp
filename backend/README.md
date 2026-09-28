# ECommerceApp — Backend

API Web ASP.NET Core (.NET 10) avec EF Core 10 sur SQL Server, organisée en couches (Clean Architecture).

## Prérequis

- .NET SDK 10
- SQL Server (par défaut `localhost\SQLEXPRESS`)
- `dotnet-ef` : `dotnet tool install --global dotnet-ef`

## Configuration

La chaîne de connexion se trouve dans `ECommerceApp.Api/appsettings.json` :

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS; Database=ECommerceAppDb; Trusted_Connection=true; TrustServerCertificate=true;"
}
```

Adaptez-la à votre instance SQL Server.

## Commandes

À lancer depuis ce dossier `backend/` :

| Commande | Rôle |
| --- | --- |
| `dotnet build ECommerceApp.slnx` | Compiler la solution |
| `dotnet run --project ECommerceApp.Api --launch-profile https` | Lancer l'API sur `https://localhost:7203` |
| `dotnet ef database update --project ECommerceApp.Infrastructure --startup-project ECommerceApp.Api` | Appliquer les migrations |
| `dotnet ef migrations add <Nom> --project ECommerceApp.Infrastructure --startup-project ECommerceApp.Api --output-dir Data/Migrations` | Créer une migration |

En développement, la documentation de l'API est disponible sur `/swagger` (Swagger UI) et `/scalar` (Scalar).

Il n'y a pas encore de tests ni de linter côté backend.

## Architecture

Les dépendances vont vers l'intérieur :

```
Api  →  Application  →  Domain
 ↓          ↑
Infrastructure ─┘        Shared (contrat générique de repository)
```

- **`ECommerceApp.Api`** — contrôleurs minces (aucune logique métier) et `ExceptionHandlingMiddleware`. Les services et repositories sont enregistrés à la main dans `Program.cs`.
- **`ECommerceApp.Application`** — logique métier : `DTOs/`, `Services/` (implémentent `Interfaces/I*Service`), validateurs FluentValidation (`Validators/`), profil AutoMapper unique (`Mapping/MappingProfile`), exceptions métier (`Exceptions/`).
- **`ECommerceApp.Domain`** — entités POCO (`Entities/`), sans comportement. `Utilisateur` hérite de `IdentityUser<int>`.
- **`ECommerceApp.Infrastructure`** — `AppDbContext`, migrations et données initiales (`Data/`), repositories (`Repositories/`, accès aux données uniquement), et `Identity/AuthService` (inscription, connexion, déconnexion).
- **`ECommerceApp.Shared`** — `IGenericInterface<T>`, le contrat CRUD de base des repositories.

## Authentification

ASP.NET Core Identity avec authentification par cookie, sans rôles pour l'instant. La migration `AjoutAuthentification` crée la table `Utilisateur` (mots de passe hachés, jamais en clair) et les tables `AspNetUserClaims`, `AspNetUserLogins` et `AspNetUserTokens`.

| Méthode | Route | Accès | Réponse |
| --- | --- | --- | --- |
| `POST` | `/api/Auth/inscription` | public | 201 + utilisateur ; connecte aussitôt (pose le cookie) |
| `POST` | `/api/Auth/connexion` | public | 200 + utilisateur ; `resterConnecte: true` → cookie de 14 jours, sinon cookie de session |
| `POST` | `/api/Auth/deconnexion` | public | 204 ; supprime le cookie |
| `GET` | `/api/Auth/moi` | connecté | 200 + utilisateur courant, sinon 401 |

- **Cookie :** `EcommerceApp.Auth`, HttpOnly (illisible en JavaScript), Secure et SameSite Strict (protection contre le CSRF). Configuré dans `Program.cs` (`ConfigureApplicationCookie`).
- **Protéger un endpoint :** ajoutez `[Authorize]` au contrôleur ou à l'action. Dans l'action, l'id de l'utilisateur connecté se lit avec `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
- **Mot de passe :** 8 caractères minimum, une majuscule, un chiffre, un caractère spécial. Ces règles sont dans `InscriptionDtoValidator` **et** dans les options d'Identity de `Program.cs`, et doivent correspondre à celles du frontend.
- **Verrouillage :** 5 échecs de connexion bloquent le compte pendant 5 minutes.
- **Tester à la main :** passez par Swagger UI (`/swagger`). Le navigateur y conserve le cookie entre les requêtes, comme avec le frontend.

## Gestion des erreurs

Les services lèvent des exceptions typées ; ne les attrapez pas dans les contrôleurs. Le middleware les convertit en réponses HTTP au format `{ "errors": ["..."] }` :

| Exception | Statut |
| --- | --- |
| `ValidationException` (FluentValidation), `BusinessRuleException` | 400 |
| `UnauthorizedAppException` | 401 |
| `NotFoundException` | 404 |
| `ConflictException` | 409 |
| Toute autre exception (journalisée) | 500 |

Un appel à un endpoint `[Authorize]` sans cookie valide renvoie aussi un 401 au même format. Il ne vient pas du middleware, mais des événements du cookie configurés dans `Program.cs`.

## Ajouter une entité

`Test` est l'exemple complet à copier :

1. Entité dans `Domain/Entities`.
2. DTO (`XDto`, `CreateXDto`, `UpdateXDto`), validateurs et entrée dans `MappingProfile` (`Application`).
3. Interface de repository (`Application/Interfaces`) et implémentation (`Infrastructure/Repositories`).
4. Interface et implémentation du service (`Application`).
5. Contrôleur dans `Api/Controllers`.
6. Enregistrement dans `Program.cs` : `AddScoped<IXRepository, XRepository>()` et `AddScoped<IXService, XService>()`. Si vous l'oubliez, l'API plante au premier appel avec une erreur d'injection de dépendances.
7. Migration EF Core, puis `dotnet ef database update`.

## CORS

La politique `PermettreClient` autorise `http://localhost:5173`, cookies compris (`AllowCredentials`). Elle ne sert que si le frontend appelle l'API directement (via `VITE_API_BASE_URL`) au lieu de passer par le proxy Vite.
