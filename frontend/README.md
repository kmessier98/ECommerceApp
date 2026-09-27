# ECommerceApp — Frontend

SPA React 19 + TypeScript construite avec Vite 8 et Tailwind CSS 4. Les données serveur passent par TanStack Query, l'état client (le panier) par Zustand.

## Prérequis

- Node.js 24+ et npm
- L'API du dossier `../backend` en cours d'exécution pour les appels réels (voir [son README](../backend/README.md))

## Démarrage

```bash
npm install
npm run dev   # http://localhost:5173
```

## Variables d'environnement

Copiez `.env.example` vers `.env` si besoin :

| Variable | Rôle |
| --- | --- |
| `VITE_API_BASE_URL` | Préfixe des appels API. Laissez vide en dev pour passer par le proxy Vite. |
| `API_PROXY_TARGET` | Cible du proxy `/api` (par défaut `https://localhost:7203`, certificat auto-signé accepté). |

## Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | Servir le build de production |
| `npm run typecheck` | Vérification TypeScript seule |
| `npm run lint` | Oxlint |
| `npm run format` / `npm run format:check` | Prettier (avec tri des classes Tailwind) |
| `npm test` / `npm run test:run` | Vitest, en mode watch ou en exécution unique |

Pour lancer un seul fichier de test : `npx vitest run src/lib/api-client.test.ts`.

## Structure

```
src/
├── app/          # Point d'entrée : providers, router (router.tsx)
├── features/     # Une tranche verticale par domaine
│   ├── auth/         # Connexion, création de compte
│   ├── catalogue/    # Liste des produits et filtres
│   ├── panier/       # Panier (store Zustand)
│   ├── commandes/    # Mes commandes, confirmation
│   └── tests/        # Exemple de référence lié à l'entité Test du backend
├── lib/          # api-client (wrapper fetch + ApiError), QueryClient
├── shared/       # Composants, hooks et utilitaires transverses
└── test/         # Configuration Vitest et renderWithProviders
```

L'alias `@/` pointe vers `src/`. Importez une feature uniquement via `@/features/<nom>` (son `index.ts`), jamais ses fichiers internes.

Le catalogue, le panier et les commandes utilisent pour l'instant des données fictives (`mock-*.ts`), en attendant les endpoints correspondants côté backend.

## Pages

| Route | Page |
| --- | --- |
| `/connexion`, `/inscription` | Connexion, création de compte |
| `/catalogue` | Catalogue |
| `/panier` | Panier |
| `/commandes` | Mes commandes |
| `/commandes/:numero/confirmation` | Confirmation de commande |
| `/compte`, `/compte/adresses`, `/compte/paiement` | Espace compte (à venir) |

Les maquettes sont dans `../docs/maquettes/`.

## Appels API et erreurs

- Tout appel passe par `apiClient` (`src/lib/api-client.ts`), qui lève une `ApiError` (`status`, `errors: string[]`) pour toute réponse non-2xx.
- Les hooks TanStack Query de chaque feature sont dans son `api.ts` ; les mutations invalident la clé racine de la feature.
- Pour afficher une erreur : `error instanceof ApiError` puis rendre `error.errors` (voir `TestForm.tsx`).

## Ajouter une feature

En copiant `features/tests` :

1. `types.ts` qui reflète les DTO du backend.
2. `api.ts` avec les hooks de requête et la fabrique de clés.
3. `components/` et `index.ts` (API publique de la feature).
4. Une route dans `src/app/router.tsx`.

## Tests

Les tests sont à côté du code (`*.test.ts(x)`) et tournent dans jsdom. L'API est simulée en remplaçant le `fetch` global avec `vi.stubGlobal`. Utilisez `renderWithProviders` pour rendre un composant avec un `QueryClient` neuf.
