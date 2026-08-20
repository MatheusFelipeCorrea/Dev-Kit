# 📚 Trilha de aprendizado Hyperion

**Duas velocidades.** Não leia o kit inteiro — escolha seu nível e siga em ordem.

| Legenda | Significado |
|---------|-------------|
| 🟢 | Iniciante — chat + 6 comandos |
| 🟡 | Intermediário — GitHub, cards, repo |
| 🔵 | Avançado — SDLC completo, referência, contribuição |

**English:** [learning-path-en.md](./learning-path-en.md)

---

## 🎯 Escolha o seu ritmo

| Você | Faça | Ignore no 1º dia |
|------|------|------------------|
| 🟢 **Nunca usou agents** | Níveis 1–2 + catálogo filtrado | README técnico do cards-sync |
| 🟡 **Já usa agents/CI** | Níveis 1 + 3–4 | Glossário longo |
| 🔵 **Lead / mantenedor** | Níveis 1 + 5–6 | — |

**Kit mínimo:** `/setup` ou `/migrate` → `/doctor` → `/refine` → `/implement` → `/execute` → `/help`

![Jornada mínima](../assets/hyperion-journey-minimal.png)

---

## 🟢 Nível 1 — Primeiro contato · ⏱️ ~15 min

[GETTING-STARTED.md](../../../GETTING-STARTED.md) — glossário + 6 comandos.

**Faça agora:** copie o kit → **`/setup`** ou **`/migrate`** → **`/doctor`**.

---

## 🟡 Nível 2 — GitHub · ⏱️ ~15 min

| Doc | Quando |
|-----|--------|
| [setup-github.md](./setup-github.md) | Sync de cards no GitHub |
| [github-cli-setup.md](../integration/github-cli-setup.md) | Só se `gh` faltar |

**Faça agora:** **`/refine`** → **`/sync`**.

💡 Outros backends (Jira, Linear…): [escolher-backend.md](../integration/escolher-backend.md) — não é passo 2.

---

## 🟡 Nível 3 — Seu repo · ⏱️ ~15 min

[adaptar-ao-repo.md](./adaptar-ao-repo.md) — `project.yml`, `commands`, `memory`.

```bash
npm run hyperion:repo-detect   # opcional — sugere commands.test, lint, etc.
```

---

## 🔵 Nível 4 — SDLC · ⏱️ ~20 min

[fluxo-completo.md](../meta/fluxo-completo.md) — fluxo maduro (diagrama completo).

---

## 🔵 Nível 5 — Referência · consulta

| Doc | Para quê |
|-----|----------|
| [catalogo-skills.md](../reference/catalogo-skills.md) | 🧩 **Qual skill usar** (30 skills + agents) |
| [comandos-rapidos.md](../reference/comandos-rapidos.md) | 💬 Slash commands |
| [skills-output-map.md](../reference/skills-output-map.md) | 📁 Onde grava cada output |
| [cheatsheet-metodologia.md](../reference/cheatsheet-metodologia.md) | Agent vs skill vs script |

---

## 🔵 Nível 6 — Sob demanda

`integration/` · `quality/` · [cards-sync README](../../../scripts/cards-sync/README.md) · [CONTRIBUTING.md](../../../CONTRIBUTING.md)

---

➡️ [Índice da documentação](../README.md)
