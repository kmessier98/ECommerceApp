using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface IPanierService
    {
        Task<PanierDto> Get(int userId);
        Task<PanierDto> AjouterArticle(int userId, AjouterArticlePanierDto dto);
        Task<PanierDto> ModifierArticle(int userId, int produitId, ModifierArticlePanierDto dto);
        Task<PanierDto> RetirerArticle(int userId, int produitId);
    }
}
