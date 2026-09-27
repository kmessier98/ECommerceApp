import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CataloguePage } from './CataloguePage'

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
