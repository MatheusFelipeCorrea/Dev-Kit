# 🚀 Getting Started — Hyperion

Jornada linear: do zero (ou repo legado) ao primeiro release.

**English:** [guide-complete-en.md](./.github/docs/onboarding/guide-complete-en.md) · **Fluxo completo:** [fluxo-completo.md](./.github/docs/meta/fluxo-completo.md)

---

## 💛 Para quem é este guia?

Você nunca usou o Hyperion — ou tem um **repo existente** e quer adaptar o kit sem quebrar nada.

---

## 1️⃣ Copiar o kit

Copie para a **raiz do seu repositório**:

| Pasta / arquivo | Obrigatório? |
|-----------------|--------------|
| `.github/` | ✅ Sim |
| `scripts/` | ✅ Sim |
| `package.json` | ⭐ Recomendado |
| `.env.example` | ⭐ Recomendado |
| `CLAUDE.md` | Se usar Claude Code |
| `.cursor/rules/` | Se usar Cursor |

---

## 2️⃣ Configurar (adaptável ao repo)

### Repo legado (já tem código)

> **`/migrate`** — ou *"Adapta o Hyperion a este repo"*

O agente detecta stack, CI, testes e escreve `project.yml` com bloco `commands:` adaptado.

### Repo novo ou setup completo

> **`/setup`** — ou *"Configura o Hyperion neste repo"*

### Detectar comandos do repo (terminal)

```bash
npm run hyperion:repo-detect
npm run hyperion:repo-detect -- --json
```

Isso sugere `commands.test`, `commands.lint`, etc. para colar em `project.yml`.

### GitHub CLI (sync de cards)

```bash
gh auth login
npm run hyperion:setup -- --yes
```

---

## 3️⃣ Primeiro card

> **`/refine`** → **`/sync`**

Cards em `.github/cards/` — sincronizam com GitHub, Jira, Linear (status no Linear agora mapeado).

---

## 4️⃣ Entrega (plano → código → testes → PR)

| Passo | Comando |
|-------|---------|
| Gate de spec | **`/spec-review`** |
| Plano em fases | **`/implement`** |
| Executar fase (+ testes do repo) | **`/execute`** |
| Revisar PR | **`/pr-review`** |

Testes usam `commands.test` do **seu** `project.yml` — não hardcoded.

---

## 5️⃣ Qualidade e release

| Passo | Comando |
|-------|---------|
| Auditoria orquestrada | **`/audit-run`** |
| Saúde de dependências | **`/deps`** |
| Release | **`/release`** |

---

## ✨ Jornada completa

```text
/migrate ou /setup → /refine → /spec → /spec-review → /implement → /execute
  → /pr-review → /audit-run → /deps → /release
```

![Jornada Hyperion](./.github/docs/assets/hyperion-journey-full.png)

---

## 🔷 Agent vs npm vs CI

| Situação | Use |
|----------|-----|
| Dia a dia com IA | **`/setup`**, **`/sync`**, **`/execute`**, **`/pr-review`** |
| Debug / power users | **npm** — `hyperion:*`, `cards:*` |
| Validação do kit | **CI** — `hyperion-validate.yml` |

---

## ⚠️ Problemas?

| Sintoma | Solução |
|---------|---------|
| Repo legado confuso | **`/migrate`** |
| Testes falham no executor | Edite `commands.test` em `project.yml` |
| Regras Cursor | `npm run hyperion:cursor` |

Mais: [armadilhas-comuns.md](./.github/docs/troubleshooting/armadilhas-comuns.md)

---

## 📚 Próximos passos

| Quer aprender | Leia |
|---------------|------|
| Trilha passo a passo | [trilha-de-aprendizado.md](./.github/docs/onboarding/trilha-de-aprendizado.md) |
| Adaptar ao seu repo | [adaptar-ao-repo.md](./.github/docs/onboarding/adaptar-ao-repo.md) |
| Fluxo SDLC | [fluxo-completo.md](./.github/docs/meta/fluxo-completo.md) |
| Comandos | [comandos-rapidos.md](./.github/docs/reference/comandos-rapidos.md) |
| Índice | [docs/README.md](./.github/docs/README.md) |
