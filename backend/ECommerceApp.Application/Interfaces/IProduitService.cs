using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface IProduitService
    {
        Task<List<ProduitDto>> GetAll();
    }
}
