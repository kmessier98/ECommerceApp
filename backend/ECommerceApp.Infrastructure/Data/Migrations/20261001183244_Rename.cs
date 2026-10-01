using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Rename : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArticlePanier_Cart_PanierId",
                table: "ArticlePanier");

            migrationBuilder.DropForeignKey(
                name: "FK_Cart_Utilisateur_UtilisateurId",
                table: "Cart");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cart",
                table: "Cart");

            migrationBuilder.RenameTable(
                name: "Cart",
                newName: "Panier");

            migrationBuilder.RenameIndex(
                name: "IX_Cart_UtilisateurId",
                table: "Panier",
                newName: "IX_Panier_UtilisateurId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Panier",
                table: "Panier",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticlePanier_Panier_PanierId",
                table: "ArticlePanier",
                column: "PanierId",
                principalTable: "Panier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier",
                column: "UtilisateurId",
                principalTable: "Utilisateur",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArticlePanier_Panier_PanierId",
                table: "ArticlePanier");

            migrationBuilder.DropForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Panier",
                table: "Panier");

            migrationBuilder.RenameTable(
                name: "Panier",
                newName: "Cart");

            migrationBuilder.RenameIndex(
                name: "IX_Panier_UtilisateurId",
                table: "Cart",
                newName: "IX_Cart_UtilisateurId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cart",
                table: "Cart",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticlePanier_Cart_PanierId",
                table: "ArticlePanier",
                column: "PanierId",
                principalTable: "Cart",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Cart_Utilisateur_UtilisateurId",
                table: "Cart",
                column: "UtilisateurId",
                principalTable: "Utilisateur",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
