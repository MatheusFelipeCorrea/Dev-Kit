---
name: dependency-health
description: >-
  Scans dependency health for the host repo: outdated packages, audit/CVEs,
  license risks. Adapts to npm/pnpm/yarn/python from project.yml and manifests.
  Used before /release or standalone via /deps.
---

# Dependency Health

## When to use

- Before `/release` preflight
- User asks "check dependencies" or `/deps`
- After security-audit flags dependency issues

## Adapt to repo

Read `.github/project.yml` → `commands.audit` first, then detect:

| Stack | Default command |
|-------|-----------------|
| npm | `npm audit --audit-level=moderate` |
| pnpm | `pnpm audit` |
| yarn | `yarn npm audit --all --recursive` |
| python | `pip-audit` (if installed) |

Also run outdated when available:

- `npm outdated --json` / `pnpm outdated` / `pip list --outdated`

## Output

| Artifact | Path |
|----------|------|
| Health report | `.github/audits/results/dependency/dependency-health-{date}.md` |

## Report structure

```markdown
# Dependency health — {date}

## Summary
- Critical: N | High: N | Moderate: N | Outdated: N

## Audit output
## Outdated packages (top 10)
## Recommendations
## Commands run (for reproducibility)
```

## Rules

- **Read-only** — do not bump versions unless user asks
- Record exact commands run (adaptability audit trail)
- If audit tool missing, document install step for the stack
- Delegate release gate integration to **release** agent

## Integration with /release

Release agent Step 1 preflight should call this skill when `commands.audit` exists or stack is detectable.
