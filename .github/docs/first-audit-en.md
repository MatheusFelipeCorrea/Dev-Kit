# First repository audit

Step-by-step guide to run your **first audit** with Dev-Kit.

Estimated time: 10–30 min (depends on repo size and whether you pause between dimensions).

**Português:** [primeira-auditoria.md](./primeira-auditoria.md)

---

## What is an audit here?

Dev-Kit does **not** change code during audits. It **reads the repo**, applies specialized checklists, and writes reports to `.github/audits/results/`.

| Skill | Focus |
|-------|------|
| **full-audit** | Orchestrates all dimensions below |
| **architecture-audit** | Structure, patterns, coupling |
| **security-audit** | OWASP, secrets, auth |
| **devops-audit** | CI/CD, deploy, infra |
| **code-review** | Quality, maintainability |
| **po-audit** | Requirements, product alignment |
| **ux-audit** | UX, accessibility, design system |

---

## Prerequisites

| Item | Required? |
|------|--------------|
| Dev-Kit copied (`.github/`) | Yes |
| `.github/project.yml` | Recommended — ask *"project-discovery in Configure"* |
| `.github/memory/PROJECT.md` | Optional — improves context |
| Domain overlay | Optional — `.github/audits/overlays/your-project.md` |

---

## Fast path (with AI agent)

### 1. Prepare context

Ask:

> "Run **project-discovery** in Context mode (if project.yml is missing)"

Fill `.github/memory/PROJECT.md` with 2–3 paragraphs about the product.

### 2. Trigger full audit

Ask:

> "Run a **full audit** of the repository"

This triggers **full-audit**, which runs the 6 dimensions **one at a time** and pauses for you to approve continuing.

### 3. Where to find reports

```
.github/audits/results/
├── architecture/
├── application-security/
├── devops/
├── code-review/
├── product-owner/
├── ux-design/
└── _summary/          ← consolidated summary (full-audit)
```

### 4. What to do with findings

1. Read the summary in `_summary/full-audit-<date>.md`
2. Prioritize Critical → High
3. Record decisions in `.github/memory/DECISIONS.md` or ADR (*"Generate ADR about X"*)
4. Create cards for fixes (*"Refine these findings into cards"*)

---

## Manual path (without agent)

1. Read `.github/audits/manifest.yml` — lists skills, prompts, output folders
2. For each dimension, read the prompt in `.github/audits/prompts/<name>.md`
3. Ask the AI to follow **one skill at a time** (e.g. *"Security review"* → `security-audit`)
4. Save outputs to `.github/audits/results/<folder>/`

Recommended order (same as full-audit):

1. architecture-audit  
2. security-audit  
3. devops-audit  
4. code-review  
5. po-audit  
6. ux-audit  

---

## Single-dimension audit

| Ask the agent | Skill |
|----------------|-------|
| "Security review" | `security-audit` |
| "Review architecture" | `architecture-audit` |
| "Code review the repo" | `code-review` |
| "DevOps review" | `devops-audit` |
| "Product alignment" | `po-audit` |
| "UX review" | `ux-audit` |

---

## Domain overlay (optional)

If the repo has specific business rules, create:

`.github/audits/overlays/my-project.md`

Reference in `project.yml`:

```yaml
audits:
  overlay: .github/audits/overlays/my-project.md
```

The overlay complements generic prompts — it does not replace them.

---

## FAQ

**Does the audit modify code?**  
No. It only generates reports in `.github/audits/results/`.

**Can I run only one folder?**  
Yes. Ask for a focused audit (e.g. *"Security review only in src/api"*).

**How long does it take?**  
Small repos: ~10 min per dimension. Large repos: use phased mode (full-audit pauses between dimensions).

**Need Node?**  
Not for the audit itself — AI flow + Markdown. Node only if you want to validate cards afterward.

---

## Next steps

- [guide-complete-en.md](./guide-complete-en.md) — kit overview
- [Main README](../../README.md) — all skills table
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — create custom overlays or prompts
