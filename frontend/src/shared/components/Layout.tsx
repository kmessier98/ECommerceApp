import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div className="min-h-screen">
      {/* TODO: pass the real cart item count once a cart feature exists */}
      <Navbar />
      <main className="px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
