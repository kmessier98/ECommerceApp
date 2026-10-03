import { Link } from 'react-router-dom'
import { formatPrix } from '@/shared/utils/format'
import { LignePanierItem } from './LignePanierItem'
import { usePanier } from '../api'
import { ResumePanier } from './ResumePanier'
import { PanierVide } from './PanierVide'

export function PanierPage() {
  const { data, isPending } = usePanier()

  if (isPending) return <p>Chargement...</p>
  if (!data) return <p>Impossible de charger le panier.</p>

  const { articles, resumePanier } = data

  if (!resumePanier || articles.length === 0) {
    return <PanierVide />
  }

  const { nombreArticles, sousTotal, montantPourLivraisonGratuite, seuilLivraisonGratuite } = resumePanier
  const progression = Math.min(
    100,
    Math.max(0, (sousTotal / seuilLivraisonGratuite) * 100),
  )

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Votre panier{' '}
          <span className="text-xl font-medium text-stone-500">
            ({nombreArticles} article{nombreArticles > 1 ? 's' : ''})
          </span>
        </h1>
        <Link
          to="/catalogue"
          className="text-brique mb-1 text-xs font-semibold underline underline-offset-2"
        >
          ← Continuer mes achats
        </Link>
      </header>

      {articles.length === 0 ? (
        <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Votre panier est vide.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <section className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5">
              <p className="text-xs">
                {montantPourLivraisonGratuite > 0
                  ? `Plus que ${formatPrix(montantPourLivraisonGratuite)} pour obtenir la livraison gratuite.`
                  : 'Vous profitez de la livraison gratuite.'}
              </p>
              <div
                role="progressbar"
                aria-label="Progression vers la livraison gratuite"
                aria-valuenow={Math.round(progression)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-2 h-1.5 rounded-full bg-stone-200"
              >
                <div
                  className="bg-brique h-full rounded-full transition-[width]"
                  style={{ width: `${progression}%` }}
                />
              </div>
            </section>

            <ul className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white px-5 py-1">
              {articles.map((ligne) => (
                <LignePanierItem key={ligne.produitId} ligne={ligne} />
              ))}
            </ul>
          </div>

          <ResumePanier totaux={resumePanier} />
        </div>
      )}
    </div>
  )
}
