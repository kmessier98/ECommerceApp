import { apiClient } from '@/lib/api-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { PanierDto } from './types'

const ENDPOINT = '/api/panier'

export const panierKeys = {
  all: ['panier'] as const,
}

export function usePanier() {
  return useQuery({
    queryKey: panierKeys.all,
    queryFn: () => {
      return apiClient.get<PanierDto>(ENDPOINT)
    },
  })
}

export function useAjouterArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.post<PanierDto>(`${ENDPOINT}/articles`, { produitId: id }),
    onSuccess: (panier) => {
      queryClient.setQueryData(panierKeys.all, panier)
    },
  })
}

export function useModifierArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiClient.patch<PanierDto>(`${ENDPOINT}/articles/${id}`, { quantite: quantity }),
    onSuccess: (panier) => {
      queryClient.setQueryData(panierKeys.all, panier)
    },
  })
}

export function useRetirerArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiClient.delete<PanierDto>(`${ENDPOINT}/articles/${id}`),
    onSuccess: (panier) => {
      queryClient.setQueryData(panierKeys.all, panier)
    },
  })
}
