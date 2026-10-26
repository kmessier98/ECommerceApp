namespace ECommerceApp.Application.DTOs
{

    public class PanierDto
    {
        public int Id { get; set; }
        public List<LignePanierDto> Articles { get; set; } = new List<LignePanierDto>();
        public ResumePanierDto ResumePanier { get; set; }
    }
    public class LignePanierDto
    {
        public int ProduitId { get; set; }
        public string Nom { get; set; }
        public decimal Prix { get; set; }
        public int Quantite { get; set; }
        public string Description { get; set; } // TODO fictif pour le moment...
        public string ImageUrl { get; set; }
    }

    public class AjouterArticlePanierDto
    {
        public int ProduitId { get; set; }
    }

    public class ModifierArticlePanierDto
    {
        public int Quantite { get; set; }
    }

    public class ResumePanierDto
    {
        public decimal SousTotal { get; set; }
        public decimal Livraison { get; set; }
        public decimal TPS { get; set; }
        public decimal TVQ { get; set; }
        public decimal Total { get; set; }
        public decimal SeuilLivraisonGratuite { get; set; }
        public decimal MontantPourLivraisonGratuite { get; set; }
        public int NombreArticles { get; set; }
    }
}
