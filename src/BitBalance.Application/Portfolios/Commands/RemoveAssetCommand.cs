using BitBalance.Application.Interfaces;
using BitBalance.Domain.Interfaces;
using MediatR;

namespace BitBalance.Application.Portfolios.Commands;

public record RemoveAssetCommand(Guid PortfolioId, Guid AssetId) : IRequest<Unit>;

public class RemoveAssetCommandHandler : IRequestHandler<RemoveAssetCommand, Unit>
{
    private readonly IPortfolioRepository _repo;
    private readonly IUnitOfWork _uow;

    public RemoveAssetCommandHandler(IPortfolioRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Unit> Handle(RemoveAssetCommand request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.PortfolioId);
        portfolio.RemoveAsset(request.AssetId);
        await _uow.SaveChangesAsync();

        return Unit.Value;
    }
}
