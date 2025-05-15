using BitBalance.Application.DTOs;
using BitBalance.Application.Portfolios.Dtos;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Portfolios.Queries;

public record GetPortfolioByIdQuery(Guid Id) : IRequest<PortfolioDto>;
public class GetPortfolioByIdQueryHandler : IRequestHandler<GetPortfolioByIdQuery, PortfolioDto>
{
    private readonly IPortfolioRepository _repo;

    public GetPortfolioByIdQueryHandler(IPortfolioRepository repo)
    {
        _repo = repo;
    }

    public async Task<PortfolioDto> Handle(GetPortfolioByIdQuery request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.Id);
        return new PortfolioDto
        {
            Id = portfolio.Id,
            Name = portfolio.Name,
            Assets = portfolio.Assets.Select(a => new AssetDto
            {
                Id = a.Id,
                CoinSymbol = a.CoinSymbol.Symbol,
                Quantity = a.Quantity.Amount,
                PurchasePrice = a.PurchasePrice.Amount,
                Currency = a.Quantity.Currency,
                PurchaseDate = a.PurchaseDate
            }).ToList()
        };
    }
}
