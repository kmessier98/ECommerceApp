import { formatPrix } from '@/shared/utils/format'
import type { ResumePanier } from '../types'

export function ResumePanier({ totaux }: { totaux: ResumePanier }) {
  const lignes = [
    { label: 'Sous-total', montant: formatPrix(totaux.sousTotal) },
    {
      label: 'Livraison standard',
      montant: totaux.livraison === 0 ? 'Gratuite' : formatPrix(totaux.livraison),
    },
    { label: 'TPS (5 %)', montant: formatPrix(totaux.tps) },
    { label: 'TVQ (9,975 %)', montant: formatPrix(totaux.tvq) },
  ]

  return (
    <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5">
      <h2 className="font-display text-2xl font-semibold">Résumé</h2>

      <dl className="mt-3 space-y-2.5 border-b border-stone-200 pb-4 text-sm">
        {lignes.map(({ label, montant }) => (
          <div key={label} className="flex justify-between">
            <dt>{label}</dt>
            <dd>{montant}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 flex items-baseline justify-between">
        <span className="text-sm font-semibold">Total</span>
        <span className="font-display text-3xl font-semibold" data-testid="total">
          {formatPrix(totaux.total)}
        </span>
      </p>

      {/* TODO: validate the code once the backend exposes promotions */}
      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="code-promo" className="text-xs text-stone-600">
          Code promo
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="code-promo"
            placeholder="EX. AUTOMNE10"
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2.5 text-xs uppercase placeholder:text-stone-400 focus:border-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            className="border-encre rounded-lg border px-3.5 text-xs font-semibold transition hover:bg-stone-100"
          >
            Appliquer
          </button>
        </div>
      </form>

      {/* TODO: navigate to checkout once it exists */}
      <button
        type="button"
        className="bg-brique mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
      >
        <LockIcon />
        Passer au paiement
      </button>
      <p className="mt-3 text-center text-[10px] text-stone-500">
        Visa · Mastercard · Amex · Apple Pay · Google Pay
      </p>
    </aside>
  )
}

function LockIcon() {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
