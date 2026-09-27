// No Commande entity exists on the backend yet: keep this in sync with the future CommandeDto.
export type StatutCommande =
  'En préparation' | 'Expédiée' | 'Livrée' | 'Remboursée' | 'Paiement échoué' | 'Annulée'

export interface ArticleCommande {
  produitId: number
  nom: string
  quantite: number
  /** Placeholder background until real product photos exist. */
  couleur: string
}

export interface Commande {
  id: number
  numero: string
  date: string
  total: number
  statut: StatutCommande
  articles: ArticleCommande[]
}

export type FiltreCommandes = 'toutes' | 'en-cours' | 'livrees' | 'annulees'
