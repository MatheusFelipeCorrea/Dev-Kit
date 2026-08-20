# Adapt Hyperion to your repository

The kit is **generic**; `.github/project.yml` is the **contract** linking Hyperion to **your** product.

**Português:** [adaptar-ao-repo.md](./adaptar-ao-repo.md)

---

## When to use

| Situation | Command |
|-----------|---------|
| **Existing repo** with code | **`/migrate`** |
| New repo or manual tweak | **`/discover`** or copy `project.example.yml` |
| Refresh test commands only | `npm run hyperion:repo-detect` |

---

## `commands` block

Agents use **your repo's commands**:

```yaml
commands:
  test: npm test
  lint: npm run lint
  build: npm run build
  audit: npm audit --audit-level=moderate
```

Detect: `npm run hyperion:repo-detect`

---

## `memory` block (optional)

```yaml
memory:
  auto_capture: true
  decisions_file: .github/memory/DECISIONS.md
```

---

## Generated artifacts (do not commit)

Session outputs under `.github/plans/migrations/`, `reviews/`, `implementations/`, `audits/results/` are gitignored. See [.gitignore](../../../.gitignore).

---

## Next

[full-flow-en.md](../meta/full-flow-en.md) · [learning-path-en.md](./learning-path-en.md)
