---
name: repo-migration
description: >-
  Step-by-step migration of an existing repo into Hyperion. Writes adaptive
  project.yml commands block and seeds memory. Used by migration agent (/migrate).
---

# Repo Migration — skill companion

## When to use

- Partial migration tasks
- User says "adapt Hyperion to this repo" without full agent
- Refresh `project.yml` commands after stack change

## Output

| Artifact | Path |
|----------|------|
| Migration report | `.github/plans/migrations/migration-{date}.md` |
| Updated contract | `.github/project.yml` |
| Memory seeds | `.github/memory/PROJECT.md`, `DOMAIN.md`, `DECISIONS.md` |

## Adaptive commands block

Detect and write under `project.yml`:

```yaml
commands:
  test: <detected>
  lint: <optional>
  build: <optional>
  audit: <npm audit | pip-audit | null>
```

Detection order: existing project.yml → package.json scripts → stack defaults.

## Steps

1. List manifests and CI files
2. Merge into `project.yml` (preserve user keys)
3. Seed memory from README (don't invent domain)
4. Run `npm run hyperion:doctor` — report blockers
5. Write migration report with follow-ups

## Rules

- Delegate full orchestration to **migration** agent for `/migrate`
- Never overwrite product CI workflows
- Never import cards without user approving the list
