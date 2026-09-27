using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceApp.Domain.Entities
{
    [Table("Utilisateur")]
    public class Utilisateur : IdentityUser<int>
    {
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public bool Infolettre { get; set; }
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;
    }
}

