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

        public async Task CreateAsync(Panier entity)
        {
            await _dbContext.Panier.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }


        public async Task UpdateAsync(Panier entity)
        {
            _dbContext.Panier.Update(entity);
            await _dbContext.SaveChangesAsync();
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
    }
}
