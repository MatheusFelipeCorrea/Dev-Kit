# DevForge Methodology Cheat Sheet

Quick reference: **what each piece is**, **when to use it**, and **what is optional vs generated**.

| Concept | What it is | When to use | Ships in clone? |
|---------|------------|-------------|-----------------|
| **Agent** | Long, autonomous flow with human gates | "Implement this card", "Teach me X" | Yes (`.github/agents/`) |
| **Skill** | On-demand capability (read `SKILL.md`, follow steps) | Natural-language trigger per skill | Yes (`.github/skills/`) |
| **Script** | Deterministic CLI (`cards-sync`, validate, watch) | Sync cards, CI, automation | Yes (`scripts/cards-sync/`) |
| **Runtime rule** | IDE-specific hints (Cursor, Copilot, Claude) | Always-on behavior for the assistant | Yes (`.cursor/rules/`, `CLAUDE.md`, `instructions/`) |
| **Memory** | Persistent project context | Every session — stack, domain, decisions | Templates yes; content after setup |
| **Card** | Markdown + YAML frontmatter for boards | Planning, refinement, sync | `CARD.template.md` + `_examples/` (reference only) |
| **Blueprint** | Architecture / folder structure docs | Greenfield planning | **No** — created by `project-architect` |
| **Exemplars** | Team reference file catalog | Point skills to "good" patterns | Optional — starter card examples only |
| **ADR / Retro / Diagram** | Generated documentation artifacts | After explicit skill invocation | **No** — folders exist, files on demand |

## Typical flow

```
Discovery → Cards/Spec → Implementation plan → Code (human-approved) → Audit / ADR / Retro
```

1. **Discovery:** `project-discovery` → `project.yml` + memory
2. **Planning:** `hypothesis-forge` → `card-refiner` → `.github/cards/`
3. **Spec:** `acceptance-spec` → `.github/plans/specs/`
4. **Build:** `implementation-plan` agent → `.github/plans/implementations/`
5. **Quality:** `full-audit` → `.github/audits/results/`
6. **Docs:** `adr-generator`, `plantuml-generator`, `sprint-retro` → respective output folders

## Fallback rule (important)

If a blueprint, exemplar path, or output file is **missing**, do not block:

1. Read `project.yml` and `.github/memory/`
2. Search the codebase for real patterns
3. Ask the user only when ambiguity remains

## Related docs

- [Fresh clone vs generated artifacts](../../README.md#clone-limpo-vs-artefatos-gerados) (PT anchor; EN section in [docs/README.md](./README.md))
- [skills-output-map.md](./skills-output-map.md)
- [INDEX.md](../INDEX.md)
