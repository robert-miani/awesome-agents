# .NET Module Registration

## Description

Expert guidance for wiring up .NET 9/10 layered architecture using Module extension methods for dependency injection. Each layer owns a `Module.cs` with a single `IServiceCollection` extension method. `Program.cs` only calls those extensions.

## When to Use

- Setting up or refactoring DI registration across layers
- Creating a new `Module.cs` for a layer
- Wiring `Program.cs` to call layer modules
- Understanding how `IConfiguration` flows to layers that need it
- Reviewing service registration organization

## Usage

Activate this skill when organizing DI registration. Key rules:

- Each layer has one `Module.cs` with one public extension method (`Add{LayerName}`)
- `Program.cs` lives in Startup and only calls module extensions
- `IConfiguration` is passed as a parameter only to layers that need it
- Options classes live in the same layer as the Module that registers them
- Startup is the only project that references all layers

## Example

```csharp
// Application/Module.cs
public static class Module
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Module).Assembly));
        services.AddValidatorsFromAssembly(typeof(Module).Assembly, includeInternalTypes: true);
        return services;
    }
}

// Infrastructure.Db/Module.cs
public static class Module
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Default")));
        return services;
    }
}

// Startup/Program.cs
builder.Services
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddApi(builder.Configuration);
```

## Requirements

- .NET 9 or 10 (existing projects on older targets: see `dotnet-architecture` → Target Framework & Existing Projects)
- Layered solution following clean architecture
