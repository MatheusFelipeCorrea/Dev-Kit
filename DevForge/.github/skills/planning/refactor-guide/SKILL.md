---
name: refactor-guide
description: >-
  Guides safe refactoring of code with a structured approach: identify smells,
  plan transformations, ensure test coverage before changes, execute incrementally.
  Use when the user says "refactor this", "this code is messy", or "how to improve
  this module".
---

# Refactor Guide

Structured approach to safe, incremental refactoring.

## Step 1 — Identify the problem

Read the target code and classify the smells:

| Smell | Signal |
|-------|--------|
| Long method | > 30 lines, multiple responsibilities |
| God class | Too many dependencies, knows too much |
| Feature envy | Method uses another class's data more than its own |
| Duplicated logic | Same pattern repeated 3+ times |
| Deep nesting | > 3 levels of if/for/try |
| Shotgun surgery | One change requires edits in 10+ places |
| Primitive obsession | Raw strings/numbers where a type would be clearer |

Present findings as a prioritized list.

## Step 2 — Verify safety net

Before any change:
- **Tests exist?** If yes, run them to confirm green.
- **Tests don't exist?** Write characterization tests first (tests that document current behavior).
- **No test framework?** Suggest setting one up via `testing-strategy` skill.

Never refactor without a safety net.

## Step 3 — Plan the refactoring

For each smell, propose a transformation:

```markdown
## Refactoring Plan: {module/file}

### Change 1: {name}
- **Smell:** {what's wrong}
- **Technique:** {Extract Method / Extract Class / Introduce Parameter Object / etc.}
- **Risk:** Low / Medium / High
- **Steps:**
  1. {atomic step}
  2. {atomic step}
  3. Run tests

### Change 2: ...
```

## Step 4 — Execute incrementally

For each planned change:
1. Apply ONE transformation
2. Run tests
3. Commit with `refactor: {description}`
4. Move to next

Never batch multiple refactorings in one commit.

## Step 5 — Validate

After all changes:
- Run full test suite
- Compare behavior (same inputs → same outputs)
- Review: is the code genuinely simpler or just different?

## Output

| Artifact | Path |
|----------|------|
| Refactoring plan (session) | `.github/plans/implementations/refactor-{module}-{date}.md` |
| Code changes | Target source files (with user approval, one commit per step) |
| Optional ADR | `.github/docs/adr/` if architecture changes |

The plan document is optional but recommended for multi-step refactors spanning sessions.

## Rules

- Never change behavior during refactoring — that's a feature, not a refactor
- Prefer small, reversible steps over big-bang rewrites
- If a refactoring grows too large, split into multiple sessions
- Suggest creating an ADR if the refactoring changes architecture
- Document the "why" in commit messages, not the "what"
- If unsure about a transformation, ask the user before proceeding

## Example

> "This service file is 500 lines, help me refactor"
> → Identifies 4 smells, verifies tests exist, proposes extract-class + extract-method,
>   executes step by step with commits between each.
