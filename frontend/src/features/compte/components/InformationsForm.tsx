import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import type { Utilisateur } from '@/features/auth'
import {
  CLASSES_BOUTON_PRINCIPAL,
  CLASSES_BOUTON_SECONDAIRE,
  CLASSES_CHAMP,
  Carte,
  Champ,
} from './ui'

type Informations = Pick<Utilisateur, 'prenom' | 'nom' | 'courriel'>

interface InformationsFormProps {
  utilisateur: Utilisateur
  onEnregistre: () => void
}

export function InformationsForm({ utilisateur, onEnregistre }: InformationsFormProps) {
  const { prenom, nom, courriel } = utilisateur
  // Last saved values, restored by Annuler.
  const [enregistrees, setEnregistrees] = useState<Informations>({ prenom, nom, courriel })
  const [valeurs, setValeurs] = useState<Informations>(enregistrees)

  function modifier(champ: keyof Informations) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setValeurs((v) => ({ ...v, [champ]: e.target.value }))
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: send to the API once it has an endpoint to update the profile.
    setEnregistrees(valeurs)
    onEnregistre()
  }

  return (
    <Carte
      titre="Informations personnelles"
      sousTitre="Utilisées pour vos commandes et vos factures."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Champ id="prenom" libelle="Prénom">
            <input
              id="prenom"
              autoComplete="given-name"
              required
              value={valeurs.prenom}
              onChange={modifier('prenom')}
              className={CLASSES_CHAMP}
            />
          </Champ>
          <Champ id="nom" libelle="Nom">
            <input
              id="nom"
              autoComplete="family-name"
              required
              value={valeurs.nom}
              onChange={modifier('nom')}
              className={CLASSES_CHAMP}
            />
          </Champ>
        </div>

        <Champ id="courriel" libelle="Courriel">
          <input
            id="courriel"
            type="email"
            autoComplete="email"
            required
            value={valeurs.courriel}
            onChange={modifier('courriel')}
            aria-describedby="aide-courriel"
            className={CLASSES_CHAMP}
          />
          <p id="aide-courriel" className="mt-1.5 text-xs text-stone-500">
            Sert à vous connecter et à recevoir vos confirmations de commande.
          </p>
        </Champ>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setValeurs(enregistrees)}
            className={CLASSES_BOUTON_SECONDAIRE}
          >
            Annuler
          </button>
          <button type="submit" className={CLASSES_BOUTON_PRINCIPAL}>
            Enregistrer
          </button>
        </div>
      </form>
    </Carte>
  )
}
