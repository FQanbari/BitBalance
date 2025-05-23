using BitBalance.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Infrastructure.Persistence.SeedData;

public static class UserSettingsSeed
{
    public static async Task SeedAsync(BitBalanceDbContext context)
    {
        if (await context.UserSettings.AnyAsync())
            return;

        var settingsList = new List<UserSettings>
        {
            new UserSettings(
                userId: Guid.Parse("11111111-1111-1111-1111-111111111111"),
                defaultCurrency: "USD",
                notificationMethod: "email",
                theme: "light",
                language: "en"
            ),
            new UserSettings(
                userId: Guid.Parse("22222222-2222-2222-2222-222222222222"),
                defaultCurrency: "EUR",
                notificationMethod: "telegram",
                theme: "dark",
                language: "de"
            )
        };

        await context.UserSettings.AddRangeAsync(settingsList);
        await context.SaveChangesAsync();
    }
}
