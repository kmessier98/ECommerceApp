using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerceApp.Infrastructure.Repositories
{
    public class CommandeRepository : ICommandeRepository
    {
        private readonly AppDbContext _dbContext;

        public CommandeRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Commande entity)
        {
            await _dbContext.Commandes.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public Task DeleteAsync(Commande entity)
        {
            throw new NotImplementedException();
        }

        public Task<Commande?> FindByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Commande>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Commande?> GetByAsync(Expression<Func<Commande, bool>> predicate)
        {
            return await _dbContext.Commandes
               .Include(a => a.Articles)
                .ThenInclude(p => p.Produit)
               .SingleOrDefaultAsync(predicate);
        }

        public async Task UpdateAsync(Commande entity)
        {
            _dbContext.Commandes.Update(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
