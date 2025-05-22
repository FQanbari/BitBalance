using Microsoft.EntityFrameworkCore;

namespace BitBalance.Application.Interfaces;

//public interface IAlertNotifier { }
public interface IUnitOfWork
{
    DbContext Context { get; }
    Task SaveChangesAsync();
}
