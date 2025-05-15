using BitBalance.Application.Analysis.Dtos;
using BitBalance.Application.Analysis.Services;
using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Analysis.Queries;

public record GetPortfolioAllocationQuery(Guid PortfolioId) : IRequest<List<AssetAllocationDto>>;
public class GetPortfolioAllocationQueryHandler : IRequestHandler<GetPortfolioAllocationQuery, List<AssetAllocationDto>>
{
    private readonly IPortfolioRepository _portfolioRepo;
    private readonly ICryptoPriceProvider _priceProvider;
    private readonly PortfolioCalculationService _calculationService;

    public GetPortfolioAllocationQueryHandler(
        IPortfolioRepository portfolioRepo,
        ICryptoPriceProvider priceProvider)
    {
        _portfolioRepo = portfolioRepo;
        _priceProvider = priceProvider;
        _calculationService = new PortfolioCalculationService();
    }

    public async Task<List<AssetAllocationDto>> Handle(GetPortfolioAllocationQuery request, CancellationToken cancellationToken)
    {
        var portfolio = await _portfolioRepo.GetByIdAsync(request.PortfolioId);

        return await _calculationService.CalculateAllocationAsync(portfolio, symbol =>
        {
            var price = _priceProvider.GetPriceAsync(symbol).Result; 
            return price;
        });
    }
}

