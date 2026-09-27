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

export interface ArticleConfirmation extends ArticleCommande {
  /** Line total (unit price × quantity). */
  montant: number
}

export interface EtapeSuivi {
  libelle: string
  /** Date or state shown under the label, e.g. "Prévu le 29 sept.". */
  detail: string
}

/** Order summary shown once the payment webhook has confirmed the order. */
export interface ConfirmationCommande {
  numero: string
  prenomClient: string
  courriel: string
  articles: ArticleConfirmation[]
  /** Total paid, shipping and taxes included. */
  total: number
  etapes: EtapeSuivi[]
  /** Index of the step in progress; earlier steps are completed. */
  etapeCourante: number
  livraison: {
    destinataire: string
    adresse: string
    villeProvince: string
    methode: string
    arriveePrevue: string
  }
}
