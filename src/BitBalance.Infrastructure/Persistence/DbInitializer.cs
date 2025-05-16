using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(BitBalanceDbContext context)
    {
        if (!context.Portfolios.Any())
        {
            var btc = CoinSymbol.BTC;
            var usd = "USD";

            var p1 = new Portfolio("Demo Portfolio");
            var asset = new Asset(
                btc,
                new Money(0.5m, usd),
                new Money(30000m, usd),
                DateTime.UtcNow.AddDays(-10)
            );
            p1.AddAsset(asset);

            context.Portfolios.Add(p1);
        }

        await context.SaveChangesAsync();
    }
}
