using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BitBalance.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationDetailsToUserSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificationEmail",
                table: "UserSettings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TelegramHandle",
                table: "UserSettings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationEmail",
                table: "UserSettings");

            migrationBuilder.DropColumn(
                name: "TelegramHandle",
                table: "UserSettings");
        }
    }
}
