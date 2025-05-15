namespace BitBalance.Application.Alerts.Dtos;

public class AlertDto
{
    public Guid Id { get; set; }
    public string CoinSymbol { get; set; }
    public string Currency { get; set; }
    public decimal TargetPrice { get; set; }
    public string Type { get; set; }
    public DateTime CreatedAt { get; set; }
}
