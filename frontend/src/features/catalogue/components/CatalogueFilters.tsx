import type { ReactNode } from 'react'
import { FILTRES_PAR_DEFAUT, type Filtres } from '../filtres'
import type { Categorie, Produit } from '../types'
import { useCategories } from '../api'

interface CatalogueFiltersProps {
  produits: Produit[]
  filtres: Filtres
  onChange: (filtres: Filtres) => void
}

export function CatalogueFilters({ produits, filtres, onChange }: CatalogueFiltersProps) {
  const set = (partial: Partial<Filtres>) => onChange({ ...filtres, ...partial })
  const count = (categorie: Categorie | null) =>
    categorie ? produits.filter((p) => p.categorie.id === categorie.id).length : produits.length
  const { data: categories = [], } = useCategories();

  return (
    <aside className="w-full shrink-0 space-y-6 md:w-48">
      <Section titre="Catégories">
        <ul className="space-y-1">
          {[null, ...categories].map((categorie) => {
            const actif = filtres.categorie?.id === categorie?.id
            return (
              <li key={categorie?.id ?? 'tout'}>
                <button
                  type="button"
                  aria-pressed={actif}
                  onClick={() => set({ categorie })}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                    actif ? 'bg-encre font-semibold text-white' : 'hover:bg-stone-200/60'
                  }`}
                >
                  {categorie?.nom ?? 'Tout'}
                  <span className={`text-xs ${actif ? 'text-stone-300' : 'text-stone-500'}`}>
                    {count(categorie)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Section>

      <Section titre="Prix">
        <div className="flex items-end gap-2">
          <PrixInput
            label="Min."
            value={filtres.prixMin}
            onChange={(prixMin) => set({ prixMin })}
          />
          <span className="pb-2.5 text-stone-500">–</span>
          <PrixInput
            label="Max."
            value={filtres.prixMax}
            onChange={(prixMax) => set({ prixMax })}
          />
        </div>
      </Section>

      <Section titre="Disponibilité">
        <div className="space-y-3">
          <Checkbox
            label="En stock seulement"
            checked={filtres.enStockSeulement}
            onChange={(enStockSeulement) => set({ enStockSeulement })}
          />
          <Checkbox
            label="En promotion"
            checked={filtres.enPromotion}
            onChange={(enPromotion) => set({ enPromotion })}
          />
        </div>
      </Section>

      <button
        type="button"
        onClick={() => onChange(FILTRES_PAR_DEFAUT)}
        className="text-brique pt-4 text-xs font-semibold underline underline-offset-2"
      >
        Réinitialiser les filtres
      </button>
    </aside>
  )
}

function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2.5 text-[11px] font-semibold tracking-widest text-stone-600 uppercase">
        {titre}
      </h2>
      {children}
    </section>
  )
}

interface PrixInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

function PrixInput({ label, value, onChange }: PrixInputProps) {
  return (
    <label className="flex-1 text-[11px] text-stone-600">
      {label}
      <span className="text-encre mt-1 flex items-center rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus-within:border-stone-500">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full [appearance:textfield] bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span>$</span>
      </span>
    </label>
  )
}

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-encre size-4.5 rounded border-stone-400"
      />
      {label}
    </label>
  )
}
