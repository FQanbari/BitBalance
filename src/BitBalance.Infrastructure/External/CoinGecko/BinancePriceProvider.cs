using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class BinancePriceProvider : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl = "https://api.binance.com/api/v3";

    public BinancePriceProvider(HttpClient httpClient,
        IOptions<ProviderOptions> options)
    {
        _httpClient = httpClient;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var binanceSymbol = MapSymbolToBinanceSymbol(symbol.Symbol);
        var url = $"{_baseUrl}/ticker/price?symbol={binanceSymbol}";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<BinancePriceResponse>(json);

        if (!decimal.TryParse(data.Price, out var price))
            throw new ApplicationException("Invalid price format.");

        return new Money(price, "USD");
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
        [JsonProperty("price")]
        public string Price { get; set; }
    }
}

