using ECommerceApp.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("Commande")]
    public class Commande
    {
        public int Id { get; set; }

        public int UtilisateurId { get; set; }
        public Utilisateur Utilisateur { get; set; } = null!;

        public StatutCommande Statut { get; set; } = StatutCommande.EnAttente;
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;
        public DateTime? DatePaiement { get; set; }

        public string? StripeSessionId { get; set; }

        public decimal SousTotal { get; set; }
        public decimal Livraison { get; set; }
        public decimal TPS { get; set; }
        public decimal TVQ { get; set; }
        public decimal Total { get; set; }

        public List<LigneCommande> Articles { get; set; } = new List<LigneCommande>();
    }
}
