using BitBalance.Application.Interfaces;
using BitBalance.Domain.ValueObjects;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace BitBalance.Infrastructure.External.CoinGecko;
public class NomicsPriceProvider : ICryptoPriceProvider
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _baseUrl = "https://api.nomics.com/v1";

    public NomicsPriceProvider(HttpClient httpClient,
        IOptions<ProviderOptions> options)
    {
        _httpClient = httpClient;
        _baseUrl = options.Value.BaseUrl ?? throw new ArgumentNullException(nameof(options));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        var url = $"{_baseUrl}/currencies/ticker?key={_apiKey}&ids={symbol.Symbol.ToUpper()}&convert=USD";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonConvert.DeserializeObject<List<NomicsTicker>>(json);

        if (data == null || data.Count == 0)
            throw new ApplicationException($"Price for {symbol.Symbol} not found.");

        if (!decimal.TryParse(data[0].Price, out var price))
            throw new ApplicationException("Invalid price format.");

        return new Money(price, "USD");
    }

    private class NomicsTicker
    {
        [JsonProperty("price")]
        public string Price { get; set; }
    }
}
