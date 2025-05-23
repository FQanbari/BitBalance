using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class CoinCapPriceProvider : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl = "https://api.coincap.io/v2";

    public CoinCapPriceProvider(HttpClient httpClient,
        IOptions<ProviderOptions> options)
    {
            _httpClient = httpClient;
            _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var coinId = MapSymbolToCoinId(symbol.Symbol);
        var url = $"{_baseUrl}/assets/{coinId}";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();

        var root = JsonConvert.DeserializeObject<CoinCapResponse>(json);
        if (root == null || root.Data == null)
            throw new ApplicationException($"Price for {symbol.Symbol} not found.");

        if (!decimal.TryParse(root.Data.PriceUsd, out var priceUsd))
            throw new ApplicationException("Invalid price format.");

        return new Money(priceUsd, "USD");
    }

    private string MapSymbolToCoinId(string symbol) =>
        symbol.ToUpper() switch
        {
            "BTC" => "bitcoin",
            "ETH" => "ethereum",
            "BNB" => "binance-coin",
            "ADA" => "cardano",
            _ => throw new NotSupportedException($"Symbol {symbol} not supported.")
        };

    private class CoinCapResponse
    {
        public CoinData Data { get; set; }
    }

    private class CoinData
    {
        [JsonProperty("priceUsd")]
        public string PriceUsd { get; set; }
    }
}
