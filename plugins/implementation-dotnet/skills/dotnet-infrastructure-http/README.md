# .NET Infrastructure.Http

## Description

Expert guidance for building typed HTTP clients in .NET 9/10 for external service integration. Interface lives in Application.Contracts, implementation in Infrastructure.Http. Covers typed clients, `IHttpClientFactory`, options pattern for base URLs, and logging handlers.

## When to Use

- Creating a typed HTTP client for an external API
- Setting up the Infrastructure.Http project structure
- Configuring `AddHttpClient` with options and resilience
- Adding a logging `DelegatingHandler`
- Wrapping any third-party HTTP API with a typed client

## Usage

Activate this skill when integrating external HTTP services. Key principles:

- Interface in `Application.Contracts`, implementation in `Infrastructure.Http`
- One typed client per external service
- Options pattern for base URLs and config (never hardcode)
- Single `LoggingDelegatingHandler` for observability
- All `AddHttpClient` registrations in `Infrastructure.Http/Module.cs`

## Example

```csharp
// Application.Contracts/ExternalServices/IPaymentGateway.cs
public interface IPaymentGateway
{
    Task<PaymentResult> ChargeAsync(ChargeRequest request, CancellationToken ct);
}

// Infrastructure.Http/Services/PaymentGatewayClient.cs
internal sealed class PaymentGatewayClient : IPaymentGateway
{
    private readonly HttpClient _httpClient;

    public PaymentGatewayClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PaymentResult> ChargeAsync(ChargeRequest request, CancellationToken ct)
    {
        HttpResponseMessage response = await _httpClient.PostAsJsonAsync("/charges", request, ct);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<PaymentResult>(ct);
    }
}

// Infrastructure.Http/Module.cs
services.AddHttpClient<IPaymentGateway, PaymentGatewayClient>((sp, client) =>
{
    PaymentGatewayOptions options = sp.GetRequiredService<IOptions<PaymentGatewayOptions>>().Value;
    client.BaseAddress = new Uri(options.BaseUrl);
});
```

## Requirements

- .NET 9 or 10 (existing projects on older targets: see `dotnet-architecture` → Target Framework & Existing Projects)
- `Microsoft.Extensions.Http` (included in ASP.NET Core)
- Options class for each external service's configuration
