using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCommande : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Commande",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UtilisateurId = table.Column<int>(type: "int", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatePaiement = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StripeSessionId = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    SousTotal = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Livraison = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TPS = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    TVQ = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Commande", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Commande_Utilisateur_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateur",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LigneCommande",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommandeId = table.Column<int>(type: "int", nullable: false),
                    ProduitId = table.Column<int>(type: "int", nullable: false),
                    NomProduit = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PrixUnitaire = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Quantite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LigneCommande", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LigneCommande_Commande_CommandeId",
                        column: x => x.CommandeId,
                        principalTable: "Commande",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LigneCommande_Produit_ProduitId",
                        column: x => x.ProduitId,
                        principalTable: "Produit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Commande_StripeSessionId",
                table: "Commande",
                column: "StripeSessionId",
                unique: true,
                filter: "[StripeSessionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Commande_UtilisateurId",
                table: "Commande",
                column: "UtilisateurId");

            migrationBuilder.CreateIndex(
                name: "IX_LigneCommande_CommandeId",
                table: "LigneCommande",
                column: "CommandeId");

            migrationBuilder.CreateIndex(
                name: "IX_LigneCommande_ProduitId",
                table: "LigneCommande",
                column: "ProduitId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LigneCommande");

            migrationBuilder.DropTable(
                name: "Commande");
        }
    }
}
