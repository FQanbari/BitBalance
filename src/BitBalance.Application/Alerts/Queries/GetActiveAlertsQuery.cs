using BitBalance.Application.Alerts.Commands;
using BitBalance.Application.Alerts.Dtos;
using BitBalance.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace BitBalance.Application.Alerts.Queries;

public record GetActiveAlertsQuery(Guid UserId) : IRequest<List<AlertDto>>;
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
        var portfolios = await _portfolioRepo.GetAllWithAlertsAsync(request.UserId);

        return portfolios
            .SelectMany(p => p.Alerts
                .Where(alert => !alert.IsTriggered)
                .Select(alert => new AlertDto
                {
                    PortfolioName = p.Name,
                    Id = alert.Id,
                    CoinSymbol = alert.CoinSymbol.Symbol,
                    TargetPrice = alert.TargetPrice.Amount,
                    Currency = alert.TargetPrice.Currency,
                    Type = alert.Type.ToString(),
                    CreatedAt = alert.CreatedAt
                }))
            .ToList();
    }

}
