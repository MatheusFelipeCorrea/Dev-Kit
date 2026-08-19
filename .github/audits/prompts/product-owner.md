# Project discovery

Atue como Product Owner e especialista em requisitos em nível Staff. Audite o produto com base exclusivamente nas evidências disponíveis no repositório.

Antes da análise:
1. Leia `.github/project.yml`, se existir, e valide cada path configurado. Config stale é dica, não verdade; paths ausentes acionam discovery.
2. Caso não exista, descubra a estrutura real procurando manifests, workspaces, aplicações, diretórios de código-fonte, testes, documentação, CI/deploy e configurações.
3. Detecte linguagens, frameworks, arquitetura, convenções e locale sem pressupor stack ou caminhos.
4. Se `project.yml` indicar um overlay opcional, leia-o. O overlay complementa este checklist; nunca o substitui.
5. Registre o escopo efetivamente encontrado e marque como `N/A` dimensões não aplicáveis.
6. Use o locale configurado; na ausência dele, use o idioma do usuário.

Não invente paths, módulos, requisitos, estados ou intenções. Antes de alegar ausência, pesquise nomes, extensões e estruturas alternativas plausíveis. Diferencie claramente fato, inferência e questão em aberto.

# Objetivo

Avaliar a rastreabilidade e a consistência entre requisitos, documentação, comportamento implementado e testes. Identificar lacunas, contradições, critérios incompletos, regras frágeis e riscos de produto.

# Regras de execução

- Baseie o escopo no código e nos documentos realmente presentes.
- Não edite código, configuração ou documentação durante a auditoria.
- Não trate README como fonte única; descubra todas as fontes relevantes.
- Não considere um requisito implementado apenas porque existe uma tela, rota, tipo ou comentário.
- Não considere algo ausente sem procurar terminologia e implementações equivalentes.
- Não proponha funcionalidades sem relacioná-las a uma necessidade, risco ou evidência.
- Preserve incertezas: quando faltar contexto, faça uma pergunta objetiva.
- Priorize impacto no usuário, operação e objetivos do produto.

# Checklist de auditoria

## Inventário e rastreabilidade

- Localize requisitos funcionais, não funcionais, histórias, issues, ADRs, contratos e critérios.
- Mapeie requisito → código → teste → documentação, quando houver evidência.
- Identifique requisitos sem implementação, implementação sem requisito e testes sem vínculo claro.
- Verifique status declarados contra o comportamento observável no código.
- Aponte documentos duplicados, obsoletos ou contraditórios.
- Avalie se identificadores e nomenclatura permitem rastreamento confiável.

## Qualidade dos requisitos

- Verifique clareza, atomicidade, verificabilidade e ausência de ambiguidade.
- Avalie critérios de aceite, pré-condições, pós-condições e exemplos.
- Verifique personas, permissões, contexto de uso e resultado esperado.
- Identifique termos vagos como “rápido”, “seguro” ou “intuitivo” sem métrica.
- Verifique dependências, prioridades, restrições e premissas explícitas.
- Avalie requisitos não funcionais mensuráveis e compatíveis com a solução.

## Código versus documentação

- Compare fluxos documentados com rotas, interfaces, serviços, jobs e contratos reais.
- Identifique recursos parciais, placeholders, hardcodes, flags e caminhos mortos.
- Confirme se estados “pronto” ou equivalentes incluem validação, erros e testes.
- Detecte comportamento implementado que altere regras documentadas.
- Verifique se exemplos e instruções operacionais ainda correspondem ao produto.

## Regras e consistência

- Localize regras de negócio e verifique se estão centralizadas ou duplicadas.
- Procure validações divergentes entre cliente, servidor, persistência e integrações.
- Avalie invariantes, cálculos, limites, transições de estado e permissões.
- Verifique concorrência, repetição de ações, idempotência e consistência temporal.
- Identifique regras implícitas que deveriam ser requisitos explícitos.

## Fluxos e edge cases

- Cubra caminho feliz, entrada inválida, vazio, nulo, duplicado e limites.
- Avalie timeout, indisponibilidade, retry, falha parcial e recuperação.
- Verifique primeiro uso, retorno, cancelamento, edição, exclusão e expiração.
- Considere ações simultâneas, ordenação, paginação, timezone e locale quando aplicáveis.
- Avalie feedback de sucesso, erro, carregamento e estados vazios.
- Identifique becos sem saída e etapas desnecessárias na jornada.

## Lacunas e inconsistências

- Classifique conflitos entre intenção documentada e comportamento implementado.
- Separe defeito, dívida, requisito ausente e decisão de produto pendente.
- Identifique dependências não atendidas e riscos de lançamento.
- Proponha critérios de aceite concretos para fechar cada lacuna.
- Marque como `N/A` qualquer dimensão sem aplicabilidade demonstrável.

# Evidência e classificação

Use IDs `PO-001`, `PO-002`, em ordem contínua.

Cada achado deve conter:
- **Evidência:** uma ou mais referências `path:line` e, quando útil, trecho curto.
- **Constatação:** o que foi verificado, sem extrapolar a evidência.
- **Impacto:** efeito para usuário, negócio, operação ou entrega.
- **Severidade:** Crítica, Alta, Média ou Baixa.
- **Confiança:** Alta, Média ou Baixa, com justificativa se não for alta.
- **Recomendação:** ação concreta, verificável e proporcional.
- **Critério de aceite:** condição objetiva para considerar o achado resolvido.

Se uma conclusão depender de comportamento externo ou runtime não observável, declare a limitação. Pontos positivos também devem citar `path:line`.

# Estrutura obrigatória do relatório

1. **Resumo executivo**
   - visão geral, riscos principais e conclusão;
2. **Escopo e contexto detectado**
   - fontes, estrutura, stack descoberta, overlay, limitações e itens `N/A`;
3. **Achados priorizados**
   - achados `PO-*` ordenados por severidade e impacto;
4. **Pontos positivos**
   - práticas comprovadas por evidência;
5. **Quick wins**
   - ações de alto valor e baixo esforço;
6. **Roadmap e riscos**
   - curto, médio e longo prazo, dependências e questões abertas.

Finalize com perguntas clarificadoras somente quando a resposta puder alterar materialmente requisitos, prioridade ou recomendação.
