---
name: dotnet-infrastructure-http
description: >
  Expert guidance for building typed HTTP clients in .NET 9/10 for external service integration.
  Use this skill whenever the user is creating or working with an Infrastructure.Http project,
  typed HTTP clients, HttpClient, IHttpClientFactory, DelegatingHandler, or external HTTP service
  wrappers. Trigger on phrases like "typed client", "HttpClient", "AddHttpClient", "external service",
  "IHttpClientFactory", "DelegatingHandler", "Infrastructure.Http", or any question about calling
  external HTTP APIs from a .NET project. Interface always lives in Application.Contracts,
  implementation in Infrastructure.Http.
---

# Infrastructure.Http Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

You are an expert in typed HTTP clients for .NET 9/10. The interface for every external service lives in `Application.Contracts`. The typed client implementation lives in `Infrastructure.Http`. Registration happens in `Infrastructure.Http`'s `Module`. The only `DelegatingHandler` used is a logging handler — no auth handlers.

---

## Guiding Principles

1. **Interface in Contracts, implementation in Infrastructure.Http** — Application layer depends on the abstraction, never on HttpClient directly.
2. **Typed clients only** — never inject `IHttpClientFactory` or raw `HttpClient` into application code.
3. **One client per external service** — each third-party API gets its own typed client and options class.
4. **Options pattern for base URLs and config** — never hardcode URLs; bind via `IOptions<T>`.
5. **Logging handler for observability** — attach a single `LoggingDelegatingHandler` to all clients.
6. **Register in Module** — all `AddHttpClient` calls live in `Infrastructure.Http/Module.cs`.

---

## Project Setup

```
src/
  Application/
    ProjectName.Application.Contracts/
      ExternalServices/
        IPaymentGateway.cs
        INotificationService.cs
  Infrastructure/
    ProjectName.Infrastructure.Http/
      Handlers/
        LoggingHandler.cs
      Services/
        PaymentGatewayClient.cs
        NotificationServiceClient.cs
      Options/
        PaymentGatewayOptions.cs
        NotificationServiceOptions.cs
      Module.cs
```

```bash
dotnet new classlib -n ProjectName.Infrastructure.Http -o src/Infrastructure/ProjectName.Infrastructure.Http
dotnet sln add src/Infrastructure/ProjectName.Infrastructure.Http

dotnet add src/Infrastructure/ProjectName.Infrastructure.Http/ reference src/Application/ProjectName.Application.Contracts
dotnet add src/$NAME.Startup/                                   reference src/Infrastructure/ProjectName.Infrastructure.Http

dotnet add src/Infrastructure/ProjectName.Infrastructure.Http/ package Microsoft.Extensions.Http
dotnet add src/Infrastructure/ProjectName.Infrastructure.Http/ package Microsoft.Extensions.Options.ConfigurationExtensions
```

---

## Application.Contracts — Interface

```csharp
// Application.Contracts/ExternalServices/IPaymentGateway.cs
public interface IPaymentGateway
{
    Task<PaymentResult> ChargeAsync(ChargeRequest request, CancellationToken ct = default);
    Task<PaymentResult> RefundAsync(Guid paymentId, CancellationToken ct = default);
}

// Application.Contracts/ExternalServices/Dtos/ChargeRequest.cs
public sealed record ChargeRequest(
    Guid OrderId,
    decimal Amount,
    string Currency);

// Application.Contracts/ExternalServices/Dtos/PaymentResult.cs
public sealed record PaymentResult(
    string TransactionId,
    bool Success,
    string? ErrorMessage);
```

---

## Options

```csharp
// Infrastructure.Http/Options/PaymentGatewayOptions.cs
public sealed class PaymentGatewayOptions
{
    public const string Section = "PaymentGateway";
    public required string BaseUrl { get; init; }
    public required string ApiKey { get; init; }
    public int TimeoutSeconds { get; init; } = 30;
}
```

```json
// appsettings.json
{
  "PaymentGateway": {
    "BaseUrl": "https://api.payment.example.com",
    "ApiKey": "your-api-key",
    "TimeoutSeconds": 30
  }
}
```

---

## Logging DelegatingHandler

