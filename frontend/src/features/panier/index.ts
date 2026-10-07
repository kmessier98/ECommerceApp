// Public API of the panier feature: import from '@/features/panier', not from its internals.
export { PanierPage } from './components/PanierPage'
export { panierKeys, useAjouterArticle, usePanier } from './api'
export type { PanierDto, LignePanier, ResumePanier } from './types'
