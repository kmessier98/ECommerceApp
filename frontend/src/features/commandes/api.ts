import { useQuery } from '@tanstack/react-query'
import { mockCommandes } from './mock-commandes'
import type { Commande } from './types'

export const commandeKeys = {
  all: ['commandes'] as const,
}

// TODO: replace with apiClient.get<Commande[]>('/api/commandes') once the backend endpoint exists.
export function useCommandes() {
  return useQuery({
    queryKey: commandeKeys.all,
    queryFn: (): Promise<Commande[]> => Promise.resolve(mockCommandes),
  })
}
