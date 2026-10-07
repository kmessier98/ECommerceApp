using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceApp.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class PanierAnonyme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier");

            migrationBuilder.DropIndex(
                name: "IX_Panier_UtilisateurId",
                table: "Panier");

            migrationBuilder.AlterColumn<int>(
                name: "UtilisateurId",
                table: "Panier",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<Guid>(
                name: "CleAnonyme",
                table: "Panier",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Panier_CleAnonyme",
                table: "Panier",
                column: "CleAnonyme",
                unique: true,
                filter: "[CleAnonyme] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Panier_UtilisateurId",
                table: "Panier",
                column: "UtilisateurId",
                unique: true,
                filter: "[UtilisateurId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier",
                column: "UtilisateurId",
                principalTable: "Utilisateur",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier");

            migrationBuilder.DropIndex(
                name: "IX_Panier_CleAnonyme",
                table: "Panier");

            migrationBuilder.DropIndex(
                name: "IX_Panier_UtilisateurId",
                table: "Panier");

            migrationBuilder.DropColumn(
                name: "CleAnonyme",
                table: "Panier");

            migrationBuilder.AlterColumn<int>(
                name: "UtilisateurId",
                table: "Panier",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Panier_UtilisateurId",
                table: "Panier",
                column: "UtilisateurId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Panier_Utilisateur_UtilisateurId",
                table: "Panier",
                column: "UtilisateurId",
                principalTable: "Utilisateur",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
