using ECommerceApp.Application.DTOs;
using ECommerceApp.Domain.Entities;

namespace ECommerceApp.Application.Interfaces
{
    public interface ICalculPanierService
    {
        ResumePanierDto Calculer(Panier panier);
    }
}
