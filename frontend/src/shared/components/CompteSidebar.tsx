import { NavLink } from 'react-router-dom'

const liens = [
  { to: '/commandes', label: 'Mes commandes' },
  { to: '/compte/adresses', label: 'Adresses' },
  { to: '/compte/paiement', label: 'Moyens de paiement' },
  { to: '/compte', label: 'Profil' },
]

// TODO: read the signed-in customer once authentication exists
const CLIENT = { nom: 'Julie Martin', depuis: 'juin 2026' }

export function CompteSidebar() {
  return (
    <aside className="md:w-48 md:shrink-0">
      <p className="font-display text-xl font-semibold">{CLIENT.nom}</p>
      <p className="mt-0.5 text-xs text-stone-500">Cliente depuis {CLIENT.depuis}</p>

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
            {/* TODO: sign out once authentication exists */}
            <button
              type="button"
              className="text-brique w-full rounded-lg px-3 py-2.5 text-left hover:bg-stone-200/60"
            >
              Se déconnecter
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
