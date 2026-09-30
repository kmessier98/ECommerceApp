import { useQuery } from '@tanstack/react-query'
import type { Categorie, Produit } from './types'
import { apiClient } from '@/lib/api-client'

const CATEGORIES_ENDPOINT = '/api/categories'
const PRODUITS_ENDPOINT = '/api/produits'

export const produitKeys = {
  all: ['produits'] as const,
}

export const categorieKeys = {
  all: ['categories'] as const,
}

export function useProduits() {
  return useQuery({
    queryKey: produitKeys.all,
    queryFn: () => {
      return apiClient.get<Produit[]>(PRODUITS_ENDPOINT)
    },
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
