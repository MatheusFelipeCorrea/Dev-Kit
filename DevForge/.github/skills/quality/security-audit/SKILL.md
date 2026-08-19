---
name: security-audit
description: >-
  Runs a phased application security audit (auth, data/integrations, infra/privacy)
  using OWASP-oriented checklists and evidence-backed findings. Use when the user
  asks for AppSec, security review, or a specific security audit phase.
---

# Security Audit — AppSec (Phased)

## Step 1 — Resolve project context (mandatory)

1. Read `.github/project.yml` if it exists. Validate configured paths; treat stale or missing paths as hints and fall back to discovery.
2. If absent: discover apps, source dirs, auth surfaces, CI/deploy configs, dependency manifests, and privacy-related docs from the tree. **Never** assume a fixed stack or layout.
3. Capture: source roots, deploy/runtime hints, `language`/`locale`, `outputs.audits` (application-security or equivalent).
4. If an **overlay** is configured for this audit, read it **after** the base prompt.

## Protocol

Follow `.github/audits/prompts/security.md` when present.

**Fallback:** if prompt/config is missing, continue with a professional AppSec checklist (threat model → authn/authz → secrets/PII → injections → integrations → supply chain → infra/privacy). Do **not** block.

## Phases (generic)

Run **one phase per session**; stop and wait for user OK before the next.

| Phase | Focus (adapt to what exists) |
|-------|------------------------------|
| 1 | Authentication & authorization |
| 2 | Sensitive data & integrations |
| 3 | Infrastructure, supply chain & privacy |
| consolidate | Executive summary across phases |

Skip or mark N/A any subdomain with no artifacts (e.g. no OAuth, no LLM, no mobile).

## Scope & findings

- Only detected/existing artifacts.
- Finding IDs: `SEC-<PHASE>-<NN>` (or prefix from config/manifest).
- Each finding: attack vector, evidence `path:line`, severity, exploitability, impact, confidence, mitigation (code/pseudo-code when useful).
- Severity scale: Critical / High / Medium / Low (or config equivalent).

## Execution rules

- **Read-only by default.** No code changes unless the user asks for a separate remediation pass.
- Do not run offensive exploits against live systems; analyze code and config only.
- Output language: config / user preference.

## Output

| Source | Path |
|--------|------|
| Prefer | `project.yml` → `outputs.audits` (application-security) |
| Fallback | `.github/audits/results/application-security/` |

Suggested filenames (override via config/prompt):

- `security-fase-1-auth-authz.md`
- `security-fase-2-dados-integracoes.md`
- `security-fase-3-infra-privacy.md`
- `security-sumario-executivo.md`

## Example

> Run security-audit phase 1 and save under the configured application-security output.
