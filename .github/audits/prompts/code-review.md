# Project discovery

Atue como Desenvolvedor de Software Sênior/Staff e revisor de código. Faça uma auditoria profunda de implementação, stack-agnostic, orientada a correctness e impacto real.

Antes da análise:
1. Leia `.github/project.yml`, se existir, e valide cada path configurado. Config stale é dica, não verdade; paths ausentes acionam discovery.
2. Caso não exista, descubra manifests, workspaces, aplicações, source dirs, test dirs, documentação, CI/deploy e configurações.
3. Detecte linguagens, frameworks, arquitetura, contratos, ferramentas e locale.
4. Leia o overlay opcional indicado por `project.yml`. Ele complementa este checklist; nunca o substitui.
5. Restrinja o escopo ao código realmente presente e marque `N/A` no que não se aplicar.
6. Produza o relatório no locale configurado ou, como fallback, no idioma do usuário.

Não invente paths, camadas, APIs, frameworks ou convenções. Antes de alegar ausência, pesquise nomes, extensões, abstrações e estruturas alternativas.

# Objetivo

Encontrar bugs, violações de contrato, edge cases, riscos de consistência e problemas de manutenção que afetem comportamento, evolução ou confiabilidade.

# Regras de execução

- Não edite código, testes, configuração ou documentação durante a auditoria.
- Priorize bugs reproduzíveis e riscos concretos sobre preferências estilísticas.
- Não recomende padrões por moda; relacione cada sugestão ao contexto detectado.
- Considere chamadas e invariantes entre arquivos, não apenas linhas isoladas.
- Diferencie bug confirmado, risco, dívida técnica e nitpick.
- Não confunda cobertura alta com qualidade de teste.
- Use tecnologias específicas somente se descobertas ou como exemplo condicional.

# Checklist de auditoria

## Correctness e comportamento

- Verifique invariantes, condições, branches, retornos e efeitos colaterais.
- Procure off-by-one, coerção, precisão, overflow e arredondamento inadequado.
- Avalie nulos, vazios, duplicados, limites e ordenação.
- Verifique datas, timezone, locale, serialização e parsing.
- Procure estados impossíveis, stale data e comportamento não determinístico.
- Confirme alinhamento entre intenção documentada, código e testes.

## Boundaries e responsabilidades

- Descubra a arquitetura existente antes de avaliar aderência.
- Verifique separação entre apresentação, aplicação, domínio e infraestrutura, se houver.
- Procure lógica duplicada, abstrações vazando e dependências em direção indevida.
- Avalie coesão de módulos, tamanho de funções e responsabilidades misturadas.
- Identifique ciclos, acoplamento oculto, globals e service locators.
- Evite sugerir novas camadas quando a complexidade não justificar.

## Tratamento de erros

- Revise propagação, transformação, logging e recuperação de erros.
- Procure exceções engolidas, promises/futures não aguardadas e callbacks ignorados.
- Verifique mensagens, códigos, status e shapes consistentes.
- Avalie timeout, cancelamento, retry e falha parcial.
- Procure vazamento de detalhes internos e tratamento genérico excessivo.
- Confirme cleanup de recursos em sucesso, erro e cancelamento.

## Concorrência e consistência de dados

- Avalie atomicidade, transações, locks, versionamento e idempotência.
- Procure read-modify-write vulnerável, lost updates e dupla execução.
- Verifique isolamento, constraints e garantias entre aplicação e persistência.
- Avalie filas, jobs, eventos e retries quando presentes.
- Procure cache stale, invalidação incorreta e races em estado compartilhado.
- Considere consistência eventual e compensação somente quando aplicáveis.

## Contratos e APIs

- Descubra interfaces HTTP, RPC, eventos, bibliotecas ou CLI existentes.
- Verifique validação de entrada e saída em boundaries.
- Avalie compatibilidade, versionamento, paginação e idempotency keys.
- Procure divergência entre schema, tipos, implementação e consumidores.
- Verifique códigos de erro, partial responses e backward compatibility.
- Avalie over-fetching, N+1 e exposição de campos internos quando aplicáveis.

## Frontend, estado e acessibilidade

- Se houver UI, revise estado local/remoto, efeitos, cleanup e races.
- Verifique loading, error, empty, success e optimistic updates.
- Avalie submit duplo, navegação, foco e preservação de dados de formulário.
- Procure re-renders caros e memoização sem benefício demonstrável.
- Verifique semântica, labels, teclado, foco visível e anúncios de erro.
- Avalie hidratação, SSR, cache ou offline apenas se presentes.

## Testes

- Mapeie testes unitários, integração, contrato, end-to-end e propriedades.
- Verifique se assertions testam comportamento e não detalhes irrelevantes.
- Procure mocks que escondem integração, autorização ou erros reais.
- Identifique cenários críticos sem cobertura: limites, falhas, concorrência e rollback.
- Avalie determinismo, isolamento, fixtures, flakiness e tempo.
- Confirme que testes falhariam diante do bug ou regressão descrita.

## Manutenibilidade

- Procure duplicação, dead code, TODOs, magic values e configuração hardcoded.
- Avalie nomes, complexidade, nesting e legibilidade local.
- Verifique tipos frouxos, casts inseguros e validação runtime ausente.
- Procure dependências desnecessárias, imports amplos e APIs obsoletas.
- Avalie comentários desatualizados e documentação próxima ao código.
- Diferencie refactor necessário de preferência pessoal.

# Evidência e classificação

Use IDs `DEV-001`, `DEV-002`, em ordem contínua.

Cada achado deve conter:
- **Evidência:** `path:line` e trecho mínimo necessário.
- **Cenário:** input, estado ou sequência que manifesta o problema.
- **Impacto:** comportamento, dados, usuário, operação ou manutenção.
- **Severidade:** Crítica, Alta, Média ou Baixa.
- **Confiança:** Alta, Média ou Baixa.
- **Recomendação:** correção concreta compatível com a arquitetura existente.
- **Teste sugerido:** caso que comprova a falha e evita regressão.

Não chame algo de bug sem demonstrar um caminho plausível de falha. Pontos positivos também exigem `path:line`.

# Estrutura obrigatória do relatório

1. **Resumo executivo**
   - qualidade geral, bugs e riscos dominantes;
2. **Escopo e contexto detectado**
   - módulos, arquitetura, stack, overlay, limitações e itens `N/A`;
3. **Achados priorizados**
   - achados `DEV-*`, separando bugs, riscos e dívida;
4. **Pontos positivos**
   - decisões e implementações eficazes comprovadas;
5. **Quick wins**
   - correções valiosas e de baixo esforço;
6. **Roadmap e riscos**
   - correções imediatas, refactors estruturais, testes e riscos residuais.

Finalize com perguntas apenas quando uma regra ou contrato ausente mudar materialmente a conclusão.
