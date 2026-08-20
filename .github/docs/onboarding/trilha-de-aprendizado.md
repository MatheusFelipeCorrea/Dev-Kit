# Trilha de aprendizado Hyperion

Ordem recomendada para **curva de aprendizado suave** — do zero ao uso diário em ~1–2 horas.

**English:** [learning-path-en.md](./learning-path-en.md)

---

## Mapa rápido

```text
Nível 1 (15 min)   GETTING-STARTED.md
Nível 2 (20 min)   setup-quickstart + /setup ou /migrate
Nível 3 (15 min)   adaptar-ao-repo.md  ← project.yml do SEU repo
Nível 4 (20 min)   fluxo-completo.md     ← SDLC do card ao release
Nível 5 (referência) comandos-rapidos.md + guia-completo.md
Nível 6 (quando precisar) integration/, quality/, troubleshooting/
```

---

## Nível 1 — Primeiro contato (15 min)

| Leia | Objetivo |
|------|----------|
| [GETTING-STARTED.md](../../../GETTING-STARTED.md) | Copiar kit, primeiro comando, visão geral |

**Faça:** copie o kit → peça **`/setup`** (repo novo) ou **`/migrate`** (repo existente).

---

## Nível 2 — Configuração (20 min)

| Leia | Objetivo |
|------|----------|
| [setup-quickstart.md](./setup-quickstart.md) | Bootstrap em 5 minutos |
| [github-cli-setup.md](../integration/github-cli-setup.md) | Só se usar GitHub Projects |

**Faça:** `gh auth login` → **`/sync`** com um card de teste.

---

## Nível 3 — Adaptar ao seu repositório (15 min)

| Leia | Objetivo |
|------|----------|
| [adaptar-ao-repo.md](./adaptar-ao-repo.md) | `project.yml`: commands, memory, backends |

**Faça:** `npm run hyperion:repo-detect` → confira bloco `commands:` no `project.yml`.

> O Hyperion **não assume** npm — agents leem `commands.test`, `commands.lint`, etc. do **seu** contrato.

---

## Nível 4 — Fluxo de trabalho (20 min)

| Leia | Objetivo |
|------|----------|
| [fluxo-completo.md](../meta/fluxo-completo.md) | Do card ao release, com gates |

**Fluxo mínimo:**

```text
/refine → /spec → /spec-review → /implement → /execute → /pr-review → /release
```

---

## Nível 5 — Referência do dia a dia

| Leia | Quando |
|------|--------|
| [comandos-rapidos.md](../reference/comandos-rapidos.md) | Esqueceu um comando |
| [guia-completo.md](./guia-completo.md) | Quer entender agents/skills em profundidade |
| [skills-output-map.md](../reference/skills-output-map.md) | Onde cada skill grava arquivos |
| [cheatsheet-metodologia.md](../reference/cheatsheet-metodologia.md) | Agent vs skill vs npm |

---

## Nível 6 — Tópicos avançados (sob demanda)

| Tópico | Documento |
|--------|-----------|
| Jira / Linear / Azure / GitLab | [escolher-backend.md](../integration/escolher-backend.md) |
| CI adaptável | [pipeline-merge.md](../integration/pipeline-merge.md) |
| Primeira auditoria | [primeira-auditoria.md](../quality/primeira-auditoria.md) |
| Problemas comuns | [armadilhas-comuns.md](../troubleshooting/armadilhas-comuns.md) |
| Organização de pastas | [organizacao.md](../meta/organizacao.md) |
| Contribuir / manter kit | [CONTRIBUTING.md](../../../CONTRIBUTING.md) · [doc-maintenance-policy.md](../meta/doc-maintenance-policy.md) |

---

## O que NÃO precisa ler agora

| Item | Por quê |
|------|---------|
| Todos os 30 skills de uma vez | [comandos-rapidos](../reference/comandos-rapidos.md) cobre 90% |
| Pares PT+EN completos | Escolha um idioma |
| `audits/prompts/*.md` | A IA lê; você usa `/audit` |
| `scripts/cards-sync/README.md` | Só integradores ou debug de sync |

---

## Artefatos gerados (não versionar)

Relatórios de sessão ficam **fora do git** (pastas com `.gitkeep` apenas):

- `.github/plans/migrations/` — relatório do `/migrate`
- `.github/plans/reviews/` — spec-review, pr-review
- `.github/plans/implementations/` — planos de `/implement`
- `.github/audits/results/` — auditorias

Veja [.gitignore](../../../.gitignore).

---

## Índice central

[docs/README.md](../README.md)
