---
name: dotnet-module-registration
description: >
  Expert guidance for wiring up .NET 8/9 layered architecture using Module extension methods
  for dependency injection. Use this skill whenever the user is setting up or refactoring DI
  registration across layers — Application, Infrastructure, Domain, or API/Presentation. Trigger
  on phrases like "Module", "AddApplication", "AddInfrastructure", "AddDomain", "layer registration",
  "DI setup", "service registration", "IServiceCollection extension", "clean architecture wiring",
  or any question about how to organise and call registrations across project layers.
---

# Module Registration Skill (.NET 8/9)

Each layer owns its own `Module.cs` with a single `IServiceCollection` extension method. `Program.cs` lives in `ProjectName.Startup` and only calls those extensions — it never reaches into another layer's internals. `IConfiguration` is passed as a parameter to modules that need it; layers never access it directly.

---

## Guiding Principles

1. **Each layer registers its own services** — no layer's internals leak into `Program.cs`.
2. **Static class named `Module`** — one per project, one public extension method named `Add{LayerName}`.
3. **Pass IConfiguration only where needed** — layers that need config take `IConfiguration` as a parameter; layers that don't (e.g. Application) take none.
4. **Layer dependency direction** — Startup → Presentation → Application → Infrastructure → Domain.
5. **Startup is the only project that references everything** — it exists solely to wire things together.
6. **Options class lives in the same layer as the Module that registers it** — never share options across layers.

---

## Layer Structure

```
src/
  ProjectName.Startup                     → Program.cs, calls all modules
  Presentation/
    ProjectName.Presentation.Api          → AddApi(IConfiguration)
    ProjectName.Presentation.Consumers    → AddConsumers(IConfiguration)
  Application/
    ProjectName.Application               → AddApplication()
  Infrastructure/
    ProjectName.Infrastructure.Db         → AddInfrastructure(IConfiguration)
    ProjectName.Infrastructure.Http       → AddHttpServices(IConfiguration)
  Domain/
    ProjectName.Domain                    → AddDomain()  (optional)
```

---

## Domain Layer

Domain typically has no DI registrations. Only add a `Module` if you have domain services to register:

```csharp
// Domain/Module.cs
public static class Module
{
    public static IServiceCollection AddDomain(this IServiceCollection services)
    {
        services.AddSingleton<IOrderNumberGenerator, SequentialOrderNumberGenerator>();
        return services;
    }
}
```

---

## Application Layer

No `IConfiguration` needed — registers MediatR, validators, and pipeline behaviours only:

```csharp
// Application/Module.cs
public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(Module).Assembly;

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly, includeInternalTypes: true);

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

        return services;
    }
}
```

---

## Infrastructure.Db Layer

Takes `IConfiguration` to bind database options. Options class lives here:

```csharp
// Infrastructure.Db/Options/DatabaseOptions.cs
public sealed class DatabaseOptions
{
    public const string Section = "Database";
    [Required] public required string ConnectionString { get; init; }
    public int MaxRetryCount { get; init; } = 3;
}

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

        var dbOptions = configuration
            .GetRequiredSection(DatabaseOptions.Section)
            .Get<DatabaseOptions>()!;

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                dbOptions.ConnectionString,
                npgsql => npgsql.EnableRetryOnFailure(dbOptions.MaxRetryCount))
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
```

---

## Infrastructure.Http Layer

Takes `IConfiguration` to bind external service options. One typed client per external service:

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
                var opts = sp.GetRequiredService<IOptions<PaymentGatewayOptions>>().Value;
                client.BaseAddress = new Uri(opts.BaseUrl);
                client.Timeout = TimeSpan.FromSeconds(opts.TimeoutSeconds);
            })
            .AddHttpMessageHandler<LoggingHandler>();

        return services;
    }
}
```

---

## Presentation.Api Layer

Takes `IConfiguration` for JWT options. Uses `AddApplicationPart` so controllers in this classlib are discovered by the Startup host:

```csharp
// Presentation.Api/Options/JwtOptions.cs
public sealed class JwtOptions
{
    public const string Section = "Jwt";
    [Required] public required string Authority { get; init; }
    [Required] public required string Audience { get; init; }
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

        var jwtOptions = configuration
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

## Presentation.Consumers Layer

```csharp
// Presentation.Consumers/Module.cs
public static class Module
{
    public static IServiceCollection AddConsumers(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // register message bus here e.g. MassTransit, Azure Service Bus
        return services;
    }
}
```

---

## Startup — Program.cs

```csharp
// src/ProjectName.Startup/Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddDomain()
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddHttpServices(builder.Configuration)
    .AddApi(builder.Configuration)
    .AddConsumers(builder.Configuration);

var app = builder.Build();

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.MapControllers();
app.Run();
```

---

## Adding a New Service — Checklist

| Service type | Layer | Registration |
|---|---|---|
| MediatR handler | Application | Auto-discovered via `RegisterServicesFromAssembly` |
| FluentValidation validator | Application | Auto-discovered via `AddValidatorsFromAssembly` |
| Repository | Infrastructure.Db | `AddScoped<IRepo, Repo>()` in Infrastructure.Db `Module` |
| EF DbContext | Infrastructure.Db | `AddDbContext<T>()` in Infrastructure.Db `Module` |
| Typed HTTP client | Infrastructure.Http | `AddHttpClient<IXyz, XyzClient>()` in Infrastructure.Http `Module` |
| Domain service | Domain | `AddSingleton` / `AddScoped` in Domain `Module` |
| Auth / middleware | Presentation.Api | `AddAuthentication` etc. in Presentation.Api `Module` |
| Message consumer | Presentation.Consumers | Register in Presentation.Consumers `Module` |
