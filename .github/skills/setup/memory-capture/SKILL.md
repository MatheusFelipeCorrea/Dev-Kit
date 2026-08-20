---
name: memory-capture
description: >-
  Appends session decisions and learnings to .github/memory/DECISIONS.md.
  Respects project.yml memory settings. Called at end of implement, execute,
  audit-run, pr-review, and release sessions.
---

# Memory Capture

## When to use

- End of agent sessions that made architectural or process decisions
- User says "record this decision"
- `memory.auto_capture: true` in project.yml (default when section present)

## Configuration (project.yml)

```yaml
memory:
  auto_capture: true
  decisions_file: .github/memory/DECISIONS.md
  project_file: .github/memory/PROJECT.md
```

Defaults if omitted: `auto_capture: false`, paths above.

## Output

| Artifact | Path |
|----------|------|
| Decision log entry | `{decisions_file}` append-only |

## Entry format

```markdown
## {YYYY-MM-DD} — {short title} ({agent or skill})

**Context:** one line
**Decision:** what was chosen
**Alternatives considered:** optional
**Follow-up:** optional cards or tasks
```

## Rules

- **Append only** — never delete historical decisions
- Max 5 entries per session (avoid noise)
- Skip trivial typos or pure formatting changes
- Match `locale` from project.yml
- If file missing, create from template in `.github/memory/`

## Who calls this

| Agent / skill | When |
|---------------|------|
| implementation-plan | Plan approved with notable arch choices |
| implementation-executor | Phase complete with new patterns |
| audit-runner | Cross-cutting themes from audit |
| pr-reviewer | REQUEST_CHANGES with design implications |
| release | Release notes-worthy decisions |
| migration | Migration detection summary |
