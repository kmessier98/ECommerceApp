using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Produit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prix = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CategorieId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Produit_Categorie_CategorieId",
                        column: x => x.CategorieId,
                        principalTable: "Categorie",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Produit",
                columns: new[] { "Id", "CategorieId", "Nom", "Prix" },
                values: new object[,]
                {
                    { 1, 4, "Tuque en laine mérinos", 38.00m },
                    { 2, 1, "Tasse en grès émaillé", 32.00m },
                    { 3, 1, "Bougie sapin baumier", 28.00m },
                    { 4, 3, "Sirop d’érable ambré 540 ml", 16.50m },
                    { 5, 1, "Jeté en laine tissé", 145.00m },
                    { 6, 2, "Planche à découper en érable", 64.00m },
                    { 7, 4, "Chaussettes de laine", 24.00m },
                    { 8, 3, "Beurre d’érable 250 g", 11.00m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Produit_CategorieId",
                table: "Produit",
                column: "CategorieId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Produit");
        }
    }
}
