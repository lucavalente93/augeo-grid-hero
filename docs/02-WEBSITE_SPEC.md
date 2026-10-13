# AUGEO Website: Especificação

Atualizada em 2026-10-13 a partir da implementação e das decisões vigentes. Esta especificação define a landing completa e distingue seus requisitos do estado publicado. Composição detalhada do hero: [HERO_HANDOFF.md](HERO_HANDOFF.md). Execução e validações: [BACKLOG.md](BACKLOG.md). Propostas e avaliações pendentes: [HERO_DECISIONS_AND_IDEAS.md](HERO_DECISIONS_AND_IDEAS.md).

## 1. Papel do Site

Landing page institucional e comercial da AUGEO Creative. Ela deve:

- apresentar a agência de forma inequívoca;
- demonstrar critério, direção e capacidade de execução pelo próprio website;
- explicar o modelo comercial baseado em entendimento do contexto antes da proposta;
- converter negócios adequados em contatos qualificados.

O site não deve tentar compensar a ausência de cases públicos com projetos fictícios, números, depoimentos ou sinais artificiais de validação social. Até existirem trabalhos publicados, a prova é dada pela qualidade da página, pela clareza do processo e pela precisão da entrada comercial.

## 2. Escopo da Primeira Versão

### Incluído na landing completa

- Header
- Hero
- Processo
- Formulário de entrada e triagem
- Footer visual mobile, integrado à composição do hero

### Fora do escopo nesta versão

- Seção autônoma de serviços ou capacidades
- Portfólio, cases, clientes, métricas e depoimentos
- Seção institucional de “sobre” ou equipe
- FAQ
- Páginas internas, blog e área de cliente

**Estado publicado:** cabeçalho, hero com copy e botão de conversão “Apresentar negócio”, matriz reativa em hover e indicativo desktop. No mobile, o componente inteiro da matriz foi reposicionado como footer visual, abaixo da copy e do CTA. Processo e formulário de entrada ainda estão previstos.

## 3. Arquitetura e Fluxo

| Camada | Função e estado |
|---|---|
| Header | Marca com retorno ao início; implementado. |
| Hero | Posicionamento, assinatura interativa e botão de conversão; implementado. |
| Footer mobile | Matriz e lettering encerram a composição abaixo da copy e do CTA; implementado. |
| Processo | Explicar entendimento, direcionamento e proposta; previsto. |
| Formulário | Receber o contexto do negócio para triagem; previsto em `#entrada`. |

“Apresentar negócio” é a entrada de conversão já presente na composição. A etapa seguinte é conectar seu destino ao formulário real; o código atual usa `href="#entrada"`.

## 4. Hero

### Função

Apresentar o posicionamento da AUGEO, demonstrar direção pela própria composição e oferecer a ação “Apresentar negócio”. No desktop, texto e matriz se contrapõem em duas colunas. No mobile, a matriz foi levada para o footer para preservar a ordem **mensagem → CTA → assinatura visual**.

### Campo visual interativo

A composição reativa já está implementada: grade em canvas e lettering SVG listrado respondem juntos ao hover/ponteiro em todo o hero, inclusive na coluna textual. Clique ou toque gera ondas; ao encerrar a interação, a deformação retorna ao repouso.

No desktop, a matriz ocupa a coluna direita do split 44/56. No mobile, o mesmo componente inteiro forma o footer retangular de largura integral, com lettering centralizado e rolagem vertical permitida pela área interativa. Essa mudança é uma escolha de composição e ergonomia, não a criação de outro componente.

Os temas claro/escuro abrangem texto e matriz. A interação pausa fora da tela e com aba oculta; `prefers-reduced-motion` mantém a composição estática. Os pulsos automáticos atuais continuam; introdução finita e otimização do warp são refinamentos registrados nos documentos do hero.

### Continuidade e conversão

Os dois triângulos desktop indicam continuidade por scroll e permanecem decorativos. A integração com `#processo` depende da seção prevista. O botão **“Apresentar negócio”** tem função distinta: conversão para a entrada comercial `#entrada`, com o formulário ainda por implementar.

## 5. Processo Público

O processo é a principal peça comercial da landing. Sua função é mostrar que uma demanda inicial recebe leitura e priorização antes de virar escopo e proposta — sem comunicar que a agência impede o cliente de escolher uma solução.

### Etapas públicas

