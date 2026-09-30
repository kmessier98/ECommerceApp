using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerceApp.Infrastructure.Repositories
{
    public class ProduitRepository : IProduitRepository
    {
        private readonly AppDbContext _dbContext;
        public ProduitRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task CreateAsync(Produit entity)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(Produit entity)
        {
            throw new NotImplementedException();
        }

        public Task<Produit?> FindByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IReadOnlyList<Produit>> GetAllAsync()
        {
            var entities = await _dbContext.Produit
                .Include(x => x.Categorie)
                .AsNoTracking()
                .ToListAsync();

            return entities;
        }

        public Task<Produit?> GetByAsync(Expression<Func<Produit, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(Produit entity)
        {
            throw new NotImplementedException();
        }
    }
}
