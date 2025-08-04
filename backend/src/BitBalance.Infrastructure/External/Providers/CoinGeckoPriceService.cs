using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.SignalR;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class CoinGeckoPriceProvider : BaseCryptoProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    public CoinGeckoPriceProvider(HttpClient client, PriceBroadcaster notifier, IOptions<ProviderOptions> options) : base(notifier)
    {
        _httpClient = client;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    protected override async Task<Money?> GetPriceInternalAsync(CoinSymbol symbol)
    {
        try
        {
            var coinId = MapSymbolToCoinId(symbol.Symbol);
            var url = $"{_baseUrl}/simple/price?ids={coinId}&vs_currencies=usd";
            var url1 = $"{_baseUrl}/coins/{coinId}/market_chart?vs_currency=usd&days=200&interval=daily";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, decimal>>>(json);

            if (result == null || !result.TryGetValue(coinId, out var priceDict))
                throw new ApplicationException($"Price for {symbol.Symbol} not found.");

            return new Money(priceDict["usd"], "USD");
        }
        catch { return null; }
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