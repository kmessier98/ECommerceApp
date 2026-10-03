import { apiClient } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'

const PANIER_ENDPOINT = '/api/oanier'

export const panierKeys = {
  all: ['panier'] as const,
}

export function usePanier() {
  return useQuery({
    queryKey: panierKeys.all,
    queryFn: () => {
      return apiClient.get(PANIER_ENDPOINT)
    },
  })
}
