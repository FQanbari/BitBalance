using BitBalance.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace BitBalance.Domain.ValueObjects;
public class Money : ValueObject
{
    public decimal Amount { get; private set; }
    public string Currency { get; private set; }

    protected Money() { }
    public Money(decimal amount, string currency)
    {
        if (amount < 0)
            throw new DomainException("Amount cannot be negative.");

        if (string.IsNullOrWhiteSpace(currency))
            throw new DomainException("Currency is required.");

        if (!Regex.IsMatch(currency, "^[A-Z]{2,5}$"))
            throw new DomainException("Invalid currency format.");

        Amount = decimal.Round(amount, 3);
        Currency = currency.ToUpper();
    }
    public Money WithNewAmount(decimal newAmount)
    {
        return new Money(newAmount, this.Currency);
    }
    public Money WithNewCurrency(string newCurrency)
    {
        return new Money(this.Amount, newCurrency);
    }
    public Money With(decimal? newAmount = null, string? newCurrency = null)
    {
        return new Money(
            newAmount ?? this.Amount,
            newCurrency ?? this.Currency
        );
    }

    public static Money operator +(Money a, Money b)
    {
        EnsureSameCurrency(a, b);
        return new Money(a.Amount + b.Amount, a.Currency);
    }
    public static Money operator -(Money a, Money b)
    {
        EnsureSameCurrency(a, b);
        return new Money(a.Amount - b.Amount, a.Currency);
    }

    public static Money operator *(Money a, Money b)
    {
        EnsureSameCurrency(a, b);
        return new Money(a.Amount * b.Amount, a.Currency);
    }

    public static Money operator *(Money a, decimal multiplier)
    {
        return new Money(a.Amount * multiplier, a.Currency);
    }

    public static Money Zero(string currency = "USD") => new(0m, currency);

    private static void EnsureSameCurrency(Money a, Money b)
    {
        if (a.Currency != b.Currency)
            throw new DomainException("Cannot operate on different currencies.");
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }

    public override string ToString() => $"{Amount:0.00} {Currency}";
}
