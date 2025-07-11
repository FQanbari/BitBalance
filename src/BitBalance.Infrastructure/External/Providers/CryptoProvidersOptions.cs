namespace BitBalance.Infrastructure.External.CoinGecko;

public class CryptoProvidersOptions
{
    public ProviderOptions CoinGecko { get; set; }
    public ProviderOptions CoinCap { get; set; }
    public ProviderOptions Binance { get; set; }
    public ProviderOptions Nomics { get; set; }
    public ProviderOptions CryptoCompare { get; set; }
    public List<string> Order { get; set; } = new();
    public Dictionary<string, ProviderOptions> Providers { get; set; } = new();
}
public class ProviderOptions
{
    public string BaseUrl { get; set; } = "";
    public string? ApiKey { get; set; }
}
public class PriceUpdaterOptions
{
    public int UpdateIntervalSeconds { get; set; } = 10;
    public int MaxSymbolsToUpdatePerCycle { get; set; } = 20;
}

public class PriceFetcherOptions
{
    public const string SectionName = "PriceFetcherOptions";
    public int RetryCount { get; set; } = 3;
    public int InitialDelaySeconds { get; set; } = 1;
    public bool UseExponentialBackoff { get; set; } = true;
}
