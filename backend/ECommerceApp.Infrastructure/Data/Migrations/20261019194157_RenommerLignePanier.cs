using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    /// <remarks>
    /// Edited by hand: EF Core scaffolded a DropTable + CreateTable, which would have deleted every
    /// cart line. The table is renamed instead, so its data is kept; the primary key, foreign keys
    /// and indexes are renamed to match the names EF Core expects for the new table.
    /// </remarks>
    public partial class RenommerLignePanier : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArticlePanier_Panier_PanierId",
                table: "ArticlePanier");

            migrationBuilder.DropForeignKey(
                name: "FK_ArticlePanier_Produit_ProduitId",
                table: "ArticlePanier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ArticlePanier",
                table: "ArticlePanier");

            migrationBuilder.RenameTable(
                name: "ArticlePanier",
                newName: "LignePanier");

            migrationBuilder.RenameIndex(
                name: "IX_ArticlePanier_PanierId_ProduitId",
                table: "LignePanier",
                newName: "IX_LignePanier_PanierId_ProduitId");

            migrationBuilder.RenameIndex(
                name: "IX_ArticlePanier_ProduitId",
                table: "LignePanier",
                newName: "IX_LignePanier_ProduitId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LignePanier",
                table: "LignePanier",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LignePanier_Panier_PanierId",
                table: "LignePanier",
                column: "PanierId",
                principalTable: "Panier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LignePanier_Produit_ProduitId",
                table: "LignePanier",
                column: "ProduitId",
                principalTable: "Produit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LignePanier_Panier_PanierId",
                table: "LignePanier");

            migrationBuilder.DropForeignKey(
                name: "FK_LignePanier_Produit_ProduitId",
                table: "LignePanier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LignePanier",
                table: "LignePanier");

            migrationBuilder.RenameTable(
                name: "LignePanier",
                newName: "ArticlePanier");

            migrationBuilder.RenameIndex(
                name: "IX_LignePanier_PanierId_ProduitId",
                table: "ArticlePanier",
                newName: "IX_ArticlePanier_PanierId_ProduitId");

            migrationBuilder.RenameIndex(
                name: "IX_LignePanier_ProduitId",
                table: "ArticlePanier",
                newName: "IX_ArticlePanier_ProduitId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ArticlePanier",
                table: "ArticlePanier",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticlePanier_Panier_PanierId",
                table: "ArticlePanier",
                column: "PanierId",
                principalTable: "Panier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ArticlePanier_Produit_ProduitId",
                table: "ArticlePanier",
                column: "ProduitId",
                principalTable: "Produit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
