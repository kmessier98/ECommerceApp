import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { ProfilPage } from './ProfilPage'

const UTILISATEUR = {
  id: 1,
  prenom: 'Julie',
  nom: 'Martin',
  courriel: 'julie.martin@exemple.ca',
  dateCreation: '2026-06-15T00:00:00Z',
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify(UTILISATEUR)))),
  )
})

afterEach(() => vi.unstubAllGlobals())

function renderPage() {
  renderWithProviders(
    <MemoryRouter>
      <ProfilPage />
    </MemoryRouter>,
  )
}

describe('ProfilPage', () => {
  it('prefills the personal information with the signed-in user', async () => {
    renderPage()
    expect(await screen.findByLabelText('Prénom')).toHaveValue('Julie')
    expect(screen.getByLabelText('Nom')).toHaveValue('Martin')
    expect(screen.getByLabelText('Courriel')).toHaveValue('julie.martin@exemple.ca')
  })

  it('restores the saved values on Annuler', async () => {
    const user = userEvent.setup()
    renderPage()
    const prenom = await screen.findByLabelText('Prénom')
    await user.clear(prenom)
    await user.type(prenom, 'Juliette')
    await user.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(prenom).toHaveValue('Julie')
  })

  it('enables the password change only once the new password is valid and confirmed', async () => {
    const user = userEvent.setup()
    renderPage()
    const bouton = screen.getByRole('button', { name: 'Changer le mot de passe' })
    await user.type(screen.getByLabelText('Mot de passe actuel'), 'Ancien1!')
    await user.type(screen.getByLabelText('Nouveau mot de passe'), 'Nouveau1!')
    await user.type(screen.getByLabelText('Confirmer le nouveau mot de passe'), 'Nouveau1')

    expect(screen.getByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument()
    expect(bouton).toBeDisabled()

    await user.type(screen.getByLabelText('Confirmer le nouveau mot de passe'), '!')
    expect(bouton).toBeEnabled()
    await user.click(bouton)
    expect(screen.getByRole('status')).toHaveTextContent('Modifications enregistrées')
  })

  it('toggles a communication preference', async () => {
    const user = userEvent.setup()
    renderPage()
    const infolettre = screen.getByRole('switch', { name: /Infolettre/ })
    expect(infolettre).toBeChecked()
    await user.click(infolettre)
    expect(infolettre).not.toBeChecked()
  })
})
