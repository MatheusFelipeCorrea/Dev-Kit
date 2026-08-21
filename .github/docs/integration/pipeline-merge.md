# Merging Hyperion into an existing CI pipeline

Use when `project.yml` → `ci.policy: merge` or when the repo already has mature CI and you only need Hyperion jobs.

Hyperion **never** overwrites your product `ci.yml`, `deploy.yml`, `.gitlab-ci.yml`, or `azure-pipelines.yml` when policy is `detect` or `merge`.

**English:** [pipeline-merge-en.md](./pipeline-merge-en.md)

---

## What Hyperion adds (safe to copy)

### GitHub Actions (`hyperion-` prefix)

| Workflow | When to add |
|----------|-------------|
| `hyperion-sync-cards.yml` | You use `.github/cards/` sync |
| `hyperion-security.yml` | Weekly audit + secret scan (optional) |
| `hyperion-validate.yml` | You maintain the Hyperion kit itself |
| `hyperion-product-ci.yml` | **Only** if you have zero product CI |

### Native includes (GitLab / Azure)

| File written by apply | When |
|-----------------------|------|
| `.gitlab/hyperion-ci.yml` | GitLab CI detected |
| `hyperion-azure-pipelines.yml` | Azure Pipelines detected |

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

---

## GitLab CI — include template

When GitLab CI is detected, apply writes `.gitlab/hyperion-ci.yml` (from `scripts/hyperion/templates/ci/gitlab-hyperion.yml`).

Add to your existing `.gitlab-ci.yml`:

```yaml
include:
  - local: .gitlab/hyperion-ci.yml
```

```yaml
# project.yml
ci:
  provider: gitlab-ci
  policy: merge
  hyperion:
    cards_sync: true
    kit_validation: false
    security_scan: false
```

---

## Azure Pipelines — job template

When Azure Pipelines is detected, apply writes `hyperion-azure-pipelines.yml` at the repo root (from `scripts/hyperion/templates/ci/azure-pipelines-hyperion.yml`).

Reference from `azure-pipelines.yml`:

```yaml
stages:
  - stage: Hyperion
    displayName: Hyperion kit
    jobs:
      - template: hyperion-azure-pipelines.yml
        parameters:
          runValidate: true
          runCards: true
          runSecurity: false
```

```yaml
# project.yml
ci:
  provider: azure-pipelines
  policy: merge
  hyperion:
    cards_sync: true
    kit_validation: false
    security_scan: false
```

---

## Policy reference

| `ci.policy` | Behavior |
|-------------|----------|
| `detect` | Add Hyperion GitHub workflows and/or GitLab/Azure include files; skip product CI generation if any exists |
| `hyperion-only` | Generate full Hyperion set including product CI when absent (GitHub Actions) |
| `merge` | Write include snippets for GitLab/Azure; never overwrite product CI |
| `skip` | No Hyperion CI files |

Skill: `pipeline-architect` (`/pipeline`) · Scripts: `hyperion:pipeline-detect`, `hyperion:pipeline-plan`, `hyperion:pipeline-apply`
