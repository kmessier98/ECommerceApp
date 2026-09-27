import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
          <span className="font-semibold">ECommerceApp</span>
          <NavLink
            to="/tests"
            className={({ isActive }) =>
              isActive ? 'font-medium text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }
          >
            Tests
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
