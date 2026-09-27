using ECommerceApp.Domain.Entities;
using ECommerceApp.Shared.Interfaces;

namespace ECommerceApp.Application.Interfaces
{
    public interface ITestRepository : IGenericInterface<Test>
    {
        Task<bool> ExistsByNomAsync(string nom, int? excludeId = null);
    }
}
