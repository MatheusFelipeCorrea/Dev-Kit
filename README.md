# Hyperion

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-MatheusFelipeCorrea%2FHyperion-181717?logo=github)](https://github.com/MatheusFelipeCorrea/Hyperion)
![Made for AI](https://img.shields.io/badge/Made%20for-AI%20Agents-blueviolet)
![Runtime](https://img.shields.io/badge/Runtime-Copilot%20%7C%20Cursor%20%7C%20Claude-green)

**Hyperion** é um kit portátil de **agentes e skills de IA** para o ciclo de software — do setup ao release. Funciona com Cursor, Claude Code, GitHub Copilot ou qualquer assistente que leia Markdown.

<details>
<summary>🇺🇸 English</summary>

Portable AI agents/skills kit for the software lifecycle. Start at **[GETTING-STARTED.md](./GETTING-STARTED.md)** · **[Learning path (EN)](./.github/docs/onboarding/learning-path-en.md)** · **[Skills catalog](./.github/docs/reference/skills-catalog.md)**.

</details>

---

## Sumário

1. [Quickstart](#-quickstart)
2. [Os 6 comandos da primeira semana](#-os-6-comandos-da-primeira-semana)
3. [O que vem no kit](#-o-que-vem-no-kit)
4. [Documentação](#-documentação) ← comece por aqui se estiver perdido
5. [Compatibilidade](#-compatibilidade)
6. [npm (opcional)](#-npm-opcional)
7. [Contribuir](#-contribuir)
8. [Licença](#-licença)

---

## 🚀 Quickstart

```bash
git clone https://github.com/MatheusFelipeCorrea/Hyperion.git
```

| # | Passo | O que fazer |
|---|--------|-------------|
| 1 | **Obter** | Clone ou baixe o ZIP deste repositório |
| 2 | **Copiar para o seu produto** | Veja a tabela abaixo (não copie tudo às cegas) |
| 3 | **No chat da IA** | Repo novo: **`/setup`** · Já tem código: **`/migrate`** |

### O que copiar (e o que não)

| Copiar | Não copiar / cuidado |
|--------|----------------------|
| `.github/skills/`, `agents/`, `docs/`, `audits/` (prompts + manifest), `commands.yml`, `memory/` (templates), `cards/` (template + `_examples` + config vazio), `diagrams/`, `STRUCTURE.md`, `project.schema.json`, `project.example.yml`, `hyperion-origin.json` | **`.github/project.yml`** deste repo → `cp project.example.yml project.yml` ou deixe `/setup` criar |
| `scripts/` | **`.github/workflows/`** do kit → use **`/pipeline`** no seu repo (senão herda CI de mantenedor) |
| Scripts `hyperion:*` / `cards:*` no **seu** `package.json` (**merge**, não substitua o arquivo) | Trocar o `package.json` do produto pelo do Hyperion |
| `bin/` + `Dockerfile` (sem Node no host) | `projects-map.json` de outro time — `/setup` configura o seu |
| `.cursor/rules/` ou `CLAUDE.md` (conforme a IDE) | `.git/`, `plans/` gerados, resultados de audit |

Depois: abra o **chat no seu repo** e diga `/setup` ou `/migrate`.

![Jornada mínima](./.github/docs/assets/hyperion-journey-minimal.png)

Guia linear: **[GETTING-STARTED.md](./GETTING-STARTED.md)**

---

## 🟢 Os 6 comandos da primeira semana

Digite **no chat** (não no terminal):

| Ordem | Comando | Para quê |
|-------|---------|----------|
| 1 | **`/setup`** ou **`/migrate`** | Liga o kit ao seu repo |
| 2 | **`/doctor`** | Diz o que falta |
| 3 | **`/refine`** | Ideia → cards |
| 4 | **`/implement`** | Plano em fases |
| 5 | **`/execute`** | Código + testes |
| 6 | **`/help`** | Lista o resto |

Quando precisar: **`/sync`** (board) · **`/pr-review`** · **`/audit`** · **`/release`**

---

## 🔷 O que vem no kit

| Peça | Qtd | Função |
|------|-----|--------|
| Agentes | 8 | Fluxos longos com pausa humana (`/migrate`, `/execute`, `/pr-review`, …) |
| Skills | 30 | Receitas curtas (planning, setup, quality, docs) |
| Cards sync | 5 backends | GitHub · Jira · Azure · Linear · GitLab |
| Auditorias | 6 dimensões | Segurança, arquitetura, DevOps, code review, PO, UX |

---

## 📚 Documentação

**Um caminho só.** O resto é consulta.

| Quero… | Abra |
|--------|------|
| **Começar do zero** | [GETTING-STARTED.md](./GETTING-STARTED.md) |
| **Trilha por nível** 🟢🟡🔵 | [trilha-de-aprendizado.md](./.github/docs/onboarding/trilha-de-aprendizado.md) |
| **Lista de comandos** | [comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md) |
| **Qual skill usar** | [catalogo-skills.md](./.github/docs/reference/catalogo-skills.md) |
| **Algo deu errado** | [armadilhas-comuns.md](./.github/docs/troubleshooting/armadilhas-comuns.md) |
| **Índice completo** | [.github/docs/README.md](./.github/docs/README.md) |
| **English** | [learning-path-en.md](./.github/docs/onboarding/learning-path-en.md) |

Mais tarde (não no dia 1): [setup GitHub](./.github/docs/onboarding/setup-github.md) · [adaptar repo](./.github/docs/onboarding/adaptar-ao-repo.md) · [fluxo SDLC](./.github/docs/meta/fluxo-completo.md) · [Node/Docker](./.github/docs/meta/node-and-docker.md) · [Definition of Done](./.github/docs/meta/definition-of-done.md)

---

## 🌌 Compatibilidade

| Runtime | Arquivo |
|---------|---------|
| Cursor | `.cursor/rules/hyperion.mdc` |
| Claude Code | `CLAUDE.md` |
| GitHub Copilot | `.github/instructions/copilot-instructions.md` |

---

## ⌨️ npm (opcional)

Só se você quiser terminal/CI. No dia a dia, o chat basta.

```bash
npm run hyperion:doctor
npm run hyperion:setup -- --yes
npm run hyperion:sync
./bin/hyperion doctor    # Node 20+ ou Docker
```

Sem Node: [node-and-docker.md](./.github/docs/meta/node-and-docker.md) · Auth GitHub: [github-cli-setup.md](./.github/docs/integration/github-cli-setup.md)

---

## 🏆 Contribuir

Quer melhorar o **próprio** Hyperion (skills, scripts, docs)? Veja [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## ⚪ Licença

[MIT](LICENSE)
