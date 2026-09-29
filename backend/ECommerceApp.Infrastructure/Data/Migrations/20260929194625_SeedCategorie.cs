using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategorie : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Categorie",
                columns: new[] { "Id", "Nom" },
                values: new object[,]
                {
                    { 1, "Maison" },
                    { 2, "Cuisine" },
                    { 3, "Épicerie" },
                    { 4, "Accessoires" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categorie",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categorie",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categorie",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Categorie",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
