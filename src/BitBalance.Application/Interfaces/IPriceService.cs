namespace BitBalance.Application.Interfaces;

public interface IPriceService
{
    Task<decimal> GetCurrentPriceAsync(string symbol);
}
