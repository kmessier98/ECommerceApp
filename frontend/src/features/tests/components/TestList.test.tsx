import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { TestList } from './TestList'

afterEach(() => vi.unstubAllGlobals())

describe('TestList', () => {
  it('renders items returned by the API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 1, nom: 'Premier' }]))),
    )
    renderWithProviders(<TestList />)
    expect(await screen.findByText('Premier')).toBeInTheDocument()
  })
})
