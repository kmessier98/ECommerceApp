using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Services
{
    public class CalculPanierService : ICalculPanierService
    {
        public const decimal SeulLivraisonGratuite = 100m;
        public const decimal FraisLivraison = 9.95m;
        public const decimal TauxTps = 0.05m;
        public const decimal TauxTvq = 0.09975m;

        public ResumePanierDto Calculer(Panier panier)
        {
            var sousTotal = panier.Articles.Sum(a => a.Quantite * a.Produit.Prix);
            var livraison = sousTotal >= SeulLivraisonGratuite ? 0m : FraisLivraison;
            var prixBase = sousTotal + livraison;

            var tps = Arrondir(prixBase * TauxTps);
            var tvq = Arrondir(prixBase * TauxTvq);

            return new ResumePanierDto
            {
                SousTotal = sousTotal,
                Livraison = livraison,
                TPS = tps,
                TVQ = tvq,
                Total = prixBase + tps + tvq,
                SeuilLivraisonGratuite = SeulLivraisonGratuite,
                MontantPourLivraisonGratuite = Math.Max(0, SeulLivraisonGratuite - sousTotal),
                NombreArticles = panier.Articles.Sum(a => a.Quantite)
            };
        }

        private static decimal Arrondir(decimal v) =>
            Math.Round(v, 2, MidpointRounding.AwayFromZero);
    }
}
