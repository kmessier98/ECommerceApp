import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CommandesPage } from './CommandesPage'

function renderPage() {
  return renderWithProviders(
    <MemoryRouter>
      <CommandesPage />
    </MemoryRouter>,
  )
}

describe('CommandesPage', () => {
  it('renders every order with its total, status and action', async () => {
    renderPage()
    const commandes = await screen.findAllByRole('article')
    expect(commandes).toHaveLength(6)

    const premiere = within(commandes[0]!)
    expect(premiere.getByText('NRD-10482')).toBeInTheDocument()
    expect(premiere.getByText('26 sept. 2026')).toBeInTheDocument()
    expect(premiere.getByText('4 articles')).toBeInTheDocument()
    expect(premiere.getByText('En préparation')).toBeInTheDocument()
    expect(premiere.getByRole('button', { name: 'Suivre' })).toBeInTheDocument()
  })

  it('filters delivered orders', async () => {
    const user = userEvent.setup()
    renderPage()
    await screen.findAllByRole('article')

    await user.click(screen.getByRole('button', { name: 'Livrées' }))
    const numeros = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(numeros).toEqual(['NRD-10377', 'NRD-10102'])
  })
})
