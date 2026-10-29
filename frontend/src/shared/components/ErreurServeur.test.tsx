import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { apiClient } from '@/lib/api-client'
import { queryClient as appQueryClient } from '@/lib/query-client'
import { ErreurServeur } from './ErreurServeur'

function PageAvecDonnees() {
  const { data, isError } = useQuery({
    queryKey: ['donnees'],
    queryFn: () => apiClient.get('/api/x'),
  })
  if (isError) return <p>Erreur gérée par la page</p>
  return <p>{data ? 'Données chargées' : 'Chargement'}</p>
}

function PageQuiPlante(): never {
  throw new Error('bug de rendu')
}

/** Renders `page` under a root route using ErreurServeur, with the app's real query defaults. */
function renderPage(page: ReactElement) {
  // The app's own defaults (including throwOnError), minus retries to keep the test fast.
  const client = new QueryClient({
    defaultOptions: { queries: { ...appQueryClient.getDefaultOptions().queries, retry: false } },
  })
  const router = createMemoryRouter([
    { errorElement: <ErreurServeur />, children: [{ path: '/', element: page }] },
  ])
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('ErreurServeur', () => {
  // React and React Router log caught render errors; keep the test output readable.
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('replaces the page when the proxy answers 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 502 })))
    renderPage(<PageAvecDonnees />)
    expect(await screen.findByText('Service momentanément indisponible')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
  })

  it('replaces the page when fetch fails (API down, no proxy)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    renderPage(<PageAvecDonnees />)
    expect(await screen.findByText('Service momentanément indisponible')).toBeInTheDocument()
  })

  it('leaves other API errors to the page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ errors: ['x'] }), { status: 404 })),
    )
    renderPage(<PageAvecDonnees />)
    expect(await screen.findByText('Erreur gérée par la page')).toBeInTheDocument()
    expect(screen.queryByText('Service momentanément indisponible')).not.toBeInTheDocument()
  })

  it('shows a generic message for a render error', () => {
    renderPage(<PageQuiPlante />)
    expect(screen.getByText('Une erreur inattendue est survenue')).toBeInTheDocument()
  })
})
