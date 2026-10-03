import { Link } from "react-router-dom";

export function PanierVide() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display mb-4 text-4xl font-semibold tracking-tight">Votre panier</h1>
      <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-stone-500">
        Votre panier est vide.
      </p>
      <Link to="/catalogue" className="text-brique mt-4 inline-block text-xs font-semibold underline underline-offset-2">
        ← Continuer mes achats
      </Link>
    </div>
  )
}