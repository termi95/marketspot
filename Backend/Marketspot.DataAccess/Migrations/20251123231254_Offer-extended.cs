using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Offerextended : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Condytion",
                table: "Offers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DeliveryType",
                table: "Offers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PickupAddress_City",
                table: "Offers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupAddress_Phone",
                table: "Offers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PickupAddress_Street",
                table: "Offers",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Condytion",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "DeliveryType",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "PickupAddress_City",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "PickupAddress_Phone",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "PickupAddress_Street",
                table: "Offers");
        }
    }
}
