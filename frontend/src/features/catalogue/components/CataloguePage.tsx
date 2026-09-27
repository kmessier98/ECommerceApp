import { useMemo, useState } from 'react'
import { useProduits } from '../api'
import { appliquerFiltres, FILTRES_PAR_DEFAUT, type Filtres } from '../filtres'
import type { Tri } from '../types'
import { CatalogueFilters } from './CatalogueFilters'
import { ProduitCard } from './ProduitCard'

const TRIS: { value: Tri; label: string }[] = [
  { value: 'popularite', label: 'Popularité' },
  { value: 'prix-croissant', label: 'Prix croissant' },
  { value: 'prix-decroissant', label: 'Prix décroissant' },
  { value: 'nouveautes', label: 'Nouveautés' },
]

export function CataloguePage() {
  const { data: produits = [], isLoading } = useProduits()
  const [filtres, setFiltres] = useState<Filtres>(FILTRES_PAR_DEFAUT)
  const [tri, setTri] = useState<Tri>('popularite')

  const visibles = useMemo(() => appliquerFiltres(produits, filtres, tri), [produits, filtres, tri])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:gap-7">
      <CatalogueFilters produits={produits} filtres={filtres} onChange={setFiltres} />

      <section className="min-w-0 flex-1">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              Tout le catalogue
            </h1>
            <p className="mt-1 text-xs text-stone-500">
              {visibles.length} produit{visibles.length > 1 ? 's' : ''} · fabriqués au Québec
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-stone-600">
            Trier par
            <select
              value={tri}
              onChange={(e) => setTri(e.target.value as Tri)}
              className="text-encre rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none"
            >
              {TRIS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </header>

        {isLoading ? (
          <p className="text-sm text-stone-500">Chargement…</p>
        ) : visibles.length === 0 ? (
          <p className="text-sm text-stone-500">Aucun produit ne correspond à ces filtres.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
            {visibles.map((produit) => (
              <ProduitCard key={produit.id} produit={produit} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
