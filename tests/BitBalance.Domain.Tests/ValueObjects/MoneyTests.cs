using BitBalance.Domain.ValueObjects;


namespace BitBalance.Domain.Tests.ValueObjects;
public class MoneyTests
{
    [Fact]
    public void Add_TwoMoneyInstancesWithSameCurrency_ReturnsSum()
    {
        var m1 = new Money(100, "USD");
        var m2 = new Money(200, "USD");

        var result = m1 + m2;

        Assert.Equal(new Money(300, "USD"), result);
    }
}
