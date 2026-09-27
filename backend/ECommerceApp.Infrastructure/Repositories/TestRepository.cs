using ECommerceApp.Application.Interfaces;
using ECommerceApp.Domain.Entities;
using ECommerceApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ECommerceApp.Infrastructure.Repositories
{
    public class TestRepository : ITestRepository
    {
        private readonly AppDbContext _dbContext;

        public TestRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateAsync(Test entity)
        {
            await _dbContext.Tests.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Test entity)
        {
            _dbContext.Tests.Update(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Test entity)
        {
            _dbContext.Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Test?> FindByIdAsync(int id)
        {
            return await _dbContext.Tests
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IReadOnlyList<Test>> GetAllAsync()
        {
            return await _dbContext.Tests
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Test?> GetByAsync(Expression<Func<Test, bool>> predicate)
        {
            return await _dbContext.Tests
                .FirstOrDefaultAsync(predicate);
        }

        public async Task<bool> ExistsByNomAsync(string nom, int? excludeId = null)
        {
            return await _dbContext.Tests
                .AnyAsync(x => x.Nom == nom && (excludeId == null || x.Id != excludeId));
        }
    }
}
