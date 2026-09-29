// No Produit entity exists on the backend yet: keep this in sync with the future ProduitDto.
export interface Categorie {
  id: number
  nom: string
}

export type Badge = 'Nouveau' | 'Populaire' | 'Stock limité' | 'Rupture'

export interface Produit {
  id: number
  nom: string
  categorie: Categorie
  prix: number
  enStock: boolean
  enPromotion: boolean
  badge?: Badge
  /** Lower is more popular. */
  popularite: number
  dateAjout: string
  /** Placeholder background until real product photos exist. */
  couleur: string
}

export type Tri = 'popularite' | 'prix-croissant' | 'prix-decroissant' | 'nouveautes'
