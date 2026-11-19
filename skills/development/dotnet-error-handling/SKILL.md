---
name: dotnet-error-handling
description: >
  Error handling patterns for .NET 9/10 using ProblemDetails (RFC 7807).
  Use this skill when the user asks about error handling, exceptions, ProblemDetails,
  validation errors, HTTP status codes, or API error responses.
  Trigger on phrases like "error handling", "exceptions", "ProblemDetails", "validation error",
  "not found", "bad request", "error response", or any question about returning errors from APIs.
---

# Error Handling Skill (.NET 9/10)

> **Existing projects on older frameworks:** check `<TargetFramework>` first and only use APIs, C# features and package versions available for it — see `dotnet-architecture` → *Target Framework & Existing Projects*.

This skill covers structured error handling using ProblemDetails (RFC 7807) with custom domain exceptions.

**PREREQUISITES:** Load these skills first:
- `dotnet-architecture` — for layer structure
- `dotnet-code-style` — for code conventions

---

## NuGet Package

Add to `Directory.Packages.props`:

```xml
<ItemGroup Label="API">
  <PackageVersion Include="Hellang.Middleware.ProblemDetails" Version="6.6.0" />
  <!-- existing packages... -->
</ItemGroup>
```

Add to `Presentation.Api.csproj`:

```xml
<PackageReference Include="Hellang.Middleware.ProblemDetails" />
```

---

## Blocks Exceptions

Custom exceptions live in the **Blocks** shared package (`ProjectName.Blocks.Exceptions`). These are reusable across projects.

### Blocks/Exceptions/DomainException.cs

```csharp
// ProjectName.Blocks/Exceptions/DomainException.cs
using System;
using System.Collections.Generic;

namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Base class for all domain exceptions.
/// </summary>
public abstract class DomainException : Exception
{
    protected DomainException(string title, string detail)
        : base(detail)
    {
        Title = title;
        Detail = detail;
    }

    public string Title { get; }

    public string Detail { get; }

    public virtual IDictionary<string, string[]> Errors { get; } = new Dictionary<string, string[]>();
}
```

### Blocks/Exceptions/ValidationException.cs

```csharp
// ProjectName.Blocks/Exceptions/ValidationException.cs
using System.Collections.Generic;

namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Thrown when validation fails. Maps to HTTP 400 Bad Request.
/// </summary>
public sealed class ValidationException : DomainException
{
    public ValidationException(IDictionary<string, string[]> errors)
        : base("Validation Failed", "One or more validation errors occurred.")
    {
        Errors = errors;
    }

    public ValidationException(string field, string error)
        : base("Validation Failed", "One or more validation errors occurred.")
    {
        Errors = new Dictionary<string, string[]>
        {
            { field, [error] }
        };
    }

    public override IDictionary<string, string[]> Errors { get; }
}
```

### Blocks/Exceptions/NotFoundException.cs

```csharp
// ProjectName.Blocks/Exceptions/NotFoundException.cs
using System.Collections.Generic;

namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Thrown when a requested resource is not found. Maps to HTTP 404 Not Found.
/// </summary>
public sealed class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object id)
        : base("Resource Not Found", $"{entityName} with ID '{id}' was not found.")
    {
        Errors = new Dictionary<string, string[]>
        {
            { entityName, [$"Entity with ID '{id}' was not found."] }
        };
    }

    public NotFoundException(string message)
        : base("Resource Not Found", message)
    {
    }

    public override IDictionary<string, string[]> Errors { get; } = new Dictionary<string, string[]>();
}
```

### Blocks/Exceptions/UnauthorizedException.cs

```csharp
// ProjectName.Blocks/Exceptions/UnauthorizedException.cs
namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Thrown when the user is not authorized. Maps to HTTP 401 Unauthorized.
/// </summary>
public sealed class UnauthorizedException : DomainException
{
    public UnauthorizedException()
        : base("Unauthorized", "You are not authorized to perform this action.")
    {
    }

    public UnauthorizedException(string message)
        : base("Unauthorized", message)
    {
    }
}
```

### Blocks/Exceptions/ForbiddenException.cs

```csharp
// ProjectName.Blocks/Exceptions/ForbiddenException.cs
namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Thrown when the user lacks permission. Maps to HTTP 403 Forbidden.
/// </summary>
public sealed class ForbiddenException : DomainException
{
    public ForbiddenException()
        : base("Forbidden", "You do not have permission to access this resource.")
    {
    }

    public ForbiddenException(string message)
        : base("Forbidden", message)
    {
    }
}
```

### Blocks/Exceptions/ConflictException.cs

```csharp
// ProjectName.Blocks/Exceptions/ConflictException.cs
namespace ProjectName.Blocks.Exceptions;

/// <summary>
/// Thrown when there is a conflict (e.g., duplicate). Maps to HTTP 409 Conflict.
/// </summary>
public sealed class ConflictException : DomainException
{
    public ConflictException(string message)
        : base("Conflict", message)
    {
    }

    public ConflictException(string entityName, string field, object value)
        : base("Conflict", $"{entityName} with {field} '{value}' already exists.")
    {
    }
}
```

---

## Exception to HTTP Status Mapping

| Exception | HTTP Status | Use Case |
|-----------|-------------|----------|
| `ValidationException` | 400 Bad Request | Invalid input, business rule violation |
| `UnauthorizedException` | 401 Unauthorized | Missing or invalid authentication |
| `ForbiddenException` | 403 Forbidden | Authenticated but lacks permission |
| `NotFoundException` | 404 Not Found | Entity not found |
| `ConflictException` | 409 Conflict | Duplicate key, version conflict |

