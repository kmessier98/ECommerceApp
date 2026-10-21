import { useMutation, useQuery } from '@tanstack/react-query'
import { mockCommandes } from './mock-commandes'
import { mockConfirmation } from './mock-confirmation'
import type { Commande, ConfirmationCommande, SessionPaiement } from './types'
import { apiClient } from '@/lib/api-client'

export const commandeKeys = {
  all: ['commandes'] as const,
  confirmation: (numero: string) => [...commandeKeys.all, 'confirmation', numero] as const,
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

// TODO: replace with apiClient.get<ConfirmationCommande>(`/api/commandes/${numero}/confirmation`)
// once the payment webhook creates the order on the backend.
export function useConfirmationCommande(numero: string) {
  return useQuery({
    queryKey: commandeKeys.confirmation(numero),
    queryFn: (): Promise<ConfirmationCommande | null> =>
      Promise.resolve(numero === mockConfirmation.numero ? mockConfirmation : null),
  })
}
