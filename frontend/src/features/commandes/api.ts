import { useMutation, useQuery } from '@tanstack/react-query'
import { mockCommandes } from './mock-commandes'
import type { Commande, CommandeDto, SessionPaiement } from './types'
import { apiClient } from '@/lib/api-client'

export const commandeKeys = {
  all: ['commandes'] as const,
  detail: (id: number) => [...commandeKeys.all, id] as const,
}

// TODO: replace with apiClient.get<Commande[]>('/api/commandes') once the backend endpoint exists.
export function useCommandes() {
  return useQuery({
    queryKey: commandeKeys.all,
    queryFn: (): Promise<Commande[]> => Promise.resolve(mockCommandes),
  })
}

export function usePasserCommande() {
  return useMutation({
    mutationFn: () => apiClient.post<SessionPaiement>('/api/commandes', undefined),
    onSuccess: ({ url }) => {
      window.location.assign(url)
    },
  })
}

export function useCommande(id: number) {
  return useQuery({
    queryKey: commandeKeys.detail(id),
    queryFn: () => apiClient.get<CommandeDto>(`/api/commandes/${id}`),
    // The webhook may land after the redirect from Stripe: poll until it does.
    refetchInterval: (query) => (query.state.data?.statut === 'EnAttente' ? 2000 : false),
  })
}
