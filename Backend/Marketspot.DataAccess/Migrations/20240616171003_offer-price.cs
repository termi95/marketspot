using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class offerprice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("decdeb79-5227-47a6-8331-fe233b9eae03"));

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Offers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "PasswordAllowTimeToChange", "PasswordChangeToken", "Roles", "Surname" },
                values: new object[] { new Guid("d03e792a-20eb-4036-8fff-0e0416c59aec"), "admin@admin.pl", "admin", "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000000"), 1L, "Jefe" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("d03e792a-20eb-4036-8fff-0e0416c59aec"));

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Offers");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "Password", "PasswordAllowTimeToChange", "PasswordChangeToken", "Roles", "Surname" },
                values: new object[] { new Guid("decdeb79-5227-47a6-8331-fe233b9eae03"), "admin@admin.pl", "admin", "AQAAAAIAAYagAAAAEFMvOOAzL4k+idqThNAhbif3uTKHFGYjJVUukDKgnRyC/rHbd8+eRrCr5xOMKFksXA==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("00000000-0000-0000-0000-000000000000"), 1L, "Jefe" });
        }
    }
}
