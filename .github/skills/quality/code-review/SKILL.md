---
name: code-review
description: >-
  Performs a deep phased code review (backend, frontend/UI, tests/integration)
  hunting bugs, edge cases, and maintainability issues. Use when the user asks
  for code review, senior review, implementation audit, or a specific review phase.
---

# Code Review — Implementation Audit

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover apps, languages, source/test dirs, frameworks, and layering from manifests, workspaces, READMEs, and tree. **Never** assume a particular framework or ORM.
3. Capture: source roots, test roots, optional `${MODULE_SCOPE}`, `language`/`locale`, `outputs.audits` (code-review).
4. If an **overlay** is configured, read it **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/code-review.md` when present.

**Fallback:** if prompt/config is missing, continue with a professional senior review checklist (correctness → concurrency/edge cases → error handling → API contracts → UI state → tests → smells). Do **not** block.

## Phases (generic)

**One phase per session**; wait for user OK between phases.

| Phase | Focus | Skip when |
|-------|-------|-----------|
| 1 | Backend / services / data access | No server/API/data layer |
| 2 | Frontend / client / UI | No UI client |
| 3 | Tests & integration | Always assess what exists; N/A if none |
| consolidate | Executive summary | — |

Phases describe **layers**, not product modules. Adapt names to detected structure (mobile, CLI, workers, etc.).

## Scope & findings

- Optional scope: a package, folder, or symbol provided by the user.
- Finding IDs: `DEV-<PHASE>-<NN>` (or config prefix).
- Prioritize real bugs over style nitpicks.
- Each finding: evidence `path:line`, severity/priority, impact, confidence, reproduction or trigger, recommendation (prefer a concrete fix snippet).

## Execution rules

- **Read-only by default.** Suggest patches; apply only if the user asks for a separate implementation pass.
- Output language: config / user preference.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (code-review) |
| Fallback | `.github/audits/results/code-review/` |

Suggested filenames:

- `dev-fase-1-backend.md`
- `dev-fase-2-frontend.md`
- `dev-fase-3-testes-integracao.md`
- `dev-sumario-executivo.md`

## Example

> Run code-review phase 1 on the API package and save the report.
