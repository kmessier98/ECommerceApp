import type { PanierDto } from './types'

// Test data matching docs/maquettes/Panier.png, shaped like the backend's PanierDto.
// The totals are computed by the backend (CalculPanierService), so they are written out here.
export const mockPanier: PanierDto = {
  articles: [
    {
      produitId: 1,
      nom: 'Tuque en laine mérinos',
      description: 'Couleur : charbon',
      prix: 38,
      quantite: 1,
      couleur: '#d8c7b3',
    },
    {
      produitId: 9,
      nom: 'Sirop d’érable ambré 540 ml',
      description: 'Goût riche · récolte 2026',
      prix: 16.5,
      quantite: 2,
      couleur: '#e3b874',
    },
    {
      produitId: 3,
      nom: 'Bougie sapin baumier',
      description: 'Cire de soya · 45 h',
      prix: 28,
      quantite: 1,
      couleur: '#bfc9b1',
    },
  ],
  resumePanier: {
    sousTotal: 99,
    livraison: 9.95,
    tps: 5.45,
    tvq: 10.87,
    total: 125.27,
    seuilLivraisonGratuite: 100,
    montantPourLivraisonGratuite: 1,
    nombreArticles: 4,
  },
}
