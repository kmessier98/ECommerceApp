import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import type { PanierDto } from './types'

const PANIER_ENDPOINT = '/api/panier'

export const panierKeys = {
  all: ['panier'] as const,
}

export function usePanier() {
  return useQuery({
    queryKey: panierKeys.all,
    queryFn: () => {
      return apiClient.get<PanierDto>(PANIER_ENDPOINT)
    },
  })
}
