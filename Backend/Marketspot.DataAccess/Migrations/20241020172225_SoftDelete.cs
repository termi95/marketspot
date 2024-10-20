using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SoftDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SoftDeletedDate",
                table: "Offers",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoftDeletedDate",
                table: "Offers");
        }
    }
}
