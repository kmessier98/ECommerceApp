// Public API of the panier feature: import from '@/features/panier', not from its internals.
export { PanierPage } from './components/PanierPage'
export { usePanier, useNombreArticles } from './store'
export type { LignePanier } from './types'
