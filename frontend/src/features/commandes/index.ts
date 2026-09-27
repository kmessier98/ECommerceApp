// Public API of the commandes feature: import from '@/features/commandes', not from its internals.
export { CommandesPage } from './components/CommandesPage'
export { useCommandes } from './api'
export type { Commande, ArticleCommande, StatutCommande } from './types'
