import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { RequireAuth } from './RequireAuth'

/** Makes GET /api/auth/moi answer with the given status and body. */
function mockMoi(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockImplementation(() => Promise.resolve(new Response(JSON.stringify(body), { status }))),
  )
}

function renderAt(url: string) {
  const router = createMemoryRouter(
    [
      {
        element: <RequireAuth />,
        children: [{ path: 'compte/adresses', element: <p>Contenu protégé</p> }],
      },
      { path: 'connexion', element: <p>Page de connexion</p> },
    ],
    { initialEntries: [url] },
  )
  renderWithProviders(<RouterProvider router={router} />)
  return router
}

afterEach(() => vi.unstubAllGlobals())

describe('RequireAuth', () => {
  it('shows the protected page to a signed-in user', async () => {
    mockMoi(200, { id: 1, prenom: 'Julie', nom: 'Martin', courriel: 'julie@test.com' })
    renderAt('/compte/adresses')

    expect(await screen.findByText('Contenu protégé')).toBeInTheDocument()
  })

  it('redirects a visitor to the login page, remembering where they were going', async () => {
    mockMoi(401, { errors: ['Vous devez être connecté.'] })
    const router = renderAt('/compte/adresses?onglet=2')

    expect(await screen.findByText('Page de connexion')).toBeInTheDocument()
    expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/connexion')
    expect(new URLSearchParams(router.state.location.search).get('retour')).toBe(
      '/compte/adresses?onglet=2',
    )
  })
})
