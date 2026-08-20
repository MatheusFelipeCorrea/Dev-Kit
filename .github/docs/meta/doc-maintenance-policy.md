# Documentation Maintenance Policy

Guidelines to keep Hyperion docs consistent while avoiding duplication.

## Source of truth map

| Topic | Source of truth | Secondary references |
|------|------------------|----------------------|
| Onboarding flow | `onboarding/guia-completo.md` + `onboarding/guide-complete-en.md` | `GETTING-STARTED.md`, `README.md` |
| Commands and scripts | `reference/comandos-rapidos.md` + `.github/commands.yml` + `scripts/hyperion/help.mjs` | `README.md`, `cards-sync/README.md` |
| Output locations | `reference/skills-output-map.md` | `meta/onde-ficam-os-outputs.md`, `README.md` |
| Audit directories | `.github/audits/manifest.yml` | `quality/primeira-auditoria*.md` |
| Learning gaps | `troubleshooting/armadilhas-comuns.md` | `reference/comandos-rapidos.md` |
| Runtime rules | `.github/commands.yml` → generate | `CLAUDE.md`, `hyperion.mdc`, `copilot-instructions.md` |
| SDLC flow | `meta/fluxo-completo.md` + `meta/full-flow-en.md` | README, guias, agents/README |
| Adapt to host repo | `onboarding/adaptar-ao-repo.md` + EN pair | GETTING-STARTED, trilha |
| Learning path | `onboarding/trilha-de-aprendizado.md` + EN | docs/README, README |
| Skill structure | `scripts/hyperion/skills-validate.mjs` | Each `skills/**/SKILL.md` |

## Doc folder structure

```
.github/docs/
├── README.md           ← canonical index
├── onboarding/         ← first-time guides
├── reference/          ← commands, output maps
├── integration/        ← backends, GitHub CLI
├── quality/            ← audit guides
├── troubleshooting/    ← pitfalls
└── meta/               ← organization, maintenance
```

## Anti-duplication rules

1. Prefer links over re-explaining long sections.
2. If a table appears in 3+ places, keep one canonical table and link to it.
3. Keep README as a thin hub (~150 lines).
4. Always update PT/EN pairs together.
5. Run validation before merging:
   - `npm run docs:check` — links in markdown
   - `npm run skills:validate` — skill frontmatter and outputs
   - `npm run hyperion:check-rules` — runtime rules in sync with `commands.yml`
   - `npm test` — hyperion + cards unit tests

Markers synced by `hyperion:generate-rules`: `HYPERION:COMMANDS`, `HYPERION:SKILLS`, `HYPERION:AGENTS`.

## Do not commit

Session artifacts (migration reports, PR reviews, audit results, implementation plans) are **gitignored** — see root `.gitignore`. Docs must not reference internal scorecards or branch-specific analysis files in the repo.

## Change checklist

When changing behavior, verify:

- `README.md`, `GETTING-STARTED.md`
- `.github/docs/README.md`, `onboarding/trilha-de-aprendizado.md`
- PT/EN pair of touched guide
- `.github/commands.yml` + `npm run hyperion:generate-rules` if commands change
- `reference/skills-output-map.md` when output paths change
- `audits/manifest.yml` when audit folders change
- New skill → register in `commands.yml` if it gets a slash command; run `skills:validate`

## Translation policy

- PT-BR and EN guides should be equivalent in meaning.
- Reference docs: provide PT pair or link at top (`cheatsheet-metodologia.md`, `mapa-outputs-skills.md`).

## Review cadence

- Weekly: `npm run docs:check`, `npm run skills:validate`, `npm run hyperion:check-rules`
- Monthly: full docs consistency sweep
- Before release: full checklist above
