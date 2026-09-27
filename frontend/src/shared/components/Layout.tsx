import { Outlet, useMatch } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  // Rendered here rather than in CataloguePage so it spans the full width, right under the navbar.
  const surCatalogue = useMatch('/catalogue')

  return (
    <div className="min-h-screen">
      {/* TODO: pass the real cart item count once a cart feature exists */}
      <Navbar />
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
