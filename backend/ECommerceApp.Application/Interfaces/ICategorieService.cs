using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface ICategorieService
    {
        Task<List<CategorieDto>> GetAll();
    }
}
