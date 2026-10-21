import { screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import type { CommandeDto } from '../types'
import { ConfirmationPage } from './ConfirmationPage'

// fr-CA prices use no-break spaces before "$": normalize them for readable assertions.
const texte = (el: HTMLElement) => el.textContent?.replace(/\s/g, ' ')

const commandePayee: CommandeDto = {
  id: 3,
  statut: 'Payee',
  dateCreation: '2026-10-21T18:11:43',
  datePaiement: '2026-10-21T18:18:25',
  sousTotal: 108,
  livraison: 0,
  tps: 5.4,
  tvq: 10.77,
  total: 124.17,
  articles: [
    {
      produitId: 1,
      nomProduit: 'Tuque en laine mérinos',
      prixUnitaire: 38,
      quantite: 2,
      couleur: '#d8c7b3',
    },
    {
      produitId: 2,
      nomProduit: 'Tasse en grès émaillé',
      prixUnitaire: 32,
      quantite: 1,
      couleur: '#c5d0c8',
    },
  ],
}

/** Answers GET /api/auth/moi with a signed-in user and GET /api/commandes/3 with `reponse`. */
function mockApi(reponse: () => Response) {
  const utilisateur = {
    id: 1,
    prenom: 'Julie',
    nom: 'Martin',
    courriel: 'j@ex.ca',
    dateCreation: '',
  }
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockImplementation((url: string) =>
        Promise.resolve(
          url.endsWith('/api/auth/moi') ? new Response(JSON.stringify(utilisateur)) : reponse(),
        ),
      ),
  )
}

function renderPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/commandes/3/confirmation']}>
      <Routes>
        <Route path="/commandes/:numero/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('ConfirmationPage', () => {
  it('renders a paid order', async () => {
    mockApi(() => new Response(JSON.stringify(commandePayee)))
    renderPage()

    expect(texte(await screen.findByRole('heading', { level: 1 }))).toBe('Merci, Julie !')
    expect(screen.getByRole('heading', { name: 'Articles (3)' })).toBeInTheDocument()
    expect(texte(screen.getByTestId('total'))).toBe('124,17 $')
  })

  it('waits while the payment is not confirmed yet', async () => {
    mockApi(() => new Response(JSON.stringify({ ...commandePayee, statut: 'EnAttente' })))
    renderPage()

    expect(await screen.findByRole('status')).toHaveTextContent(/Paiement en cours de confirmation/)
  })

  it('shows a message for an unknown order', async () => {
    mockApi(() => new Response(JSON.stringify({ errors: ['Introuvable'] }), { status: 404 }))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent(/Commande introuvable/)
  })
})
