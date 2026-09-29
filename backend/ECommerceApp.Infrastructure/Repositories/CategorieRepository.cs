using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerceApp.Infrastructure.Repositories
{
    public class CategorieRepository : ICategorieRepository
    {
        private readonly AppDbContext _dbContext;
        public CategorieRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public Task CreateAsync(Categorie entity)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(Categorie entity)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Categorie entity)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<Categorie>> GetAllAsync()
        {
            return await _dbContext.Categories
                .AsNoTracking()
                .ToListAsync();
        }

        public Task<Categorie?> FindByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Categorie?> GetByAsync(Expression<Func<Categorie, bool>> predicate)
        {
            throw new NotImplementedException();
        }
    }
}
