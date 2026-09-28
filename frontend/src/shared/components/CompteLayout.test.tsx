import { screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CompteLayout } from './CompteLayout'
import { PageAVenir } from './PageAVenir'

const UTILISATEUR = {
  id: 1,
  prenom: 'Julie',
  nom: 'Martin',
  courriel: 'julie@test.com',
  dateCreation: '2026-06-15T00:00:00Z',
}

// CompteSidebar asks GET /api/auth/moi who is signed in: answer with a signed-in user.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify(UTILISATEUR)))),
  )
})

afterEach(() => vi.unstubAllGlobals())

function renderAt(url: string) {
  const router = createMemoryRouter(
    [
      {
        element: <CompteLayout />,
        children: [
          { path: 'compte', element: <PageAVenir titre="Profil" /> },
          { path: 'compte/adresses', element: <PageAVenir titre="Adresses" /> },
          { path: 'compte/paiement', element: <PageAVenir titre="Moyens de paiement" /> },
        ],
      },
    ],
    { initialEntries: [url] },
  )
  renderWithProviders(<RouterProvider router={router} />)
}

describe('CompteLayout', () => {
  it.each([
    ['/compte', 'Profil'],
    ['/compte/adresses', 'Adresses'],
    ['/compte/paiement', 'Moyens de paiement'],
  ])('on %s, only the %s tab is active', (url, onglet) => {
    renderAt(url)
    const actifs = screen
      .getAllByRole('link')
      .filter((lien) => lien.getAttribute('aria-current') === 'page')
    expect(actifs.map((lien) => lien.textContent)).toEqual([onglet])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(onglet)
  })

  it('shows the signed-in user in the sidebar', async () => {
    renderAt('/compte')
    expect(await screen.findByText('Julie Martin')).toBeInTheDocument()
    expect(screen.getByText('Membre depuis juin 2026')).toBeInTheDocument()
  })
})
