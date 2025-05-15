using BitBalance.Application.Analysis.Dtos;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Services;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Application.Analysis.Services;

public class PortfolioCalculationService
{
    private readonly PortfolioCalculator _calculator;

    public PortfolioCalculationService()
    {
        _calculator = new PortfolioCalculator();
    }

    public async Task<List<AssetAllocationDto>> CalculateAllocationAsync(
        Portfolio portfolio,
        Func<CoinSymbol, Money> getCurrentPrice)
    {
        var allocations = _calculator.CalculateAllocation(portfolio.Assets, getCurrentPrice);

        var results = new List<AssetAllocationDto>();
        foreach (var asset in portfolio.Assets)
        {
            var currentPrice = getCurrentPrice(asset.CoinSymbol);
            var currentValue = asset.GetCurrentValue(currentPrice);

            results.Add(new AssetAllocationDto
            {
                CoinSymbol = asset.CoinSymbol.Symbol,
                CurrentValue = currentValue.Amount,
                Currency = currentValue.Currency,
                Percentage = Math.Round(allocations[asset.CoinSymbol], 2)
            });
        }

        return results
            .GroupBy(a => a.CoinSymbol)
            .Select(g => new AssetAllocationDto
            {
                CoinSymbol = g.Key,
                Currency = g.First().Currency,
                Percentage = g.First().Percentage,
                CurrentValue = g.Sum(x => x.CurrentValue)
            })
            .ToList();
    }
}
