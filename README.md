# 🌟 Hyperion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Made for AI](https://img.shields.io/badge/Made%20for-AI%20Agents-blueviolet)
![Runtime](https://img.shields.io/badge/Runtime-Copilot%20%7C%20Cursor%20%7C%20Claude-green)

> 💎 **Hyperion** ilumina seu projeto de cima — kit portátil de agentes e skills de IA para software.  
> Funciona com GitHub Copilot, Cursor, Claude Code ou qualquer assistente que leia Markdown.

<details>
<summary>🇺🇸 English version</summary>

**Hyperion** is a portable, runtime-agnostic AI agents and skills kit. Works with Copilot, Cursor, Claude Code, or any assistant that reads Markdown.

**Full guides (EN):**
- **[Getting started](./GETTING-STARTED.md)** (glossary + 6 commands)
- **[Learning path](./.github/docs/onboarding/learning-path-en.md)**
- **[Skills catalog](./.github/docs/reference/skills-catalog.md)**

Skill names and paths use English identifiers. User guides available in **PT-BR and EN**.

</details>

---

## 🚀 Quickstart em 3 passos

Não precisa saber o que é um agent. Abra o chat da IA **no seu repo** (depois de copiar o kit) e digite os comandos.

| # | Passo | Ação |
|---|-------|------|
| 1️⃣ | **Copiar** | Copie `.github/` + `scripts/` + `package.json` para seu repo |
| 2️⃣ | **Configurar** | Repo novo: **`/setup`** · Repo existente: **`/migrate`** |
| 3️⃣ | **Usar** | **`/refine`** → **`/implement`** → **`/execute`** |

🟢 **Iniciante:** só esses 6 no começo — `/setup` ou `/migrate`, `/doctor`, `/refine`, `/implement`, `/execute`, `/help`.

![Jornada mínima Hyperion](./.github/docs/assets/hyperion-journey-minimal.png)

Jornada completa: **[GETTING-STARTED.md](./GETTING-STARTED.md)** · duas velocidades: [trilha](./.github/docs/onboarding/trilha-de-aprendizado.md)

---

## 🔷 O que está incluído

| Componente | Quantidade | Descrição |
|------------|------------|-----------|
| 🤖 **Agentes** | 8 | migration, spec-review, implementation-plan, executor, pr-reviewer, audit-runner, release, mentoring |
| ✨ **Skills** | 30 | planning · setup · quality · docs |
| 🔄 **Cards Sync** | 5 backends | GitHub (completo) · Jira · Azure · Linear · GitLab |
| 🔍 **Auditorias** | 6 dimensões | Segurança, arquitetura, DevOps, code review, PO, UX |

Detalhes: **[catalogo-skills.md](./.github/docs/reference/catalogo-skills.md)**

---

## 📚 Qual doc ler?

| Objetivo | Documento |
|----------|-----------|
| 🚀 **Primeira vez** | [GETTING-STARTED.md](./GETTING-STARTED.md) → [trilha](./.github/docs/onboarding/trilha-de-aprendizado.md) |
| 🧩 **Qual skill usar** | [catalogo-skills.md](./.github/docs/reference/catalogo-skills.md) |
| 🔧 **Repo existente** | [adaptar-ao-repo.md](./.github/docs/onboarding/adaptar-ao-repo.md) → `/migrate` |
| 📘 **Setup GitHub** | [setup-github.md](./.github/docs/onboarding/setup-github.md) |
| 🗺️ **Fluxo SDLC** | [fluxo-completo.md](./.github/docs/meta/fluxo-completo.md) |
| 💬 **Comandos** | [comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md) |
| 📁 **Onde ficam outputs** | [onde-ficam-os-outputs.md](./.github/docs/meta/onde-ficam-os-outputs.md) |
| 🗺️ **Índice** | [docs/README.md](./.github/docs/README.md) |
| 🇺🇸 **English** | [learning-path-en.md](./.github/docs/onboarding/learning-path-en.md) |

![Mapa de outputs](./.github/docs/assets/hyperion-outputs-map.png)

---

## 💬 Comandos — kit mínimo vs o resto

Fale no **chat** (Cursor / Copilot / Claude). Sem terminal.

**🟢 Primeira semana (6):** `/setup` ou `/migrate` · `/doctor` · `/refine` · `/implement` · `/execute` · `/help`

| Quando precisar | Comando |
|-----------------|---------|
| 🔄 Subir cards pro board | **`/sync`** |
| 📋 Spec antes de codar | **`/spec`** · **`/spec-review`** |
| 👀 Revisar PR | **`/pr-review`** |
| 🔍 Auditoria | **`/audit`** (rápida) ou **`/audit-run`** (com gates) |
| 📦 Dependências / release | **`/deps`** · **`/release`** |
| 📐 Diagramas UML | **`/diagram`** |

Lista completa: **[comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md)**

<details>
<summary>⌨️ npm (CI / power users)</summary>

```bash
npm run hyperion:help              # lista atalhos
npm run hyperion:doctor            # saúde kit + cards
npm run hyperion:setup -- --yes    # bootstrap completo
npm run hyperion:sync              # validate + sync
```

**Mantenedores do kit:**

```bash
npm run hyperion:generate-rules    # após editar .github/commands.yml
npm run hyperion:check-rules     # verifica drift (mesmo check do CI)
npm run docs:check               # links markdown
npm run skills:validate          # valida 30 skills
npm run hyperion:skills-eval     # eval estrutural de skills críticas
npm run hyperion:repo-detect     # detecta commands para project.yml
npm run cards:test               # testes cards-sync
npm test                         # hyperion + cards tests
```

Pré-requisito GitHub: [`gh auth login`](./.github/docs/integration/github-cli-setup.md)

</details>

---

## 🌌 Compatibilidade

| Runtime | Config |
|---------|--------|
| **Cursor** | `.cursor/rules/hyperion.mdc` |
| **Claude Code** | `CLAUDE.md` |
| **GitHub Copilot** | `.github/instructions/copilot-instructions.md` |

---

## 🏆 Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para contribuir com skills, prompts ou melhorias.

---

## ⚪ Licença

[MIT](LICENSE)
