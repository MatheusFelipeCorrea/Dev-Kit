---
name: ux-audit
description: >-
  Runs a phased UX/UI and design-system audit focused on consistency of tokens,
  components, and user journeys. Use when reviewing design consistency,
  accessibility basics, or UI patterns—not for a full product redesign.
---

# UX Audit — Consistency & Design System

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover UI apps, style/token files, component libraries, and journey-related routes/screens from manifests, READMEs, and tree. **Never** assume a brand, color system, or frontend stack.
3. Capture: UI roots, design-token paths, `language`/`locale`, `outputs.audits` (ux-design).
4. If an **overlay** is configured, read it **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/ux-design.md` when present.

**Fallback:** if prompt/config is missing, continue with a professional UX consistency checklist (tokens → components → patterns → journeys → a11y basics). Do **not** block.

## Phases (generic)

**One phase per session**; wait for user OK between phases.

| Phase | Focus (if artifacts exist) |
|-------|----------------------------|
| 1 | Foundations & tokens |
| 2 | Components & interaction patterns |
| 3 | Journeys / flows across screens |
| consolidate | Canonical decisions + executive summary |

If there is no design system or UI, mark the audit N/A and stop early with rationale.

## Scope & findings

- Goal: **standardize**, not catalog endless variations or redesign the product.
- Finding IDs: `UX-<PHASE>-<NN>` (or config prefix).
- Each inconsistency → one **canonical decision** (single recommended pattern).
- Each finding: evidence `path:line`, severity/priority, impact, confidence, recommendation.

## Execution rules

- **Read-only by default.** Do not change UI code unless the user asks for implementation separately.
- Respect the project's existing visual language; do not impose an unrelated aesthetic.
- Output language: config / user preference.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (ux-design) |
| Fallback | `.github/audits/results/ux-design/` |

Suggested filenames:

- `design-fase-1-fundamentos-tokens.md`
- `design-fase-2-componentes-padroes.md`
- `design-fase-3-jornadas.md`
- `design-sumario-executivo.md`

## Example

> Run ux-audit phase 1 on design tokens and foundations.
