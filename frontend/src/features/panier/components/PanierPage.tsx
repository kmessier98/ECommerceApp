import { Link } from 'react-router-dom'
import { formatPrix } from '@/shared/utils/format'
import { useNombreArticles, usePanier } from '../store'
import { calculerTotaux, SEUIL_LIVRAISON_GRATUITE } from '../totaux'
import { LignePanierItem } from './LignePanierItem'
import { ResumePanier } from './ResumePanier'

export function PanierPage() {
  const lignes = usePanier((state) => state.lignes)
  const nbArticles = useNombreArticles()
  const totaux = calculerTotaux(lignes)
  const progression = Math.min(100, (totaux.sousTotal / SEUIL_LIVRAISON_GRATUITE) * 100)

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Votre panier{' '}
          <span className="text-xl font-medium text-stone-500">
            ({nbArticles} article{nbArticles > 1 ? 's' : ''})
          </span>
        </h1>
        <Link
          to="/catalogue"
          className="text-brique mb-1 text-xs font-semibold underline underline-offset-2"
        >
          ← Continuer mes achats
        </Link>
      </header>

      {lignes.length === 0 ? (
        <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
          Votre panier est vide.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <section className="rounded-2xl border border-stone-200 bg-white px-4 py-3.5">
              <p className="text-xs">
                {totaux.resteAvantLivraisonGratuite > 0
                  ? `Plus que ${formatPrix(totaux.resteAvantLivraisonGratuite)} pour obtenir la livraison gratuite.`
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
              {lignes.map((ligne) => (
                <LignePanierItem key={ligne.produitId} ligne={ligne} />
              ))}
            </ul>
          </div>

          <ResumePanier totaux={totaux} />
        </div>
      )}
    </div>
  )
}
