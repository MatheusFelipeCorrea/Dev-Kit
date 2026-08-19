---
name: po-audit
description: >-
  Runs a Product Owner audit that compares requirements and docs to real code,
  producing findings and a prioritized action plan. Use when auditing a feature
  area, reviewing requirement gaps, or before closing an epic/card.
---

# PO Audit — Requirements vs Code

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover layout from manifests (`package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, etc.), workspaces/monorepo configs, READMEs, and the repo tree. **Never** assume product-specific paths or stacks.
3. Capture from config or discovery: source roots, docs/requirements roots, `language`/`locale`, and `outputs.audits` (product-owner key or equivalent).
4. If `project.yml` points to an **overlay** for this audit, read the overlay **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/product-owner.md` when present.

**Fallback:** if the prompt or config is missing, continue with a professional PO checklist (map requirements → reverse-engineer code → gaps → edge cases → new requirement proposals → prioritized plan). Do **not** block.

Optional: `.github/audits/manifest.yml` may map skill → prompt → output dir.

## Scope

- Only artifacts that exist or were detected; mark N/A when not applicable.
- Prefer **one feature area / module per session** when the user scopes it; otherwise honor the requested scope.
- Do not invent requirements IDs, modules, or paths that are not in docs/code/config.

## Execution rules

- **Read-only by default.** Do not edit code or docs unless the user separately asks for implementation.
- Be exhaustive for the scoped area; cite evidence as `path:line`.
- Each finding must include: evidence, severity/priority, impact, confidence (high/medium/low), recommendation.
- Output language: `project.yml` / user preference; else match the user.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (product-owner / mapped key) |
| Fallback | `.github/audits/results/product-owner/` |

Create the directory if needed. Save the report file (not chat-only). Naming: follow config/prompt; else `{slug-or-scope}.md`.

## Report skeleton

1. Executive summary
2. Status: docs/requirements vs reality
3. Gaps (usability / journeys when relevant)
4. Business rules & validation diagnosis
5. Proposed new requirements (only when justified)
6. Prioritized action plan
7. Clarifying questions (if fundamentals unclear)

## Example

> Audit the authentication area with po-audit and save the report under the configured audits output.
