// Public API of the commandes feature: import from '@/features/commandes', not from its internals.
export { CommandesPage } from './components/CommandesPage'
export { ConfirmationPage } from './components/ConfirmationPage'
export { useCommandes, usePasserCommande } from './api'
export type { Commande, StatutCommande } from './types'
