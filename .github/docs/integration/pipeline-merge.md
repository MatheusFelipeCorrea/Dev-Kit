# Merging Hyperion into an existing CI pipeline

Use when `project.yml` → `ci.policy: merge` or when the repo already has mature CI and you only need Hyperion jobs.

Hyperion **never** overwrites your `ci.yml`, `deploy.yml`, GitLab CI, or Azure Pipelines when policy is `detect` (default).

---

## What Hyperion adds (safe to copy)

All kit workflows use the **`hyperion-`** prefix:

| Workflow | When to add |
|----------|-------------|
| `hyperion-sync-cards.yml` | You use `.github/cards/` sync |
| `hyperion-security.yml` | Weekly audit + secret scan (optional) |
| `hyperion-validate.yml` | You maintain the Hyperion kit itself |
| `hyperion-product-ci.yml` | **Only** if you have zero product CI |

Install via:

```bash
npm run hyperion:pipeline-plan
npm run hyperion:pipeline-apply -- --yes
```

---

## GitHub Actions — inject into existing workflow

Add a job to your existing `ci.yml` (example):

```yaml
  hyperion-cards-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: "22"
      - run: node scripts/cards-sync/validate.mjs
      - run: node scripts/cards-sync/sync.mjs --dry-run
```

Or trigger the standalone workflow on `workflow_call` (future enhancement).

---

## GitLab CI snippet

```yaml
hyperion-cards:
  stage: test
  image: node:22
  rules:
    - changes:
        - .github/cards/**/*
  script:
    - node scripts/cards-sync/validate.mjs
    - node scripts/cards-sync/sync.mjs --dry-run
  only:
    - merge_requests
```

Set `ci.provider: gitlab-ci` and `ci.policy: merge` in `project.yml`.

---

## Azure Pipelines snippet

```yaml
- job: HyperionCards
  displayName: Validate Hyperion cards
  pool:
    vmImage: ubuntu-latest
  steps:
    - task: NodeTool@0
      inputs:
        versionSpec: "22.x"
    - script: node scripts/cards-sync/validate.mjs
    - script: node scripts/cards-sync/sync.mjs --dry-run
```

---

## Policy reference

| `ci.policy` | Behavior |
|-------------|----------|
| `detect` | Add `hyperion-*` only; skip product CI generation if any exists |
| `hyperion-only` | Generate full Hyperion set including product CI when absent |
| `merge` | No auto-write; use snippets above |
| `skip` | No Hyperion workflows |

Skill: `pipeline-architect` (`/pipeline`) · Scripts: `hyperion:pipeline-detect`, `hyperion:pipeline-plan`, `hyperion:pipeline-apply`
