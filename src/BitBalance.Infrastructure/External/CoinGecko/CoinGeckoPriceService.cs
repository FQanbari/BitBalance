using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text.Json.Nodes;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class CoinGeckoPriceProvider : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;

    public CoinGeckoPriceProvider(
        HttpClient httpClient,
        IOptions<CoinGeckoOptions> options)
    {
        _httpClient = httpClient;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var coinId = MapSymbolToCoinId(symbol.Symbol);
        var url = $"{_baseUrl}/simple/price?ids={coinId}&vs_currencies=usd";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, decimal>>>(json);

        if (result == null || !result.TryGetValue(coinId, out var priceDict))
            throw new ApplicationException($"Price for {symbol.Symbol} not found.");

        return new Money(priceDict["usd"], "USD");
    }

    private string MapSymbolToCoinId(string symbol) =>
        symbol.ToUpper() switch
        {
            "BTC" => "bitcoin",
            "ETH" => "ethereum",
            "BNB" => "binancecoin",
            "ADA" => "cardano",
            _ => throw new NotSupportedException($"Symbol {symbol} not supported.")
        };
}
