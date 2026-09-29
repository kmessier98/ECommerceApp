import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CreerComptePage } from './CreerComptePage'

describe('CreerComptePage', () => {
  it('checks off password rules as they are met', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <MemoryRouter>
        <CreerComptePage />
      </MemoryRouter>,
    )

    const regles = screen
      .getAllByRole('listitem')
      .filter((li) => li.closest('#regles-mot-de-passe'))
    expect(regles.every((li) => li.classList.contains('text-stone-500'))).toBe(true)

    await user.type(screen.getByLabelText('Mot de passe'), 'Motdepasse1')
    const respectees = regles.filter((li) => li.classList.contains('text-stone-700'))
    expect(respectees.map((li) => li.textContent)).toEqual([
      '8 caractères minimum',
      'Une majuscule',
      'Un chiffre',
    ])
  })

  it('enables the submit button only once every password rule is met', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <MemoryRouter>
        <CreerComptePage />
      </MemoryRouter>,
    )

    const bouton = screen.getByRole('button', { name: 'Créer mon compte et continuer' })
    expect(bouton).toBeDisabled()

    await user.type(screen.getByLabelText('Mot de passe'), 'Motdepasse1')
    expect(bouton).toBeDisabled()

    await user.type(screen.getByLabelText('Mot de passe'), '!')
    expect(bouton).toBeEnabled()
  })
})
