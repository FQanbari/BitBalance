namespace BitBalance.Infrastructure.External.CoinGecko;

public class CryptoProvidersOptions
{
    public ProviderOptions CoinGecko { get; set; }
    public ProviderOptions CoinCap { get; set; }
    public ProviderOptions Binance { get; set; }
    public ProviderOptions Nomics { get; set; }
    public ProviderOptions CryptoCompare { get; set; }
}
public class ProviderOptions
{
    public string BaseUrl { get; set; }
}
