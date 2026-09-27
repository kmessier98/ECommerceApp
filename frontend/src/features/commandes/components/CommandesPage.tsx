import { useState } from 'react'
import { useCommandes } from '../api'
import { FILTRES, filtrerCommandes } from '../statuts'
import type { FiltreCommandes } from '../types'
import { CommandeLigne } from './CommandeLigne'

export function CommandesPage() {
  const { data: commandes = [], isLoading } = useCommandes()
  const [filtre, setFiltre] = useState<FiltreCommandes>('toutes')

  const visibles = filtrerCommandes(commandes, filtre)

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight">Mes commandes</h1>
        <div
          role="group"
          aria-label="Filtrer les commandes"
          className="flex rounded-xl bg-stone-200/60 p-1 text-xs"
        >
          {FILTRES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filtre === value}
              onClick={() => setFiltre(value)}
              className={`rounded-lg px-4 py-2 ${filtre === value ? 'bg-white font-semibold shadow-sm' : 'hover:text-encre text-stone-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <p className="text-sm text-stone-500">Chargement…</p>
      ) : visibles.length === 0 ? (
        <p className="text-sm text-stone-500">Aucune commande dans cette catégorie.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {visibles.map((commande) => (
            <CommandeLigne key={commande.id} commande={commande} />
          ))}
        </div>
      )}
    </>
  )
}
