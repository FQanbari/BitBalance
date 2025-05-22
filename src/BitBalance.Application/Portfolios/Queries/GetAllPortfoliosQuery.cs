using BitBalance.Application.DTOs;
using BitBalance.Application.Portfolios.Dtos;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Portfolios.Queries;

public record GetAllPortfoliosQuery(Guid UserId) : IRequest<IEnumerable<PortfolioDto>>;
public class GetAllPortfoliosQueryHandler : IRequestHandler<GetAllPortfoliosQuery, IEnumerable<PortfolioDto>>
{
    private readonly IPortfolioRepository _repo;

    public GetAllPortfoliosQueryHandler(IPortfolioRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PortfolioDto>> Handle(GetAllPortfoliosQuery request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetAllByUserAsync(request.UserId);
        return portfolio.Select(a => new PortfolioDto
        {
            Id = a.Id,
            Name = a.Name,
            CreatedAt = a.CreatedAt,
            Assets = a.Assets.Select(a => new AssetDto
            {
                Id = a.Id,
                CoinSymbol = a.CoinSymbol.Symbol,
                Quantity = a.Quantity.Amount,
                PurchasePrice = a.PurchasePrice.Amount,
                Currency = a.Quantity.Currency,
                PurchaseDate = a.PurchaseDate
            }).ToList()
        }).ToList();
    }
}