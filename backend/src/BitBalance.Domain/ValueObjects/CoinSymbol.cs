namespace BitBalance.Domain.ValueObjects;

public record CoinSymbol(string Symbol)
{
    public static CoinSymbol BTC => new("BTC");
    public static CoinSymbol ETH => new("ETH");
    public static CoinSymbol From(string symbol) => new(symbol.ToUpperInvariant());
}
