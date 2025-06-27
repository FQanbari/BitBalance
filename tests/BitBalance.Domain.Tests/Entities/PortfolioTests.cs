using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Domain.Tests.Entities;

public class PortfolioTests
{
    [Fact]
    public void AddAsset_WhenValid_AddsAssetToPortfolio()
    {
        var userId = Guid.NewGuid();
        var portfolio = new Portfolio(userId, "Test");
        var asset = new Asset(new CoinSymbol("BTC"), new Money(1000, "USD"), new Money(1000, "USD"), DateTime.UtcNow);

        portfolio.AddAsset(asset);

        Assert.Contains(asset, portfolio.Assets);
    }

}
