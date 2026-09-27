import { screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { ConfirmationPage } from './ConfirmationPage'

// fr-CA prices use no-break spaces before "$": normalize them for readable assertions.
const texte = (el: HTMLElement) => el.textContent?.replace(/\s/g, ' ')

function renderPage(numero: string) {
  return renderWithProviders(
    <MemoryRouter initialEntries={[`/commandes/${numero}/confirmation`]}>
      <Routes>
        <Route path="/commandes/:numero/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ConfirmationPage', () => {
  it('renders the confirmed order from the mockup', async () => {
    renderPage('NRD-10482')

    expect(texte(await screen.findByRole('heading', { level: 1 }))).toBe('Merci, Julie !')
    expect(screen.getByText(/julie\.martin@exemple\.ca/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Articles (4)' })).toBeInTheDocument()
    expect(texte(screen.getByTestId('total'))).toBe('125,27 $')
    expect(screen.getByText('En préparation').closest('li')).toHaveAttribute('aria-current', 'step')
    expect(screen.getByRole('link', { name: 'Voir mes commandes' })).toHaveAttribute(
      'href',
      '/commandes',
    )
  })

  it('shows a message for an unknown order', async () => {
    renderPage('NRD-00000')
    expect(await screen.findByText(/Commande introuvable/)).toBeInTheDocument()
  })
})
