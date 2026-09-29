import { useEffect, useState } from 'react'
import { useUtilisateurCourant } from '@/features/auth'
import { PROFIL_MOCK } from '../mock-profil'
import type { PreferencesCommunication } from '../types'
import { InformationsForm } from './InformationsForm'
import { MotDePasseForm } from './MotDePasseForm'
import { Carte, Interrupteur } from './ui'

const DUREE_CONFIRMATION_MS = 4000

export function ProfilPage() {
  const { data: utilisateur } = useUtilisateurCourant()
  const [communications, setCommunications] = useState<PreferencesCommunication>(
    PROFIL_MOCK.communications,
  )
  // Incremented on every save, so a second save restarts the badge's timer.
  const [enregistrements, setEnregistrements] = useState(0)
  const [confirmationVisible, setConfirmationVisible] = useState(false)

  useEffect(() => {
    if (enregistrements === 0) return
    const minuterie = setTimeout(() => setConfirmationVisible(false), DUREE_CONFIRMATION_MS)
    return () => clearTimeout(minuterie)
  }, [enregistrements])

  function confirmer() {
    setConfirmationVisible(true)
    setEnregistrements((n) => n + 1)
  }

  function basculer(preference: keyof PreferencesCommunication) {
    return (actif: boolean) => {
      // TODO: send to the API once it stores the communication preferences.
      setCommunications((c) => ({ ...c, [preference]: actif }))
      confirmer()
    }
  }

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Profil</h1>
        <p role="status">
          {confirmationVisible && (
            <span className="bg-sapin/10 text-sapin rounded-full px-4 py-2 text-xs font-semibold">
              ✓ Modifications enregistrées
            </span>
          )}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {/* RequireAuth renders the account pages only once the user is known. */}
        {utilisateur && <InformationsForm utilisateur={utilisateur} onEnregistre={confirmer} />}

        <MotDePasseForm
          dateModification={PROFIL_MOCK.dateModificationMotDePasse}
          onEnregistre={confirmer}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Carte titre="Communications" separateur>
            <div className="-my-3 divide-y divide-stone-200">
              <Interrupteur
                libelle="Infolettre"
                description="Nouveautés et promotions, 2 fois par mois."
                actif={communications.infolettre}
                onChange={basculer('infolettre')}
              />
              <Interrupteur
                libelle="Suivi de commande par courriel"
                description="Expédition et livraison."
                actif={communications.suiviCommande}
                onChange={basculer('suiviCommande')}
              />
            </div>
          </Carte>

          <Carte titre="Supprimer le compte" separateur>
            <p className="text-sm leading-relaxed text-stone-600">
              Votre compte et vos adresses seront effacés définitivement. L’historique de vos
              commandes est conservé pour nos obligations comptables.
            </p>
            {/* TODO: ask for confirmation, then call the API once it can delete an account. */}
            <button
              type="button"
              className="text-brique border-brique/30 hover:bg-brique/5 mt-4 rounded-full border px-5 py-2.5 text-sm font-semibold transition"
            >
              Supprimer mon compte
            </button>
          </Carte>
        </div>
      </div>
    </>
  )
}
