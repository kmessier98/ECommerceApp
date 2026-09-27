using ECommerceApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ECommerceApp.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Test> Tests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration Fluent API des relations (HasOne/HasMany/UsingEntity...) ici.

            SeedData(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.LogTo(message => Debug.WriteLine(message));
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // --- Tests ---
            modelBuilder.Entity<Test>().HasData(
                new Test { Id = 1, Nom = "Exemple 1" },
                new Test { Id = 2, Nom = "Exemple 2" }
            );
        }
    }
}
