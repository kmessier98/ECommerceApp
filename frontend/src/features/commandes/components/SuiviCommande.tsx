import type { EtapeSuivi } from '../types'

interface SuiviCommandeProps {
  etapes: EtapeSuivi[]
  /** Index of the step in progress; earlier steps are completed. */
  etapeCourante: number
}

export function SuiviCommande({ etapes, etapeCourante }: SuiviCommandeProps) {
  return (
    <ol
      aria-label="Suivi de la commande"
      className="grid grid-cols-2 gap-x-3 gap-y-5 rounded-2xl border border-stone-200 bg-white px-6 py-5 sm:grid-cols-4"
    >
      {etapes.map((etape, index) => {
        const terminee = index < etapeCourante
        const enCours = index === etapeCourante

        return (
          <li key={etape.libelle} aria-current={enCours ? 'step' : undefined}>
            <span
              className={`block h-1 rounded-full ${terminee ? 'bg-sapin' : enCours ? 'bg-brique' : 'bg-stone-200/70'}`}
              aria-hidden="true"
            />
            <p
              className={`mt-3 text-xs ${terminee || enCours ? 'font-semibold' : 'text-stone-500'}`}
            >
              {etape.libelle}
            </p>
            <p className="mt-1 text-[10px] text-stone-500">{etape.detail}</p>
          </li>
        )
      })}
    </ol>
  )
}
