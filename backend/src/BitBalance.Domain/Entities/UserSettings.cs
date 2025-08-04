using BitBalance.Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BitBalance.Domain.Entities;

public class UserSettings : BaseEntity<Guid>
{
    public Guid UserId { get; private set; }
    public string DefaultCurrency { get; private set; }
    public string NotificationMethod { get; private set; }
    public string Theme { get; private set; }
    public string Language { get; private set; }
    public string? NotificationEmail { get; private set; }
    public string? TelegramHandle { get; private set; }


    protected UserSettings() { }

    public UserSettings(Guid userId, string defaultCurrency = "USD", string notificationMethod = "email", string theme = "light", string language = "en", string? email = null, string? telegram = null)
    {
        UserId = userId;
        DefaultCurrency = defaultCurrency;
        NotificationMethod = notificationMethod;
        Theme = theme;
        Language = language;
        NotificationEmail = email;
        TelegramHandle = telegram;
    }

    public void Update(string currency, string notification, string theme, string language, string? email = null, string? telegram = null)
    {
        DefaultCurrency = currency;
        NotificationMethod = notification;
        Theme = theme;
        Language = language;
        NotificationEmail = email;
        TelegramHandle = telegram;
    }

}
public class UserSettingsConfiguration : IEntityTypeConfiguration<UserSettings>
{
    public void Configure(EntityTypeBuilder<UserSettings> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.DefaultCurrency).IsRequired().HasMaxLength(5);
        builder.Property(s => s.NotificationMethod).IsRequired().HasMaxLength(20);
        builder.Property(s => s.Theme).HasMaxLength(10);
        builder.Property(s => s.Language).HasMaxLength(5);
        builder.HasIndex(s => s.UserId).IsUnique();
        builder.Property(s => s.NotificationEmail).HasMaxLength(100);
        builder.Property(s => s.TelegramHandle).HasMaxLength(50);

    }
}