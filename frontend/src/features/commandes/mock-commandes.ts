import type { Commande } from './types'

// Temporary data matching docs/maquettes/MesCommandes.png, until the backend exposes /api/commandes.
export const mockCommandes: Commande[] = [
  {
    id: 10482,
    numero: 'NRD-10482',
    date: '2026-09-26',
    total: 125.27,
    statut: 'En préparation',
    articles: [
      { produitId: 1, nom: 'Tuque en laine mérinos', quantite: 2, couleur: '#d8c8b5' },
      { produitId: 3, nom: 'Bougie sapin baumier', quantite: 1, couleur: '#e3b874' },
      { produitId: 5, nom: 'Linge à vaisselle en lin', quantite: 1, couleur: '#bfc9b1' },
    ],
  },
  {
    id: 10419,
    numero: 'NRD-10419',
    date: '2026-09-12',
    total: 86.19,
    statut: 'Expédiée',
    articles: [
      { produitId: 2, nom: 'Tasse en grès émaillé', quantite: 2, couleur: '#c5d0c8' },
      { produitId: 4, nom: 'Beurre d’érable 250 g', quantite: 1, couleur: '#ead09f' },
    ],
  },
  {
    id: 10377,
    numero: 'NRD-10377',
    date: '2026-09-02',
    total: 166.71,
    statut: 'Livrée',
    articles: [{ produitId: 8, nom: 'Jeté en laine tissé', quantite: 1, couleur: '#d6b8ab' }],
  },
  {
    id: 10251,
    numero: 'NRD-10251',
    date: '2026-08-14',
    total: 66.65,
    statut: 'Remboursée',
    articles: [{ produitId: 6, nom: 'Mitaines tricotées', quantite: 2, couleur: '#b8c0cc' }],
  },
  {
    id: 10198,
    numero: 'NRD-10198',
    date: '2026-08-03',
    total: 84.99,
    statut: 'Paiement échoué',
    articles: [{ produitId: 7, nom: 'Planche en érable', quantite: 1, couleur: '#dbc39a' }],
  },
  {
    id: 10102,
    numero: 'NRD-10102',
    date: '2026-07-19',
    total: 70.01,
    statut: 'Livrée',
    articles: [
      { produitId: 3, nom: 'Bougie sapin baumier', quantite: 2, couleur: '#e3b874' },
      { produitId: 5, nom: 'Linge à vaisselle en lin', quantite: 1, couleur: '#bfc9b1' },
    ],
  },
]
