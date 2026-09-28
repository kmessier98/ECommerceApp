import { describe, expect, it } from 'vitest'
import { destinationSure } from './redirection'

describe('destinationSure', () => {
  it('keeps an internal path', () => {
    expect(destinationSure('/compte/adresses?onglet=2')).toBe('/compte/adresses?onglet=2')
  })

  it('falls back to the catalogue when there is no retour parameter', () => {
    expect(destinationSure(null)).toBe('/catalogue')
  })

  // Open redirect attempts: each would send the user to another site after login.
  it.each(['https://pirate.com', '//pirate.com', '/\\pirate.com', 'pirate.com', ''])(
    'refuses %j and falls back to the catalogue',
    (retour) => {
      expect(destinationSure(retour)).toBe('/catalogue')
    },
  )
})
