namespace BitBalance.Domain.Interfaces;

public interface IPriceBroadcaster
{
    Task BroadcastProviderUsed(string providerName);
    Task BroadcastPriceAsync(string symbol, decimal price);
}
public record CryptoPriceDto(string Symbol, decimal Amount, string Currency);