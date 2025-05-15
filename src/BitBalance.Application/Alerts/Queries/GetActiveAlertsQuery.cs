using BitBalance.Application.Alerts.Commands;
using BitBalance.Application.Alerts.Dtos;
using BitBalance.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace BitBalance.Application.Alerts.Queries;

public record GetActiveAlertsQuery(Guid PortfolioId) : IRequest<List<AlertDto>>;
public class CreateAlertCommandValidator : AbstractValidator<CreateAlertCommand>
{
    public CreateAlertCommandValidator()
    {
        RuleFor(x => x.PortfolioId).NotEmpty();
        RuleFor(x => x.CoinSymbol).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Currency).NotEmpty().Length(3, 5);
        RuleFor(x => x.TargetPrice).GreaterThan(0);
        RuleFor(x => x.Type).IsInEnum();
    }
}

public class GetActiveAlertsQueryHandler : IRequestHandler<GetActiveAlertsQuery, List<AlertDto>>
{
    private readonly IPortfolioRepository _portfolioRepo;

    public GetActiveAlertsQueryHandler(IPortfolioRepository portfolioRepo)
    {
        _portfolioRepo = portfolioRepo;
    }

    public async Task<List<AlertDto>> Handle(GetActiveAlertsQuery request, CancellationToken cancellationToken)
    {
        var portfolio = await _portfolioRepo.GetByIdAsync(request.PortfolioId);

        return portfolio.Alerts
            .Where(a => !a.IsTriggered)
            .Select(a => new AlertDto
            {
                Id = a.Id,
                CoinSymbol = a.CoinSymbol.Symbol,
                TargetPrice = a.TargetPrice.Amount,
                Currency = a.TargetPrice.Currency,
                Type = a.Type.ToString(),
                CreatedAt = a.CreatedAt
            }).ToList();
    }
}
