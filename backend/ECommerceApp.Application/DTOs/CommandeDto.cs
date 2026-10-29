using ECommerceApp.Domain.Enums;

namespace ECommerceApp.Application.DTOs
{
    public class SessionPaiementDto
    {
        public string Url { get; set; } = string.Empty;
    }

    public class CommandeDto
    {
        public int Id { get; set; }
        public StatutCommande Statut { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime? DatePaiement { get; set; }
        public decimal SousTotal { get; set; }
        public decimal Livraison { get; set; }
        public decimal TPS { get; set; }
        public decimal TVQ { get; set; }
        public decimal Total { get; set; }
        public List<LigneCommandeDto> Articles { get; set; } = new List<LigneCommandeDto>();
    }

    public class LigneCommandeDto
    {
        public int ProduitId { get; set; }
        public string NomProduit { get; set; } = string.Empty;
        public decimal PrixUnitaire { get; set; }
        public int Quantite { get; set; }
        public string ImageUrl { get; set; }
        public string Couleur { get; set; } = string.Empty; // TODO fictif pour le moment
    }
}
