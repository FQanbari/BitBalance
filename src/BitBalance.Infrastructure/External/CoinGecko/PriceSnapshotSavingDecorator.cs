using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Infrastructure.External.CoinGecko;

public class PriceSnapshotSavingDecorator : ICryptoPriceProvider
{
    private readonly ICryptoPriceProvider _innerProvider;
    private readonly IPriceSnapshotRepository _priceSnapshotRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PriceSnapshotSavingDecorator(
        ICryptoPriceProvider innerProvider,
        IPriceSnapshotRepository priceSnapshotRepository,
        IUnitOfWork unitOfWork)
    {
        _innerProvider = innerProvider ?? throw new ArgumentNullException(nameof(innerProvider));
        _priceSnapshotRepository = priceSnapshotRepository ?? throw new ArgumentNullException(nameof(priceSnapshotRepository));
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
    }

    public async Task<Money> GetPriceAsync(CoinSymbol symbol)
    {
        if (symbol == null) throw new ArgumentNullException(nameof(symbol));

        var price = await _innerProvider.GetPriceAsync(symbol);

        var snapshot = new PriceSnapshot(symbol, price, DateTime.UtcNow);

        await _priceSnapshotRepository.AddAsync(snapshot);

        //await _unitOfWork.SaveChangesAsync();

        return price;
    }
}
