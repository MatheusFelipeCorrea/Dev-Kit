---
name: devkit-ops
description: >-
  Runs Dev-Kit npm scripts on behalf of the user (doctor, setup, sync,
  validate). Use when the user says /doctor, /sync, "sincroniza os cards",
  "roda o doctor", "valida os cards", or any cards-sync terminal task they
  should not run manually.
---

# Dev-Kit Ops — run kit commands for the user

Users should **not** need to memorize npm scripts. When this skill applies,
**execute the command in the terminal** and summarize results in plain language.

## Triggers

| User says | You run |
|-----------|---------|
| `/doctor` / "doctor do Dev-Kit" / "está tudo ok?" | `npm run devkit:doctor` |
| `/sync` / "sincroniza os cards" / "sobe pro GitHub" | `npm run devkit:sync` |
| "dry-run dos cards" / "simula sync" | `npm run devkit:sync -- --dry-run` |
| "setup Dev-Kit" (cards only, project.yml exists) | `npm run devkit:setup -- --yes` |
| "valida os cards" | `npm run cards:validate` |
| "sync só CARD-X" | `npm run cards:sync -- --only CARD-X` |
| "reverse sync" / "puxa do GitHub" | `npm run cards:reverse` |
| "ajusta labels" | `npm run cards:labels-reset -- --yes` (confirm with user first) |
| "lista comandos" / `/help` | `npm run devkit:help` (paste summary) |

Full guided setup (project.yml + memory + cards) → use **project-startup** (`/setup`), not this skill alone.

## Standard sync workflow

After editing cards (including status moves from conversation):

```bash
npm run devkit:sync
```

Equivalent to validate → sync. On failure, read output, fix frontmatter or config, retry once.

For incremental dev, suggest `npm run cards:watch` **only if** user wants auto-sync on save.

## Doctor interpretation

| Result | Tell user |
|--------|-----------|
| Blocking issues | What to fix (Node, missing kit files) |
| Warnings only | Kit usable; suggest `/setup` or fill memory |
| cards doctor failed | Point to `projects-map.json`, gh auth, Project fields |

## GitHub auth

If sync fails with auth/permission:

1. Suggest `gh auth login` — link `.github/docs/github-cli-setup.md`
2. Or repo secret `PROJECT_SYNC_TOKEN`
3. Re-run `npm run devkit:sync`

## Rules

- Always run commands — do not only tell the user to run them.
- Never use `--include-samples` unless user is a kit maintainer testing EXAMPLE cards.
- Report: command run, exit code, card count synced, issue numbers if visible in log.
- Read-only audits are **not** this skill — use `full-audit` and siblings.

## Command map (npm)

| npm | Purpose |
|-----|---------|
| `devkit:help` | All shortcuts |
| `devkit:doctor` | Kit + cards health |
| `devkit:setup -- --yes` | Bootstrap cards pipeline |
| `devkit:sync` | Validate + sync |
| `cards:watch` | Watch mode |
| `cards:test` | Unit tests (maintainers) |
