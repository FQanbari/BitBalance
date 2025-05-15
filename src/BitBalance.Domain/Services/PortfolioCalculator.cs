using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Domain.Services;
public class PortfolioCalculator
{
    public Money CalculateTotal(IEnumerable<Asset> assets, Func<CoinSymbol, Money> getCurrentPrice)
    {
        if (assets == null || !assets.Any())
            return Money.Zero();

        var total = Money.Zero(assets.First().PurchasePrice.Currency);

        foreach (var asset in assets)
        {
            var currentPrice = getCurrentPrice(asset.CoinSymbol);
            var value = asset.GetCurrentValue(currentPrice);
            total += value;
        }

        return total;
    }

    public Dictionary<CoinSymbol, decimal> CalculateAllocation(IEnumerable<Asset> assets, Func<CoinSymbol, Money> getCurrentPrice)
    {
        var total = CalculateTotal(assets, getCurrentPrice);

        if (total.Amount == 0)
            return assets.ToDictionary(a => a.CoinSymbol, a => 0m);

        var allocation = new Dictionary<CoinSymbol, decimal>();

        foreach (var group in assets.GroupBy(a => a.CoinSymbol))
        {
            var groupTotal = group
                .Select(a => a.GetCurrentValue(getCurrentPrice(a.CoinSymbol)))
                .Aggregate(Money.Zero(total.Currency), (sum, val) => sum + val);

            var percent = (groupTotal.Amount / total.Amount) * 100;
            allocation.Add(group.Key, Math.Round(percent, 2));
        }

        return allocation;
    }
}
