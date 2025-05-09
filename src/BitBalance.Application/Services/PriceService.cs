using BitBalance.Application.Interfaces;
using System.Text.Json;

namespace BitBalance.Application.Services;

public class PriceService : IPriceService
{
    private readonly HttpClient _httpClient;

    public PriceService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<decimal> GetCurrentPriceAsync(string symbol)
    {
        var response = await _httpClient.GetStringAsync($"https://api.example.com/price/{symbol}");
        var price = JsonSerializer.Deserialize<decimal>(response);
        return Math.Round(price, 2);
    }
}
