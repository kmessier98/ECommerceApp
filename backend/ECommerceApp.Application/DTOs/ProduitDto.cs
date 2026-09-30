using ECommerceApp.Application.Enums;

namespace ECommerceApp.Application.DTOs
{
    public class ProduitDto
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public decimal Prix { get; set; }
        public CategorieDto Categorie { get; set; }
        public bool EnStock { get; set; } //TODO fictif pour le moment
        public bool EnPromotion { get; set; } //TODO fictif pour le moment
        public BadgeType? Badge { get; set; } // TODO fictif pour le moment..
        public int RangPopularite { get; set; } //TODO fictif pour le moment.. ... Lower is more popular
        public DateTime DateAjout { get; set; } //TODO fictif pour le moment..
        public string Couleur { get; set; } //TODO fictif pour le moment..
    }
}
