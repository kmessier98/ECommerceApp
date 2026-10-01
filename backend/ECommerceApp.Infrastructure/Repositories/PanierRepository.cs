using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerceApp.Infrastructure.Repositories
{
    public class PanierRepository : IPanierRepository
    {
        private readonly AppDbContext _dbContext;

        public PanierRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task CreateAsync(Panier entity)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Panier entity)
        {
            throw new NotImplementedException();
        }

        public Task<Panier?> FindByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Panier>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Panier?> GetByAsync(Expression<Func<Panier, bool>> predicate)
        {
            return await _dbContext.Panier
                .Include(a => a.Articles)
                    .ThenInclude(p => p.Produit)
                .SingleOrDefaultAsync(predicate);
        }

        public Task UpdateAsync(Panier entity)
        {
            throw new NotImplementedException();
        }
    }
}
