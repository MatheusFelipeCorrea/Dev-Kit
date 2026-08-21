# Merging Hyperion into an existing CI pipeline (EN)

**Português:** [pipeline-merge.md](./pipeline-merge.md)

Hyperion never overwrites your product CI (`.gitlab-ci.yml`, `azure-pipelines.yml`, or GitHub `ci.yml`) when `ci.policy` is `detect` or `merge`.

## Install

```bash
npm run hyperion:pipeline-plan
npm run hyperion:pipeline-apply -- --yes
```

| Detected provider | File written |
|-------------------|--------------|
| GitHub Actions | `.github/workflows/hyperion-*.yml` |
| GitLab CI | `.gitlab/hyperion-ci.yml` (include from `.gitlab-ci.yml`) |
| Azure Pipelines | `hyperion-azure-pipelines.yml` (template reference) |

## project.yml

```yaml
ci:
  provider: gitlab-ci   # or azure-pipelines | github-actions
  policy: merge
  hyperion:
    cards_sync: true
    kit_validation: false
    security_scan: false
```

Full snippets: [pipeline-merge.md](./pipeline-merge.md)
