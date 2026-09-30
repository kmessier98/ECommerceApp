namespace ECommerceApp.Domain.Entities
{
    public class Produit
    {
        public int Id { get; set; }
        public string Nom { get; set; }
        public decimal Prix { get; set; }
        public int CategorieId { get; set; }
        public Categorie Categorie { get; set; }

    }
}
