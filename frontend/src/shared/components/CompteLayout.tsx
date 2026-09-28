import { Outlet } from 'react-router-dom'
import { CompteSidebar } from './CompteSidebar'

/** Shell of the account pages: the account menu on the left, the current tab on the right. */
export function CompteLayout() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row">
      <CompteSidebar />
      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  )
}
