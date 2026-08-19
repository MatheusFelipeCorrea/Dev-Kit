# Documentation Maintenance Policy

Guidelines to keep DevForge docs consistent while avoiding duplication.

## Source of truth map

| Topic | Source of truth | Secondary references |
|------|------------------|----------------------|
| Onboarding flow | `guia-completo.md` + `guide-complete-en.md` | `README.md`, `setup-quickstart*.md` |
| Commands and scripts | `scripts/cards-sync/README.md` + `package.json` | `README.md`, quickstarts |
| Output locations | `skills-output-map.md` | `onde-ficam-os-outputs.md`, `where-outputs-go-en.md`, `README.md` |
| Audit directories | `.github/audits/manifest.yml` | `primeira-auditoria*.md`, `README.md` |
| Runtime rules | `.github/instructions/copilot-instructions.md` | `.cursor/rules/devforge.mdc`, `CLAUDE.md` |

## Anti-duplication rules

1. Prefer links over re-explaining long sections.
2. If a table appears in 3+ places, keep one canonical table and link to it.
3. Keep README as a hub; move deep details to docs files.
4. Always update PT/EN pairs together.

## Change checklist

When changing behavior, verify these files in the same PR:

- `README.md`
- `.github/docs/README.md`
- PT/EN pair of touched guide
- `skills-output-map.md` when output paths change
- `audits/manifest.yml` and audit docs when folder names change

## Translation policy

- PT-BR and EN guides should be equivalent in meaning.
- If one side is temporarily behind, add an explicit note at the top of the lagging file.

## Lightweight review cadence

- Weekly: quick link/path sanity check.
- Monthly: full docs consistency sweep.
- Before release/template publish: run the full checklist above.
