import type { ReactNode } from 'react'

export const CLASSES_CHAMP =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-stone-500 focus:outline-none'

export const CLASSES_BOUTON_PRINCIPAL =
  'bg-brique rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60'

export const CLASSES_BOUTON_SECONDAIRE =
  'rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold transition hover:bg-stone-50'

interface CarteProps {
  titre: string
  sousTitre?: string
  /** Draws a rule under the heading, as on the smaller cards of the mockup. */
  separateur?: boolean
  children: ReactNode
}

export function Carte({ titre, sousTitre, separateur = false, children }: CarteProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6">
      <header className={separateur ? 'mb-4 border-b border-stone-200 pb-3' : 'mb-4'}>
        <h2 className="font-display text-xl font-semibold">{titre}</h2>
        {sousTitre && <p className="mt-0.5 text-sm text-stone-600">{sousTitre}</p>}
      </header>
      {children}
    </section>
  )
}

export function Champ({
  id,
  libelle,
  children,
}: {
  id: string
  libelle: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold">
        {libelle}
      </label>
      {children}
    </div>
  )
}

interface InterrupteurProps {
  libelle: string
  description: string
  actif: boolean
  onChange: (actif: boolean) => void
}

/** On/off switch with its label, as a row of the Communications card. */
export function Interrupteur({ libelle, description, actif, onChange }: InterrupteurProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-semibold">{libelle}</span>
        <span className="block text-sm text-stone-600">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={actif}
        onClick={() => onChange(!actif)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition ${actif ? 'bg-sapin' : 'bg-stone-300'}`}
      >
        <span
          className={`absolute top-1 left-1 size-4 rounded-full bg-white shadow transition-transform ${actif ? 'translate-x-4' : ''}`}
        />
      </button>
    </label>
  )
}
