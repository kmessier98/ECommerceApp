import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CompteLayout } from './CompteLayout'
import { PageAVenir } from './PageAVenir'

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
  render(<RouterProvider router={router} />)
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
})
