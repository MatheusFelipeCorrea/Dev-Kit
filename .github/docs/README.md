# Hyperion Documentation

Central index. **New here?** Follow the [learning path](./onboarding/trilha-de-aprendizado.md) — do not read everything at once.

**🚀 Start:** [GETTING-STARTED.md](../../GETTING-STARTED.md)

---

## Trilha de aprendizado (recomendada)

| Nível | Documento | Tempo |
|-------|-----------|-------|
| 1 | [GETTING-STARTED.md](../../GETTING-STARTED.md) | ~15 min |
| 2 | [setup-quickstart.md](./onboarding/setup-quickstart.md) · [EN](./onboarding/setup-quickstart-en.md) | ~20 min |
| 3 | [adaptar-ao-repo.md](./onboarding/adaptar-ao-repo.md) · [EN](./onboarding/adapt-repo-en.md) | ~15 min |
| 4 | [fluxo-completo.md](./meta/fluxo-completo.md) · [EN](./meta/full-flow-en.md) | ~20 min |
| 5 | [comandos-rapidos.md](./reference/comandos-rapidos.md) · [guia-completo.md](./onboarding/guia-completo.md) | referência |

Mapa completo: [trilha-de-aprendizado.md](./onboarding/trilha-de-aprendizado.md) · [EN](./onboarding/learning-path-en.md)

---

## Busca rápida por objetivo

| Objetivo | Documento |
|----------|-----------|
| **Repo legado** | [adaptar-ao-repo.md](./onboarding/adaptar-ao-repo.md) → `/migrate` |
| **Comandos** (`/setup`, `/sync`, `/execute`) | [comandos-rapidos.md](./reference/comandos-rapidos.md) · [EN](./reference/quick-commands-en.md) |
| **GitHub CLI** | [github-cli-setup.md](./integration/github-cli-setup.md) · [EN](./integration/github-cli-setup-en.md) |
| **Backend (Jira/Linear/…)** | [escolher-backend.md](./integration/escolher-backend.md) · [EN](./integration/choose-backend-en.md) |
| **CI adaptável** | [pipeline-merge.md](./integration/pipeline-merge.md) |
| **Onde ficam outputs** | [onde-ficam-os-outputs.md](./meta/onde-ficam-os-outputs.md) · [mapa skills](./reference/skills-output-map.md) |
| **Primeira auditoria** | [primeira-auditoria.md](./quality/primeira-auditoria.md) · [EN](./quality/first-audit-en.md) |
| **Problemas** | [armadilhas-comuns.md](./troubleshooting/armadilhas-comuns.md) · [EN](./troubleshooting/common-pitfalls-en.md) |
| **Organização de pastas** | [organizacao.md](./meta/organizacao.md) · [STRUCTURE.md](../STRUCTURE.md) |
| **Contribuir / manter** | [CONTRIBUTING.md](../../CONTRIBUTING.md) · [doc-maintenance-policy.md](./meta/doc-maintenance-policy.md) |
| **Sync técnico** | [scripts/cards-sync/README.md](../../scripts/cards-sync/README.md) |
| **Variáveis de ambiente** | [`.env.example`](../../.env.example) |

---

## Mapa visual

![Mapa da documentação Hyperion](./assets/hyperion-docs-map.png)

---

## Clone limpo vs artefatos gerados

O kit versiona **estrutura e guias**. Relatórios de sessão **não vão pro git**:

| Categoria | Exemplos | No clone? |
|-----------|----------|-----------|
| **Kit (sempre)** | agents, skills, guias, templates | Sim |
| **Config do projeto** | `project.yml`, memory preenchida | Após `/setup` ou `/migrate` |
| **Outputs de sessão** | planos, reviews, migrações, audits | Gitignored — ver [.gitignore](../../.gitignore) |

**Regra:** pastas vazias usam `.gitkeep`; conteúdo gerado fica local ou no board (GitHub/Jira).

---

## Pastas de documentação

| Pasta | Conteúdo |
|-------|----------|
| [onboarding/](./onboarding/) | Primeiros passos, trilha, adaptar repo |
| [reference/](./reference/) | Comandos, outputs, metodologia |
| [integration/](./integration/) | GitHub CLI, backends, pipeline |
| [quality/](./quality/) | Guias de auditoria |
| [troubleshooting/](./troubleshooting/) | Armadilhas comuns |
| [meta/](./meta/) | Organização, fluxo SDLC, manutenção |
