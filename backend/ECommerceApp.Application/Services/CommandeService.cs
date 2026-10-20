using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Domain.Enums;

namespace ECommerceApp.Application.Services
{
    public class CommandeService : ICommandeService
    {
        private readonly ICommandeRepository _commandeRepository;
        private readonly IPanierRepository _panierRepository;
        private readonly ICalculPanierService _calculPanierService;
        private readonly IPaiementService _paiementService;

        public CommandeService(ICommandeRepository commandeRepository, IPanierRepository panierRepository, ICalculPanierService calculPanierService, IPaiementService paiementService)
        {
            _commandeRepository = commandeRepository;
            _panierRepository = panierRepository;
            _calculPanierService = calculPanierService;
            _paiementService = paiementService;
        }

        public async Task<SessionPaiementDto> PasserCommande(int utilisateurId)
        {
            // 1. Le panier vient de la BASE, jamais du frontend.
            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == utilisateurId);
            if (panier == null || panier.Articles.Count == 0)
                throw new BusinessRuleException("Votre panier est vide.");

            // 2. Les montants viennent du MÊME calcul que celui affiché dans le panier.
            var resume = _calculPanierService.Calculer(panier);

            // 3. La « photo » : on recopie les montants et chaque ligne.
            var commande = new Commande
            {
                UtilisateurId = utilisateurId,
                SousTotal = resume.SousTotal,
                Livraison = resume.Livraison,
                TPS = resume.TPS,
                TVQ = resume.TVQ,
                Total = resume.Total,
                Articles = panier.Articles.Select(a => new LigneCommande
                {
                    ProduitId = a.ProduitId,
                    NomProduit = a.Produit.Nom,
                    PrixUnitaire = a.Produit.Prix,
                    Quantite = a.Quantite
                }).ToList()
            };
            await _commandeRepository.CreateAsync(commande);

            // 4. On demande la session au fournisseur, puis on mémorise son id.
            var session = await _paiementService.CreerSession(commande);
            commande.StripeSessionId = session.SessionId;
            await _commandeRepository.UpdateAsync(commande);

            return new SessionPaiementDto { Url = session.Url };
        }

        public async Task ConfirmerPaiement(string stripeSessionId)
        {
            var commande = await _commandeRepository.GetByAsync(c => c.StripeSessionId == stripeSessionId);

            // Session inconnue : on ignore.
            if (commande == null)
                return;

            // Idempotence : Stripe peut envoyer le même événement plusieurs fois.
            if (commande.Statut == StatutCommande.Payee)
                return;

            commande.Statut = StatutCommande.Payee;
            commande.DatePaiement = DateTime.UtcNow;
            await _commandeRepository.UpdateAsync(commande);

            var panier = await _panierRepository.GetByAsync(p => p.UtilisateurId == commande.UtilisateurId);
            if (panier != null)
                await _panierRepository.DeleteAsync(panier);
        }
    }
}
