import { useState, type SubmitEvent } from 'react'
import { Link } from 'react-router-dom'

const TUILES = ['bg-[#d8c8b5]', 'bg-[#e3b874]', 'bg-[#bfc9b1]', 'bg-[#d6b8ab]']

// TODO: read the real count from the cart once a cart feature exists
const ARTICLES_PANIER = 4

export function ConnexionPage() {
  const [courriel, setCourriel] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)
  const [resterConnecte, setResterConnecte] = useState(false)

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    // TODO: call the login endpoint once the backend exposes one
  }

  return (
    <div className="flex min-h-screen">
      <aside className="bg-encre hidden w-2/5 max-w-xl flex-col justify-between p-10 text-stone-100 md:flex">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Nordet
        </Link>

        <div>
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
        </div>
      </aside>

      <div className="flex flex-1 flex-col px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <Link to="/panier" className="text-brique font-semibold underline">
            ← Retour au panier
          </Link>
          <p className="text-stone-600">
            Nouveau client ?{' '}
            <Link to="/inscription" className="text-brique font-semibold underline">
              Créer un compte
            </Link>
          </p>
        </div>

        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
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
                onChange={(e) => setCourriel(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="mot-de-passe" className="text-xs font-semibold">
                  Mot de passe
                </label>
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-brique text-xs font-semibold underline"
                >
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
                  onChange={(e) => setMotDePasse(e.target.value)}
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

            <button
              type="submit"
              className="bg-brique rounded-full py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Se connecter et continuer
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
        </main>

        <p className="text-center text-[11px] text-stone-500">
          En vous connectant, vous acceptez nos conditions d’utilisation et notre politique de
          confidentialité.
        </p>
      </div>
    </div>
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
