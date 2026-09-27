// Public API of the catalogue feature: import from '@/features/catalogue', not from its internals.
export { CataloguePage } from './components/CataloguePage'
export { useProduits } from './api'
export type { Produit, Categorie, Badge, Tri } from './types'
