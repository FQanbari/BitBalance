
using BitBalance.Domain.Entities;
using BitBalance.Domain.ValueObjects;

namespace BitBalance.Application.Interfaces;

public interface IAlertNotifier
{
    Task NotifyAsync(Alert alert);
}
