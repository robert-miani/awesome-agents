# .NET Error Handling

## Description

Structured error handling patterns for .NET 9/10 using ProblemDetails (RFC 7807) with custom domain exceptions. Covers exception hierarchy, ProblemDetails middleware mapping, and consistent API error responses.

## When to Use

- Implementing error handling in a .NET API
- Creating custom domain exceptions
- Mapping exceptions to ProblemDetails HTTP responses
- Setting up `Hellang.Middleware.ProblemDetails`
- Returning consistent error responses (400, 404, 409, 500)
- Designing exception hierarchy for domain errors

## Usage

Activate this skill when working with error handling. It provides:

- Custom exception hierarchy (`DomainException`, `NotFoundException`, `ConflictException`, etc.)
- ProblemDetails middleware configuration
- Exception-to-HTTP-status mapping rules
- Validation error formatting

**Prerequisites:** Load `dotnet-architecture` and `dotnet-code-style` first.

## Example

```csharp
// Domain exception
public class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object id)
        : base($"{entityName} with id '{id}' was not found.")
    {
        StatusCode = StatusCodes.Status404NotFound;
    }
}

// ProblemDetails mapping in Module.cs
services.AddProblemDetails(options =>
{
    options.MapToStatusCode<NotFoundException>(StatusCodes.Status404NotFound);
    options.MapToStatusCode<ConflictException>(StatusCodes.Status409Conflict);
    options.MapToStatusCode<ValidationException>(StatusCodes.Status400BadRequest);
});
```

## Requirements

- .NET 9 or 10
- `Hellang.Middleware.ProblemDetails` NuGet package
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
