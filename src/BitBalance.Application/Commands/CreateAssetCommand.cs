using BitBalance.Application.DTOs;

namespace BitBalance.Application.Commands;

public class CreateAssetCommand
{
    public Guid PortfolioId { get; set; }
    public AssetDto Asset { get; set; }
}
