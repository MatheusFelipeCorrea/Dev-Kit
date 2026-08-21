---
name: hyperion-ops
description: >-
  Runs Hyperion npm scripts on behalf of the user (doctor, setup, sync,
  validate). Use when the user says /doctor, /sync, "sincroniza os cards",
  "roda o doctor", "valida os cards", or any cards-sync terminal task they
  should not run manually.
---

# Hyperion Ops — run kit commands for the user

Users should **not** need to memorize npm scripts. When this skill applies,
**execute the command in the terminal** and summarize results in plain language.

## Triggers

| User says | You run |
|-----------|---------|
| `/doctor` / "doctor do Hyperion" / "está tudo ok?" | `npm run hyperion:doctor` (ou `./bin/hyperion doctor`) |
| `/sync` / "sincroniza os cards" / "sobe pro GitHub" | `npm run hyperion:sync` (ou `./bin/hyperion sync`) |
| "dry-run dos cards" / "simula sync" | `npm run hyperion:sync -- --dry-run` |
| "setup Hyperion" (cards only, project.yml exists) | `npm run hyperion:setup -- --yes` |
| "valida os cards" | `npm run cards:validate` |
| "sync só CARD-X" | `npm run cards:sync -- --only CARD-X` |
| "reverse sync" / "puxa do GitHub" | `npm run cards:reverse` |
| "ajusta labels" | `npm run cards:labels-reset -- --yes` (confirm with user first) |
| "lista comandos" / `/help` | `npm run hyperion:help` (paste summary) |
| `/pipeline` / "detecta CI" / "aplica pipeline Hyperion" | `npm run hyperion:pipeline-detect` then `pipeline-plan`; apply only with user OK |
| "upgrade do kit" / "atualiza Hyperion" | `npm run hyperion:upgrade` then `--yes` with user OK |
| "project-verify" / "valida project.yml" | `npm run hyperion:project-verify` |
| "phase-verify" | `npm run hyperion:phase-verify -- --plan <path>` |
| "review-verify" | `npm run hyperion:review-verify -- --review <path>` |

If Node is missing, use `./bin/hyperion <cmd>` (Docker) — see `.github/docs/meta/node-and-docker.md`. Gates: `.github/docs/meta/definition-of-done.md`.

Full guided setup (project.yml + memory + cards) → use **project-startup** (`/setup`), not this skill alone.

## Standard sync workflow

After editing cards (including status moves from conversation):

```bash
npm run hyperion:sync
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

1. Suggest `gh auth login` — link `.github/docs/integration/github-cli-setup.md`
2. Or repo secret `PROJECT_SYNC_TOKEN`
3. Re-run `npm run hyperion:sync`

## Rules

- Always run commands — do not only tell the user to run them.
- Never use `--include-samples` unless user is a kit maintainer testing EXAMPLE cards.
- Report: command run, exit code, card count synced, issue numbers if visible in log.
- Read-only audits are **not** this skill — use `full-audit` and siblings.

## Command map (npm)

| npm | Purpose |
|-----|---------|
| `hyperion:help` | All shortcuts |
| `hyperion:doctor` | Kit + cards health |
| `hyperion:setup -- --yes` | Bootstrap cards pipeline |
| `hyperion:sync` | Validate + sync |
| `cards:watch` | Watch mode |
| `cards:test` | Unit tests (maintainers) |
