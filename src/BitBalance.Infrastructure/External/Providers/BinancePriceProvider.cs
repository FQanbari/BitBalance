using System.Text.Json;
using System.Text.Json.Serialization;
using BitBalance.Domain.ValueObjects;
using BitBalance.Infrastructure.SignalR;
using Microsoft.Extensions.Options;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class BinancePriceProvider : BaseCryptoProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl = "https://api.binance.com/api/v3";

    public BinancePriceProvider(HttpClient client, PriceBroadcaster notifier, IOptions<ProviderOptions> options) : base(notifier)
    {
        _httpClient = client;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var binanceSymbol = MapSymbolToBinanceSymbol(symbol.Symbol);
        var url = $"{_baseUrl}/ticker/price?symbol={binanceSymbol}";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<BinancePriceResponse>(json);

        if (!decimal.TryParse(data.Price, out var price))
            throw new ApplicationException("Invalid price format.");

        return new Money(price, "USD");
    }

    protected override async Task<Money?> GetPriceInternalAsync(CoinSymbol symbol)
    {
        try
        {
            return await GetPriceAsync(symbol);
        }
        catch { return null; }
    }

    private string MapSymbolToBinanceSymbol(string symbol) =>
        symbol.ToUpper() switch
        {
            "BTC" => "BTCUSDT",
            "ETH" => "ETHUSDT",
            "BNB" => "BNBUSDT",
            "ADA" => "ADAUSDT",
            _ => throw new NotSupportedException($"Symbol {symbol} not supported.")
        };

    private class BinancePriceResponse
    {
        public string Price { get; set; }
    }
}

