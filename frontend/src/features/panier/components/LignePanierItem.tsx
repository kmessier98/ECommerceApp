import { formatPrix } from '@/shared/utils/format'
import type { LignePanier } from '../types'

export function LignePanierItem({ ligne }: { ligne: LignePanier }) {
  //const changerQuantite = usePanier((state) => state.changerQuantite)
  //const retirer = usePanier((state) => state.retirer)

  return (
    <li className="grid grid-cols-[5.25rem_1fr] items-center gap-x-4 gap-y-3 py-4 sm:grid-cols-[5.25rem_1fr_auto_6rem]">
      <span
        className="size-21 rounded-lg"
        style={{ backgroundColor: ligne.couleur }}
        aria-hidden="true"
      />

      <div>
        <h2 className="text-sm font-semibold">{ligne.nom}</h2>
        <p className="mt-0.5 text-xs text-stone-500">{ligne.description}</p>
        <p className="text-xs text-stone-500">{formatPrix(ligne.prix)} / unité</p>
        <button
          type="button"
          //onClick={() => retirer(ligne.produitId)}
          className="text-brique mt-3 text-[11px] font-semibold underline underline-offset-2 hover:brightness-125"
        >
          Retirer
        </button>
      </div>

      <div
        role="group"
        aria-label={`Quantité de ${ligne.nom}`}
        className="col-start-2 flex w-27 items-center justify-between rounded-full border border-stone-300 px-1.5 py-1.5 sm:col-start-auto"
      >
        <button
          type="button"
          aria-label="Diminuer la quantité"
          disabled={ligne.quantite <= 1}
         // onClick={() => changerQuantite(ligne.produitId, ligne.quantite - 1)}
          className="flex size-6 items-center justify-center rounded-full hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          −
        </button>
        <span className="text-xs font-semibold" aria-live="polite">
          {ligne.quantite}
        </span>
        <button
          type="button"
          aria-label="Augmenter la quantité"
         // onClick={() => changerQuantite(ligne.produitId, ligne.quantite + 1)}
          className="flex size-6 items-center justify-center rounded-full hover:bg-stone-100"
        >
          +
        </button>
      </div>

      <p className="font-display col-start-2 text-lg font-semibold sm:col-start-auto sm:text-right">
        {formatPrix(ligne.prix * ligne.quantite)}
      </p>
    </li>
  )
}
