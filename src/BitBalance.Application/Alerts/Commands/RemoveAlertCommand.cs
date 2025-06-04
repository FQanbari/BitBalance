using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Alerts.Commands;

public record RemoveAlertCommand(Guid PortfolioId, Guid AlertId) : IRequest<Unit>;

public class RemoveAlertCommandHandler : IRequestHandler<RemoveAlertCommand, Unit>
{
    private readonly IPortfolioRepository _repo;
    private readonly IUnitOfWork _uow;

    public RemoveAlertCommandHandler(IPortfolioRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Unit> Handle(RemoveAlertCommand request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.PortfolioId);

        if (portfolio.Assets.Count > 0)
            throw new ApplicationException("You are not allow to remove alert!!");

        portfolio.RemoveAlert(request.AlertId);
        await _uow.SaveChangesAsync();

        return Unit.Value;
    }
}
