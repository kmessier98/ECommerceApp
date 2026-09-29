import { REGLES_MOT_DE_PASSE } from '../mot-de-passe'

/** Strength gauge and rule checklist shown under a new-password field. */
export function ForceMotDePasse({ id, motDePasse }: { id: string; motDePasse: string }) {
  const reglesRespectees = REGLES_MOT_DE_PASSE.map((regle) => regle.test(motDePasse))
  const force = reglesRespectees.filter(Boolean).length

  return (
    <>
      <div className="mt-2.5 grid grid-cols-4 gap-1" aria-hidden="true">
        {REGLES_MOT_DE_PASSE.map((regle, i) => (
          <span
            key={regle.libelle}
            className={`h-1 rounded-full ${i < force ? 'bg-[#c98a1e]' : 'bg-stone-200'}`}
          />
        ))}
      </div>
      <ul id={id} className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {REGLES_MOT_DE_PASSE.map((regle, i) => (
          <li
            key={regle.libelle}
            className={`flex items-center gap-1.5 ${reglesRespectees[i] ? 'text-stone-700' : 'text-stone-500'}`}
          >
            {reglesRespectees[i] ? <CheckIcon /> : <CircleIcon />}
            {regle.libelle}
          </li>
        ))}
      </ul>
    </>
  )
}

function CheckIcon() {
  return (
    <svg
      className="size-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5 9-10" />
    </svg>
  )
}

function CircleIcon() {
  return (
    <svg
      className="size-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
    </svg>
  )
}
