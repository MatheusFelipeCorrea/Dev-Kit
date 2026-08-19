---
name: testing-strategy
description: >-
  Generates a testing strategy and plan for a feature, module, or the entire project.
  Defines what to test, which type of test to use (unit, integration, e2e), coverage
  targets, and testing patterns. Use when the user asks for a test plan, testing strategy,
  or "how should I test this?".
---

# Testing Strategy

Generates a comprehensive testing plan aligned with the project's stack and conventions.

## Step 1 — Context

Read:
- `.github/project.yml` — stack, testing frameworks, coverage targets
- `.github/memory/DOMAIN.md` — business rules that need coverage
- The source code of the feature/module being discussed

## Step 2 — Classify the scope

Ask or determine:
- **Unit scope** — pure functions, business logic, utilities, transformers
- **Integration scope** — API routes, database queries, service interactions
- **E2E scope** — critical user flows, happy paths, regression scenarios
- **Contract scope** — API contracts between services

## Step 3 — Generate the strategy

For the given scope, produce a structured test plan:

```markdown
## Testing Strategy: {feature/module name}

### Coverage Target
- Unit: {X}% (business logic)
- Integration: {Y}% (API/service layer)
- E2E: {Z}% (critical paths only)

### Unit Tests
| What to test | Why | Pattern |
|--------------|-----|---------|
| {function/class} | {business rule it protects} | {arrange-act-assert / given-when-then} |

### Integration Tests
| Flow | Dependencies | Mock strategy |
|------|--------------|---------------|
| {API endpoint / service call} | {DB, external API, queue} | {real DB / in-memory / mock} |

### E2E Tests
| Scenario | Steps | Expected outcome |
|----------|-------|-----------------|
| {user flow} | {1. do X, 2. do Y} | {final state} |

### Edge Cases & Error Paths
- {list of boundary conditions, error scenarios, race conditions}

### Testing Patterns Recommended
- {TDD / BDD / Property-based / Snapshot / Contract}

### Tools
- {framework}: {jest, vitest, pytest, etc.} (from project.yml)
- {runner}: {how to run}
- {coverage}: {how to measure}
```

## Step 4 — Prioritization

Rank tests by:
1. **Risk** — what breaks if this fails in production?
2. **Frequency** — how often is this code path hit?
3. **Complexity** — how many branches/conditions?

## Output

| Artifact | Path |
|----------|------|
| Testing strategy document | `.github/plans/specs/testing-strategy-{scope}.md` |
| Optional test stubs | Project test directories (only with user approval) |

Read `project.yml` for existing test commands and frameworks before suggesting new tools.

## Rules

- Always check existing test patterns in the codebase before suggesting new ones
- Never suggest testing implementation details — test behavior
- Prefer the testing pyramid: many unit, fewer integration, minimal e2e
- If the project has no tests yet, suggest a pragmatic starting point (not 100% coverage)
- Reference `project.yml` for existing test commands and frameworks
- Output language matches user preference

## Example

> "How should I test the checkout flow?"
> → Reads domain, identifies: cart calculation (unit), payment gateway (integration),
>   full purchase flow (e2e). Generates prioritized plan with specific test cases.
