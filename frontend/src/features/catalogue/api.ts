import { useQuery } from '@tanstack/react-query'
import { mockProduits } from './mock-produits'
import type { Produit } from './types'

export const produitKeys = {
  all: ['produits'] as const,
}

// TODO: replace with apiClient.get<Produit[]>('/api/produits') once the backend endpoint exists.
export function useProduits() {
  return useQuery({
    queryKey: produitKeys.all,
    queryFn: (): Promise<Produit[]> => Promise.resolve(mockProduits),
  })
}
