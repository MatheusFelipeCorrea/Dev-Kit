---
name: project-discovery
description: >-
  Resolves a repository's real layout, stack, documentation, commands, and
  conventions; optionally creates or refreshes .github/project.yml (Configure
  mode). Use when project.yml is missing, incomplete, or stale, when
  project-startup needs setup, or when another skill needs reliable context.
---

# Project Discovery

Build a small evidence-backed project context, then optionally persist it to
`.github/project.yml`. This skill is the way `project.yml` gets created or
refreshed — everything else in the pack reads that file.

## Two modes

| Mode | Trigger | Writes files? |
|------|---------|---------------|
| **Context** (default) | "discover", "map the repo", or another skill needs context | No |
| **Configure** | "configure/create/refresh `project.yml`", "set up this repo", or run by `project-startup` | Yes — writes `.github/project.yml` |

## Output

| Mode | Path | Notes |
|------|------|-------|
| **Configure** | `.github/project.yml` | Validate against `project.schema.json`; show diff before overwrite |
| **Context** | *(none — in-session summary only)* | Do not write files unless user asks to persist |

Optional follow-up: suggest filling `.github/memory/PROJECT.md`, `DOMAIN.md`, `DECISIONS.md` when evidence exists.

In **Configure** mode, produce the YAML below, fill only fields backed by
evidence, and write it to `.github/project.yml`. Use `.github/project.example.yml`
as the shape and `.github/project.schema.json` to validate. Leave unknown fields
out (or `null`) instead of guessing, and list them under `uncertainties` for the
user to confirm. Never overwrite an existing `project.yml` without the user's OK;
prefer showing a diff first.

## Resolution order

1. Read `.github/project.yml` when present.
2. Validate every configured file/directory exists.
3. Keep valid entries; mark stale entries and discover replacements.
4. Inspect repository-level instructions and contributor docs.
5. Detect workspace/package roots from manifests and workspace declarations.
6. Detect source, test, schema/migration, docs, CI, deploy, and infrastructure paths.
7. Infer commands from manifests/configs; never guess commands.

## Evidence sources

- Manifests: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, build files
- Workspace declarations and lockfiles
- Root/package READMEs, contributor guides, ADRs, agent instructions
- Source imports and folder patterns
- Test/lint/format/build configurations
- CI workflows, containers, IaC, deployment files
- Database schemas and migration directories
- Project management indicators:
  - `.jira.yml`, `atlassian-config.yml` → Jira
  - `azure-pipelines.yml`, `.azure/` → Azure DevOps
  - `.linear/` → Linear
  - `.gitlab-ci.yml` → GitLab
  - `.github/` (default) → GitHub

Treat dependency names and folder names as signals, not proof. Confirm the stack
through imports, scripts, or configuration.

## Context output

Return only what downstream work needs:

```yaml
project:
  name: detected-or-configured
  locale: configured-or-user-language
  layout: single|monorepo|multi-package
apps:
  <id>:
    root: existing/path
    manifest: existing/path
    source_dirs: [existing/path]
    test_dirs: [existing/path]
docs:
  requirements: existing/path-or-null
  readmes: [existing/path]
  diagrams: existing/path-or-null
commands:
  install: verified-command-or-null
  lint: verified-command-or-null
  test: verified-command-or-null
  build: verified-command-or-null
outputs:
  audits: configured-or-.github/audits/results
  cards: configured-or-.github/plans/cards
  implementations: configured-or-.github/plans/implementations
management:
  backend: github|jira|azure-devops|linear|gitlab|none
  # additional fields depending on backend (url, project_key, org, team)
uncertainties:
  - item requiring confirmation
```

## Persisting to `project.yml` (Configure mode)

Map the discovered context to the contract, keeping only verified entries:

- `name`, `locale`, `layout`
- `apps.<id>`: `root`, `manifest`, `source_dirs`, optional `orm`
- `docs`: `requirements`, `*_readme`, `diagrams`, `historical_audits` (only when found)
- `outputs`: keep defaults unless the repo already uses other paths
- `stack_hints`: only stacks confirmed via imports/scripts/config
- `conventions`: requirement/finding prefixes if the repo already uses them
- `management`: only when you have evidence of the project management tool (Jira/Azure/Linear/GitLab/GitHub). Include `management.backend` and minimal required fields; otherwise omit it.
- `audits.overlay`: only if a domain overlay exists
- `ci`: run `npm run hyperion:pipeline-detect` mentally or via terminal — persist `provider`, `policy: detect`, `stack`, `existing` (product CI paths), and `hyperion` flags. **Never** set policy to overwrite existing product CI.

Example `ci` block (adjust from detection):

```yaml
ci:
  provider: github-actions
  policy: detect
  stack: node-npm
  existing:
    - ".github/workflows/deploy.yml"
  hyperion:
    cards_sync: true
    kit_validation: false
    security_scan: true
    product_ci: auto
```

Then: validate against `project.schema.json`, show the user the file (or a diff if
one already exists), and confirm before saving.

## Rules

- Never invent paths, modules, architecture, commands, or deployment targets.
- Prefer existing project conventions over generic best practices.
- Missing dimensions are `null` / `N/A`, not failures.
- Ask only when an uncertainty materially changes the task.
- Match the configured locale; otherwise match the user's language.
- Do not expose secret values while inspecting configuration.
