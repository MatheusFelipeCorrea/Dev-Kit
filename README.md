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
- **[Complete guide](./.github/docs/onboarding/guide-complete-en.md)**
- **[5-minute setup](./.github/docs/onboarding/setup-quickstart-en.md)**
- **[Getting started](./GETTING-STARTED.md)**

Skill names and paths use English identifiers. User guides available in **PT-BR and EN**.

</details>

---

## ☀️ Quickstart em 3 passos

| # | Passo | Ação |
|---|-------|------|
| 1️⃣ | **Copiar** | Copie `.github/` + `scripts/` + `package.json` para seu repo |
| 2️⃣ | **Configurar** | Repo novo: **`/setup`** · Repo existente: **`/migrate`** |
| 3️⃣ | **Usar** | **`/refine`** → **`/implement`** → **`/execute`** |

📖 Jornada completa passo a passo: **[GETTING-STARTED.md](./GETTING-STARTED.md)**

![Jornada Hyperion](./.github/docs/assets/hyperion-journey-full.png)

---

## 🔷 O que está incluído

| Componente | Quantidade | Descrição |
|------------|------------|-----------|
| 🤖 **Agentes** | 8 | migration, spec-review, implementation-plan, executor, pr-reviewer, audit-runner, release, mentoring |
| ✨ **Skills** | 30 | planning · setup · quality · docs |
| 🔄 **Cards Sync** | 5 backends | GitHub (completo) · Jira · Azure · Linear · GitLab |
| 🔍 **Auditorias** | 6 dimensões | Segurança, arquitetura, DevOps, code review, PO, UX |

Detalhes completos: **[guia completo](./.github/docs/onboarding/guia-completo.md)**

---

## 📚 Qual doc ler?

| Objetivo | Documento |
|----------|-----------|
| 🚀 **Primeira vez** | [GETTING-STARTED.md](./GETTING-STARTED.md) → [trilha](./.github/docs/onboarding/trilha-de-aprendizado.md) |
| 🔧 **Repo existente** | [adaptar-ao-repo.md](./.github/docs/onboarding/adaptar-ao-repo.md) → `/migrate` |
| 📘 **Guia completo** | [guia-completo.md](./.github/docs/onboarding/guia-completo.md) |
| 🗺️ **Fluxo SDLC** | [fluxo-completo.md](./.github/docs/meta/fluxo-completo.md) |
| 💬 **Comandos** | [comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md) |
| 📁 **Onde ficam outputs** | [onde-ficam-os-outputs.md](./.github/docs/meta/onde-ficam-os-outputs.md) |
| 🗺️ **Índice** | [docs/README.md](./.github/docs/README.md) |
| 🇺🇸 **English** | [learning-path-en.md](./.github/docs/onboarding/learning-path-en.md) |

![Mapa de outputs](./.github/docs/assets/hyperion-outputs-map.png)

---

## 💬 Comandos essenciais

Fale com seu agente — **sem terminal**:

| Comando | O que faz |
|---------|-----------|
| **`/setup`** | Setup completo guiado |
| **`/sync`** | Valida e sincroniza cards |
| **`/doctor`** | Verifica saúde do kit |
| **`/audit`** | Auditoria completa (6 dimensões) |
| **`/refine`** | Refina ideia em cards |
| **`/implement`** | Plano de implementação |
| **`/execute`** | Executa fase aprovada (+ testes) |
| **`/migrate`** | Adaptar Hyperion a repo existente |
| **`/pr-review`** | Revisar PR aberto |
| **`/deps`** | Auditoria de dependências |
| **`/spec-review`** | Gate de spec antes de codar |
| **`/audit-run`** | Auditoria orquestrada (6 dimensões) |
| **`/release`** | Changelog, versão e tag |
| **`/diagram`** | Pacote completo de diagramas UML (11 tipos) |

Referência completa: **[comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md)**

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
