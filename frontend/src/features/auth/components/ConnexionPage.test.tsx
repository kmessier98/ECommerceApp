import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ConnexionPage } from './ConnexionPage'

describe('ConnexionPage', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<ConnexionPage />, { wrapper: MemoryRouter })

    const motDePasse = screen.getByLabelText('Mot de passe')
    expect(motDePasse).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Afficher' }))
    expect(motDePasse).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Masquer' }))
    expect(motDePasse).toHaveAttribute('type', 'password')
  })
})
