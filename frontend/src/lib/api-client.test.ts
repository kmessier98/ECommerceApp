import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  apiClient,
  ApiError,
  estServeurInjoignable,
  messagesErreur,
  ServeurInjoignableError,
} from './api-client'

function mockFetch(status: number, body?: unknown) {
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockResolvedValue(
        new Response(body === undefined ? null : JSON.stringify(body), { status }),
      ),
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('apiClient', () => {
  it('returns parsed JSON on success', async () => {
    mockFetch(200, [{ id: 1, nom: 'A' }])
    await expect(apiClient.get('/api/tests')).resolves.toEqual([{ id: 1, nom: 'A' }])
  })

  it('returns undefined on 204', async () => {
    mockFetch(204)
    await expect(apiClient.delete('/api/tests/1')).resolves.toBeUndefined()
  })

  it('throws ApiError with the backend { errors } shape', async () => {
    mockFetch(404, { errors: ['Test introuvable'] })
    const error = await apiClient.get('/api/tests/99').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, errors: ['Test introuvable'] })
  })
})

describe('serveur injoignable', () => {
  it('wraps a network failure in ServeurInjoignableError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const error = await apiClient.get('/api/tests').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ServeurInjoignableError)
    expect(estServeurInjoignable(error)).toBe(true)
  })

  it('treats gateway statuses as unreachable, but not other errors', () => {
    expect(estServeurInjoignable(new ApiError(502, ['Bad Gateway']))).toBe(true)
    expect(estServeurInjoignable(new ApiError(503, []))).toBe(true)
    expect(estServeurInjoignable(new ApiError(500, ['Erreur']))).toBe(false)
    expect(estServeurInjoignable(new ApiError(404, ['Introuvable']))).toBe(false)
    expect(estServeurInjoignable(new TypeError('bug'))).toBe(false)
  })

  it('shows a French message instead of the proxy status text', () => {
    expect(messagesErreur(new ApiError(502, ['Bad Gateway']))).toEqual([
      'Impossible de joindre le serveur. Réessayez.',
    ])
  })
})
