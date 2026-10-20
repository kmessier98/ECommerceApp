using ECommerceApp.Application.Models;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Interfaces
{
    public interface IPaiementService
    {
        /// <summary>Crée une session de paiement hébergée pour cette commande.</summary>
        Task<SessionPaiement> CreerSession(Commande commande);

        /// <summary>Vérifie la signature d'un webhook et retourne l'id de session
        /// si l'événement confirme un paiement ; null pour tout autre événement.</summary>
        string? LireSessionPayee(string json, string signature);
    }
}
