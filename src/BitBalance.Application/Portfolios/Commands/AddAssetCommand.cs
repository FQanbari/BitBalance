using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using FluentValidation;
using MediatR;

namespace BitBalance.Application.Portfolios.Commands;

public record AddAssetCommand(
    Guid PortfolioId,
    string CoinSymbol,
    decimal Quantity,
    decimal PurchasePrice,
    string Currency,
    DateTime PurchaseDate
) : IRequest<Unit>;
public class AddAssetCommandValidator : AbstractValidator<AddAssetCommand>
{
    public AddAssetCommandValidator()
    {
        RuleFor(x => x.CoinSymbol).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Quantity).GreaterThan(0);
        RuleFor(x => x.PurchasePrice).GreaterThan(0);
        RuleFor(x => x.Currency).NotEmpty().Length(3, 5);
        RuleFor(x => x.PurchaseDate).LessThanOrEqualTo(DateTime.UtcNow);
    }
}

public class AddAssetCommandHandler : IRequestHandler<AddAssetCommand, Unit>
{
    private readonly IPortfolioRepository _repo;
    private readonly IUnitOfWork _uow;

    public AddAssetCommandHandler(IPortfolioRepository repo, IUnitOfWork uow)
    {
        _repo = repo;
        _uow = uow;
    }

    public async Task<Unit> Handle(AddAssetCommand request, CancellationToken cancellationToken)
    {
        var portfolio = await _repo.GetByIdAsync(request.PortfolioId);
        if (portfolio == null)
            throw new ApplicationException("Portfolio not found.");

        var asset = new Asset(
            CoinSymbol.From(request.CoinSymbol),
            new Money(request.Quantity, request.Currency),
            new Money(request.PurchasePrice, request.Currency),
            request.PurchaseDate
        );

        portfolio.AddAsset(asset);
        await _uow.SaveChangesAsync();

        return Unit.Value;
    }
}