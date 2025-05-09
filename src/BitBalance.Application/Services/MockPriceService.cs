using BitBalance.Application.Interfaces;

namespace BitBalance.Application.Services;

public class MockPriceService : IPriceService
{
    private static readonly Random _random = new();

    public Task<decimal> GetCurrentPriceAsync(string symbol)
    {
        var price = symbol switch
        {
            "BTC" => 60000m,
            "ETH" => 3000m,
            "AAPL" => 190m,
            _ => Math.Round((decimal)(_random.NextDouble() * 100), 2)
        };

        return Task.FromResult(price);
    }
}
