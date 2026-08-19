# Comandos rápidos Dev-Kit

Referência única: **npm** (terminal) e **agente** (sem terminal).  
**English:** [quick-commands-en.md](./quick-commands-en.md)

---

## Preferência: fale com o agente

Se você usa Cursor, Copilot ou Claude Code, **não precisa rodar npm**. Diga:

| Diga isto | O que acontece |
|-----------|----------------|
| **`/setup`** ou *"Configura o Dev-Kit neste repo"* | Setup completo guiado (`project-startup`) |
| **`/doctor`** ou *"Rode o doctor do Dev-Kit"* | Verifica saúde do kit + cards |
| **`/sync`** ou *"Sincroniza os cards"* | Valida e sobe cards pro GitHub |
| **`/discover`** ou *"Descobre esse projeto"* | Mapeia repo, cria/atualiza `project.yml` |
| **`/refine`** ou *"Refina em cards"* | Gera cards estruturados |
| **`/audit`** ou *"Auditoria completa"* | 6 dimensões de auditoria |
| **`/review`** | Code review |
| **`/implement`** | Plano de implementação de um card |
| **`/help`** ou *"Lista comandos Dev-Kit"* | Mostra atalhos |

Slash commands funcionam nativamente no **Claude Code** (`CLAUDE.md`). No **Cursor**, `.cursor/rules/dev-kit.mdc` mapeia os mesmos triggers.

---

## npm — one-liners

Requer Node 20+ na raiz do repo.

```bash
npm run devkit:help              # lista tudo
npm run devkit:doctor            # saúde kit + cards
npm run devkit:setup -- --yes    # bootstrap completo (cards)
npm run devkit:sync              # validate + sync
npm run devkit:sync -- --dry-run # simula sem escrever
```

### Primeira vez (GitHub)

```bash
gh auth login
npm run devkit:setup -- --yes
# ou peça ao agente: /setup
```

### Dia a dia

```bash
npm run devkit:sync              # após editar cards
npm run cards:watch                # sync ao salvar (opcional)
```

---

## Auditorias (só agente)

Auditorias são **read-only** — o agente lê o repo e grava relatórios em `.github/audits/results/`.

| Frase | Skill |
|-------|-------|
| *"Auditoria completa"* | `full-audit` |
| *"Revisão de segurança"* | `security-audit` |
| *"Revisa a arquitetura"* | `architecture-audit` |
| *"Revisão de DevOps"* | `devops-audit` |
| *"Code review"* | `code-review` |
| *"Alinhamento de produto"* | `po-audit` |
| *"Revisão de UX"* | `ux-audit` |

Guia: [primeira-auditoria.md](./primeira-auditoria.md)

---

## O que mantém os comandos atualizados?

| Fonte | Papel |
|-------|-------|
| `package.json` | Scripts npm (`devkit:*`, `cards:*`) |
| `scripts/devkit/help.mjs` | Texto do `devkit:help` |
| `CLAUDE.md` + `.cursor/rules/dev-kit.mdc` | Slash commands e frases para agentes |
| `.github/skills/setup/project-startup/` | Orquestrador setup completo |
| `.github/skills/setup/devkit-ops/` | Agente roda npm por você |
| `.github/audits/manifest.yml` | Tipos de auditoria |

Não há auto-sync entre camadas — ao adicionar script ou skill, atualize `help.mjs` e este doc.

Guia de confusões frequentes: [armadilhas-comuns.md](./armadilhas-comuns.md)

---

## Ver também

- [setup-quickstart.md](./setup-quickstart.md)
- [scripts/cards-sync/README.md](../../scripts/cards-sync/README.md)
- Skills: `.github/skills/setup/project-startup/SKILL.md`, `devkit-ops/SKILL.md`
