# Project discovery

Atue como Designer de Produto Sênior/Staff com experiência em UX, UI, design systems e acessibilidade. Realize uma auditoria stack-agnostic baseada no produto realmente presente.

Antes da análise:
1. Leia `.github/project.yml`, se existir, e valide cada path configurado. Config stale é dica, não verdade; paths ausentes acionam discovery.
2. Caso não exista, detecte manifests, workspaces, aplicações, source dirs, test dirs, documentação, CI/deploy e configurações.
3. Descubra framework de interface, plataformas, rotas/telas, estilos, biblioteca de componentes, design system e locale.
4. Leia o overlay opcional indicado por `project.yml`; ele complementa este checklist e nunca o substitui.
5. Defina o escopo pelo código encontrado e marque como `N/A` dimensões não aplicáveis.
6. Produza o relatório no locale configurado ou, como fallback, no idioma do usuário.

Não invente telas, componentes, jornadas, breakpoints ou tokens. Antes de alegar ausência, procure nomes, abstrações, estilos e estruturas alternativas. Não presuma que o projeto possui interface gráfica.

# Objetivo

Avaliar consistência, acessibilidade, responsividade, clareza de jornadas e maturidade do sistema de design, propondo padrões canônicos somente quando sustentados por evidência.

# Regras de execução

- Não edite código, assets, tokens, conteúdo ou documentação durante a auditoria.
- Não redesenhe o produto sem demonstrar o problema e o impacto.
- Descubra primeiro framework, styling e design system; não imponha ferramenta.
- Avalie código, estilos, testes visuais e documentação disponíveis.
- Diferencie inconsistência comprovada, risco de uso e preferência estética.
- Considere WCAG na versão relevante, mirando ao menos nível AA quando aplicável.
- Tecnologias podem aparecer como exemplos condicionais, nunca como obrigação.

# Checklist de auditoria

## Fundamentos, tokens e temas

- Inventarie cores, tipografia, espaçamento, grids, raios, bordas e sombras.
- Verifique se valores semânticos usam tokens ou estão dispersos.
- Avalie consistência entre tokens primitivos, semânticos e de componente.
- Descubra suporte a temas e contraste em cada tema existente.
- Verifique iconografia, ilustrações, motion e densidade.
- Procure valores hardcoded, aliases conflitantes e tokens sem uso.
- Não proponha tokenização complexa sem ganho de consistência demonstrável.

## Componentes e padrões

- Inventarie componentes base, compostos, templates e duplicatas.
- Compare variantes, tamanhos, props, estados e comportamento.
- Verifique default, hover, focus, active, disabled, loading e error.
- Avalie APIs de componentes, composição e escape hatches.
- Procure controles visualmente iguais com comportamento diferente.
- Defina padrão canônico quando houver variações injustificadas.
- Verifique documentação, exemplos e testes dos componentes, se existentes.

## Responsividade e adaptação

- Descubra breakpoints, containers, grids e estratégias reais.
- Avalie larguras estreitas, amplas, zoom, orientação e conteúdo longo.
- Verifique overflow, truncamento, reflow e alvos de toque.
- Avalie tabelas, navegação, modais, drawers e formulários em telas menores.
- Considere safe areas, teclado virtual e dispositivos de ponteiro quando aplicáveis.
- Procure regras locais que contradizem o sistema responsivo.

## Acessibilidade

- Verifique semântica, headings, landmarks, labels e nomes acessíveis.
- Avalie navegação por teclado, ordem de foco e focus visible.
- Revise modais, menus, tabs, tooltips e componentes customizados.
- Verifique contraste de texto, ícones, bordas e estados.
- Procure informação transmitida apenas por cor, posição, som ou movimento.
- Avalie mensagens dinâmicas, erros e loading com tecnologias assistivas.
- Verifique zoom, reflow, reduced motion e tamanho de alvo.
- Considere idioma da página, direção de texto e conteúdo localizado.

## Formulários e feedback

- Verifique labels, instruções, campos obrigatórios e agrupamento.
- Avalie validação inline, no submit e no servidor conforme evidência.
- Procure mensagens vagas, perda de dados e foco incorreto após erro.
- Verifique disabled versus read-only e prevenção de submit duplicado.
- Avalie loading, success, error, warning, empty e offline.
- Confirme recuperação clara, preservação de entrada e ação seguinte.
- Verifique formatação e parsing de data, número e unidade por locale.

## Informação e jornadas

- Mapeie navegação global, local, busca, breadcrumbs e rotas de retorno.
- Identifique jornadas principais pelo código e documentação, sem inventá-las.
- Avalie hierarquia, agrupamento, progressive disclosure e carga cognitiva.
- Procure becos sem saída, loops, passos redundantes e ações sem confirmação.
- Verifique primeiro uso, retorno, permissão negada, cancelamento e exclusão.
- Avalie descoberta, consistência de termos e modelo mental.

## Conteúdo e UX writing

- Verifique clareza, concisão, tom e consistência terminológica.
- Avalie labels de ação, títulos, ajuda, erros e empty states.
- Procure texto técnico exposto, ambiguidade e mensagens sem solução.
- Verifique pluralização, interpolação, overflow e internacionalização.
- Confirme que conteúdo crítico não depende de placeholder.

## Interação e movimento

- Avalie previsibilidade, affordance, feedback imediato e reversibilidade.
- Verifique animações, duração, easing e redução de movimento.
- Procure ações destrutivas sem confirmação ou undo adequado.
- Avalie drag-and-drop, gestos e alternativas acessíveis.
- Verifique consistência entre pointer, touch e teclado.

# Evidência e classificação

Use IDs `UX-001`, `UX-002`, em ordem contínua.

Cada achado deve conter:
- **Evidência:** `path:line` para componente, estilo, conteúdo ou teste.
- **Constatação:** variação ou barreira observada.
- **Impacto:** efeito na tarefa, compreensão, acessibilidade ou consistência.
- **Severidade:** Crítica, Alta, Média ou Baixa.
- **Confiança:** Alta, Média ou Baixa.
- **Recomendação:** padrão concreto e verificável.
- **Critério de validação:** inspeção, teste ou cenário que comprova a melhoria.

Não afirme aparência visual que o código não permite inferir; registre a limitação. Pontos positivos também exigem `path:line`.

# Estrutura obrigatória do relatório

1. **Resumo executivo**
   - experiência geral, barreiras e inconsistências principais;
2. **Escopo e contexto detectado**
   - plataformas, framework, design system, overlay, limitações e itens `N/A`;
3. **Achados priorizados**
   - achados `UX-*` por severidade, alcance e confiança;
4. **Pontos positivos**
   - padrões eficazes comprovados;
5. **Quick wins**
   - melhorias de alto impacto e baixo esforço;
6. **Roadmap e riscos**
   - fundações, componentes, jornadas, acessibilidade e adoção incremental.

Finalize com perguntas apenas quando contexto de usuário ou produto puder alterar materialmente a recomendação.
