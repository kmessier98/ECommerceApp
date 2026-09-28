import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthLayout, CLASSES_CHAMP } from './AuthLayout'
import { useConnexion } from '../api'
import { destinationSure } from '../redirection'
import { messagesErreur } from '@/lib/api-client'
import { BandeauErreur } from './BandeauErreur'

const TUILES = ['bg-[#d8c8b5]', 'bg-[#e3b874]', 'bg-[#bfc9b1]', 'bg-[#d6b8ab]']

// TODO: read the real count from the cart once a cart feature exists
const ARTICLES_PANIER = 4

export function ConnexionPage() {
  const [courriel, setCourriel] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)
  const [resterConnecte, setResterConnecte] = useState(false)
  const connexion = useConnexion()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const messagesErreurConnexion = messagesErreur(connexion.error)

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const destination = destinationSure(searchParams.get('retour'))
    connexion.mutate(
      { courriel, motDePasse, resterConnecte },
      { onSuccess: () => navigate(destination, { replace: true }) },
    )
  }

  function modifier(setter: (valeur: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value)
      if (connexion.isError) connexion.reset()
    }
  }

  return (
    <AuthLayout
      panneau={
        <>
          <div className="mb-8 grid grid-cols-2 gap-3" aria-hidden="true">
            {TUILES.map((couleur) => (
              <div key={couleur} className={`aspect-6/5 rounded-xl ${couleur}`} />
            ))}
          </div>
          <p className="font-display text-3xl leading-tight font-semibold">
            Des objets faits ici, pour les longs hivers.
          </p>
          <p className="mt-2 text-sm text-stone-300">
            Suivez vos commandes et payez plus vite avec votre compte.
          </p>
        </>
      }
      lienHaut={
        <>
          Nouveau client ?{' '}
          <Link to="/inscription" className="text-brique font-semibold underline">
            Créer un compte
          </Link>
        </>
      }
      pied="En vous connectant, vous acceptez nos conditions d’utilisation et notre politique de confidentialité."
    >
      <h1 className="font-display text-4xl font-semibold tracking-tight">Connexion</h1>
      <p className="mt-1 text-sm text-stone-600">Content de vous revoir.</p>

      {ARTICLES_PANIER > 0 && (
        <p className="mt-5 flex gap-2 rounded-lg bg-[#e3eaf3] px-3 py-2.5 text-xs text-[#2c4a6b]">
          <InfoIcon />
          <span>
            Connectez-vous pour passer au paiement. Votre panier ({ARTICLES_PANIER} article
            {ARTICLES_PANIER > 1 ? 's' : ''}) est conservé.
          </span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor="courriel" className="mb-1.5 block text-xs font-semibold">
            Courriel
          </label>
          <input
            id="courriel"
            type="email"
            autoComplete="email"
            required
            value={courriel}
            onChange={modifier(setCourriel)}
            className={CLASSES_CHAMP}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="mot-de-passe" className="text-xs font-semibold">
              Mot de passe
            </label>
            <Link to="/mot-de-passe-oublie" className="text-brique text-xs font-semibold underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="flex items-center rounded-lg border border-stone-300 bg-white focus-within:border-stone-500">
            <input
              id="mot-de-passe"
              type={afficherMotDePasse ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={motDePasse}
              onChange={modifier(setMotDePasse)}
              className="w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setAfficherMotDePasse((v) => !v)}
              aria-pressed={afficherMotDePasse}
              className="hover:text-encre px-3 text-xs font-semibold text-stone-700"
            >
              {afficherMotDePasse ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={resterConnecte}
            onChange={(e) => setResterConnecte(e.target.checked)}
            className="accent-brique size-4"
          />
          Rester connecté
        </label>

        <BandeauErreur messages={messagesErreurConnexion} />

        <button
          type="submit"
          className="bg-brique rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={connexion.isPending}
        >
          {connexion.isPending ? 'Connexion en cours…' : 'Se connecter et continuer'}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-stone-500">
        <span className="h-px flex-1 bg-stone-300" />
        ou
        <span className="h-px flex-1 bg-stone-300" />
      </div>

      <Link
        to="/inscription"
        className="border-encre rounded-full border py-3 text-center text-sm font-semibold transition hover:bg-white"
      >
        Créer un compte
      </Link>
    </AuthLayout>
  )
}

function InfoIcon() {
  return (
    <svg
      className="mt-0.5 size-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  )
}
