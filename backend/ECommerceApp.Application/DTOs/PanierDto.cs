namespace ECommerceApp.Application.DTOs
{

    public class PanierDto
    {
        public int Id { get; set; }
        public int UtilisateurId { get; set; }
        public List<ArticlePanierDto> Articles { get; set; } = new List<ArticlePanierDto>();
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
        public int Quantite { get; set; }
    }

    public class ModifierArticlePanierDto
    {
        public int Quantite { get; set; }
    }
}
