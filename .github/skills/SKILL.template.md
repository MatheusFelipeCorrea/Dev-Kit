---
name: skill-name-kebab-case
description: One-line description of when to use this skill.
---

# Skill Title

Brief purpose statement.

## When to use

- Trigger phrase or scenario 1
- Trigger phrase or scenario 2

## Output

**Write artifacts to:** `.github/path/to/folder/` (must match [onde-ficam-os-outputs.md](../docs/meta/onde-ficam-os-outputs.md))

| Artifact | Path |
|----------|------|
| Primary output | `.github/.../filename.md` |

Read `project.yml` → `outputs` if paths are customized.

## Steps

1. Read context (`project.yml`, relevant `memory/` files)
2. ...
3. Write output to the path above — never scatter files in repo root

## Rules

- Constraint 1
- Constraint 2

## Example

```
User: "..."
Agent: [reads SKILL, writes to defined path]
```