---

## ProblemDetails Configuration

### Presentation.Api/Module.cs

```csharp
// src/Presentation/ProjectName.Presentation.Api/Module.cs
using System;
using Asp.Versioning;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ProjectName.Blocks.Exceptions;

namespace ProjectName.Presentation.Api;

public static class Module
{
    private static readonly Type[] KnownExceptionTypes =
    [
        typeof(ValidationException),
        typeof(NotFoundException),
        typeof(UnauthorizedException),
        typeof(ForbiddenException),
        typeof(ConflictException)
    ];

    public static IServiceCollection AddApi(
        this IServiceCollection services,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        services.AddControllers()
            .AddApplicationPart(typeof(Module).Assembly);

        services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

        services.AddProblemDetails(options => ConfigureProblemDetails(options, environment));

        return services;
    }

    private static void ConfigureProblemDetails(
        ProblemDetailsOptions options,
        IHostEnvironment environment)
    {
        // Only include exception details in development for unexpected exceptions
        options.IncludeExceptionDetails = (_, exception) =>
            environment.IsDevelopment() && !Array.Exists(KnownExceptionTypes, t => t == exception.GetType());

        // Map domain exceptions to ProblemDetails
        options.Map<ValidationException>(exception =>
            new ValidationProblemDetails(exception.Errors)
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status400BadRequest
            });

        options.Map<NotFoundException>(exception =>
            new ValidationProblemDetails(exception.Errors)
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status404NotFound
            });

        options.Map<UnauthorizedException>(exception =>
            new ProblemDetails
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status401Unauthorized
            });

        options.Map<ForbiddenException>(exception =>
            new ProblemDetails
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status403Forbidden
            });

        options.Map<ConflictException>(exception =>
            new ProblemDetails
            {
                Title = exception.Title,
                Detail = exception.Detail,
                Status = StatusCodes.Status409Conflict
            });
    }
}
```

---

## Startup Configuration

### Startup/Program.cs

```csharp
// src/ProjectName.Startup/Program.cs
using Hellang.Middleware.ProblemDetails;
using ProjectName.Application;
using ProjectName.Infrastructure.Db;
using ProjectName.Presentation.Api;
using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Layer registrations
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApi(builder.Configuration, builder.Environment);  // Pass environment

// OpenAPI
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// ProblemDetails middleware MUST be first in the pipeline
app.UseProblemDetails();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
```

**CRITICAL:** `app.UseProblemDetails()` must be called early in the pipeline to catch exceptions from downstream middleware.

---

## Response Examples

### 400 Bad Request (Validation)

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Validation Failed",
  "status": 400,
  "detail": "One or more validation errors occurred.",
  "errors": {
    "Name": ["Name is required."],
    "Email": ["Email must be a valid email address."]
  }
}
```

### 404 Not Found

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Order with ID '123e4567-e89b-12d3-a456-426614174000' was not found.",
  "errors": {
    "Order": ["Entity with ID '123e4567-e89b-12d3-a456-426614174000' was not found."]
  }
}
```

### 409 Conflict

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.8",
  "title": "Conflict",
  "status": 409,
  "detail": "User with Email 'john@example.com' already exists."
}
```

---

## Usage in Handlers

### Throwing Exceptions

```csharp
// In a command/query handler
public async Task<Guid> Handle(CreateOrder.Command request, CancellationToken cancellationToken)
{
    // Check for conflict
    bool exists = await _orderRepository.ExistsByReferenceAsync(request.Reference, cancellationToken);
    if (exists)
    {
        throw new ConflictException("Order", "Reference", request.Reference);
    }

    // ... create order
}

public async Task<OrderDto?> Handle(GetOrderById.Query request, CancellationToken cancellationToken)
{
    Order? order = await _orderRepository.GetByIdAsync(request.Id, cancellationToken);

    if (order is null)
    {
        throw new NotFoundException("Order", request.Id);
    }

    return MapToDto(order);
}
```

---

## Integration with FluentValidation

When using the `ValidationBehaviour` pipeline, FluentValidation errors are automatically converted to `ValidationException`:

```csharp
// src/Application/ProjectName.Application/Behaviours/ValidationBehaviour.cs
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using ProjectName.Blocks.Exceptions;
using ValidationException = ProjectName.Blocks.Exceptions.ValidationException;

namespace ProjectName.Application.Behaviours;

internal sealed class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        ValidationContext<TRequest> context = new(request);

        FluentValidation.Results.ValidationResult[] validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        Dictionary<string, string[]> errors = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .GroupBy(f => f.PropertyName, f => f.ErrorMessage)
            .ToDictionary(g => g.Key, g => g.ToArray());

        if (errors.Count > 0)
        {
            throw new ValidationException(errors);
        }

        return await next();
    }
}
```

---

## Checklist

When adding error handling to a project:

- [ ] Add `Hellang.Middleware.ProblemDetails` to `Directory.Packages.props`
- [ ] Add package reference to `Presentation.Api.csproj`
- [ ] Reference `ProjectName.Blocks` package for exceptions
- [ ] Configure `ProblemDetails` in `Presentation.Api/Module.cs`
- [ ] Add `app.UseProblemDetails()` early in `Program.cs` pipeline
- [ ] Update `ValidationBehaviour` to throw `ProjectName.Blocks.Exceptions.ValidationException`
- [ ] Test each exception type returns correct HTTP status
