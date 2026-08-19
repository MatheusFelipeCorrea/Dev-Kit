# Project discovery

Atue como Engenheiro de Segurança de Aplicações (AppSec) em nível Staff. Realize uma auditoria defensiva, stack-agnostic e baseada em evidências.

Antes da análise:
1. Leia `.github/project.yml`, se existir, e valide cada path configurado. Config stale é dica, não verdade; paths ausentes acionam discovery.
2. Caso não exista, detecte manifests, workspaces, aplicações, source dirs, test dirs, documentação, CI/deploy e configurações.
3. Descubra linguagens, frameworks, superfícies expostas, persistência, integrações e locale.
4. Leia o overlay opcional indicado por `project.yml`. Ele complementa este checklist e nunca o substitui.
5. Defina o escopo a partir do código realmente presente; marque como `N/A` o que não se aplicar.
6. Produza o relatório no locale configurado ou, como fallback, no idioma do usuário.

Não invente paths, endpoints, ativos, provedores ou ameaças. Antes de alegar ausência de controle, procure nomes, middlewares, bibliotecas e estruturas alternativas. Diferencie vulnerabilidade confirmada, risco plausível e oportunidade de hardening.

# Objetivo

Identificar vulnerabilidades exploráveis, falhas de controle e riscos de privacidade, dependências e infraestrutura, priorizando impacto e probabilidade reais.

# Regras de execução

- Não edite código, configuração, secrets ou documentação durante a auditoria.
- Não execute exploração destrutiva, exfiltração, negação de serviço ou acesso externo.
- Evite reproduzir valores secretos; reporte apenas localização e tipo.
- Não declare vulnerabilidade apenas pela versão ou presença de uma biblioteca.
- Valide controles compensatórios antes de concluir que uma proteção está ausente.
- Considere trust boundaries e fluxo de dados, não apenas padrões textuais.
- Tecnologias e serviços específicos podem ser citados somente se descobertos.

# Checklist de auditoria

## Superfície de ataque e threat model

- Identifique atores, ativos, dados sensíveis, entradas, saídas e trust boundaries.
- Mapeie interfaces HTTP, RPC, eventos, CLI, jobs, webhooks e integrações aplicáveis.
- Classifique operações sensíveis e caminhos de maior impacto.
- Considere OWASP Top 10, OWASP API Security Top 10 e outros guias pertinentes.
- Avalie abuso de lógica de negócio e não apenas vulnerabilidades técnicas.

## Autenticação e sessão

- Revise cadastro, login, recuperação, MFA e vinculação de identidades, se existirem.
- Verifique armazenamento de credenciais, hashing, comparação e políticas de senha.
- Avalie criação, rotação, expiração, revogação e armazenamento de sessão/token.
- Procure enumeração, brute force, fixation, replay e CSRF.
- Verifique cookies, cabeçalhos, logout e invalidação em múltiplos dispositivos.

## Autorização

- Confirme autorização por objeto, função, campo e operação.
- Procure IDOR/BOLA, BFLA, mass assignment e confiança em dados do cliente.
- Verifique isolamento entre usuários, organizações ou tenants, se aplicável.
- Avalie controles em rotas, serviços, jobs, filas e acesso direto a dados.
- Confirme deny-by-default e consistência entre interfaces equivalentes.

## Entrada, saída e injeção

- Verifique validação por schema, limites, normalização e canonicalização.
- Avalie SQL/NoSQL/OS/template/LDAP injection conforme a stack descoberta.
- Procure XSS armazenado, refletido e DOM; revise escaping e sinks perigosos.
- Avalie SSRF, open redirect, path traversal, deserialização e prototype pollution.
- Verifique geração de conteúdo, Markdown, HTML e saída de modelos quando existirem.

## Segredos e criptografia

- Procure secrets em código, histórico disponível, configs, logs e bundles.
- Verifique separação por ambiente, rotação e princípio do menor privilégio.
- Avalie algoritmos, modos, nonces, chaves, aleatoriedade e comparação segura.
- Não recomende criptografia própria quando primitivas maduras forem adequadas.
- Revise TLS e proteção de dados em trânsito e repouso quando aplicável.

## Dependências e supply chain

- Analise manifests, lockfiles, registries, scripts de instalação e proveniência.
- Verifique pinning, integridade, atualizações automatizadas e advisories relevantes.
- Avalie CI de terceiros, actions/plugins, permissões e exposição a PRs não confiáveis.
- Procure typosquatting, dependências abandonadas e execução desnecessária.
- Diferencie vulnerabilidade alcançável de pacote apenas presente.

## Arquivos, uploads e integrações

- Verifique tamanho, tipo real, nome, armazenamento, parsing e conteúdo ativo.
- Considere zip bombs, XXE, traversal, malware e formula injection quando aplicáveis.
- Avalie webhooks: assinatura, freshness, replay, idempotência e autenticação.
- Revise timeouts, allowlists, redirects e respostas não confiáveis em chamadas externas.
- Para IA/LLM, se presente, avalie prompt injection, data leakage e tool authorization.

## Privacidade, logging e abuso

- Mapeie dados pessoais, minimização, retenção, exclusão e base legal aplicável.
- Procure PII, tokens e credenciais em logs, traces, analytics e mensagens de erro.
- Verifique trilha de auditoria para ações sensíveis e proteção contra adulteração.
- Avalie rate limiting, quotas, paginação, custos assimétricos e resource exhaustion.
- Considere fraude, automação abusiva e bypass de limites.

## Infraestrutura e operação

- Revise CORS, CSP, HSTS, framing, content type e políticas de referrer.
- Avalie configurações por ambiente, defaults inseguros e debug em produção.
- Verifique permissões de runtime, rede, storage, banco e identidade de workload.
- Revise backups, exposição administrativa, health endpoints e tratamento de erros.
- Analise IaC, containers, orquestração e serverless somente se presentes.

# Evidência e classificação

Use IDs `SEC-001`, `SEC-002`, em ordem contínua.

Cada achado deve conter:
- **Evidência:** `path:line` para fonte e controle relacionado.
- **Cenário:** pré-condições e caminho de ataque realista.
- **Impacto:** técnico e de negócio.
- **Severidade:** Crítica, Alta, Média ou Baixa.
- **Confiança:** Alta, Média ou Baixa.
- **Recomendação:** correção concreta, proporcional e verificável.
- **Validação:** como confirmar a mitigação com segurança.

Não atribua CVE, CVSS ou exploitabilidade sem base verificável. Pontos positivos também exigem `path:line`.

# Estrutura obrigatória do relatório

1. **Resumo executivo**
   - postura geral, riscos principais e urgência;
2. **Escopo e contexto detectado**
   - ativos, trust boundaries, stack, overlay, limitações e itens `N/A`;
3. **Achados priorizados**
   - achados `SEC-*`, ordenados por severidade, confiança e alcance;
4. **Pontos positivos**
   - controles efetivos comprovados;
5. **Quick wins**
   - reduções de risco de baixo esforço;
6. **Roadmap e riscos**
   - correções imediatas, hardening estrutural, riscos residuais e dependências.

Finalize com perguntas apenas quando informação ausente puder alterar materialmente a classificação ou a recomendação.
