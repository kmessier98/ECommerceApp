import { useQuery } from '@tanstack/react-query'
import { mockProduits } from './mock-produits'
import type { Categorie, Produit } from './types'
import { apiClient } from '@/lib/api-client'

const CATEGORIES_ENDPOINT = '/api/categories'

export const produitKeys = {
  all: ['produits'] as const,
}

export const categorieKeys = {
  all: ['categories'] as const,
}

// TODO: replace with apiClient.get<Produit[]>('/api/produits') once the backend endpoint exists.
export function useProduits() {
  return useQuery({
    queryKey: produitKeys.all,
    queryFn: (): Promise<Produit[]> => Promise.resolve(mockProduits),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: categorieKeys.all,
    queryFn: () => {
      return apiClient.get<Categorie[]>(CATEGORIES_ENDPOINT)
    },
  })
}
