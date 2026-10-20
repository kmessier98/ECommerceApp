using ECommerceApp.Application.Exceptions;
using ECommerceApp.Application.Interfaces;
using ECommerceApp.Application.Models;
using ECommerceApp.Domain.Entities;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace ECommerceApp.Infrastructure.Paiement
{
    public class StripePaiementService : IPaiementService
    {
        private readonly IStripeClient _stripeClient;
        private readonly StripeOptions _options;

        public StripePaiementService(IStripeClient stripeClient, IOptions<StripeOptions> options)
        {
            _stripeClient = stripeClient;
            _options = options.Value;
        }

        public async Task<SessionPaiement> CreerSession(Commande commande)
        {
            // Une ligne Stripe par article, puis livraison et taxes : le total
            // payé est exactement le Total de la commande.
            var lignes = commande.Articles
                .Select(a => Ligne(a.NomProduit, a.PrixUnitaire, a.Quantite))
                .ToList();

            if (commande.Livraison > 0)
                lignes.Add(Ligne("Livraison", commande.Livraison, 1));

            lignes.Add(Ligne("TPS (5 %)", commande.TPS, 1));
            lignes.Add(Ligne("TVQ (9,975 %)", commande.TVQ, 1));

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                LineItems = lignes,
                ClientReferenceId = commande.Id.ToString(),
                SuccessUrl = $"{_options.UrlFrontend}/commandes/{commande.Id}/confirmation?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{_options.UrlFrontend}/panier"
            };

            var session = await new SessionService(_stripeClient).CreateAsync(options);

            return new SessionPaiement(session.Id, session.Url);
        }

        public string? LireSessionPayee(string json, string signature)
        {
            Event evenement;
            try
            {
                evenement = EventUtility.ConstructEvent(json, signature, _options.WebhookSecret);
            }
            catch (StripeException ex)
            {
                throw new BusinessRuleException($"Webhook Stripe invalide : {ex.Message}");
            }

            if (evenement.Type != EventTypes.CheckoutSessionCompleted)
                return null;

            var session = (Session)evenement.Data.Object;

            return session.PaymentStatus == "paid" ? session.Id : null;
        }

        private static SessionLineItemOptions Ligne(string nom, decimal montant, int quantite) => new()
        {
            Quantity = quantite,
            PriceData = new SessionLineItemPriceDataOptions
            {
                Currency = "cad",
                UnitAmount = (long)Math.Round(montant * 100, MidpointRounding.AwayFromZero),
                ProductData = new SessionLineItemPriceDataProductDataOptions { Name = nom }
            }
        };
    }
}
