using BitBalance.Application.Interfaces;
using System.Text.Json.Nodes;

namespace BitBalance.Infrastructure.Services;

public class CoinGeckoPriceService : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;

    public CoinGeckoPriceService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<decimal> GetPriceAsync(string symbol)
    {
        symbol = symbol.ToLower(); // BTC → btc
        var url = $"https://api.coingecko.com/api/v3/simple/price?ids={symbol}&vs_currencies=usd";

        var response = await _httpClient.GetStringAsync(url);
        var json = JsonNode.Parse(response);
        var price = json[symbol]?["usd"]?.GetValue<decimal>() ?? throw new Exception("Invalid symbol");

        return Math.Round(price, 2);
    }
}
