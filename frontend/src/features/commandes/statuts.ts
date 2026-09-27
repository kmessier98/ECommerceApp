import type { Commande, FiltreCommandes, StatutCommande } from './types'

interface InfoStatut {
  /** Tailwind classes for the status pill. */
  classes: string
  /** Label of the row's main action. */
  action: string
  filtre: Exclude<FiltreCommandes, 'toutes'>
}

export const STATUTS: Record<StatutCommande, InfoStatut> = {
  'En préparation': {
    classes: 'bg-[#e3eaf3] text-[#2c4a6b]',
    action: 'Suivre',
    filtre: 'en-cours',
  },
  Expédiée: {
    classes: 'bg-[#f6e8c8] text-[#8a5a10]',
    action: 'Suivre le colis',
    filtre: 'en-cours',
  },
  Livrée: { classes: 'bg-[#dfeee4] text-[#2f6b45]', action: 'Racheter', filtre: 'livrees' },
  Remboursée: {
    classes: 'bg-stone-200 text-stone-700',
    action: 'Voir la facture',
    filtre: 'annulees',
  },
  'Paiement échoué': {
    classes: 'bg-[#f7dcd8] text-brique',
    action: 'Réessayer',
    filtre: 'en-cours',
  },
  Annulée: { classes: 'bg-stone-200 text-stone-700', action: 'Racheter', filtre: 'annulees' },
}

export const FILTRES: { value: FiltreCommandes; label: string }[] = [
  { value: 'toutes', label: 'Toutes' },
  { value: 'en-cours', label: 'En cours' },
  { value: 'livrees', label: 'Livrées' },
  { value: 'annulees', label: 'Annulées' },
]

export function filtrerCommandes(commandes: Commande[], filtre: FiltreCommandes) {
  return filtre === 'toutes'
    ? commandes
    : commandes.filter((c) => STATUTS[c.statut].filtre === filtre)
}
