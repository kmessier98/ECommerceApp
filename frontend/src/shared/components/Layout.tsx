import { Outlet, useMatch } from 'react-router-dom'
import { Navbar } from './Navbar'
import { usePanier } from '@/features/panier/api'

export function Layout() {
  // Rendered here rather than in CataloguePage so it spans the full width, right under the navbar.
  const surCatalogue = useMatch('/catalogue')
  const { data: panier } = usePanier()

  return (
    <div className="min-h-screen">
      <Navbar cartItemCount={panier?.resumePanier?.nombreArticles ?? 0} />
      {surCatalogue && (
        <p className="bg-encre px-4 py-2 text-center text-xs text-stone-100">
          Livraison gratuite au Québec dès 100 $ · Retours faciles sous 30 jours
        </p>
      )}
      <main className="px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
