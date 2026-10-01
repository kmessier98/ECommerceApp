using ECommerceApp.Application.DTOs;

namespace ECommerceApp.Application.Interfaces
{
    public interface IPanierService
    {
        Task<PanierDto> Get(int userId);
    }
}
