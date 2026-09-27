import type { LignePanier } from './types'

// Temporary data matching docs/maquettes/Panier.png, until the backend exposes /api/panier.
export const mockPanier: LignePanier[] = [
  {
    produitId: 1,
    nom: 'Tuque en laine mérinos',
    description: 'Couleur : charbon',
    prixUnitaire: 38,
    quantite: 1,
    couleur: '#d8c7b3',
  },
  {
    produitId: 9,
    nom: 'Sirop d’érable ambré 540 ml',
    description: 'Goût riche · récolte 2026',
    prixUnitaire: 16.5,
    quantite: 2,
    couleur: '#e3b874',
  },
  {
    produitId: 3,
    nom: 'Bougie sapin baumier',
    description: 'Cire de soya · 45 h',
    prixUnitaire: 28,
    quantite: 1,
    couleur: '#bfc9b1',
  },
]
