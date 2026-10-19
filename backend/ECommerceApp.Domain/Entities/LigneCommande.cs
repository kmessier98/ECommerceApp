using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("LigneCommande")]
    public class LigneCommande
    {
        public int Id { get; set; }

        public int CommandeId { get; set; }
        public Commande Commande { get; set; } = null!;

        public int ProduitId { get; set; }
        public Produit Produit { get; set; } = null!;

        public string NomProduit { get; set; } = string.Empty;
        public decimal PrixUnitaire { get; set; }
        public int Quantite { get; set; }
    }
}
