import { create } from 'zustand'
import { mockPanier } from './mock-panier'
import type { LignePanier } from './types'

interface PanierState {
  lignes: LignePanier[]
  changerQuantite: (produitId: number, quantite: number) => void
  retirer: (produitId: number) => void
}

// Client-only cart until the backend exposes /api/panier; then move it to TanStack Query hooks in api.ts.
export const usePanier = create<PanierState>()((set) => ({
  lignes: mockPanier,
  changerQuantite: (produitId, quantite) =>
    set((state) => ({
      lignes: state.lignes.map((l) =>
        l.produitId === produitId ? { ...l, quantite: Math.max(1, quantite) } : l,
      ),
    })),
  retirer: (produitId) =>
    set((state) => ({ lignes: state.lignes.filter((l) => l.produitId !== produitId) })),
}))

export function useNombreArticles() {
  return usePanier((state) => state.lignes.reduce((total, l) => total + l.quantite, 0))
}
