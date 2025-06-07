using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Portfolios.Queries;

public record GetPortfolioValueQuery(Guid PortfolioId) : IRequest<decimal>;
public class GetPortfolioValueQueryHandler : IRequestHandler<GetPortfolioValueQuery, decimal>
{
    private readonly IPortfolioRepository _repo;
    private readonly ICryptoPriceProvider _priceProvider;

    public GetPortfolioValueQueryHandler(IPortfolioRepository repo, ICryptoPriceProvider priceProvider)
    {
        _repo = repo;
        _priceProvider = priceProvider;
    }

    public async Task<decimal> Handle(GetPortfolioValueQuery request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.PortfolioId);
        return portfolio.GetTotalValue(symbol =>
        {
            var price = _priceProvider.TryGetPriceAsync(symbol).Result;
            return price;
        }).Amount;
    }
}