```csharp
// Infrastructure.Http/Handlers/LoggingHandler.cs
internal sealed class LoggingHandler(ILogger<LoggingHandler> logger) : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken ct)
    {
        logger.LogInformation("HTTP {Method} {Uri}", request.Method, request.RequestUri);

        Stopwatch sw = Stopwatch.StartNew();
        HttpResponseMessage response = await base.SendAsync(request, ct);
        sw.Stop();

        logger.LogInformation("HTTP {Method} {Uri} responded {StatusCode} in {ElapsedMs}ms",
            request.Method,
            request.RequestUri,
            (int)response.StatusCode,
            sw.ElapsedMilliseconds);

        return response;
    }
}
```

---

## Typed Client Implementation

```csharp
// Infrastructure.Http/Services/PaymentGatewayClient.cs
internal sealed class PaymentGatewayClient(
    HttpClient http,
    IOptions<PaymentGatewayOptions> opts,
    ILogger<PaymentGatewayClient> logger) : IPaymentGateway
{
    public async Task<PaymentResult> ChargeAsync(ChargeRequest request, CancellationToken ct = default)
    {
        HttpResponseMessage response = await http.PostAsJsonAsync("/v1/charges", request, ct);

        if (!response.IsSuccessStatusCode)
        {
            string error = await response.Content.ReadAsStringAsync(ct);
            logger.LogWarning("Charge failed {StatusCode}: {Error}", (int)response.StatusCode, error);
            return new PaymentResult(string.Empty, false, error);
        }

        PaymentGatewayChargeResponse? result = await response.Content.ReadFromJsonAsync<PaymentGatewayChargeResponse>(ct);
        return new PaymentResult(result!.TransactionId, true, null);
    }

    public async Task<PaymentResult> RefundAsync(Guid paymentId, CancellationToken ct = default)
    {
        HttpResponseMessage response = await http.PostAsync($"/v1/charges/{paymentId}/refund", null, ct);

        if (!response.IsSuccessStatusCode)
        {
            string error = await response.Content.ReadAsStringAsync(ct);
            logger.LogWarning("Refund failed {StatusCode}: {Error}", (int)response.StatusCode, error);
            return new PaymentResult(string.Empty, false, error);
        }

        return new PaymentResult(paymentId.ToString(), true, null);
    }

    private sealed record PaymentGatewayChargeResponse(string TransactionId);
}
```

---

## Module

```csharp
// Infrastructure.Http/Module.cs
public static class Module
{
    public static IServiceCollection AddHttpServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddTransient<LoggingHandler>();

        services.AddOptions<PaymentGatewayOptions>()
            .BindConfiguration(PaymentGatewayOptions.Section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddHttpClient<IPaymentGateway, PaymentGatewayClient>(
            (sp, client) =>
            {
                PaymentGatewayOptions opts = sp.GetRequiredService<IOptions<PaymentGatewayOptions>>().Value;
                client.BaseAddress = new Uri(opts.BaseUrl);
                client.Timeout = TimeSpan.FromSeconds(opts.TimeoutSeconds);
            })
            .AddHttpMessageHandler<LoggingHandler>();

        // Add more clients following the same pattern:
        // services.AddHttpClient<INotificationService, NotificationServiceClient>(...).AddHttpMessageHandler<LoggingHandler>();

        return services;
    }
}
```

---

## Startup — Program.cs

```csharp
builder.Services
    .AddDomain()
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddHttpServices(builder.Configuration)
    .AddApi()
    .AddConsumers();
```

---

## Adding a New External Service — Checklist

1. **Application.Contracts** — add interface + request/response DTOs under `ExternalServices/`
2. **Infrastructure.Http/Options** — add `XyzOptions` with `Section`, `BaseUrl`, timeout
3. **Infrastructure.Http/Services** — add typed client implementing the interface; keep internal response models private
4. **appsettings.json** — add config section matching `Options.Section`
5. **Module** — register options + `AddHttpClient<IXyz, XyzClient>(...).AddHttpMessageHandler<LoggingHandler>()`
6. **Startup** — already calls `AddHttpServices`, nothing to change
