# Hexagonal Architecture (Ports & Adapters)

## Description

Language-agnostic guidelines for Clean Architecture and hexagonal ports/adapters. Covers the dependency rule, port/adapter definitions, layer boundaries, use case isolation, and when to apply (or skip) hexagonal architecture.

## When to Use

- Designing system architecture for long-lived applications
- Understanding hexagonal architecture concepts
- Evaluating whether ports/adapters pattern fits a project
- Ensuring the dependency rule is followed (dependencies point inward only)
- Reviewing code for architecture boundary violations
- Separating infrastructure concerns from domain logic

## Usage

Activate this skill when designing or reviewing system architecture. It provides:

- The dependency rule and how to enforce it
- Port and adapter definitions with examples
- Layer responsibilities (Domain, Application, Infrastructure)
- Decision criteria for when to use vs. skip hexagonal architecture
- Common violation patterns and how to fix them

## Example

**Dependency Rule:**

```
Infrastructure → Application → Domain
   (adapters)     (use cases)    (core)
```

**Validation test:** "Can you run your domain logic from tests with no infrastructure?" If yes, your boundaries are correct.

**Port (interface in Application):**

```csharp
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    void Add(Order order);
}
```

**Adapter (implementation in Infrastructure):**

```csharp
internal sealed class OrderRepository : IOrderRepository { ... }
```

## Requirements

- No external tools required
- Applicable to any language or framework
