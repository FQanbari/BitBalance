
using Xunit;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using BitBalance.API;
using Microsoft.VisualStudio.TestPlatform.TestHost;

namespace BitBalance.API.IntegrationTests.Portfolios;
public class PortfolioApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public PortfolioApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Post_AddPortfolio_ReturnsCreated()
    {
        var request = new { name = "Test Portfolio" };
        var response = await _client.PostAsJsonAsync("/api/portfolio", request);

        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<dynamic>();
        Assert.Equal("Test Portfolio", (string)result.name);
    }
}
