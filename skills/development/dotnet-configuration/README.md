# .NET Configuration

## Description

Configuration guidance for .NET 8/9 using the Options pattern, user secrets, and environment variables. Each layer owns its own options class and registers it in its own Module. Covers `IOptions<T>`, `ValidateOnStart`, configuration priority, and secrets management.

## When to Use

- Setting up configuration with the Options pattern
- Creating options classes for a layer
- Configuring `appsettings.json` structure
- Working with user secrets for local development
- Setting up environment variable overrides for production
- Wiring `IOptions<T>` with `ValidateDataAnnotations` and `ValidateOnStart`

## Usage

Activate this skill when working with .NET configuration. It provides:

- Options class pattern (sealed class with `Section` constant and data annotations)
- Module registration pattern (`BindConfiguration` + `ValidateDataAnnotations` + `ValidateOnStart`)
- Configuration priority (env vars > user secrets > appsettings.{Env}.json > appsettings.json)
- Rules: never inject `IConfiguration` into services, each layer owns its options

## Example

```csharp
// Infrastructure.Db/Options/DatabaseOptions.cs
public sealed class DatabaseOptions
{
    public const string Section = "Database";

    [Required]
    public string ConnectionString { get; init; } = string.Empty;
}

// Infrastructure.Db/Module.cs
services.AddOptions<DatabaseOptions>()
    .BindConfiguration(DatabaseOptions.Section)
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

## Requirements

- .NET 8 or 9
- `Microsoft.Extensions.Options.DataAnnotations` package
