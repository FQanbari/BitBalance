using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Enums;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using MediatR;

namespace BitBalance.Application.Alerts.Commands;

public record CreateAlertCommand(
    Guid PortfolioId,
    Guid UserId,
    string CoinSymbol,
    string Currency,
    decimal TargetPrice,
    AlertType Type
) : IRequest<Guid>;
public class CreateAlertCommandHandler : IRequestHandler<CreateAlertCommand, Guid>
{
    private readonly IPortfolioRepository _portfolioRepo;
    private readonly IUnitOfWork _uow;

    public CreateAlertCommandHandler(IPortfolioRepository portfolioRepo, IUnitOfWork uow)
    {
        _portfolioRepo = portfolioRepo;
        _uow = uow;
    }

    public async Task<Guid> Handle(CreateAlertCommand request, CancellationToken cancellationToken)
    {
        var portfolio = await _portfolioRepo.GetByIdAsync(request.PortfolioId);

        if (portfolio.UserId != request.UserId)
            throw new ApplicationException("This portfolio not belong to this user!!");

        var alert = new Alert(
            CoinSymbol.From(request.CoinSymbol),
            request.Type,
            new Money(request.TargetPrice, request.Currency)
        );

        portfolio.AddAlert(alert);

        await _uow.SaveChangesAsync();
        return alert.Id;
    }
}
