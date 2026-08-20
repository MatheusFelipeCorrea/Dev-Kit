# 📋 Cheat sheet de metodologia — Hyperion

**English:** [methodology-cheatsheet.md](./methodology-cheatsheet.md)

| Conceito | O que é | Quando usar |
|----------|---------|-------------|
| 🤖 **Agent** | Fluxo longo com gates humanos | `/implement`, `/execute`, `/migrate` |
| ✨ **Skill** | Receita curta (`SKILL.md`) | `/refine`, `/audit`, `/diagram` |
| ⌨️ **Script** | CLI determinístico | CI, sync, doctor |
| 💬 **Comando** | Atalho no chat | `/setup` — ver [comandos-rapidos.md](./comandos-rapidos.md) |
| 🧠 **Memory** | Contexto persistente | Após `/setup` — `.github/memory/` |

**🟢 Fluxo mínimo:** `/setup` ou `/migrate` → `/refine` → `/implement` → `/execute`

**🔵 Referência:** [catalogo-skills.md](./catalogo-skills.md) · [skills-output-map.md](./skills-output-map.md)
