using BitBalance.Application.Interfaces;
using BitBalance.Application.Portfolios.Commands;
using BitBalance.Domain.Entities;
using BitBalance.Domain.Interfaces;
using BitBalance.Domain.ValueObjects;
using Moq;

namespace BitBalance.Application.Tests.Handlers;
public class AddAssetCommandHandlerTests
{
    [Fact]
    public async Task Handle_AddAssetCommand_CallsRepositorySave()
    {
        var mockRepo = new Mock<IPortfolioRepository>();
        var mockUOW = new Mock<IUnitOfWork>();
        var handler = new AddAssetCommandHandler(mockRepo.Object, mockUOW.Object);
        var userId = Guid.NewGuid();
        var portfolio = new Portfolio(userId, "Test");       
        var command = new AddAssetCommand(portfolio.Id, "BTC",100, 105000,"USD", DateTime.UtcNow);

        await handler.Handle(command, default);

        mockRepo.Verify(x => x.AddAsync(portfolio), Times.Once);
    }
}
