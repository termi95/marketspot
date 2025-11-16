using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Marketspot.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class Orderschangefield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeliveryMethodIdDeliveryMethodId",
                table: "Orders",
                newName: "DeliveryMethodIdDeliveryMethod");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeliveryMethodIdDeliveryMethod",
                table: "Orders",
                newName: "DeliveryMethodIdDeliveryMethodId");
        }
    }
}
