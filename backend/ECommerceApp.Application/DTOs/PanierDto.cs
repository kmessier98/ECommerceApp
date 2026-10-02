namespace ECommerceApp.Application.DTOs
{

    public class PanierDto
    {
        public int Id { get; set; }
        public int UtilisateurId { get; set; }
        public List<ArticlePanierDto> Articles { get; set; } = new List<ArticlePanierDto>();
        public ResumePanierDto ResumePanier { get; set; }
    }
    public class ArticlePanierDto
    {
        public int ProduitId { get; set; }
        public string NomProduit { get; set; }
        public decimal Prix { get; set; }
        public int Quantite { get; set; }
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
        public decimal MontantPourLivraisonGratuite { get; set; }
        public int NombreArticles { get; set; }
    }
}
