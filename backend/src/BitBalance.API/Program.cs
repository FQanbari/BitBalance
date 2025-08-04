using BitBalance.API.Extensions;
using BitBalance.API.Middlewares;
using BitBalance.API.Services;
using BitBalance.Application.Extensions;
using BitBalance.Infrastructure.Extensions;
using BitBalance.Infrastructure.Persistence;
using BitBalance.Infrastructure.SignalR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


builder.ConfigureSerilog();

builder.Services.AddAPIService();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.MapFallbackToFile("index.html");

app.UseSerilogRequestLogging();

app.UseMiddleware<ErrorHandlingMiddleware>();

await app.SeedBitBalanceDatabaseAsync();
app.UseSwaggerDocumentation();
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<PriceHub>("/priceHub");

app.Run();