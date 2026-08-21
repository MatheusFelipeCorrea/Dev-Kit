# ⚙️ Adaptar o Hyperion ao seu repositório

🟡 **Intermediário** — o kit é **genérico**; o arquivo `.github/project.yml` é o **contrato** que liga o Hyperion ao **seu** produto (stack, comandos, backend, memória).

**Repo do kit:** [MatheusFelipeCorrea/Hyperion](https://github.com/MatheusFelipeCorrea/Hyperion) · **English:** [adapt-repo-en.md](./adapt-repo-en.md)

---

## 🎯 Quando usar

| Situação | Comando |
|----------|---------|
| Repo **já existente** com código | **`/migrate`** — agente detecta e escreve `project.yml` |
| Repo novo ou ajuste manual | **`/discover`** ou copie `project.example.yml` |
| Só atualizar comandos de teste | `npm run hyperion:repo-detect` |

---

## Bloco `commands` (adaptável)

Agents (`/execute`, `/pr-review`, `/release`) rodam os **comandos do seu repo**, não hardcode do kit:

```yaml
commands:
  test: npm test          # ou pytest, go test ./..., cargo test
  lint: npm run lint      # opcional
  build: npm run build    # opcional
  audit: npm audit --audit-level=moderate
```

**Detectar automaticamente:**

```bash
npm run hyperion:repo-detect
npm run hyperion:repo-detect -- --json
```

Edite o resultado em `.github/project.yml`. Schema: `project.schema.json`.

---

## Bloco `memory` (opcional)

Persiste decisões entre sessões de IA:

```yaml
memory:
  auto_capture: true
  decisions_file: .github/memory/DECISIONS.md
```

Agents `/implement`, `/execute`, `/audit-run`, `/pr-review`, `/release` podem append via skill `memory-capture`.

---

## Bloco `management` (cards sync)

```yaml
management:
  backend: github   # github | jira | linear | azure-devops | gitlab
  # Linear: team: <team-id>
  # Jira: url, project_key
  status_map:       # opcional — nomes do board externo
    "In Progress": "Started"
```

Guia de backends: [escolher-backend.md](../integration/escolher-backend.md)

---

## Bloco `outputs` (onde gravar artefatos)

```yaml
outputs:
  audits: .github/audits/results
  cards: .github/plans/cards
  implementations: .github/plans/implementations
  diagrams: .github/diagrams
```

Mapa completo: [skills-output-map.md](../reference/skills-output-map.md)

---

## Outputs de sessão

Outputs de `/migrate`, `/implement`, `/audit`, etc. ficam em `.github/plans/` e `.github/audits/results/`. Mapa completo: [skills-output-map.md](../reference/skills-output-map.md).

---

## Checklist pós-adaptação

```bash
npm run hyperion:doctor
npm run hyperion:project-verify
npm run hyperion:pipeline-detect   # CI opcional
# sem Node: ./bin/hyperion doctor && ./bin/hyperion project-verify
```

Peça ao agente: **`/doctor`**. Gates: [definition-of-done.md](../meta/definition-of-done.md).

---

## Próximo passo

[fluxo-completo.md](../meta/fluxo-completo.md) — fluxo SDLC após configuração.

Trilha completa: [trilha-de-aprendizado.md](./trilha-de-aprendizado.md)
