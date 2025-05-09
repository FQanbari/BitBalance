namespace BitBalance.Application.DTOs;

public class PortfolioValueDto
{
    public decimal TotalValue { get; set; }
    public string Currency { get; set; } = "USD";
}
