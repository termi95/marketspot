using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Ordersdelivery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<int>(
                name: "DeliveryMethodIdDeliveryMethodId",
                table: "Orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "DeliveryMethodIdDeliveryMethodId",
                table: "Orders");
        }
    }
}
