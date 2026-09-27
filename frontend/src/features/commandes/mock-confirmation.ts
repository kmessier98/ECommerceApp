import type { ConfirmationCommande } from './types'

// Temporary data matching docs/maquettes/Confirmation.png, until the backend exposes the confirmed order.
export const mockConfirmation: ConfirmationCommande = {
  numero: 'NRD-10482',
  prenomClient: 'Julie',
  courriel: 'julie.martin@exemple.ca',
  articles: [
    { produitId: 1, nom: 'Tuque en laine mérinos', quantite: 1, montant: 38, couleur: '#d8c7b3' },
    {
      produitId: 9,
      nom: 'Sirop d’érable ambré 540 ml',
      quantite: 2,
      montant: 33,
      couleur: '#e3b874',
    },
    { produitId: 3, nom: 'Bougie sapin baumier', quantite: 1, montant: 28, couleur: '#bfc9b1' },
  ],
  total: 125.27,
  etapes: [
    { libelle: 'Paiement confirmé', detail: 'Aujourd’hui, 22 h 31' },
    { libelle: 'En préparation', detail: 'En cours' },
    { libelle: 'Expédiée', detail: 'Prévu le 29 sept.' },
    { libelle: 'Livrée', detail: '1er au 3 oct.' },
  ],
  etapeCourante: 1,
  livraison: {
    destinataire: 'Julie Martin',
    adresse: '[ADRESSE CIVIQUE]',
    villeProvince: 'Québec (Québec)',
    methode: 'Standard · Postes Canada',
    arriveePrevue: '1er au 3 oct.',
  },
}
