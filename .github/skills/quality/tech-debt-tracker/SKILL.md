---
name: tech-debt-tracker
description: >-
  Identifies, categorizes, and prioritizes technical debt in the codebase.
  Produces a debt inventory with cost/risk analysis and a payoff roadmap.
  Use when the user asks about tech debt, code health, or "what should we
  clean up?".
---

# Tech Debt Tracker

Systematic identification and prioritization of technical debt.

## Step 1 — Context

Read:
- `.github/project.yml` — stack, apps, conventions
- `.github/memory/DECISIONS.md` — known shortcuts or deferred work
- Previous audit results in `.github/audits/results/` (if available)
- TODO/FIXME/HACK comments in the codebase

## Step 2 — Scan for debt indicators

| Category | What to look for |
|----------|-----------------|
| **Code** | TODOs, FIXMEs, HACKs, dead code, duplications, long files (>300 lines) |
| **Dependencies** | Outdated packages, deprecated APIs, unmaintained libraries |
| **Tests** | Low coverage areas, flaky tests, missing test types |
| **Architecture** | Circular dependencies, god modules, tight coupling |
| **DevOps** | Manual deployments, missing monitoring, no rollback strategy |
| **Documentation** | Outdated docs, missing API docs, stale READMEs |
| **Security** | Known vulnerabilities, hardcoded configs, missing input validation |

## Step 3 — Classify each debt item

For each item found:

```markdown
### {DEBT-NNN}: {title}

- **Category:** Code / Dependencies / Tests / Architecture / DevOps / Docs / Security
- **Location:** {file:line or module}
- **Age:** {when introduced, if known}
- **Impact:** High / Medium / Low
  - {what breaks or degrades if not addressed}
- **Effort:** S / M / L / XL
  - {estimated time to fix}
- **Interest rate:** {does it get worse over time? how fast?}
- **Suggested fix:** {brief approach}
```

## Step 4 — Prioritize

Score each item: `Priority = Impact × Interest Rate ÷ Effort`

| Priority | Action |
|----------|--------|
| Critical | Fix this sprint — blocking or degrading rapidly |
| High | Schedule within 2 sprints |
| Medium | Add to backlog, fix opportunistically |
| Low | Document and monitor |

## Output

| Artifact | Path |
|----------|------|
| Tech debt inventory | `.github/docs/tech-debt-inventory.md` |
| Optional card follow-ups | `.github/cards/` (only if user asks to track items as cards) |

Update the inventory in place on subsequent runs; bump `Last updated` date.

## Step 5 — Generate output

Write to `.github/docs/tech-debt-inventory.md`:

```markdown
# Tech Debt Inventory

Last updated: {date}
Total items: {N}
Critical: {n} | High: {n} | Medium: {n} | Low: {n}

## Critical
| ID | Title | Location | Impact | Effort | Interest |
|----|-------|----------|--------|--------|----------|

## High
...

## Recommended Payoff Order
1. {DEBT-001} — {why first: high interest, blocks others}
2. {DEBT-003} — {why second}
3. ...

## Quick Wins (High impact, Low effort)
- {items that can be fixed in < 1 hour}
```

## Step 6 — Generate cards (optional)

If the user wants to track debt in the project board, offer to generate cards
using the `card-refiner` format for Critical/High items:

```yaml
---
card_id: {PROJECT}-DEBT-{NNN}
title: "[DEBT] {title}"
type: Task
priority: High
labels: [Débito Técnico]
---
```

## Rules

- Be objective — debt is not "code I don't like", it's measurable friction
- Don't conflate debt with feature work (debt = past shortcuts, not future features)
- Include the "interest rate" — debt that compounds is more urgent than static debt
- Never auto-fix debt without user approval — some debt is intentional
- Cross-reference with audit results to avoid duplicate findings
- Update the inventory incrementally (don't regenerate from scratch each time)

## Example

> "What tech debt do we have?"
> → Scans codebase, finds 23 TODOs, 5 outdated deps, 2 circular dependencies,
>   missing tests on payment module. Produces prioritized inventory with 3 critical
>   items and suggests generating cards for the top 5.
