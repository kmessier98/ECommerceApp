import { Link, useParams } from 'react-router-dom'
import { formatPrix } from '@/shared/utils/format'
import { useConfirmationCommande } from '../api'
import { SuiviCommande } from './SuiviCommande'

export function ConfirmationPage() {
  const { numero = '' } = useParams()
  const { data: commande, isLoading } = useConfirmationCommande(numero)

  if (isLoading) return <p className="text-center text-sm text-stone-500">Chargement…</p>

  if (!commande) {
    return (
      <p className="text-center text-sm text-stone-500">
        Commande introuvable.{' '}
        <Link to="/commandes" className="text-brique font-semibold underline underline-offset-2">
          Voir mes commandes
        </Link>
      </p>
    )
  }

  const nbArticles = commande.articles.reduce((total, a) => total + a.quantite, 0)
  const { livraison } = commande

  return (
    <div className="mx-auto max-w-2xl">
      <header className="text-center">
        <span className="bg-sapin mx-auto flex size-13 items-center justify-center rounded-full text-white">
          <CheckIcon />
        </span>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">
          Merci, {commande.prenomClient}&nbsp;!
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Votre paiement est confirmé. La commande{' '}
          <strong className="text-encre">{commande.numero}</strong> est en préparation.
          <br />
          Un reçu a été envoyé à {commande.courriel}.
        </p>
      </header>

      <div className="mt-5">
        <SuiviCommande etapes={commande.etapes} etapeCourante={commande.etapeCourante} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_15rem]">
        <section className="rounded-2xl border border-stone-200 bg-white px-5 py-5">
          <h2 className="font-display text-xl font-semibold">Articles ({nbArticles})</h2>
          <ul className="mt-2.5 space-y-2 border-b border-stone-200 pb-3">
            {commande.articles.map((article) => (
              <li key={article.produitId} className="flex items-center gap-3 text-xs">
                <span
                  className="size-11 shrink-0 rounded-lg"
                  style={{ backgroundColor: article.couleur }}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  {article.nom} × {article.quantite}
                </span>
                <span className="font-semibold">{formatPrix(article.montant)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-baseline justify-between">
            <span className="text-xs text-stone-600">Total payé (livraison et taxes incluses)</span>
            <span className="font-display text-2xl font-semibold" data-testid="total">
              {formatPrix(commande.total)}
            </span>
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white px-5 py-5 text-xs">
          <h2 className="font-display text-xl font-semibold">Livraison</h2>
          <address className="mt-2.5 not-italic">
            {livraison.destinataire}
            <br />
            {livraison.adresse}
            <br />
            {livraison.villeProvince}
          </address>
          <p className="mt-2 text-stone-500">{livraison.methode}</p>
          <p className="mt-2 font-semibold">Arrivée prévue : {livraison.arriveePrevue}</p>
        </section>
      </div>

      <nav className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Link
          to="/commandes"
          className="bg-encre rounded-full px-5 py-3 text-xs font-semibold text-white transition hover:bg-stone-700"
        >
          Voir mes commandes
        </Link>
        <Link
          to="/catalogue"
          className="border-encre rounded-full border px-5 py-3 text-xs font-semibold transition hover:bg-stone-100"
        >
          Continuer mes achats
        </Link>
      </nav>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}
