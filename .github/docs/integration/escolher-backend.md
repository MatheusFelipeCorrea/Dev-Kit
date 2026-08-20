# Escolher backend de gestão (GitHub, Jira, etc.)

**English:** [choose-backend-en.md](../integration/choose-backend-en.md)

Use este guia para decidir **onde seus cards vão parar** e qual caminho de setup seguir.

---

## Árvore de decisão

```
Você usa qual ferramenta de gestão?
│
├── GitHub Projects (Issues + board no repo)
│   └── → github-cli-setup.md + /setup (ou hyperion:setup -- --yes)
│
├── Jira
│   └── → integration-bridge (via agente) + setup-quickstart §3.1 Jira
│
├── Azure DevOps
│   └── → integration-bridge + setup-quickstart §3.1 Azure
│
├── Linear
│   └── → integration-bridge + setup-quickstart §3.1 Linear
│
└── GitLab Issues
    └── → integration-bridge + setup-quickstart §3.1 GitLab
```

---

## Comparativo rápido

| Backend | Setup | Sync | Status no board | Reverse |
|---------|-------|------|-----------------|---------|
| **GitHub** | Mais fácil (`gh auth login`) | Completo | Coluna Status ✅ | ✅ |
| **Jira** | API token + env vars | Forward + reverse | Transição workflow ✅ | ✅ |
| **Azure DevOps** | PAT + env vars | Forward | Metadata ⚠️ | ❌ |
| **Linear** | API token | Forward + **status** | `status_map` optional | ❌ |
| **GitLab** | Token + project ID | Forward | Metadata ⚠️ | ❌ |

> **Recomendação:** se você já está no GitHub, use GitHub Projects — é o caminho com mais automação.

---

## GitHub Projects (default)

**Quando escolher:** repo no GitHub, board de projeto no mesmo ecossistema.

**Setup:**

1. [github-cli-setup.md](../integration/github-cli-setup.md) — `gh auth login`
2. **`/setup`** ou `npm run hyperion:setup -- --yes`
3. `npm run cards:watch` (opcional, sync ao salvar)

**Peça ao agente:** *"Configura cards sync"* → skill `cards-sync-setup`

---

## Jira

**Quando escolher:** time já usa Jira Cloud/Server como fonte de verdade.

**Setup:**

1. Copie [`.env.example`](../../../.env.example) → `.env`
2. Preencha: `JIRA_URL`, `JIRA_PROJECT_KEY`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
3. Defina `CARDS_SYNC_BACKEND=jira`
4. Em `project.yml`:

```yaml
management:
  backend: jira
  url: https://sua-org.atlassian.net
  project_key: PROJ
```

5. Sync: `CARDS_SYNC_BACKEND=jira npm run cards:sync`

**Peça ao agente:** *"Conecta ao Jira"* → skill `integration-bridge`

**Dica:** mapeie nomes de status PT em `projects-map.json` → `optionMapByLocale`.

---

## Azure DevOps / Linear / GitLab

**Quando escolher:** board já existe nessa ferramenta.

**Setup:** veja [setup-quickstart §3.1](../onboarding/setup-quickstart.md#passo-31--escolher-backend-github--jira--outros) para env vars de cada um.

**Peça ao agente:** *"Conecta ao Azure"* / *"Conecta ao Linear"* / *"Conecta ao GitLab"* → `integration-bridge`

---

## Depois de escolher

| Próximo passo | Documento |
|---------------|-----------|
| Criar cards | Peça *"Refina X em cards"* ou veja [guia-completo §4](../onboarding/guia-completo.md#4-como-funcionam-os-cards) |
| Evoluir cards | *"mova CARD-ID para Done"* — [card-refiner](../../skills/planning/card-refiner/SKILL.md) |
| Auditar repo | [primeira-auditoria.md](../quality/primeira-auditoria.md) |
