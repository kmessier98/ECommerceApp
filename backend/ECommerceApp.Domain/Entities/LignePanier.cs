using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("LignePanier")]
    public class LignePanier
    {
        public int Id { get; set; }
        public int ProduitId { get; set; }
        public Produit Produit { get; set; }
        public int PanierId { get; set; }
        public Panier Panier { get; set; }
        public int Quantite { get; set; }
    }
}
