import type { LignePanier } from './types'

export const SEUIL_LIVRAISON_GRATUITE = 100
export const FRAIS_LIVRAISON = 9.95
export const TAUX_TPS = 0.05
export const TAUX_TVQ = 0.09975

const arrondir = (montant: number) => Math.round(montant * 100) / 100

export interface TotauxPanier {
  sousTotal: number
  livraison: number
  tps: number
  tvq: number
  total: number
  /** Amount still needed to reach free shipping, 0 once reached. */
  resteAvantLivraisonGratuite: number
}

/** Quebec pricing: both taxes apply to the subtotal plus shipping, each rounded to the cent. */
export function calculerTotaux(lignes: LignePanier[]): TotauxPanier {
  const sousTotal = arrondir(lignes.reduce((total, l) => total + l.prixUnitaire * l.quantite, 0))
  const livraison = sousTotal === 0 || sousTotal >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON
  const taxable = sousTotal + livraison
  const tps = arrondir(taxable * TAUX_TPS)
  const tvq = arrondir(taxable * TAUX_TVQ)

  return {
    sousTotal,
    livraison,
    tps,
    tvq,
    total: arrondir(taxable + tps + tvq),
    resteAvantLivraisonGratuite: Math.max(0, arrondir(SEUIL_LIVRAISON_GRATUITE - sousTotal)),
  }
}
