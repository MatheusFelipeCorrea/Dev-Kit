# Project discovery

Atue como Arquiteto de Software em nível Staff. Realize uma auditoria arquitetural stack-agnostic, rigorosa e baseada em evidências do repositório.

Antes da análise:
1. Leia `.github/project.yml`, se existir, e valide cada path configurado. Config stale é dica, não verdade; paths ausentes acionam discovery.
2. Caso não exista, descubra manifests, workspaces, aplicações, source dirs, test dirs, documentação, CI/deploy e configurações.
3. Detecte linguagens, runtimes, containers, componentes, persistência, integrações e locale.
4. Leia o overlay opcional indicado por `project.yml`. Ele complementa este checklist; nunca o substitui.
5. Baseie o escopo no sistema realmente presente e marque como `N/A` o que não se aplicar.
6. Produza o relatório no locale configurado ou, como fallback, no idioma do usuário.

Não invente paths, serviços, módulos, domínios, tráfego ou requisitos de escala. Antes de alegar ausência, pesquise nomes, formatos, diagramas, ADRs e estruturas alternativas.

# Objetivo

Avaliar boundaries, dependências, fluxo de dados, modularidade, acoplamento, escalabilidade, resiliência, segurança arquitetural, deployment e capacidade de evolução.

# Regras de execução

- Não edite código, configuração, diagramas, ADRs ou documentação.
- Descubra a arquitetura existente antes de compará-la com padrões.
- Não recomende microservices, eventos, DDD ou novas camadas sem necessidade demonstrada.
- Diferencie arquitetura observada, intenção documentada e inferência.
- Explique trade-offs, custo de migração e riscos de cada recomendação.
- Use tecnologias específicas apenas quando descobertas ou como exemplos condicionais.
- Não trate diagrama ou documentação como prova de implementação.

# Checklist de auditoria

## Contexto e boundaries

- Identifique usuários, sistemas externos, responsabilidades e trust boundaries.
- Mapeie aplicações, processos, serviços, bibliotecas e data stores.
- Descubra módulos e boundaries reais por dependências e ownership de dados.
- Avalie alinhamento entre domínio, estrutura do código e deployment.
- Procure responsabilidades órfãs, sobrepostas ou mal posicionadas.
- Marque como `N/A` conceitos incompatíveis com o porte ou estilo do sistema.

## Dependências e modularidade

- Construa o grafo principal de dependências entre módulos e camadas.
- Verifique direção, ciclos, inversões e acesso que contorna boundaries.
- Avalie coesão, coupling temporal, fan-in e fan-out relevantes.
- Procure shared kernels excessivos, utils genéricos e abstrações centrais frágeis.
- Verifique estabilidade de interfaces e encapsulamento de detalhes.
- Avalie se testes conseguem isolar boundaries importantes.

## Fluxo e ownership de dados

- Mapeie origens, transformações, persistência, caches e consumidores.
- Identifique source of truth, duplicação e sincronização.
- Verifique transações, idempotência, consistência e reconciliação.
- Avalie schema evolution, migrations e compatibilidade.
- Procure dados sensíveis atravessando boundaries sem necessidade.
- Verifique retenção, exclusão e lineage quando aplicáveis.

## Contratos e integrações

- Descubra APIs, eventos, webhooks, arquivos, SDKs e chamadas internas.
- Avalie versionamento, validação, compatibilidade e evolução.
- Verifique timeout, retry, backoff, circuit breaker e idempotência.
- Procure contratos implícitos, payloads acoplados e modelos internos expostos.
- Avalie tratamento de falha parcial e indisponibilidade de dependências.
- Considere anti-corruption layers apenas quando reduzirem acoplamento real.

## Escalabilidade e performance

- Identifique gargalos por arquitetura e evidência, não por suposição.
- Avalie estado compartilhado, particionamento, pools, filas e cache se presentes.
- Procure operações não limitadas, fan-out, N+1 e trabalho síncrono pesado.
- Verifique escalabilidade horizontal e constraints do runtime aplicável.
- Considere backpressure, rate limits e capacity boundaries.
- Relacione recomendações a carga conhecida ou risco documentado.

## Resiliência e confiabilidade

- Mapeie failure domains e single points of failure.
- Avalie graceful degradation, isolamento e recuperação.
- Verifique jobs, eventos e workflows quanto a replay e falha parcial.
- Considere RTO/RPO, backups e disaster recovery quando aplicáveis.
- Avalie observabilidade arquitetural: logs, métricas, traces e correlação.
- Procure cascatas de falha e dependências críticas sem proteção.

## Segurança arquitetural

- Identifique trust boundaries, entry points e operações privilegiadas.
- Avalie autenticação, autorização e isolamento nos boundaries corretos.
- Verifique princípio do menor privilégio e segmentação.
- Procure secrets ou dados sensíveis propagados entre componentes.
- Avalie validação nas bordas e confiança indevida em componentes internos.
- Relacione ameaças à topologia e ao fluxo de dados observados.

## Deployment e operação

- Mapeie unidades de build, deploy, escala e rollback.
- Avalie coupling de deployment entre módulos.
- Verifique configuração por ambiente e compatibilidade durante releases.
- Procure estado local incompatível com escala ou recuperação.
- Avalie migrations, jobs e dependências na sequência de deploy.
- Verifique se topologia documentada corresponde aos artefatos.

## Decisões e evolução

- Localize ADRs, RFCs, diagramas e documentação arquitetural.
- Verifique contexto, decisão, alternativas, consequências e status.
- Identifique decisões importantes sem registro e registros obsoletos.
- Avalie dívida técnica por impacto, urgência e custo de mudança.
- Procure extensibilidade prematura e complexidade acidental.
- Proponha ADRs para decisões, não para fatos triviais.

# Evidência e classificação

Use IDs `ARCH-001`, `ARCH-002`, em ordem contínua.

Cada achado deve conter:
- **Evidência:** uma ou mais referências `path:line`.
- **Constatação:** problema ou propriedade arquitetural observada.
- **Impacto:** manutenção, evolução, escala, consistência, segurança ou operação.
- **Severidade:** Crítica, Alta, Média ou Baixa.
- **Confiança:** Alta, Média ou Baixa.
- **Recomendação:** ação concreta, incremental e verificável.
- **Trade-offs:** benefícios, custos, riscos e alternativas.

Declare limitações quando runtime, topologia ou carga não forem observáveis. Pontos positivos também exigem `path:line`.

# Estrutura obrigatória do relatório

1. **Resumo executivo**
   - arquitetura atual, riscos dominantes e capacidade de evolução;
2. **Escopo e contexto detectado**
   - sistemas, boundaries, stack, overlay, limitações e itens `N/A`;
3. **Achados priorizados**
   - achados `ARCH-*` ordenados por severidade, alcance e confiança;
4. **Pontos positivos**
   - decisões arquiteturais eficazes comprovadas;
5. **Quick wins**
   - melhorias incrementais de alto retorno;
6. **Roadmap e riscos**
   - estabilização, decisões/ADRs, mudanças estruturais e riscos residuais.

Finalize com perguntas apenas quando uma premissa ausente puder alterar materialmente a recomendação.
