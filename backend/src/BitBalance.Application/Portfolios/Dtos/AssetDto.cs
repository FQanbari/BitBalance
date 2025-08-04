namespace BitBalance.Application.Portfolios.Dtos;


public class AssetDto
{
    public Guid Id { get; set; }
    public string CoinSymbol { get; set; }
    public decimal Quantity { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; }
    public DateTime PurchaseDate { get; set; }
}

