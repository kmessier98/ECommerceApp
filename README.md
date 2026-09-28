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

En développement, le frontend appelle des URL relatives `/api/...` que le proxy Vite redirige vers l'API. Le frontend et l'API ont donc la même origine : aucune configuration CORS n'est nécessaire, et le cookie de connexion fonctionne tout seul.

> Une erreur **502 Bad Gateway** sur `/api/...` signifie que le proxy n'arrive pas à joindre l'API : elle n'est pas démarrée, ou elle a été lancée avec le profil `http` (port 5077) au lieu de `https`.

## Comptes utilisateurs

Les visiteurs peuvent créer un compte, se connecter (avec l'option « Rester connecté ») et se déconnecter. L'authentification repose sur ASP.NET Core Identity et un **cookie HttpOnly** posé par l'API : le frontend ne stocke aucun jeton, le navigateur envoie le cookie tout seul. Il n'y a pas encore de rôles.

| Pour protéger… | Comment | Rôle |
| --- | --- | --- |
| un endpoint de l'API | `[Authorize]` sur le contrôleur ou l'action | La vraie sécurité : répond 401 sans cookie valide. |
| une page du frontend | placer ses routes sous `<RequireAuth />` dans `router.tsx` | Le confort : redirige vers `/connexion`, puis ramène à la page demandée. |

Les règles du mot de passe (8 caractères, une majuscule, un chiffre, un caractère spécial) sont définies des deux côtés et doivent rester identiques. Détails dans les README du [backend](backend/README.md#authentification) et du [frontend](frontend/README.md#authentification).

## Contrat entre frontend et backend

- Les types TypeScript de chaque feature (`frontend/src/features/<nom>/types.ts`) reflètent les DTO du backend (`backend/ECommerceApp.Application/DTOs`).
- Toutes les erreurs de l'API ont la forme `{ "errors": ["..."] }`, y compris le 401 renvoyé aux visiteurs non connectés ; le frontend les expose via `ApiError`.

Toute modification d'un côté doit être répercutée de l'autre.

## Ajouter une fonctionnalité

L'entité `Test` est la tranche verticale d'exemple, des deux côtés : copiez-la. Les étapes détaillées sont dans les README de [`backend/`](backend/README.md#ajouter-une-entité) et de [`frontend/`](frontend/README.md#ajouter-une-feature).

## Conventions

Les textes de l'interface, les noms de champs des DTO et certains noms de configuration sont en français ; les identifiants de code et les commentaires sont en anglais.
