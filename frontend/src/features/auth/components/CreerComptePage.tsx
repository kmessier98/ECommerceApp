import { useState, type ChangeEvent, type ReactNode, type SubmitEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout, CLASSES_CHAMP } from './AuthLayout'
import { useInscription } from '../api'
import { destinationSure } from '../redirection'
import { messagesErreur } from '@/lib/api-client'
import { BandeauErreur } from './BandeauErreur'

const REGLES_MOT_DE_PASSE: { libelle: string; test: (motDePasse: string) => boolean }[] = [
  { libelle: '8 caractères minimum', test: (m) => m.length >= 8 },
  { libelle: 'Une majuscule', test: (m) => /[A-Z]/.test(m) },
  { libelle: 'Un chiffre', test: (m) => /\d/.test(m) },
  { libelle: 'Un caractère spécial', test: (m) => /[^A-Za-z0-9]/.test(m) },
]

const AVANTAGES: { icone: ReactNode; texte: string }[] = [
  { icone: <BoxIcon />, texte: 'Suivez vos commandes en temps réel' },
  { icone: <RepeatIcon />, texte: 'Rachetez vos produits préférés en un clic' },
  { icone: <HomeIcon />, texte: 'Adresse de livraison préremplie' },
]

export function CreerComptePage() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [accepteConditions, setAccepteConditions] = useState(false)
  const [infolettre, setInfolettre] = useState(false)
  const inscription = useInscription()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const messagesErreurInscription = messagesErreur(inscription.error)

  const reglesRespectees = REGLES_MOT_DE_PASSE.map((regle) => regle.test(motDePasse))
  const force = reglesRespectees.filter(Boolean).length

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const destination = destinationSure(searchParams.get('retour'))
    inscription.mutate(
      { prenom, nom, courriel, motDePasse, accepteConditions, infolettre },
      {
        onSuccess: () => {
          navigate(destination, { replace: true })
        },
      },
    )
  }

  function modifier(setter: (valeur: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      if (inscription.isError) inscription.reset()
    }
  }

  return (
    <AuthLayout
      panneau={
        <>
          <p className="font-display mb-5 text-3xl leading-tight font-semibold">
            Un compte, c’est pratique.
          </p>
          <ul className="flex flex-col gap-3">
            {AVANTAGES.map(({ icone, texte }) => (
              <li
                key={texte}
                className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3.5 text-sm"
              >
                <span className="text-[#e3b874]">{icone}</span>
                {texte}
              </li>
            ))}
          </ul>
        </>
      }
      lienHaut={
        <>
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-brique font-semibold underline">
            Se connecter
          </Link>
        </>
      }
    >
      <h1 className="font-display text-4xl font-semibold tracking-tight">Créer un compte</h1>
      <p className="mt-1 text-sm text-stone-600">Ça prend moins d’une minute.</p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <Champ id="prenom" libelle="Prénom">
            <input
              id="prenom"
              autoComplete="given-name"
              required
              value={prenom}
              onChange={modifier(setPrenom)}
              className={CLASSES_CHAMP}
            />
          </Champ>
          <Champ id="nom" libelle="Nom">
            <input
              id="nom"
              autoComplete="family-name"
              required
              value={nom}
              onChange={modifier(setNom)}
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
            value={courriel}
            onChange={modifier(setCourriel)}
            className={CLASSES_CHAMP}
          />
        </Champ>

        <Champ id="mot-de-passe" libelle="Mot de passe">
          <input
            id="mot-de-passe"
            type="password"
            autoComplete="new-password"
            required
            value={motDePasse}
            onChange={modifier(setMotDePasse)}
            aria-describedby="regles-mot-de-passe"
            className={CLASSES_CHAMP}
          />
          <div className="mt-2.5 grid grid-cols-4 gap-1" aria-hidden="true">
            {REGLES_MOT_DE_PASSE.map((regle, i) => (
              <span
                key={regle.libelle}
                className={`h-1 rounded-full ${i < force ? 'bg-[#c98a1e]' : 'bg-stone-200'}`}
              />
            ))}
          </div>
          <ul id="regles-mot-de-passe" className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {REGLES_MOT_DE_PASSE.map((regle, i) => (
              <li
                key={regle.libelle}
                className={`flex items-center gap-1.5 ${reglesRespectees[i] ? 'text-stone-700' : 'text-stone-500'}`}
              >
                {reglesRespectees[i] ? <CheckIcon /> : <CircleIcon />}
                {regle.libelle}
              </li>
            ))}
          </ul>
        </Champ>

        <div className="flex flex-col gap-3 text-sm text-stone-700">
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              required
              checked={accepteConditions}
              onChange={(e) => setAccepteConditions(e.target.checked)}
              className="accent-brique mt-0.5 size-4 shrink-0"
            />
            <span>
              J’accepte les{' '}
              <Link to="/conditions" className="text-brique underline">
                conditions d’utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/confidentialite" className="text-brique underline">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              checked={infolettre}
              onChange={(e) => setInfolettre(e.target.checked)}
              className="accent-brique mt-0.5 size-4 shrink-0"
            />
            Recevoir l’infolettre (nouveautés et promotions, 2 fois par mois).
          </label>
        </div>

        <BandeauErreur messages={messagesErreurInscription} />

        <button
          type="submit"
          className="bg-brique rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={inscription.isPending}
        >
          {inscription.isPending ? 'Création en cours…' : 'Créer mon compte et continuer'}
        </button>
      </form>
    </AuthLayout>
  )
}

function Champ({ id, libelle, children }: { id: string; libelle: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {libelle}
      </label>
      {children}
    </div>
  )
}

function Icone({ children, className = 'size-4' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function BoxIcon() {
  return (
    <Icone>
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </Icone>
  )
}

function RepeatIcon() {
  return (
    <Icone>
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </Icone>
  )
}

function HomeIcon() {
  return (
    <Icone>
      <path d="M3 10.5 12 3l9 7.5V21H3V10.5Z" />
      <path d="M9 21v-6h6v6" />
    </Icone>
  )
}

function CheckIcon() {
  return (
    <Icone className="size-3">
      <path d="m5 12 5 5 9-10" />
    </Icone>
  )
}

function CircleIcon() {
  return (
    <Icone className="size-3">
      <circle cx="12" cy="12" r="7" />
    </Icone>
  )
}
