import { useState, type SubmitEvent } from 'react'
import { ForceMotDePasse, motDePasseValide } from '@/features/auth'
import { formatDate } from '@/shared/utils/format'
import { CLASSES_BOUTON_PRINCIPAL, CLASSES_CHAMP, Carte, Champ } from './ui'

interface MotDePasseFormProps {
  dateModification: string
  onEnregistre: () => void
}

export function MotDePasseForm({ dateModification, onEnregistre }: MotDePasseFormProps) {
  const [actuel, setActuel] = useState('')
  const [nouveau, setNouveau] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const confirmationDifferente = confirmation !== '' && confirmation !== nouveau
  const valide = actuel !== '' && motDePasseValide(nouveau) && confirmation === nouveau

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: send to the API once it has an endpoint to change the password.
    setActuel('')
    setNouveau('')
    setConfirmation('')
    onEnregistre()
  }

  return (
    <Carte
      titre="Mot de passe"
      sousTitre={`Dernière modification le ${formatDate(dateModification)}.`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Champ id="mot-de-passe-actuel" libelle="Mot de passe actuel">
            <input
              id="mot-de-passe-actuel"
              type="password"
              autoComplete="current-password"
              required
              value={actuel}
              onChange={(e) => setActuel(e.target.value)}
              className={CLASSES_CHAMP}
            />
          </Champ>
        </div>

        <div className="grid items-start gap-3 sm:grid-cols-2">
          <Champ id="nouveau-mot-de-passe" libelle="Nouveau mot de passe">
            <input
              id="nouveau-mot-de-passe"
              type="password"
              autoComplete="new-password"
              required
              value={nouveau}
              onChange={(e) => setNouveau(e.target.value)}
              aria-describedby="regles-nouveau-mot-de-passe"
              className={CLASSES_CHAMP}
            />
            <ForceMotDePasse id="regles-nouveau-mot-de-passe" motDePasse={nouveau} />
          </Champ>
          <Champ id="confirmation-mot-de-passe" libelle="Confirmer le nouveau mot de passe">
            <input
              id="confirmation-mot-de-passe"
              type="password"
              autoComplete="new-password"
              required
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              aria-invalid={confirmationDifferente}
              aria-describedby={confirmationDifferente ? 'erreur-confirmation' : undefined}
              className={CLASSES_CHAMP}
            />
            {confirmationDifferente && (
              <p id="erreur-confirmation" className="text-brique mt-1.5 text-xs">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </Champ>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={!valide} className={CLASSES_BOUTON_PRINCIPAL}>
            Changer le mot de passe
          </button>
        </div>
      </form>
    </Carte>
  )
}
