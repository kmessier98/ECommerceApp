import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const CLASSES_CHAMP =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none'

interface AuthLayoutProps {
  /** Content of the dark side panel, below the logo. */
  panneau: ReactNode
  /** Top-right prompt linking to the other auth page. */
  lienHaut: ReactNode
  /** Small print pinned to the bottom of the form column. */
  pied?: ReactNode
  children: ReactNode
}

/** Full-screen two-column shell shared by the login and sign-up pages. */
export function AuthLayout({ panneau, lienHaut, pied, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="bg-encre hidden w-2/5 max-w-xl flex-col justify-between p-10 text-stone-100 md:flex">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Nordet
        </Link>
        <div>{panneau}</div>
      </aside>

      <div className="flex flex-1 flex-col px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <Link to="/panier" className="text-brique font-semibold underline">
            ← Retour au panier
          </Link>
          <p className="text-stone-600">{lienHaut}</p>
        </div>

        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {children}
        </main>

        {pied && <p className="text-center text-[11px] text-stone-500">{pied}</p>}
      </div>
    </div>
  )
}
