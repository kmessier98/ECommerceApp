export interface PanierDto {
  articles: LignePanier[]
  resumePanier: ResumePanier | null
}

export interface LignePanier {
  produitId: number
  nom: string
  /** Variant details shown under the name, e.g. "Couleur : charbon". */
  description: string
  prix: number
  quantite: number
  /** Placeholder background until real product photos exist. */
  couleur: string
}

export interface ResumePanier {
  sousTotal: number
  livraison: number
  tps: number
  tvq: number
  total: number
  seuilLivraisonGratuite: number
  montantPourLivraisonGratuite: number
  nombreArticles: number
}
