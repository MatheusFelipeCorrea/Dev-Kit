# Common pitfalls and learning gaps

What confuses first-time Hyperion users — and how to avoid it.

**Português:** [armadilhas-comuns.md](../troubleshooting/armadilhas-comuns.md) · **Commands:** [quick-commands-en.md](../reference/quick-commands-en.md)

---

## 1. “Do I need npm all the time?”

**No.** Prefer the agent:

| Instead of… | Say… |
|-------------|------|
| Copying README commands | **`/setup`** — guided full setup |
| `validate` + `sync` manually | **`/sync`** — agent runs `hyperion:sync` |
| Manual diagnostics | **`/doctor`** |

npm remains for CI, power users, and when the agent has no shell.

---

## 2. Cursor: rules not loading

The kit **includes** `.cursor/rules/hyperion.mdc` in a full clone.

If you copied only `.github/` + `scripts/`:

```bash
npm run hyperion:cursor
```

Or ask `/setup` — bootstrap installs rules automatically.

---

## 3. EXAMPLE cards on the board / sync shows zero

Files under `_examples/` and `CARD.template.md` are **reference only** — never synced.

| Symptom | Likely cause |
|---------|--------------|
| “0 cards to sync” on clean clone | Expected — create cards under `epics/`, etc. |
| EXAMPLE vanished from board after update | Correct — they were samples |
| `--only EXAMPLE-*` does nothing | By design — maintainer flag `--include-samples` only |

---

## 4. Card status vs board column

**Safe mode (GitHub Projects):** existing cards without `status` in frontmatter preserve manual board moves. When the user asks to move a card, the agent must set `status:` and run `/sync`.

Forward sync does not auto-update Markdown from board-only moves — use `cards:reverse` if needed.

---

## 5. `gh auth login` vs `.env` token

Local dev: `gh auth login`. CI: `GITHUB_TOKEN` or `PROJECT_SYNC_TOKEN`. Org Projects may need a fine-grained PAT.

---

## 6. Too many skills — where to start?

Suggested minimal journey:

![Minimal Hyperion journey — setup, refine, implement, audit](../assets/hyperion-journey-minimal.png)

| Phase | Command | Goal |
|------|---------|------|
| Bootstrap | `/setup` | project.yml + memory + cards |
| Plan | `/refine` | Idea → cards |
| Execute | `/implement` | Phased plan |
| Quality | `/audit` | Read-only reports |

You do not need to memorize 30 skills — [quick-commands-en.md](../reference/quick-commands-en.md) covers most usage.

---

## 7. Audit takes long / pauses between dimensions

`full-audit` runs six dimensions with pauses by design. Read-only — reports only in `.github/audits/results/`.

---

## 8. Stale docs vs `hyperion:*`

Some long guides still mention `cards:init` — equivalent to `hyperion:setup`.

**Source of truth:**

1. `.github/commands.yml` — canonical registry
2. `npm run hyperion:help` — generated from the YAML above
3. [quick-commands-en.md](../reference/quick-commands-en.md) — human reference (PT pair available)
4. `CLAUDE.md`, `.cursor/rules/hyperion.mdc`, `copilot-instructions.md` — generated runtime rules
5. Folder map: [organizacao.md](../meta/organizacao.md)

Run `npm run hyperion:check-rules` if shortcuts look inconsistent — CI enforces sync.

---

## 9. Non-GitHub backends

GitHub Projects is fully mature. Others are best-effort forward sync — see [choose-backend-en.md](../integration/choose-backend-en.md) and `/connect`.

---

## 10. Not in the kit yet

| User expects | Current status |
|--------------|----------------|
| Native Cursor slash plugin | Rules file only |
| Full Jira board column sync | Metadata in issue; WIP |
| Video walkthrough | Markdown only |

---

## Ask the agent

- *“Run `/doctor` and tell me what’s missing”*
- *“Cursor rules not working — what do I copy?”*
- *“Why didn’t my card sync to the Project?”*
- *“Difference between project-discovery and `/setup`?”*

`/setup` = full orchestration. `project-discovery` = repo map + `project.yml` only.
