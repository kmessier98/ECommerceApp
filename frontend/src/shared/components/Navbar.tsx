import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/nouveautes', label: 'Nouveautés' },
  { to: '/epicerie-fine', label: 'Épicerie fine' },
  { to: '/commandes', label: 'Mes commandes' },
]

interface NavbarProps {
  cartItemCount?: number
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  return (
    <header className="bg-creme border-b border-stone-200 px-4">
      <nav className="mx-auto flex max-w-6xl items-center gap-8 py-3">
        <Link to="/" className="font-display text-encre text-2xl font-semibold tracking-tight">
          Nordet
        </Link>

        <ul className="hidden items-center gap-5 text-sm md:flex">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'text-encre font-semibold' : 'hover:text-encre text-stone-600'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <form role="search" className="ml-auto" onSubmit={(e) => e.preventDefault()}>
          <label className="flex w-60 items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 focus-within:border-stone-500">
            <SearchIcon />
            <input
              type="search"
              placeholder="Rechercher un produit"
              aria-label="Rechercher un produit"
              className="w-full bg-transparent text-sm placeholder:text-stone-500 focus:outline-none"
            />
          </label>
        </form>

        <div className="flex items-center gap-6">
          <Link to="/compte" aria-label="Mon compte" className="text-encre hover:text-brique">
            <UserIcon />
          </Link>
          <Link
            to="/panier"
            aria-label={`Panier (${cartItemCount} article${cartItemCount > 1 ? 's' : ''})`}
            className="text-encre hover:text-brique relative"
          >
            <BagIcon />
            {cartItemCount > 0 && (
              <span className="bg-brique absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-stone-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}
