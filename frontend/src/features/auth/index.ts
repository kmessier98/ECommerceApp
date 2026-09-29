// Public API of the auth feature: import from '@/features/auth', not from its internals.
export { ConnexionPage } from './components/ConnexionPage'
export { CreerComptePage } from './components/CreerComptePage'
export { useUtilisateurCourant, useInscription, useConnexion, useDeconnexion } from './api'
export type { Utilisateur, InscriptionInput, ConnexionInput } from './types'
export { RequireAuth } from './components/RequireAuth'
export { ForceMotDePasse } from './components/ForceMotDePasse'
export { motDePasseValide } from './mot-de-passe'
