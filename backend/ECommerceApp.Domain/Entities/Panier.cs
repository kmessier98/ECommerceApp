using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("Panier")]
    public class Panier
    {
        public int Id { get; set; }
        public Guid? CleAnonyme { get; set; }
        public int? UtilisateurId { get; set; }
        public Utilisateur? Utilisateur { get; set; }
        public List<ArticlePanier> Articles { get; set; } = new List<ArticlePanier>();
    }
}
