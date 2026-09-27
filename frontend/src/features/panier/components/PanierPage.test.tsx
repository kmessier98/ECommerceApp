import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { mockPanier } from '../mock-panier'
import { usePanier } from '../store'
import { PanierPage } from './PanierPage'

// fr-CA prices use no-break spaces before "$": normalize them for readable assertions.
const texte = (el: HTMLElement) => el.textContent?.replace(/\s/g, ' ')

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <PanierPage />
    </MemoryRouter>,
  )
}

describe('PanierPage', () => {
  // The cart store is a module-level singleton: reset it so tests stay independent.
  beforeEach(() => usePanier.setState({ lignes: mockPanier }))

  it('renders the cart lines and the summary from the mockup', () => {
    renderPage()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(texte(screen.getByRole('heading', { level: 1 }))).toBe('Votre panier (4 articles)')
    expect(texte(screen.getByTestId('total'))).toBe('125,27 $')
    expect(screen.getByText(/Plus que 1,00/)).toBeInTheDocument()
  })

  it('updates the quantity and the totals', async () => {
    const user = userEvent.setup()
    renderPage()
    const tuque = within(screen.getAllByRole('listitem')[0]!)

    await user.click(tuque.getByRole('button', { name: 'Augmenter la quantité' }))
    expect(tuque.getByText('2')).toBeInTheDocument()
    // Subtotal of 137 $ reaches free shipping: 137 + 6,85 TPS + 13,67 TVQ
    expect(texte(screen.getByTestId('total'))).toBe('157,52 $')
    expect(screen.getByText('Gratuite')).toBeInTheDocument()
  })

  it('removes a line', async () => {
    const user = userEvent.setup()
    renderPage()
    const bougie = within(screen.getAllByRole('listitem')[2]!)

    await user.click(bougie.getByRole('button', { name: 'Retirer' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText('Bougie sapin baumier')).not.toBeInTheDocument()
  })
})
