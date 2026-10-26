using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductImageUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Produit",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageUrl",
                value: "/images/products/tuque-merinos.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageUrl",
                value: "/images/products/tasse-gres.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageUrl",
                value: "/images/products/bougie-sapin.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 4,
                column: "ImageUrl",
                value: "/images/products/sirop-erable.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 5,
                column: "ImageUrl",
                value: "/images/products/jete-laine.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 6,
                column: "ImageUrl",
                value: "/images/products/planche-erable.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 7,
                column: "ImageUrl",
                value: "/images/products/chaussettes-laine.webp");

            migrationBuilder.UpdateData(
                table: "Produit",
                keyColumn: "Id",
                keyValue: 8,
                column: "ImageUrl",
                value: "/images/products/beurre-erable.webp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Produit");
        }
    }
}
