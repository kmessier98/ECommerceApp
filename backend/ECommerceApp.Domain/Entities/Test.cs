using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("Test")]
    public class Test
    {
        public int Id { get; set; }
        public string Nom { get; set; } = string.Empty;
    }
}
