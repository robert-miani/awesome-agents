# .NET Presentation REST

## Description

REST API presentation layer patterns for .NET 9/10. Covers controllers, OpenAPI/Scalar documentation setup, middleware pipeline, Module registration, routing conventions, and API versioning in the Presentation.Api project.

## When to Use

- Working on controllers or API endpoints
- Setting up OpenAPI/Scalar API documentation
- Configuring middleware pipeline ordering
- Registering the Presentation.Api module (DI + middleware)
- Defining routing conventions or `ProducesResponseType` attributes
- Adding authentication configuration to Scalar

## Usage

Activate this skill when working with the Presentation.Api layer. It provides:

- Project folder structure (`Controllers/`, `Extensions/`, `Routing/`, `Module.cs`)
- Controller conventions (attribute routing, versioning, response types)
- OpenAPI/Scalar registration and configuration
- Middleware pipeline ordering
- Module pattern for DI registration (`AddApi`) and middleware (`UseApi`)

**Prerequisites:** Load `dotnet-architecture` and `dotnet-code-style` first.

## Example

```csharp
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public sealed class OrdersController : ApiController
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OrderDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetById(Guid id)
    {
        OrderDto result = await Sender.Send(new GetOrderById.Query(id));
        return Ok(result);
    }
}
```

## Requirements

- .NET 9 or 10
- `Asp.Versioning.Mvc` NuGet package
- `Scalar.AspNetCore` NuGet package (for API docs)
- `dotnet-architecture` skill (prerequisite)
- `dotnet-code-style` skill (prerequisite)
