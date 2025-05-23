using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.Persistence.SeedData;

namespace BitBalance.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(BitBalanceDbContext context)
    {
        await PortfolioSeed.SeedAsync(context);
        await UserSettingsSeed.SeedAsync(context);
    }
}
