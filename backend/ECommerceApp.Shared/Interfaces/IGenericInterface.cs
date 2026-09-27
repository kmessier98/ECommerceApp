using System.Linq.Expressions;

namespace ECommerceApp.Shared.Interfaces
{
    public interface IGenericInterface<T> where T : class
    {
        Task CreateAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T?> FindByIdAsync(int id);
        Task<T?> GetByAsync(Expression<Func<T, bool>> predicate);
    }
}
