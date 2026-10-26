using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface ICommandeService
    {
        Task<SessionPaiementDto> PasserCommande(int utilisateurId);
        Task ConfirmerPaiement(string stripeSessionId);
        Task<CommandeDto> Get(int id, int utilisateurId);
    }
}
