namespace BitBalance.Application.Analysis.Dtos;

public class AssetAllocationDto
{
    public string CoinSymbol { get; set; }
    public decimal Percentage { get; set; } // 0 - 100
    public decimal CurrentValue { get; set; }
    public string Currency { get; set; }
}
