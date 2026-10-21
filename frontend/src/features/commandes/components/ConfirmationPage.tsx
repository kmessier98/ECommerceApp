import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUtilisateurCourant } from '@/features/auth'
import { ApiError, messagesErreur } from '@/lib/api-client'
import { formatPrix } from '@/shared/utils/format'
import { useCommande } from '../api'

export function ConfirmationPage() {
  const { numero = '' } = useParams()
  const { data: commande, isPending, isError, error } = useCommande(Number(numero))
  const { data: utilisateur } = useUtilisateurCourant()
  const queryClient = useQueryClient()

  const payee = commande?.statut === 'Payee'

  // Once paid, the webhook has deleted the cart on the server: refetch what other
  // components show (e.g. the cart count in the navbar).
  useEffect(() => {
    if (payee) queryClient.invalidateQueries()
  }, [payee, queryClient])

  if (isPending) return <p className="text-center text-sm text-stone-500">Chargement…</p>

  if (isError) {
    const introuvable = error instanceof ApiError && error.status === 404
    return (
      <p role="alert" className="text-center text-sm text-stone-500">
        {introuvable ? 'Commande introuvable.' : messagesErreur(error).join(' ')}{' '}
        <Link to="/commandes" className="text-brique font-semibold underline underline-offset-2">
          Voir mes commandes
        </Link>
      </p>
    )
  }

  if (commande.statut === 'EnAttente') {
    return (
      <div role="status" className="mx-auto max-w-md text-center">
        <h1 className="font-display text-3xl font-semibold">Paiement en cours de confirmation…</h1>
        <p className="mt-3 text-sm text-stone-600">
          Cela prend habituellement quelques secondes. Cette page se mettra à jour toute seule.
        </p>
      </div>
    )
  }

  if (commande.statut === 'Annulee') {
    return (
      <p className="text-center text-sm text-stone-500">
        Cette commande a été annulée.{' '}
        <Link to="/panier" className="text-brique font-semibold underline underline-offset-2">
          Retour au panier
        </Link>
      </p>
    )
  }

  const nbArticles = commande.articles.reduce((total, a) => total + a.quantite, 0)
  const montants = [
    { label: 'Sous-total', montant: formatPrix(commande.sousTotal) },
    {
      label: 'Livraison',
      montant: commande.livraison === 0 ? 'Gratuite' : formatPrix(commande.livraison),
    },
    { label: 'TPS (5 %)', montant: formatPrix(commande.tps) },
    { label: 'TVQ (9,975 %)', montant: formatPrix(commande.tvq) },
  ]

  return (
    <div className="mx-auto max-w-2xl">
      <header className="text-center">
        <span className="bg-sapin mx-auto flex size-13 items-center justify-center rounded-full text-white">
          <CheckIcon />
        </span>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight">
          Merci{utilisateur ? `, ${utilisateur.prenom}` : ''}&nbsp;!
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Votre paiement est confirmé. La commande{' '}
          <strong className="text-encre">n°&nbsp;{commande.id}</strong> est enregistrée.
        </p>
      </header>

      <section className="mt-5 rounded-2xl border border-stone-200 bg-white px-5 py-5">
        <h2 className="font-display text-xl font-semibold">Articles ({nbArticles})</h2>
        <ul className="mt-2.5 space-y-2 border-b border-stone-200 pb-3 text-xs">
          {commande.articles.map((article) => (
            <li key={article.produitId} className="flex justify-between">
              <span>
                {article.nomProduit} × {article.quantite}
              </span>
              <span className="font-semibold">
                {formatPrix(article.prixUnitaire * article.quantite)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1.5 border-b border-stone-200 pb-3 text-xs">
          {montants.map(({ label, montant }) => (
            <div key={label} className="flex justify-between">
              <dt className="text-stone-600">{label}</dt>
              <dd>{montant}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex items-baseline justify-between">
          <span className="text-xs text-stone-600">Total payé</span>
          <span className="font-display text-2xl font-semibold" data-testid="total">
            {formatPrix(commande.total)}
          </span>
        </p>
      </section>

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
