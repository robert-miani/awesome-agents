# .NET Unit Testing

## Description

Writes fast, isolated unit tests for .NET 9/10 layered solutions: domain entities and value objects, MediatR handlers or application services, FluentValidation validators, and pure logic. New test projects use **xUnit v3 + NSubstitute + Shouldly**; existing solutions keep their own stack (NUnit, MSTest, Moq, FluentAssertions, xUnit v2). Database, HTTP pipeline and DI wiring are left to `dotnet-integration-testing`.

## When to Use

- Adding unit tests for a new or changed handler, service, validator, or entity
- Setting up a `tests/ProjectName.*.UnitTests` project
- Substituting repositories / unit of work / external clients
- Reviewing existing tests for isolation, naming, and over-mocking

## Usage

Load alongside `dotnet-architecture` and `dotnet-code-style`. The skill:

1. Detects the solution's existing test framework, mocking and assertion libraries (and never adds a second one)
2. Picks what to unit-test vs. what belongs in integration tests
3. Sets up the test project, `InternalsVisibleTo`, and central package versions
4. Generates tests from templates for entities, MediatR handlers, application services, and validators

## Example

```csharp
[Fact]
public async Task Handle_ValidCommand_AddsOrderAndSaves()
{
    // Arrange
    CreateOrder.Command command = new(Guid.NewGuid(), 250m);
    CancellationToken ct = TestContext.Current.CancellationToken;

    // Act
    Guid id = await _handler.Handle(command, ct);

    // Assert
    id.ShouldNotBe(Guid.Empty);
    await _unitOfWork.Received(1).SaveChangesAsync(ct);
}
```

## Requirements

- .NET 9 or 10 SDK (older targets: follow the existing test stack — see the skill's Gotchas)
- New projects: `xunit.v3`, `xunit.runner.visualstudio`, `Microsoft.NET.Test.Sdk`, `NSubstitute`, `NSubstitute.Analyzers.CSharp`, `Shouldly`
- FluentAssertions 8+ is commercially licensed — the skill keeps existing 7.x references and never upgrades them silently
