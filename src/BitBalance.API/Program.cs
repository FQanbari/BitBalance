using BitBalance.Application.Interfaces;
using BitBalance.Application.Services;
using BitBalance.Domain.Interfaces;
using BitBalance.Infrastructure.Data;
using BitBalance.Infrastructure.Repositories;
using BitBalance.Infrastructure.Services;
using BitBalance.Infrastructure.SignalR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<BitBalanceDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IPortfolioRepository, PortfolioRepository>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddHttpClient<IPriceService, CoinGeckoPriceService>();
builder.Services.AddScoped<IPriceService, MockPriceService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger(c =>
{
    c.OpenApiVersion = Microsoft.OpenApi.OpenApiSpecVersion.OpenApi2_0;
});
app.UseSwaggerUI();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();