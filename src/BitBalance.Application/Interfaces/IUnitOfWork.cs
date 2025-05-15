namespace BitBalance.Application.Interfaces;

//public interface IAlertNotifier { }
public interface IUnitOfWork
{
    Task SaveChangesAsync();
}
