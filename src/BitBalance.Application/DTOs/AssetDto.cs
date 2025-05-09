namespace BitBalance.Application.DTOs;

public class AssetDto
{
    public string Symbol { get; set; }
    public decimal Quantity { get; set; }
    public decimal PurchasePrice { get; set; }
    public string Currency { get; set; }
    public DateTime PurchaseDate { get; set; }
}
