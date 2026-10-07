import { apiClient, ApiError } from '@/lib/api-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ConnexionInput, InscriptionInput, Utilisateur } from './types'
import { panierKeys } from '@/features/panier'

const ENDPOINT = '/api/auth'

export const authKeys = {
  moi: ['auth', 'moi'] as const,
}

export function useUtilisateurCourant() {
  return useQuery({
    queryKey: authKeys.moi,
    queryFn: async () => {
      try {
        return await apiClient.get<Utilisateur>(`${ENDPOINT}/moi`)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null // Utilisateur non connecté
        }

        throw error
      }
    },
    staleTime: Infinity,
  })
}

export function useInscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: InscriptionInput) =>
      apiClient.post<Utilisateur>(`${ENDPOINT}/inscription`, input),
    onSuccess: (utilisateur) => {
      queryClient.setQueryData(authKeys.moi, utilisateur)
      queryClient.invalidateQueries({ queryKey: panierKeys.all })
    },
  })
}

export function useConnexion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ConnexionInput) =>
      apiClient.post<Utilisateur>(`${ENDPOINT}/connexion`, input),
    onSuccess: (utilisateur) => {
      queryClient.setQueryData(authKeys.moi, utilisateur)
      queryClient.invalidateQueries({ queryKey: panierKeys.all })
    },
  })
}

export function useDeconnexion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.post(`${ENDPOINT}/deconnexion`, undefined),
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(authKeys.moi, null)
    },
  })
}
