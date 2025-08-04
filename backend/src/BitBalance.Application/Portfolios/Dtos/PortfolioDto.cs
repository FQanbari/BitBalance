using BitBalance.Application.Portfolios.Dtos;

namespace BitBalance.Application.DTOs;

public class PortfolioDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<AssetDto> Assets { get; set; } = new();
    public DateTime CreatedAt { get; internal set; }
}
