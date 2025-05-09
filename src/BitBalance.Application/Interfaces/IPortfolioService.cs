using BitBalance.Application.Commands;
using BitBalance.Application.DTOs;
using BitBalance.Application.Queries;

namespace BitBalance.Application.Interfaces;

public interface IPortfolioService
{
    Task AddAssetAsync(CreateAssetCommand command);
    Task<PortfolioValueDto> GetPortfolioValueAsync(GetPortfolioValueQuery query);
}
