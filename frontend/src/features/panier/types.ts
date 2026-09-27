// No Panier entity exists on the backend yet: keep this in sync with the future PanierDto.
export interface LignePanier {
  produitId: number
  nom: string
  /** Variant details shown under the name, e.g. "Couleur : charbon". */
  description: string
  prixUnitaire: number
  quantite: number
  /** Placeholder background until real product photos exist. */
  couleur: string
}
