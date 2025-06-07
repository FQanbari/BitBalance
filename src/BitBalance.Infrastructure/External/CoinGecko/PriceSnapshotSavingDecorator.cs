using BitBalance.Application.Interfaces;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using System.Reflection;

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

        var price = await _innerProvider.TryGetPriceAsync(symbol);

        var snapshot = new PriceSnapshot(symbol, price, DateTime.UtcNow);

        await _priceSnapshotRepository.AddAsync(snapshot);

        //await _unitOfWork.SaveChangesAsync();

        return price;
    }

    public ICryptoPriceProvider? SetNext(ICryptoPriceProvider next)
    {
        return _innerProvider.SetNext(next);
    }

    public async Task<Money?> TryGetPriceAsync(CoinSymbol symbol)
    {
        var price = await _innerProvider.TryGetPriceAsync(symbol);

        if (price != null)
        {
            var snapshot = new PriceSnapshot(symbol, price, DateTime.UtcNow);
            await _priceSnapshotRepository.AddAsync(snapshot);
            // await _unitOfWork.SaveChangesAsync();
        }

        return price;
    }
}

