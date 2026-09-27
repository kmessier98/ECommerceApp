namespace ECommerceApp.Application.DTOs
{
    public class UtilisateurDto
    {
        public int Id { get; set; }
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Courriel { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
    }
}


