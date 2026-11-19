---
name: dotnet-configuration
description: >
  Expert guidance for configuration in .NET 9/10 using the Options pattern, user secrets, and
  environment variables. Use this skill whenever the user is setting up configuration, options
  classes, appsettings.json, user secrets, or environment variable overrides in a layered .NET
  solution. Trigger on phrases like "IOptions", "appsettings", "configuration", "options pattern",
  "user secrets", "environment variables", "IConfiguration", "BindConfiguration", "ValidateOnStart",
  "options class", or any question about how to read or structure config in a .NET project.
  Each layer owns its own options class and registers it in its own Module.
---

# Configuration Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

Configuration flows into each layer via `IConfiguration`, passed as a parameter to each `Module` method. Each layer defines its own options class and registers it internally. No layer reaches into another layer's options.

---

## Guiding Principles

1. **Each layer owns its options** — options class lives in the same project as the `Module` that registers it.
2. **IConfiguration flows in via Module** — `Program.cs` passes `builder.Configuration` down; layers never access it directly.
3. **Always validate on startup** — use `ValidateDataAnnotations()` + `ValidateOnStart()` so misconfiguration fails fast.
4. **Never inject IConfiguration into services** — inject `IOptions<T>` instead; `IConfiguration` stays in `Module`.
5. **User secrets for dev, environment variables for prod** — never commit secrets to appsettings.json.

---

## Configuration Priority (highest to lowest)

```
Environment variables          ← production secrets, CI/CD
User secrets                   ← local dev secrets (never committed)
appsettings.{Environment}.json ← environment-specific non-secret config
appsettings.json               ← defaults and non-secret config
```

---

## Options Class Pattern

Each options class lives in the same layer that uses it:

```csharp
// Infrastructure.Db/Options/DatabaseOptions.cs
public sealed class DatabaseOptions
{
    public const string Section = "Database";

    [Required]
    public required string ConnectionString { get; init; }

    public int MaxRetryCount { get; init; } = 3;
    public int CommandTimeoutSeconds { get; init; } = 30;
}
```

---

## Module Registration

`IConfiguration` is passed into each `Module` method. The module binds and validates its own options internally:

```csharp
// Infrastructure.Db/Module.cs
public static class Module
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<DatabaseOptions>()
            .BindConfiguration(DatabaseOptions.Section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        DatabaseOptions dbOptions = configuration
            .GetRequiredSection(DatabaseOptions.Section)
            .Get<DatabaseOptions>()!;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                dbOptions.ConnectionString,
                npgsql => npgsql.EnableRetryOnFailure(dbOptions.MaxRetryCount))
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
```

```csharp
// Application/Module.cs — no external config needed
public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        Assembly assembly = typeof(Module).Assembly;
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        return services;
    }
}
```

```csharp
// Infrastructure.Http/Module.cs
public static class Module
{
    public static IServiceCollection AddHttpServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
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

        return services;
    }
}
```

```csharp
// Presentation.Api/Options/JwtOptions.cs
public sealed class JwtOptions
{
    public const string Section = "Jwt";

    [Required]
    public required string Authority { get; init; }

    [Required]
    public required string Audience { get; init; }
}

// Presentation.Api/Module.cs
public static class Module
{
    public static IServiceCollection AddApi(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddOptions<JwtOptions>()
            .BindConfiguration(JwtOptions.Section)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        JwtOptions jwtOptions = configuration
            .GetRequiredSection(JwtOptions.Section)
            .Get<JwtOptions>()!;

        services.AddControllers()
            .AddApplicationPart(typeof(Module).Assembly);

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.Authority = jwtOptions.Authority;
                options.Audience  = jwtOptions.Audience;
            });

        services.AddAuthorization();
        services.AddOpenApi();
        services.AddProblemDetails();

        return services;
    }
}
```

---

## Startup — Program.cs

```csharp
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddHttpServices(builder.Configuration)
    .AddApi(builder.Configuration)
    .AddConsumers(builder.Configuration);

WebApplication app = builder.Build();

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.Run();
```

---

## Injecting Options into Services

```csharp
// IOptions<T> — value fixed for app lifetime, use for most cases
internal sealed class PaymentGatewayClient(
    HttpClient http,
    IOptions<PaymentGatewayOptions> opts) : IPaymentGateway
{
    private readonly PaymentGatewayOptions _opts = opts.Value;
}

// IOptionsSnapshot<T> — re-evaluated per request, supports config reload (scoped only)
internal sealed class FeatureFlagService(IOptionsSnapshot<FeatureFlagOptions> opts)
{
    public bool IsEnabled(string flag) =>
        opts.Value.EnabledFlags.Contains(flag);
}

// IOptionsMonitor<T> — for singletons that need to react to live config changes
internal sealed class CacheService(IOptionsMonitor<CacheOptions> monitor)
{
    public TimeSpan Ttl => TimeSpan.FromSeconds(monitor.CurrentValue.TtlSeconds);
}
```

---

## appsettings.json Structure

```json
{
  "Database": {
    "ConnectionString": "PLACEHOLDER",
    "MaxRetryCount": 3,
    "CommandTimeoutSeconds": 30
  },
  "PaymentGateway": {
    "BaseUrl": "https://api.payment.example.com",
    "ApiKey": "PLACEHOLDER",
    "TimeoutSeconds": 30
  },
  "Jwt": {
    "Authority": "https://auth.example.com",
    "Audience": "api"
  }
}
```

Never put real secrets in `appsettings.json`. Use `PLACEHOLDER` to document the shape.

---

## User Secrets (dev)

```bash
# Initialise — run once per project
dotnet user-secrets init --project src/ProjectName.Startup

# Set secrets — stored outside the repo, override appsettings.json locally
dotnet user-secrets set "Database:ConnectionString" "Host=localhost;Database=mydb;Username=postgres;Password=realpassword" --project src/ProjectName.Startup
dotnet user-secrets set "PaymentGateway:ApiKey" "sk_test_abc123" --project src/ProjectName.Startup
dotnet user-secrets set "Jwt:Authority" "https://dev-auth.example.com" --project src/ProjectName.Startup
```

Secrets are stored in `~/.microsoft/usersecrets/{id}/secrets.json` — never inside the repo.

---

## Environment Variables (prod)

Use double underscore `__` as the section separator — overrides everything:

```bash
Database__ConnectionString="Host=prod-db;Database=mydb;Username=app;Password=secret"
PaymentGateway__ApiKey="sk_live_xyz"
Jwt__Authority="https://auth.example.com"
```

```yaml
# docker-compose.yml
environment:
  - Database__ConnectionString=Host=db;Database=mydb;Username=postgres;Password=secret
  - PaymentGateway__ApiKey=sk_live_xyz

# Kubernetes secret
env:
  - name: Database__ConnectionString
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: db-connection-string
```

---

## Adding a New Options Class — Checklist

1. Create `XyzOptions.cs` in the layer that owns it with `public const string Section`
2. Add `[Required]` on all required properties
3. Add the section to `appsettings.json` with `PLACEHOLDER` values for secrets
4. Register in the layer's `Module` with `.BindConfiguration(...).ValidateDataAnnotations().ValidateOnStart()`
5. Set real values via user secrets (dev) or environment variables (prod)
6. Inject `IOptions<XyzOptions>` into services — never `IConfiguration`
