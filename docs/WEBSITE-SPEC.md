# AUGEO Website: Especificação

## 1. Produto

Landing page institucional e comercial da AUGEO Creative. A primeira versão é uma **SPA** orientada a apresentar a agência, explicar seu modelo de trabalho e receber contatos qualificados.

O site demonstra qualidade pela própria execução, pela clareza do processo e pela entrada comercial. Não deve simular prova social enquanto não houver cases públicos: nada de projetos fictícios, métricas, clientes ou depoimentos.

## 2. Escopo da Primeira Versão

### Incluído

- Header
- Hero
- Processo
- Formulário de entrada
- Footer

### Adiado

- Portfólio e prova social
- Seções institucionais adicionais (`Sobre`, equipe e FAQ)

As áreas de atuação da AUGEO orientam a mensagem e a qualificação do lead, mas não aparecem como uma seção de serviços ou catálogo de módulos.

## 3. Estrutura da Página

| Ordem | Seção | Objetivo |
|---|---|---|
| 1 | Header | Identificar a AUGEO e disponibilizar a entrada comercial. |
| 2 | Hero | Estabelecer posicionamento e conduzir o visitante à entrada. |
| 3 | Processo | Explicar como uma demanda inicial se torna direcionamento e proposta. É o principal bloco informativo da página. |
| 4 | Formulário | Receber contexto inicial e classificar a natureza da demanda. |
| 5 | Footer | Concentrar os canais e links institucionais necessários. |

Fluxo principal: **hero/header → formulário → triagem → contato inicial**.

## 4. Especificação por Seção

### 4.1 Header

- Marca da AUGEO.
- Navegação mínima, definida na implementação de acordo com a extensão final da página.
- Acesso ao mesmo formulário usado pelo CTA principal.

### 4.2 Hero

**Objetivo:** apresentar a agência com impacto, estabelecer padrão de execução e levar à entrada comercial. Não é a área para detalhar serviços, processo ou tecnologia.

**Composição já definida:** divisão entre um campo de conteúdo à esquerda e um campo visual escuro à direita. Essa divisão é uma decisão da hero; não determina o layout das demais seções.

**Componente visual:** o campo direito contém uma grade interativa que se deforma ao hover. Trata-se de assinatura visual, sem obrigação de representar literalmente um serviço ou uma etapa do processo.

**Estados necessários do componente:**

- estado-base, quando não há cursor sobre o campo;
- estado de interação por hover;
- estado estático equivalente para contextos sem hover e para redução de movimento.

O último estado é necessário porque o componente faz parte da hero em dispositivos touch e para usuários que optem por reduzir animações; a compreensão da hero e o CTA não podem depender da deformação acontecer.

**CTA:** leva ao formulário de entrada. O texto será definido no trabalho de copy.

### 4.3 Processo

**Objetivo:** tornar perceptível o valor de entender e priorizar uma demanda antes de definir o escopo. A seção deve orientar a escolha do cliente, não sugerir que ele perde autonomia.

**Informação pública:**

1. **Entrada** — o negócio apresenta seu momento, objetivo e demanda inicial.
2. **Entendimento do cenário** — a AUGEO lê contexto, relações, prioridades e pontos de intervenção.
3. **Direcionamento e proposta** — a AUGEO devolve escopo, etapas e investimento para o cliente decidir se faz sentido seguir.

Calls, briefing interno, handoffs e validações pertencem à operação. Só entram no site se, em uma etapa posterior, tiverem papel claro na decisão comercial.

### 4.4 Formulário de Entrada

**Objetivo:** receber contexto suficiente para uma triagem inicial, tanto de quem chega com demanda definida quanto de quem ainda precisa entender o caminho adequado.

**Campos a definir na implementação:**

- identificação e canal de retorno;
- nome e contexto do negócio;
- objetivo ou problema atual;
- estágio do negócio;
- referências, links ou materiais existentes;
- demanda inicial, selecionável ou descritiva.

**Demandas que devem poder ser indicadas:**

- identidade ou direção visual;
- website;
- aquisição via Meta Ads;
- CRM, automação ou integração;
- necessidade de entender qual caminho faz sentido.

As opções qualificam a conversa. Elas não são pacotes, produtos avulsos ou compromisso de contratação.

**Após o envio:** confirmar recebimento e informar que haverá leitura inicial antes do retorno. Prazo de resposta, orçamento automático ou reunião garantida não devem ser prometidos antes de a operação defini-los.

### 4.5 Footer

- Canais de contato e links institucionais necessários.
- Informações legais aplicáveis ao formulário e ao tratamento de dados, quando definidas.

## 5. Direção Visual

### Princípio

**Estrutura precisa, comportamento instável.** O sistema visual combina grades, vetores, módulos, notações e tipografia com deformação, interferência e formas orgânicas submetidas a regras.

### Decisões confirmadas

- Base cromática preto e branco.
- Laranja-cereja para ação, estado ou ênfase pontual.
- O símbolo de marca está finalizado e não será redesenhado.
- O grid é linguagem de estrutura e interação; não deve virar textura repetida em todas as seções.

### Limites de linguagem

- Não usar tipografia experimental a ponto de prejudicar conteúdo comercial, navegação ou formulário.
- Evitar dashboard SaaS, bento grid genérico e cards padronizados de serviço.
- Evitar 3D, wireframes, moda ou imagens editoriais como decoração genérica de agência.
- Evitar gradientes neon, Memphis corporativo, estética genérica de IA e cinética sem função compositiva.

### Definições pendentes de design

- famílias e regras tipográficas;
- hexadecimal e contraste do laranja-cereja;
- tokens de grid, espaçamento, bordas e superfícies;
- motion fora da hero;
- necessidade e tratamento de assets complementares.

## 6. Conteúdo

A copy final será definida em frente própria. Ela deve explicar a atuação integrada da AUGEO em direção, presença e operação digital sem transformar a página em uma lista de serviços.

Evitar promessas de resultado, retorno rápido, fórmulas, solução total sem contexto e alegações de cases, clientes ou métricas inexistentes.

## 7. Implementação

### Requisitos funcionais

- SPA responsiva.
- Formulário com validação, retorno de sucesso/erro e encaminhamento para a triagem comercial.
- Componente visual da hero com os três estados definidos na seção 4.2.

### Decisões técnicas pendentes

- framework e arquitetura de front-end;
- solução de estilos e componentes;
- hospedagem e domínio;
- recebimento, armazenamento e encaminhamento dos dados do formulário;
- CMS, caso o conteúdo da primeira versão realmente exija edição recorrente;
- analytics, consentimento e tratamento de dados.

## 8. Próximas Decisões

1. Consolidar os estados e o acabamento da hero.
2. Definir sistema visual mínimo: tipografia, cor de ênfase e tokens.
3. Estruturar visualmente a seção de processo.
4. Fechar copy, campos obrigatórios e fluxo operacional do formulário.
5. Definir stack, hospedagem e integração de recebimento antes da publicação.
