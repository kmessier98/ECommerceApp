using ECommerceApp.Application.DTOs;
using ECommerceApp.Application.Models;

namespace ECommerceApp.Application.Interfaces
{
    public interface IPanierService
    {
        Task<PanierDto> Get(ProprietairePanier proprietaire);
        Task<PanierDto> AjouterArticle(ProprietairePanier proprietaire, AjouterArticlePanierDto dto);
        Task<PanierDto> ModifierArticle(ProprietairePanier proprietaire, int produitId, ModifierArticlePanierDto dto);
        Task<PanierDto> RetirerArticle(ProprietairePanier proprietaire, int produitId);
        Task Fusionner(Guid cleAnonyme, int utilisateurId);
    }
}
