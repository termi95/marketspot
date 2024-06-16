using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class offers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("96dbde9e-41a3-46e2-87db-70abd1e7c55d"));

            migrationBuilder.CreateTable(
                name: "Offers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Tittle = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Photos = table.Column<List<string>>(type: "text[]", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offers_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Offers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "PasswordAllowTimeToChange", "PasswordChangeToken", "Roles", "Surname" },
                values: new object[] { new Guid("decdeb79-5227-47a6-8331-fe233b9eae03"), "admin@admin.pl", "admin", "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000000"), 1L, "Jefe" });

            migrationBuilder.CreateIndex(
                name: "IX_Offers_CategoryId",
                table: "Offers",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_UserId",
                table: "Offers",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Offers");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("decdeb79-5227-47a6-8331-fe233b9eae03"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "PasswordAllowTimeToChange", "PasswordChangeToken", "Roles", "Surname" },
                values: new object[] { new Guid("96dbde9e-41a3-46e2-87db-70abd1e7c55d"), "admin@admin.pl", "admin", "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000000"), 1L, "Jefe" });
        }
    }
}
