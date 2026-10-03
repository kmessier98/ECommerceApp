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
