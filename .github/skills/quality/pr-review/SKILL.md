---
name: pr-review
description: >-
  Structured pull request review checklist. Companion to pr-reviewer agent.
  Adapts to project.yml commands and conventions. Use for partial PR reviews
  or when runtime has no agent support.
---

# PR Review — checklist skill

## When to use

- User invoked `/pr-review` without full agent
- Sub-step of pr-reviewer agent
- "Review my changes against main"

## Adapt to repo

1. **Prefer `.github/project.yml`** — do not re-run full discovery if the contract exists and paths validate.
2. Read `.github/project.yml`:
   - `commands.test`, `commands.lint`, `commands.build`
   - `apps` for monorepo scope
   - `conventions.commit_refs_style`
3. If commands absent, infer from `package.json` scripts or ask once
4. Review file **must** include frontmatter `tests_ran: yes|no|skipped` and pass:
   `npm run hyperion:review-verify -- --review <path>`

## Output

| Artifact | Path |
|----------|------|
| PR review report | `.github/plans/reviews/pr-{id}-review.md` |

## Checklist

1. **Scope** — title, description, linked CARD_ID
2. **Diff** — logic, edge cases, error handling
3. **Tests** — run `commands.test`; new paths covered
4. **Security** — secrets, auth, input validation
5. **Style** — matches surrounding code
6. **Docs** — public API / README if needed

## Verdict template

```markdown
verdict: APPROVE | REQUEST_CHANGES | COMMENT
```

## Rules

- Read-only on product code unless user asks for fixes
- Prefer `gh pr diff` / `gh pr view` when GitHub CLI available
- For local branch: `git diff main...HEAD`
