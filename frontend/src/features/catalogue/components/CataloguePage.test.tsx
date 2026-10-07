import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import type { Categorie, Produit } from '../types'
import { CataloguePage } from './CataloguePage'

const MAISON: Categorie = { id: 1, nom: 'Maison' }
const CUISINE: Categorie = { id: 2, nom: 'Cuisine' }
const EPICERIE: Categorie = { id: 3, nom: 'Épicerie' }
const ACCESSOIRES: Categorie = { id: 4, nom: 'Accessoires' }

// Products from docs/maquettes/Catalogue.png.
const PRODUITS: Produit[] = [
  {
    id: 1,
    nom: 'Tuque en laine mérinos',
    categorie: ACCESSOIRES,
    prix: 38,
    enStock: true,
    enPromotion: false,
    badge: 'Nouveau',
    rangPopularite: 1,
    dateAjout: '2026-09-20',
    couleur: '#d8c7b3',
  },
  {
    id: 2,
    nom: 'Tasse en grès émaillé',
    categorie: MAISON,
    prix: 32,
    enStock: true,
    enPromotion: true,
    rangPopularite: 2,
    dateAjout: '2026-06-02',
    couleur: '#c5d0c8',
  },
  {
    id: 3,
    nom: 'Bougie sapin baumier',
    categorie: MAISON,
    prix: 28,
    enStock: true,
    enPromotion: false,
    rangPopularite: 3,
    dateAjout: '2026-07-14',
    couleur: '#bccab0',
  },
  {
    id: 4,
    nom: 'Sirop d’érable ambré 540 ml',
    categorie: EPICERIE,
    prix: 16.5,
    enStock: true,
    enPromotion: false,
    badge: 'Populaire',
    rangPopularite: 4,
    dateAjout: '2026-03-10',
    couleur: '#e3b572',
  },
  {
    id: 5,
    nom: 'Jeté en laine tissé',
    categorie: MAISON,
    prix: 145,
    enStock: true,
    enPromotion: false,
    badge: 'Stock limité',
    rangPopularite: 5,
    dateAjout: '2026-08-28',
    couleur: '#d7b8ab',
  },
  {
    id: 6,
    nom: 'Planche à découper en érable',
    categorie: CUISINE,
    prix: 64,
    enStock: true,
    enPromotion: true,
    rangPopularite: 6,
    dateAjout: '2026-05-05',
    couleur: '#d9bf92',
  },
  {
    id: 7,
    nom: 'Chaussettes de laine',
    categorie: ACCESSOIRES,
    prix: 24,
    enStock: false,
    enPromotion: false,
    badge: 'Rupture',
    rangPopularite: 7,
    dateAjout: '2026-02-18',
    couleur: '#b7bfcc',
  },
  {
    id: 8,
    nom: 'Beurre d’érable 250 g',
    categorie: EPICERIE,
    prix: 11,
    enStock: true,
    enPromotion: false,
    rangPopularite: 8,
    dateAjout: '2026-04-22',
    couleur: '#ead0a0',
  },
]

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      const corps = url === '/api/categories' ? [MAISON, CUISINE, EPICERIE, ACCESSOIRES] : PRODUITS
      return Promise.resolve(new Response(JSON.stringify(corps)))
    }),
  )
})

afterEach(() => vi.unstubAllGlobals())

describe('CataloguePage', () => {
  it('renders every product by default', async () => {
    renderWithProviders(<CataloguePage />)
    expect(await screen.findAllByRole('article')).toHaveLength(8)
    expect(screen.getByText('8 produits · fabriqués au Québec')).toBeInTheDocument()
  })

  it('filters by category and hides out-of-stock products', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CataloguePage />)
    await screen.findAllByRole('article')

    await user.click(screen.getByRole('button', { name: /Accessoires/ }))
    expect(screen.getAllByRole('article')).toHaveLength(2)

    await user.click(screen.getByLabelText('En stock seulement'))
    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(1)
    expect(within(articles[0]!).getByText('Tuque en laine mérinos')).toBeInTheDocument()
  })

  it('sorts by ascending price', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CataloguePage />)
    await screen.findAllByRole('article')

    await user.selectOptions(screen.getByLabelText('Trier par'), 'prix-croissant')
    const names = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(names[0]).toBe('Beurre d’érable 250 g')
    expect(names.at(-1)).toBe('Jeté en laine tissé')
  })
})
