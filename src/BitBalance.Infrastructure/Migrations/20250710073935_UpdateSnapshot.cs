using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BitBalance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_PriceSnapshots_CoinSymbol",
                table: "PriceSnapshots",
                column: "CoinSymbol",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PriceSnapshots_CoinSymbol",
                table: "PriceSnapshots");
        }
    }
}
