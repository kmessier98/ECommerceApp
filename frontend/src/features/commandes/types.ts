// Mock types for the order history page (CommandesPage): reconcile them with
// CommandeDto below once GET /api/commandes exists.

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

export type StatutCommandeDto = 'EnAttente' | 'Payee' | 'Annulee'

export interface CommandeDto {
  id: number
  statut: StatutCommandeDto
  dateCreation: string
  datePaiement: string | null
  sousTotal: number
  livraison: number
  tps: number
  tvq: number
  total: number
  articles: LigneCommande[]
}

export interface LigneCommande {
  produitId: number
  nomProduit: string
  prixUnitaire: number
  quantite: number
  /** Placeholder background until real product photos exist. */
  couleur: string
  imageUrl: string
}

export interface SessionPaiement {
  url: string
}
