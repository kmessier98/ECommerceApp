import { formatPrix } from '@/shared/utils/format'
import type { Produit } from '../types'
import { useAjouterArticle } from '@/features/panier'
import { imageUrl } from '@/lib/images'

export function ProduitCard({ produit }: { produit: Produit }) {
  const { mutate: ajouterArticle } = useAjouterArticle()

  const handleAjouter = () => {
    ajouterArticle(produit.id)
  }

  return (
    <article className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={`${imageUrl(produit.imageUrl)}`}
          alt={produit.nom}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/placeholder.webp'
          }}
        />
        {produit.badge && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold">
            {produit.badge}
          </span>
        )}
      </div>

      <p className="mt-2.5 text-xs text-stone-500">{produit.categorie.nom}</p>
      <h3 className="text-sm font-semibold">{produit.nom}</h3>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="font-display text-lg font-semibold">{formatPrix(produit.prix)}</span>
        {produit.enStock ? (
          <button
            type="button"
            className="bg-brique cursor-pointer rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            onClick={handleAjouter}
          >
            Ajouter
          </button>
        ) : (
          <button
            type="button"
            className="cursor-pointer rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold transition hover:border-stone-500"
          >
            M’avertir
          </button>
        )}
      </div>
    </article>
  )
}
