import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { ConnexionPage } from './ConnexionPage'

/** Makes the next API call answer with the given status and body. */
function mockFetch(status: number, body: unknown) {
  const fetchMock = vi
    .fn()
    .mockImplementation(() => Promise.resolve(new Response(JSON.stringify(body), { status })))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Renders the login page at `url`, next to a page to land on after a successful login. */
function renderConnexion(url: string) {
  const router = createMemoryRouter(
    [
      { path: 'connexion', element: <ConnexionPage /> },
      { path: 'compte/adresses', element: <p>Page des adresses</p> },
      { path: 'catalogue', element: <p>Page du catalogue</p> },
    ],
    { initialEntries: [url] },
  )
  renderWithProviders(<RouterProvider router={router} />)
}

async function seConnecter(motDePasse = 'MotDePasse1!') {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Courriel'), 'julie@test.com')
  await user.type(screen.getByLabelText('Mot de passe'), motDePasse)
  await user.click(screen.getByRole('button', { name: 'Se connecter et continuer' }))
}

afterEach(() => vi.unstubAllGlobals())

describe('ConnexionPage', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <MemoryRouter>
        <ConnexionPage />
      </MemoryRouter>,
    )

    const motDePasse = screen.getByLabelText('Mot de passe')
    expect(motDePasse).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Afficher' }))
    expect(motDePasse).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Masquer' }))
    expect(motDePasse).toHaveAttribute('type', 'password')
  })

  it('sends the credentials and goes back to the retour page on success', async () => {
    const fetchMock = mockFetch(200, {
      id: 1,
      prenom: 'Julie',
      nom: 'Martin',
      courriel: 'julie@test.com',
      dateCreation: '2026-06-15T00:00:00Z',
    })
    renderConnexion('/connexion?retour=%2Fcompte%2Fadresses')

    await seConnecter()

    expect(await screen.findByText('Page des adresses')).toBeInTheDocument()
    // The page also loads the cart, so look the login call up by URL rather than by position.
    const [, init] = fetchMock.mock.calls.find(([url]) => url === '/api/auth/connexion')!
    expect(JSON.parse(init.body)).toEqual({
      courriel: 'julie@test.com',
      motDePasse: 'MotDePasse1!',
      resterConnecte: false,
    })
  })

  it('goes to the catalogue when retour points to another site', async () => {
    mockFetch(200, { id: 1, prenom: 'Julie', nom: 'Martin', courriel: 'julie@test.com' })
    renderConnexion('/connexion?retour=%2F%2Fpirate.com')

    await seConnecter()

    expect(await screen.findByText('Page du catalogue')).toBeInTheDocument()
  })

  it('shows the backend error and stays on the page when the login fails', async () => {
    mockFetch(401, { errors: ['Courriel ou mot de passe invalide.'] })
    renderConnexion('/connexion')

    await seConnecter('MauvaisMotDePasse1!')

    expect(await screen.findByRole('alert')).toHaveTextContent('Courriel ou mot de passe invalide.')
    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument()
  })

  it('shows how many items the cart holds', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation((url: string) =>
          Promise.resolve(
            new Response(
              JSON.stringify(
                url === '/api/panier' ? { articles: [], resumePanier: { nombreArticles: 2 } } : {},
              ),
            ),
          ),
        ),
    )
    renderConnexion('/connexion')

    expect(await screen.findByText(/Votre panier \(2 articles\) est conservé/)).toBeInTheDocument()
  })

  it('hides the cart notice when the cart is empty', async () => {
    mockFetch(200, { articles: [], resumePanier: null })
    renderConnexion('/connexion')

    expect(await screen.findByRole('heading', { name: 'Connexion' })).toBeInTheDocument()
    expect(screen.queryByText(/Votre panier/)).not.toBeInTheDocument()
  })

  it('clears the error as soon as the user edits a field', async () => {
    const user = userEvent.setup()
    mockFetch(401, { errors: ['Courriel ou mot de passe invalide.'] })
    renderConnexion('/connexion')

    await seConnecter('MauvaisMotDePasse1!')
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Mot de passe'), 'x')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
