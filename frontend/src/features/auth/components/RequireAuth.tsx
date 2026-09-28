import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUtilisateurCourant } from '../api'

export function RequireAuth() {
  const { data: utilisateur, isPending } = useUtilisateurCourant()
  const location = useLocation()

  if (isPending) return null

  if (!utilisateur) {
    // Remember the requested page so ConnexionPage can send the user back to it after login.
    const retour = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/connexion?retour=${retour}`} replace />
  }

  return <Outlet /> // L'utilisateur est connecté : on affiche la route protégée
}
