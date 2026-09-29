using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("Categorie")]
    public class Categorie
    {
        public int Id { get; set; }
        public string Nom { get; set; }
    }
}
