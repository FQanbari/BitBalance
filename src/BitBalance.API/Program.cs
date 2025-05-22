using BitBalance.API.Extensions;
using BitBalance.API.Middlewares;
using BitBalance.Application.Extensions;
using BitBalance.Infrastructure.Extensions;
using BitBalance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BitBalanceDbContext>(options =>
           options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAPIService();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration); 

builder.Services.AddControllers();


var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

await app.UseInfrastructure();
app.UseAPIService();

app.UseHttpsRedirection();

app.UseAuthentication();
//app.UseAuthorization();

app.MapControllers();

app.Run();