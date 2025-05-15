using BitBalance.Application.Interfaces;
using BitBalance.Application.Services;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.Data;
using BitBalance.Infrastructure.Repositories;
using BitBalance.Infrastructure.Services;
using BitBalance.Infrastructure.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<BitBalanceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BitBalance API", Version = "v1" });
});

// Repository and Services
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();

builder.Services.Configure<CoinGeckoOptions>(
    builder.Configuration.GetSection("CryptoProviders:CoinGecko"));

builder.Services.AddHttpClient<ICryptoPriceProvider, CoinGeckoPriceProvider>();


// Choose one of the price services:
builder.Services.AddHttpClient<ICryptoPriceProvider, CoinGeckoPriceService>();
// OR
// builder.Services.AddScoped<ICryptoPriceProvider, MockPriceService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BitBalance API v1"));
}

app.UseRouting();
app.UseAuthorization(); // If you use authentication

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();