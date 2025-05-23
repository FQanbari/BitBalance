using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BitBalance.Infrastructure.External.CoinGecko;
public class CryptoComparePriceProvider : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl = "https://min-api.cryptocompare.com/data";

    public CryptoComparePriceProvider(HttpClient httpClient,
        IOptions<ProviderOptions> options)
    {
        _httpClient = httpClient;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var url = $"{_baseUrl}/price?fsym={symbol.Symbol.ToUpper()}&tsyms=USD";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<Dictionary<string, decimal>>(json);

        if (data == null || !data.TryGetValue("USD", out var price))
            throw new ApplicationException($"Price for {symbol.Symbol} not found.");

        return new Money(price, "USD");
    }
}
