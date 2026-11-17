# .NET API Versioning

## Description

API versioning patterns for .NET 9/10 using `Asp.Versioning.Mvc` with URL segment versioning (`/api/v1/...`). Covers controller organization by version, version registration, and multi-version support.

## When to Use

- Setting up API versioning in a .NET project
- Organizing controllers by version (v1, v2, etc.)
- Adding a new API version to an existing endpoint
- Configuring `Asp.Versioning.Mvc` URL segment versioning
- Any question about multi-version API support

## Usage

Activate this skill when working with API versioning. It provides:

- Folder structure for versioned controllers (`Controllers/Feature/v1/`)
- Version attribute conventions (`[ApiVersion("1.0")]`)
- Route template setup (`api/v{version:apiVersion}/[controller]`)
- Module registration for versioning services

**Prerequisites:** Load `dotnet-architecture` and `dotnet-code-style` first.

## Example

```
Controllers/
├── Products/
│   ├── v1/
│   │   └── ProductsController.cs
│   └── v2/
│       └── ProductsController.cs
```

```csharp
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class ProductsController : ApiController
{
    [HttpGet]
    public async Task<ActionResult<List<ProductV2Dto>>> GetAll() { ... }
}
```

## Requirements

- .NET 9 or 10
- `Asp.Versioning.Mvc` NuGet package
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
