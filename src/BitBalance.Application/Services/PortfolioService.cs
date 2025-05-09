using BitBalance.Application.Commands;
using BitBalance.Application.DTOs;
using BitBalance.Application.Interfaces;
using BitBalance.Application.Queries;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Exceptions;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using System.Text.Json.Serialization;

namespace BitBalance.Application.Services;

public class PortfolioService : IPortfolioService
{
    private readonly IPortfolioRepository _portfolioRepository;
    private readonly IAssetRepository _assetRepository;
    private readonly IPriceService _priceService;

    public PortfolioService(IPortfolioRepository portfolioRepository, IAssetRepository assetRepository, IPriceService priceService)
    {
        _portfolioRepository = portfolioRepository;
        _assetRepository = assetRepository;
        _priceService = priceService;
    }

    public async Task AddAssetAsync(CreateAssetCommand command)
    {
        var portfolio = await _portfolioRepository.GetByIdAsync(command.PortfolioId);
        if (portfolio == null)
            throw new DomainException("Portfolio not found.");

        var quantity = new Money(command.Asset.Quantity, command.Asset.Currency);
        var price = new Money(command.Asset.PurchasePrice, command.Asset.Currency);
        var asset = new Asset(command.Asset.Symbol, quantity, price, command.Asset.PurchaseDate);

        portfolio.AddAsset(asset);
        await _assetRepository.AddAsync(asset);
        await _portfolioRepository.UpdateAsync(portfolio);
    }

    public async Task<PortfolioValueDto> GetPortfolioValueAsync(GetPortfolioValueQuery query)
    {
        var portfolio = await _portfolioRepository.GetByIdAsync(query.PortfolioId);
        if (portfolio == null)
            throw new DomainException("Portfolio not found.");

        decimal total = 0m;
        foreach (var asset in portfolio.Assets)
        {
            var currentPrice = await _priceService.GetCurrentPriceAsync(asset.Symbol);
            total += currentPrice * asset.Quantity.Amount;
        }

        return new PortfolioValueDto
        {
            TotalValue = Math.Round(total, 2),
            Currency = "USD"
        };
    }
}
