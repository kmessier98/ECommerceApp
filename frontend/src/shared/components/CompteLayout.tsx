import { Outlet } from 'react-router-dom'
import { CompteSidebar } from './CompteSidebar'

/** Shell of the account pages: the account menu on the left, the current tab on the right. */
export function CompteLayout() {
  // TODO: once authentication exists, redirect signed-out visitors to the login page, e.g.
  // `if (!client) return <Navigate to="/connexion" replace />`. Done here, it covers /compte
  // (Profil, also reached from the navbar icon) and every other account tab.
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row">
      <CompteSidebar />
      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  )
}
