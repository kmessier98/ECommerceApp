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
│   ├── auth/         # Connexion, création de compte, utilisateur courant, RequireAuth
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

| Route | Page | Connexion requise |
| --- | --- | --- |
| `/connexion`, `/inscription` | Connexion, création de compte | |
| `/catalogue` | Catalogue | |
| `/panier` | Panier | |
| `/commandes` | Mes commandes | 🔒 |
| `/commandes/:numero/confirmation` | Confirmation de commande | |
| `/compte`, `/compte/adresses`, `/compte/paiement` | Espace compte (contenu à venir) | 🔒 |

Les maquettes sont dans `../docs/maquettes/`.

## Authentification

La connexion repose sur un cookie posé par l'API (voir le [README du backend](../backend/README.md#authentification)) : aucun jeton n'est stocké côté client.

- **Qui est connecté ?** `useUtilisateurCourant()` (depuis `@/features/auth`) renvoie `undefined` pendant le chargement, `null` pour un visiteur, ou l'`Utilisateur`. Testez-le par sa valeur de vérité (`utilisateur ? … : …`).
- **Connexion, inscription, déconnexion :** hooks `useConnexion`, `useInscription` et `useDeconnexion`. La déconnexion vide tout le cache TanStack Query, pour que les données d'un compte ne s'affichent jamais pour le suivant.
- **Protéger une page :** placez ses routes sous `<RequireAuth />` dans `src/app/router.tsx`. Un visiteur est redirigé vers `/connexion?retour=<page>` et y revient après s'être connecté. C'est du confort : la vraie protection est le `[Authorize]` de l'API.

## Appels API et erreurs

- Tout appel passe par `apiClient` (`src/lib/api-client.ts`). Il envoie les cookies (`credentials: 'include'`) et lève une `ApiError` (`status`, `errors: string[]`) pour toute réponse non-2xx.
- Les hooks TanStack Query de chaque feature sont dans son `api.ts`. Les mutations invalident la clé racine de la feature, ou écrivent directement la nouvelle valeur dans le cache (`setQueryData`) quand la réponse la contient déjà.
- Pour afficher une erreur : `messagesErreur(error)` renvoie les messages du backend, ou un message générique en français si le serveur est injoignable. Voir `BandeauErreur` dans `features/auth`.

## Ajouter une feature

En copiant `features/tests` :

1. `types.ts` qui reflète les DTO du backend.
2. `api.ts` avec les hooks de requête et la fabrique de clés.
3. `components/` et `index.ts` (API publique de la feature).
4. Une route dans `src/app/router.tsx`.

## Tests

Les tests sont à côté du code (`*.test.ts(x)`) et tournent dans jsdom. L'API est simulée en remplaçant le `fetch` global avec `vi.stubGlobal`. Utilisez `renderWithProviders` pour rendre un composant avec un `QueryClient` neuf. C'est obligatoire dès qu'il utilise un hook de requête, même indirectement : par exemple `CompteLayout`, dont la barre latérale lit l'utilisateur courant. Si le composant a besoin d'un routeur, placez-le à l'intérieur : `renderWithProviders(<MemoryRouter>…</MemoryRouter>)`.
