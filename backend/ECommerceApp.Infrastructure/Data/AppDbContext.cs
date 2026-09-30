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
        public DbSet<Produit> Produit { get; set; }

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

            // --- Produits ---
            modelBuilder.Entity<Produit>().HasData(
                new Produit { Id = 1, Nom = "Tuque en laine mérinos", Prix = 38.00m, CategorieId = 4 },
                new Produit { Id = 2, Nom = "Tasse en grès émaillé", Prix = 32.00m, CategorieId = 1 },
                new Produit { Id = 3, Nom = "Bougie sapin baumier", Prix = 28.00m, CategorieId = 1 },
                new Produit { Id = 4, Nom = "Sirop d’érable ambré 540 ml", Prix = 16.50m, CategorieId = 3 },
                new Produit { Id = 5, Nom = "Jeté en laine tissé", Prix = 145.00m, CategorieId = 1 },
                new Produit { Id = 6, Nom = "Planche à découper en érable", Prix = 64.00m, CategorieId = 2 },
                new Produit { Id = 7, Nom = "Chaussettes de laine", Prix = 24.00m, CategorieId = 4 },
                new Produit { Id = 8, Nom = "Beurre d’érable 250 g", Prix = 11.00m, CategorieId = 3 }
            );
        }
    }
}
