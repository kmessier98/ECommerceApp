import { useDeconnexion, useUtilisateurCourant } from '@/features/auth'
import { NavLink, useNavigate } from 'react-router-dom'
import { formatMoisAnnee } from '../utils/format'

const liens = [
  { to: '/commandes', label: 'Mes commandes' },
  { to: '/compte/adresses', label: 'Adresses' },
  { to: '/compte/paiement', label: 'Moyens de paiement' },
  { to: '/compte', label: 'Profil' },
]

export function CompteSidebar() {
  const { data: utilisateur } = useUtilisateurCourant()
  const deconnexion = useDeconnexion()
  const navigate = useNavigate()

  return (
    <aside className="md:w-48 md:shrink-0">
      {utilisateur && (
        <>
          <p className="font-display text-xl font-semibold">
            {utilisateur.prenom} {utilisateur.nom}
          </p>
          <p className="mt-0.5 text-xs text-stone-500">
            Membre depuis {formatMoisAnnee(utilisateur.dateCreation)}
          </p>
        </>
      )}

      <nav aria-label="Mon compte" className="mt-5">
        <ul className="flex flex-col gap-1 text-sm">
          {liens.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                // Without end, /compte would also be active on /compte/adresses and /compte/paiement.
                end
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 ${isActive ? 'bg-encre font-semibold text-white' : 'hover:bg-stone-200/60'}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="text-brique w-full rounded-lg px-3 py-2.5 text-left hover:bg-stone-200/60 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={deconnexion.isPending}
              onClick={() => {
                deconnexion.mutate(undefined, {
                  onSuccess: () => {
                    navigate('/catalogue', { replace: true })
                  },
                })
              }}
            >
              {deconnexion.isPending && (
                <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              )}
              Se déconnecter
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
