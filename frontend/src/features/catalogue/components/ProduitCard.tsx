import { formatPrix } from '@/shared/utils/format'
import type { Produit } from '../types'
import { useLocation, useNavigate } from 'react-router-dom';
import { useUtilisateurCourant } from '@/features/auth';

export function ProduitCard({ produit }: { produit: Produit }) {
  const { data: utilisateur } = useUtilisateurCourant()
  const navigate = useNavigate();
  const location = useLocation();

  const handleAjouter = () => {
    // TEMPORAIRE: ajouter au panier exige l'auth pour le moment.
    if (!utilisateur) {
      navigate('/connexion', { state: { from: location } });
      return;
    }
    //ajouterAuPanier(produit); 
  };

  return (
    <article className="flex flex-col">
      <div
        className="relative aspect-square rounded-xl"
        style={{ backgroundColor: produit.couleur }}
      >
        {produit.badge && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold">
            {produit.badge}
          </span>
        )}
        <span className="absolute bottom-2.5 left-2.5 text-[10px] tracking-widest text-stone-600 uppercase">
          Photo produit
        </span>
      </div>

      <p className="mt-2.5 text-xs text-stone-500">{produit.categorie.nom}</p>
      <h3 className="text-sm font-semibold">{produit.nom}</h3>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <span className="font-display text-lg font-semibold">{formatPrix(produit.prix)}</span>
        {produit.enStock ? (
          <button
            type="button"
            className="bg-brique rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
            onClick={handleAjouter}
          >
            Ajouter
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold transition hover:border-stone-500"
          >
            M’avertir
          </button>
        )}
      </div>
    </article>
  )
}