1. **Entrada** — o negócio apresenta o momento atual, o objetivo e a demanda inicial.
2. **Entendimento do cenário** — a AUGEO lê o contexto, relações, prioridades e pontos que exigem intervenção.
3. **Direcionamento e proposta** — a AUGEO devolve um caminho com escopo, etapas e investimento para o cliente decidir se faz sentido seguir.

### Limite de exposição

O site comunica o modelo de trabalho, não o procedimento interno completo. Call inicial, estruturação de briefing, handoffs, validação e segunda call pertencem à operação e estão documentados em [operação interna](PRODUCT.md#operação-interna); só devem aparecer publicamente se contribuírem para a decisão do lead.

## 6. Entrada Comercial e Formulário

A landing completa terá um único formulário de entrada, ainda não implementado. Ele não cria duas jornadas separadas nem obriga o visitante a já saber qual serviço comprar.

### Papel do formulário

- captar informações suficientes para uma triagem inicial;
- permitir que o lead apresente uma demanda objetiva ou uma necessidade ainda indefinida;
- preparar a conversa inicial sem antecipar uma promessa de proposta ou contratação.

### Estrutura mínima

- identificação e canal de retorno;
- nome e contexto do negócio;
- objetivo ou problema que motivou o contato;
- estágio/momento atual;
- links, referências ou materiais existentes, quando houver;
- campo para selecionar ou descrever a demanda inicial;
- orçamento/faixa de investimento, somente se a decisão comercial posterior confirmar que essa informação deve ser coletada na entrada.

### Demandas que o formulário deve acomodar

- identidade ou direção visual;
- website;
- aquisição via Meta Ads;
- CRM, automação ou integração;
- necessidade de entender qual caminho faz sentido.

Essas opções qualificam o contato; não constituem catálogo, pacote fechado ou compromisso de contratação avulsa.

### Pós-envio previsto

Após o envio, a interface confirma o recebimento e informa que a AUGEO fará a leitura inicial antes do retorno. Não deve prometer prazo, orçamento automático ou reunião garantida enquanto esses parâmetros não estiverem definidos pela operação.

## 7. Direção Visual

### Princípio

**Estrutura precisa, comportamento instável.** A linguagem combina sistemas controlados — grades, vetores, módulos, notações e tipografia — com deformação, interferência e formas orgânicas condicionadas por regras.

### Fundamentos já definidos

- Base cromática implementada: claro com fundo `#f7f7f5`/texto `#111111`; escuro com fundo `#06070a`/texto `#f7f7f5`.
- Cor de ênfase implementada: laranja-cereja `#ff482c`, usada pontualmente, inclusive em foco. Uso em futuras superfícies deve preservar contraste adequado.
- Tipografia atual: Hanken Grotesk local na landing, título com peso 620; Archivo como alternativa declarada e Share Tech Mono no componente/demo. O sistema completo para as seções futuras ainda precisa ser consolidado.
- Temas seguem a preferência do sistema, com suporte às classes explícitas `.light`/`.dark`; não há seletor de tema na landing.
- A marca e o símbolo existentes não devem ser redesenhados.
- A hero usa contraste entre presença humana/comercial e campo técnico; essa divisão não deve ser repetida mecanicamente no restante da página.
- A tipografia deve sustentar impacto e clareza comercial; experimentação não pode comprometer leitura de conteúdo, formulários ou navegação.

### Uso do grid e da abstração

Grades e sistemas gráficos devem funcionar como linguagem de estrutura, resposta e transição — não como textura repetida em todas as seções. A abstração visual deve reforçar composição e ritmo, sem tentar demonstrar artificialmente uma capacidade técnica.

### Evitar

- tipografia deteriorada ou ilegível em conteúdo comercial;
- visual de dashboard SaaS, bento grid genérico e cards de serviço padronizados;
- 3D, wireframes, fashion, carros futuristas ou imagens editoriais usados como decoração genérica de agência;
- excesso de linhas finas, grades pretas repetidas ou cinética de scroll sem função;
- gradientes neon, Memphis corporativo, minimalismo sem construção tipográfica e estética genérica de IA;
- qualquer redução de contraste, acessibilidade ou performance para preservar efeito visual.

### Consolidação visual ainda pendente

- Estender os papéis tipográficos e tokens existentes a Processo e formulário.
- Estruturar e avaliar a composição dessas seções, sem repetir mecanicamente o hero.
- Registrar o sistema em `DESIGN.md`, conforme a frente prevista do hero.
- Definir motion fora do hero e necessidade de assets complementares quando houver função concreta.
- Concluir as avaliações e refinamentos do hero registrados nos documentos pertinentes.

Fontes, cores e composição atuais são a base existente, não escolhas iniciais em aberto. Isso não equivale a aprovação visual global nem à conclusão do sistema para toda a landing.

## 8. Assets

### Diretriz

Marca, lettering, fontes locais e matriz já estão incorporados ao hero. O moodboard informa direção e geometria; suas imagens não são decoração a importar para a página. Assets adicionais devem ser definidos conforme as necessidades das seções futuras. Não há exigência de preencher a página com objetos 3D para compensar a ausência de portfólio.

### Prioridades

1. Preservar o componente interativo e os assets de marca já implementados no hero; refinamentos pendentes devem respeitar essa base.
2. Sistema gráfico que acompanhe a leitura do processo, se ele se mostrar necessário ao design.
3. Assets pontuais para sustentação de composição e ritmo.

### Possibilidades compatíveis

- gráficos cinéticos e diagramáticos;
- objetos ou formas abstratas submetidas a regras do sistema visual;
- tipografia em escala e interfaces modulares;
- imagem editorial única e controlada, quando tiver função concreta.

Cada asset precisa ter função de composição, narrativa ou interação, atender contraste e acessibilidade e ter custo de carregamento proporcional ao benefício visual.

## 9. Copy e Conteúdo

A copy do hero já está aplicada:

- Título: **“Presença digital com direção.”**
- Apoio: **“O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.”**
- CTA: **“Apresentar negócio”.**

Processo e formulário ainda precisam de copy própria, incluindo estados de envio; rascunhos estão ao final deste documento. A mensagem deve deixar claro que a AUGEO atua em direção, presença e operação digital, sem transformar o site em uma lista de serviços. O processo deve mostrar que o cliente mantém a decisão de seguir ou não; a AUGEO agrega critério para que essa decisão e o escopo tenham coerência.

Evitar promessas de resultado, retorno rápido, fórmula, solução total sem contexto e qualquer alegação de cases, clientes ou métricas inexistentes.

## 10. Implementação

### Requisitos confirmados

- Landing responsiva, acessível e performática.
- Interação de hero adaptada a mouse, touch e redução de movimento.
- Formulário com validação, confirmação de envio e encaminhamento para a triagem comercial.
- Estrutura preparada para adicionar cases e páginas futuras sem reescrever o fluxo principal.

### Base técnica implementada

- Front-end: React 19 e TypeScript, com Vite 8; aplicação de uma página, sem roteador ou CMS implementado.
- Estilos: Tailwind CSS 4 integrado ao Vite e CSS próprio em `src/styles.css`, com fontes locais, tokens e temas.
- Hero: `KineticMatrix` compartilhado entre landing e demo `?demo=matrix`, com física/warp em `lib/matrix-motion.ts`; indicador em `ScrollCue`.
- Tooling: Bun para instalação e execução, com `bun.lock` e `bunfig.toml`. Build por `bun run build`; regressões por `bun run test` com Playwright/Chromium; inspeção visual/interativa por `dev-browser`.
- Hospedagem: projeto `augeo-grid-hero` na equipe `augeocreative` da Vercel, conectado ao repositório GitHub `lucavalente93/augeo-grid-hero`, com produção na `main` e integração de deploy por push.
- Domínio próprio: `augeocreative.com` e `www.augeocreative.com` vinculados ao projeto. O usuário confirmou o site online no domínio, e HTTPS respondeu 200 nos dois endereços; evidências de DNS/HTTPS e publicação pertencem ao backlog. O alias `augeo-grid-hero.vercel.app` permanece disponível.
- DNS gerenciado na Hostinger; e-mail comercial existente `hello@augeocreative.com`, independente do deploy. Preservar os registros de e-mail ao alterar o apontamento do site.
- Plano Vercel atual mantido por decisão do usuário; contratação do Pro e configuração do WhatsApp Business adiadas até concluir o site. Não são bloqueios para o desenvolvimento nem tarefas autorizadas nesta revisão.

### Decisões e integrações técnicas ainda abertas

- Campos obrigatórios e validação do formulário; backend/serviço de recebimento, armazenamento, proteção contra abuso e tratamento de falhas.
- Tratamento de dados, informações de privacidade e parâmetros operacionais de triagem/retorno.
- CMS somente se surgir necessidade real de edição de conteúdo; não há adoção decidida.
- Analytics e rastreamento, quando houver objetivo de medição definido, respeitando privacidade e consentimento aplicáveis.
- Endereço canônico e redirecionamento entre domínio raiz e `www`, ainda sem configuração confirmada.

A stack, a hospedagem, o domínio e a interação inicial da matriz já foram definidos e implementados. Integrações comerciais futuras devem ser escolhidas conforme o fluxo de entrada e a operação, sem reabrir essas bases por padrão.

## 11. Estado e Próximas Decisões

### Base já implementada e publicada

- Cabeçalho com marca, hero responsivo, copy aplicada, botão de conversão, composição reativa em hover e indicativo desktop.
- Footer mobile implementado com a matriz e o lettering abaixo da copy e do CTA.
- Temas, fontes locais, cor de ênfase e tokens do hero presentes no código.
- Stack React/TypeScript/Vite/Tailwind, tooling Bun e testes Playwright existentes.
- Deploy de produção na Vercel e domínio próprio conectado; primeira publicação já realizada.

Publicação não equivale a conclusão da landing, aprovação visual global ou fechamento dos fluxos metodológicos do hero. Resultados de testes e limitações de cobertura ficam no backlog, sem tratar evidências históricas como validação automática de versões futuras.

### Para concluir a landing completa

- Concluir as avaliações e refinamentos autorizados do hero conforme os pontos de avaliação existentes; introdução finita, desempenho, extração do sistema e acabamento integrado permanecem frentes específicas.
- Estruturar Processo e formulário com copy coerente com o posicionamento. Preservar o footer mobile já implementado.
- Fechar campos obrigatórios, ferramenta de recebimento, tratamento de dados, responsável pela triagem e mensagens de sucesso/erro.
- Implementar `#processo` e `#entrada`, integrar navegação/continuidade e conectar o CTA ao formulário funcional.
- Definir onde apresentar os canais públicos, usando o e-mail existente; WhatsApp Business depende de configuração futura.
- Validar a experiência completa: responsividade, teclado/foco, contraste, movimento reduzido, carregamento, envio, falhas e recebimento real para triagem.
- Definir a política de redirecionamento/canonical dos domínios e metadados de publicação/indexação; manter HTTPS válido nos dois endereços antes de encerrar a entrega completa.

Essas pendências não autorizam avanço automático de bloco nem contratação de serviços. A sequência operacional e as autorizações ficam no backlog; propostas e avaliações do hero ficam no registro de decisões.

### Futuro, após a primeira versão completa

- Avaliar inclusão de cases, portfólio, prova social, FAQ e páginas internas a partir de trabalhos e objeções reais.
- Complementar abstrações visuais com evidências de trabalho publicado quando houver material adequado, preservando a assinatura gráfica que já foi construída.

## Rascunhos de copy das seções futuras

Material anteriormente em `copywriting.md`, ainda não aplicado ao site nem registrado como copy final aprovada. Preservado como ponto de partida para Header, Processo, entrada comercial e footer; não substitui a copy implementada do hero na seção 9.

### Header

Nosso processo · Apresentar negócio

### Processo

**Nós estruturamos sua presença digital.**

Conhecemos seu negócio, identificamos o que precisa mudar e propomos um projeto para conectar apresentação e operação.

#### 1. Conhecemos seu negócio

Investigamos seu momento atual e os obstáculos que motivaram o contato.

#### 2. Definimos as prioridades

Analisamos quais mudanças fazem sentido e como as entregas devem trabalhar juntas.

#### 3. Apresentamos o projeto

Explicamos nossa recomendação, o escopo e o investimento. Você decide sobre a contratação.

**Apresentar negócio**

### Entrada comercial

**Vamos entender o que seu negócio precisa.**

Compartilhe uma breve apresentação e o motivo do contato. A análise e o direcionamento ficam com a AUGEO.

**Apresentar negócio**

#### Após o envio

Recebemos sua apresentação. Vamos analisar as informações antes de retornar pelo contato indicado.

### Footer

AUGEO Creative

Direção, presença e operação digital.

Atendimento remoto.
