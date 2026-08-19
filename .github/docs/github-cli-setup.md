# GitHub CLI (`gh`) — instalação e login

**English:** [github-cli-setup-en.md](./github-cli-setup-en.md)

O Dev-Kit usa o **GitHub CLI** para automatizar quase tudo no backend **GitHub Projects**:

| Sem `gh` | Com `gh auth login` |
|----------|---------------------|
| Você precisa copiar/colar token manualmente | Token detectado automaticamente (`gh auth token`) |
| Sync local não altera Issues/Projects | `npm run cards:init` e `cards:watch` funcionam |
| Auto-discovery de Project limitado | Busca e salva `projectNumber` sozinho |

**Alternativa ao `gh`:** definir `GITHUB_TOKEN` ou `PROJECT_SYNC_TOKEN` no `.env` (veja [`.env.example`](../../.env.example)). O CLI é só o caminho mais simples.

---

## 1. Instalar

### Windows

**Opção A — winget (recomendado)**

```powershell
winget install --id GitHub.cli
```

**Opção B — instalador**

1. Baixe em [https://cli.github.com](https://cli.github.com)
2. Execute o `.msi` e conclua o assistente
3. Feche e reabra o terminal (PowerShell ou CMD)

**Verificar:**

```powershell
gh --version
```

---

### macOS

**Homebrew (recomendado):**

```bash
brew install gh
gh --version
```

**MacPorts:**

```bash
sudo port install gh
```

---

### Linux

**Debian / Ubuntu:**

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update \
  && sudo apt install gh -y
```

**Fedora / RHEL:**

```bash
sudo dnf install gh
```

Documentação oficial (outras distros): [https://github.com/cli/cli#installation](https://github.com/cli/cli#installation)

---

## 2. Fazer login

No terminal, na pasta do seu repositório:

```bash
gh auth login
```

Responda ao assistente:

| Pergunta | Recomendado para Dev-Kit |
|----------|---------------------------|
| GitHub.com ou Enterprise? | **GitHub.com** (ou sua instância Enterprise) |
| Protocolo | **HTTPS** (mais simples no Windows) |
| Autenticar | **Login with a web browser** |
| Escopos | Aceite **repo** (e **project** se pedido) |

O navegador abre → autorize → volte ao terminal.

**Verificar login:**

```bash
gh auth status
gh auth token    # o cards-sync usa isso internamente
```

---

## 3. Permissões necessárias

Para **cards-sync** com GitHub Projects (repo-level):

| Escopo | Para quê |
|--------|----------|
| `repo` | Issues, labels, conteúdo |
| `read:project` / `project` | Ler e atualizar campos do Project |

Se o Project estiver no **perfil do usuário** (não no repositório), crie um **fine-grained PAT** com scope **Projects** e salve como `PROJECT_SYNC_TOKEN` no `.env` ou em GitHub Secrets.

---

## 4. Testar com o Dev-Kit

Pré-requisitos: kit copiado, `git remote` apontando para GitHub, Node 20+.

```bash
# 1. Bootstrap completo — ou peça /setup ao agente
npm run devkit:setup -- --yes

# 2. Modo contínuo (sync ao salvar cards)
npm run cards:watch
```

Se algo falhar:

```bash
npm run cards:doctor
node scripts/cards-sync/doctor.mjs --interactive
```

---

## 5. Problemas comuns

| Sintoma | Causa provável | Solução |
|---------|----------------|---------|
| `'gh' não é reconhecido` | CLI não instalado ou PATH | Reinstale; reinicie o terminal |
| `Token missing` no sync | Sem login | `gh auth login` |
| `Project not found` | Vários Projects no repo | Defina `projectNumber` em `projects-map.json` |
| `GraphQL failed` permission | Token sem scope Projects | PAT com Projects ou Project no repo |
| `Repository: unknown/unknown` | Sem git remote | `git remote add origin git@github.com:OWNER/REPO.git` |

---

## 6. CI (GitHub Actions)

No CI **não** use `gh auth login`. O workflow `.github/workflows/sync-cards.yml` usa `GITHUB_TOKEN` automaticamente.

Local = `gh`. CI = token do Actions.

---

## Próximos passos

- [Índice da documentação](./README.md) — qual doc ler
- [Setup em 5 minutos](./setup-quickstart.md)
- [Escolher backend](./escolher-backend.md)
- [Guia completo](./guia-completo.md)
- [Cards sync README](../../scripts/cards-sync/README.md)
