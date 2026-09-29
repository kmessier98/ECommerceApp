import type { Categorie, Produit, Tri } from './types'

export interface Filtres {
  categorie: Categorie | null
  prixMin: number
  prixMax: number
  enStockSeulement: boolean
  enPromotion: boolean
}

export const FILTRES_PAR_DEFAUT: Filtres = {
  categorie: null,
  prixMin: 0,
  prixMax: 200,
  enStockSeulement: false,
  enPromotion: false,
}

const comparateurs: Record<Tri, (a: Produit, b: Produit) => number> = {
  popularite: (a, b) => a.popularite - b.popularite,
  'prix-croissant': (a, b) => a.prix - b.prix,
  'prix-decroissant': (a, b) => b.prix - a.prix,
  nouveautes: (a, b) => b.dateAjout.localeCompare(a.dateAjout),
}

export function appliquerFiltres(produits: Produit[], f: Filtres, tri: Tri) {
  return produits
    .filter(
      (p) =>
        (!f.categorie?.id || p.categorie.id === f.categorie.id) &&
        p.prix >= f.prixMin &&
        p.prix <= f.prixMax &&
        (!f.enStockSeulement || p.enStock) &&
        (!f.enPromotion || p.enPromotion),
    )
    .sort(comparateurs[tri])
}
