import { formatDate, formatPrix } from '@/shared/utils/format'
import { STATUTS } from '../statuts'
import type { Commande } from '../types'

const MINIATURES_MAX = 3

export function CommandeLigne({ commande }: { commande: Commande }) {
  const { classes, action } = STATUTS[commande.statut]
  const nbArticles = commande.articles.reduce((total, a) => total + a.quantite, 0)

  return (
    <article className="grid grid-cols-2 items-center gap-4 rounded-xl border border-stone-200 bg-white px-5 py-4 md:grid-cols-[9rem_1fr_7rem_9rem_8rem]">
      <div>
        <h2 className="text-sm font-semibold">{commande.numero}</h2>
        <p className="text-xs text-stone-500">{formatDate(commande.date)}</p>
      </div>

      <div className="flex items-center gap-2">
        {commande.articles.slice(0, MINIATURES_MAX).map((article) => (
          <span
            key={article.produitId}
            title={article.nom}
            className="size-10 shrink-0 rounded-lg"
            style={{ backgroundColor: article.couleur }}
          />
        ))}
        <span className="ml-1 text-xs text-stone-500">
          {nbArticles} article{nbArticles > 1 ? 's' : ''}
        </span>
      </div>

      <p className="font-display text-lg font-semibold">{formatPrix(commande.total)}</p>

      <p>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
          {commande.statut}
        </span>
      </p>

      {/* TODO: wire each action once tracking, invoices and checkout exist */}
      <button
        type="button"
        className="rounded-full border border-stone-300 px-4 py-2.5 text-xs font-semibold transition hover:border-stone-500"
      >
        {action}
      </button>
    </article>
  )
}
