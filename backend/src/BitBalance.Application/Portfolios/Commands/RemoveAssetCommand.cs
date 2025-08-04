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
public record RemovePortfolioCommand(Guid PortfolioId) : IRequest<Unit>;

public class RemovePortfolioCommandHandler : IRequestHandler<RemovePortfolioCommand, Unit>
{
    private readonly IPortfolioRepository _repo;
    private readonly IUnitOfWork _uow;

    public RemovePortfolioCommandHandler(IPortfolioRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Unit> Handle(RemovePortfolioCommand request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.PortfolioId);
        if (portfolio.Assets.Count > 0)
            throw new ApplicationException("You are not allow to remove portfolio!!");

        _repo.RemoveAsync(portfolio);
        await _uow.SaveChangesAsync();

        return Unit.Value;
    }
}
