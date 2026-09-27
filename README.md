# ECommerceApp

Application e-commerce full-stack : une API .NET 10 et une SPA React 19.

| Dossier     | Contenu                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------- |
| `backend/`  | API ASP.NET Core (.NET 10), architecture en couches, EF Core 10 sur SQL Server — [README](backend/README.md) |
| `frontend/` | SPA React 19 + TypeScript (Vite, Tailwind CSS 4, TanStack Query) — [README](frontend/README.md) |
| `docs/maquettes/` | Maquettes des écrans à réaliser (catalogue, panier, connexion, commandes…)            |
| `docs/database/`  | Lien vers le schéma de la base de données (dbdiagram.io)                              |

## Prérequis

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 24+ et npm
- SQL Server (par défaut `localhost\SQLEXPRESS`)
- L'outil EF Core : `dotnet tool install --global dotnet-ef`

## Démarrage rapide

```bash
# 1. Base de données (depuis backend/)
dotnet ef database update --project ECommerceApp.Infrastructure --startup-project ECommerceApp.Api

# 2. API (depuis backend/) → https://localhost:7203
dotnet run --project ECommerceApp.Api --launch-profile https

# 3. Frontend (depuis frontend/, dans un autre terminal) → http://localhost:5173
npm install
npm run dev
```

En développement, le frontend appelle des URL relatives `/api/...` que le proxy Vite redirige vers l'API : aucune configuration CORS n'est nécessaire.

## Contrat entre frontend et backend

- Les types TypeScript de chaque feature (`frontend/src/features/<nom>/types.ts`) reflètent les DTO du backend (`backend/ECommerceApp.Application/DTOs`).
- Toutes les erreurs de l'API ont la forme `{ "errors": ["..."] }` ; le frontend les expose via `ApiError`.

Toute modification d'un côté doit être répercutée de l'autre.

## Ajouter une fonctionnalité

L'entité `Test` est la tranche verticale d'exemple, des deux côtés : copiez-la. Les étapes détaillées sont dans les README de [`backend/`](backend/README.md#ajouter-une-entité) et de [`frontend/`](frontend/README.md#ajouter-une-feature).

## Conventions

Les textes de l'interface, les noms de champs des DTO et certains noms de configuration sont en français ; les identifiants de code et les commentaires sont en anglais.
