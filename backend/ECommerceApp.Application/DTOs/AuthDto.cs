namespace ECommerceApp.Application.DTOs
{
    public class InscriptionDto 
    {
        public string Prenom { get; set; } = string.Empty;
        public string Nom { get; set; } = string.Empty;
        public string Courriel { get; set; } = string.Empty;
        public string MotDePasse {  get; set; } = string.Empty;
        public bool AccepteConditions { get; set; }
        public bool Infolettre { get; set; }
    }

    public class ConnexionDto
    {
        public string Courriel { get; set; } = string.Empty;
        public string MotDePasse { get; set; } = string.Empty;
        public bool ResterConnecte { get; set; }
    }
}
