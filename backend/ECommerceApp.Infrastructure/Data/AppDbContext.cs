using ECommerceApp.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ECommerceApp.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityUserContext<Utilisateur, int>(options)
    {
        public DbSet<Test> Tests { get; set; }
        public DbSet<Categorie> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Utilisateur>(u =>
            {
                u.ToTable("Utilisateur");
                u.Property(p => p.Prenom).HasMaxLength(100);
                u.Property(n => n.Nom).HasMaxLength(100);
            });

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

            // --- Categories ---
            modelBuilder.Entity<Categorie>().HasData(
                new Categorie { Id = 1, Nom = "Maison" },
                new Categorie { Id = 2, Nom = "Cuisine" },
                new Categorie { Id = 3, Nom = "Épicerie" },
                new Categorie { Id = 4, Nom = "Accessoires" }
            );
        }
    }
}
