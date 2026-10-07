import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { mockPanier } from '../mock-panier'
import type { PanierDto } from '../types'
import { PanierPage } from './PanierPage'

// fr-CA prices use no-break spaces before "$": normalize them for readable assertions.
const texte = (el: HTMLElement) => el.textContent?.replace(/\s/g, ' ')

/**
 * Answers `GET /api/panier` with `panier`, and any PATCH or DELETE with `apresMutation`
 * (the backend returns the updated cart after each change).
 */
function mockApi(panier: PanierDto, apresMutation: PanierDto = panier) {
  const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
    const corps = init?.method ? apresMutation : panier
    return Promise.resolve(new Response(JSON.stringify(corps)))
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <PanierPage />
    </MemoryRouter>,
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('PanierPage', () => {
  it('renders the cart lines and the summary from the mockup', async () => {
    mockApi(mockPanier)
    renderPage()

    expect(await screen.findAllByRole('listitem')).toHaveLength(3)
    expect(texte(screen.getByRole('heading', { level: 1 }))).toBe('Votre panier (4 articles)')
    expect(texte(screen.getByTestId('total'))).toBe('125,27 $')
    expect(screen.getByText(/Plus que 1,00/)).toBeInTheDocument()
  })

  it('shows the empty state when the cart has no summary', async () => {
    mockApi({ articles: [], resumePanier: null })
    renderPage()

    expect(await screen.findByText('Votre panier est vide.')).toBeInTheDocument()
  })

  it('sends the new quantity and shows the cart returned by the API', async () => {
    const user = userEvent.setup()
    // Subtotal of 137 $ reaches free shipping: 137 + 6,85 TPS + 13,67 TVQ
    const apresMutation: PanierDto = {
      articles: mockPanier.articles.map((a) => (a.produitId === 1 ? { ...a, quantite: 2 } : a)),
      resumePanier: {
        ...mockPanier.resumePanier!,
        sousTotal: 137,
        livraison: 0,
        tps: 6.85,
        tvq: 13.67,
        total: 157.52,
        montantPourLivraisonGratuite: 0,
        nombreArticles: 5,
      },
    }
    const fetchMock = mockApi(mockPanier, apresMutation)
    renderPage()
    const tuque = within((await screen.findAllByRole('listitem'))[0]!)

    await user.click(tuque.getByRole('button', { name: 'Augmenter la quantité' }))

    expect(await tuque.findByText('2')).toBeInTheDocument()
    expect(texte(screen.getByTestId('total'))).toBe('157,52 $')
    expect(screen.getByText('Gratuite')).toBeInTheDocument()
    const [url, init] = fetchMock.mock.calls.find(([, init]) => init?.method === 'PATCH')!
    expect(url).toBe('/api/panier/articles/1')
    expect(JSON.parse(init.body)).toEqual({ quantite: 2 })
  })

  it('removes a line', async () => {
    const user = userEvent.setup()
    const apresMutation: PanierDto = {
      ...mockPanier,
      articles: mockPanier.articles.filter((a) => a.produitId !== 3),
    }
    const fetchMock = mockApi(mockPanier, apresMutation)
    renderPage()
    const bougie = within((await screen.findAllByRole('listitem'))[2]!)

    await user.click(bougie.getByRole('button', { name: 'Retirer' }))

    expect(await screen.findAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText('Bougie sapin baumier')).not.toBeInTheDocument()
    const [url] = fetchMock.mock.calls.find(([, init]) => init?.method === 'DELETE')!
    expect(url).toBe('/api/panier/articles/3')
  })
})
