# AUGEO Website: Especificação

## 1. Papel do Site

Landing page institucional e comercial da AUGEO Creative. Ela deve:

- apresentar a agência de forma inequívoca;
- demonstrar critério, direção e capacidade de execução pelo próprio website;
- explicar o modelo comercial baseado em entendimento do contexto antes da proposta;
- converter negócios adequados em contatos qualificados.

O site não deve tentar compensar a ausência de cases públicos com projetos fictícios, números, depoimentos ou sinais artificiais de validação social. Até existirem trabalhos publicados, a prova é dada pela qualidade da página, pela clareza do processo e pela precisão da entrada comercial.

## 2. Escopo da Primeira Versão

### Incluído

- Header
- Hero
- Processo
- Formulário de entrada e triagem
- Footer

### Fora do escopo nesta versão

- Seção autônoma de serviços ou capacidades
- Portfólio, cases, clientes, métricas e depoimentos
- Seção institucional de “sobre” ou equipe
- FAQ
- Páginas internas, blog e área de cliente

As frentes de atuação da AUGEO continuam informando a mensagem e a qualificação do lead, mas não aparecem como uma vitrine de módulos independentes.

## 3. Arquitetura e Fluxo

| Ordem | Camada | Responsabilidade |
|---|---|---|
| 1 | Header | Identificar a AUGEO, oferecer navegação mínima e acesso à ação comercial. |
| 2 | Hero | Estabelecer presença, apresentar a tese da agência e direcionar para a entrada comercial. |
| 3 | Processo | Explicar como uma demanda inicial se transforma em entendimento, direcionamento e proposta. É a seção informativa central da landing. |
| 4 | Formulário | Coletar contexto inicial e classificar a natureza da demanda para orientar a próxima conversa. |
| 5 | Footer | Reunir canais, dados institucionais e links necessários sem competir com a conversão. |

O caminho primário é: **hero ou header → formulário → triagem → contato inicial**. A seção de processo reduz a incerteza entre a intenção do visitante e esse envio.

## 4. Hero

### Função

A hero é a porta de entrada da página. Ela deve comunicar o posicionamento de modo breve, estabelecer o nível de acabamento da AUGEO e levar o visitante ao formulário. Não tem responsabilidade de explicar serviços, processo inteiro ou tecnologia utilizada.

### Campo visual interativo

O lado direito da hero contém um componente visual próprio de interação por hover: uma grade estruturada reage e se deforma conforme a interação. A função é estética e de assinatura visual; ele não precisa representar literalmente um serviço, produto ou etapa do processo.

### Requisitos de comportamento

- Manter uma composição visual válida sem hover, especialmente em touch.
- Respeitar `prefers-reduced-motion` com uma versão estática ou movimento significativamente reduzido.
- Preservar legibilidade, contraste e desempenho; a interação não pode bloquear o CTA nem depender de hardware gráfico excepcional.
- O split claro/escuro da hero não é uma regra de layout para o restante da página.

### Continuidade para Processo

EXPLORE AQUI é o indicativo vertical do hero para a seção Processo, abaixo: uma coluna alongada na lateral com direção descendente. Na página completa, será um link nativo para `#processo`. Enquanto essa seção não existir no protótipo, mantém a indicação visual como texto acessível sem ação ou foco. O estado atual e o ponto de retomada estão em [HERO_HANDOFF.md](HERO_HANDOFF.md).

### CTA

O CTA principal da hero conduz ao formulário de entrada. O texto final do CTA será definido na etapa de copy; sua função já está fixa: iniciar a apresentação do negócio, e não abrir um “contato genérico”.

## 5. Processo Público

O processo é a principal peça comercial da landing. Sua função é mostrar que uma demanda inicial recebe leitura e priorização antes de virar escopo e proposta — sem comunicar que a agência impede o cliente de escolher uma solução.

### Etapas públicas

1. **Entrada** — o negócio apresenta o momento atual, o objetivo e a demanda inicial.
2. **Entendimento do cenário** — a AUGEO lê o contexto, relações, prioridades e pontos que exigem intervenção.
3. **Direcionamento e proposta** — a AUGEO devolve um caminho com escopo, etapas e investimento para o cliente decidir se faz sentido seguir.

### Limite de exposição

O site comunica o modelo de trabalho, não o procedimento interno completo. Call inicial, estruturação de briefing, handoffs, validação e segunda call pertencem à operação e estão documentados em [03-INTERNAL.md](03-INTERNAL.md); só devem aparecer publicamente se contribuírem para a decisão do lead.

## 6. Entrada Comercial e Formulário

Há um único formulário de entrada. Ele não cria duas jornadas separadas nem obriga o visitante a já saber qual serviço comprar.

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

### Pós-envio

Após o envio, a interface confirma o recebimento e informa que a AUGEO fará a leitura inicial antes do retorno. Não deve prometer prazo, orçamento automático ou reunião garantida enquanto esses parâmetros não estiverem definidos pela operação.

## 7. Direção Visual

### Princípio

**Estrutura precisa, comportamento instável.** A linguagem combina sistemas controlados — grades, vetores, módulos, notações e tipografia — com deformação, interferência e formas orgânicas condicionadas por regras.

### Fundamentos já definidos

- Base cromática: preto e branco.
- Cor de ênfase: laranja-cereja, reservada para ação, estado e ênfase pontual.
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

### Decisões visuais ainda em aberto

- família tipográfica, pesos e regras de uso;
- hexadecimal e requisitos de contraste da cor de ênfase;
- tokens de layout, espaçamento, bordas e superfícies;
- regras definitivas de motion fora da hero;
- tratamento e necessidade de assets complementares.

Essas decisões pertencem à frente de design visual e não bloqueiam a arquitetura de informação já definida.

## 8. Assets

### Diretriz

Assets devem ser definidos depois que a arquitetura e as necessidades de cada seção estiverem estáveis. Não há exigência de preencher a página com objetos 3D para compensar a ausência de portfólio.

### Prioridades

1. Componente interativo da hero.
2. Sistema gráfico que acompanhe a leitura do processo, se ele se mostrar necessário ao design.
3. Assets pontuais para sustentação de composição e ritmo.

### Possibilidades compatíveis

- gráficos cinéticos e diagramáticos;
- objetos ou formas abstratas submetidas a regras do sistema visual;
- tipografia em escala e interfaces modulares;
- imagem editorial única e controlada, quando tiver função concreta.

Cada asset precisa ter função de composição, narrativa ou interação, atender contraste e acessibilidade e ter custo de carregamento proporcional ao benefício visual.

## 9. Copy e Conteúdo

A copy será desenvolvida em etapa própria. A arquitetura não depende de texto definitivo neste momento.

Quando escrita, a mensagem deve deixar claro que a AUGEO atua em direção, presença e operação digital, sem transformar o site em uma lista de serviços. O processo deve mostrar que o cliente mantém a decisão de seguir ou não; a AUGEO agrega critério para que essa decisão e o escopo tenham coerência.

Evitar promessas de resultado, retorno rápido, fórmula, solução total sem contexto e qualquer alegação de cases, clientes ou métricas inexistentes.

## 10. Implementação

### Requisitos confirmados

- Landing responsiva, acessível e performática.
- Interação de hero adaptada a mouse, touch e redução de movimento.
- Formulário com validação, confirmação de envio e encaminhamento para a triagem comercial.
- Estrutura preparada para adicionar cases e páginas futuras sem reescrever o fluxo principal.

### Decisões técnicas ainda abertas

- framework e arquitetura de front-end;
- solução de estilos e componentes;
- hospedagem e domínio;
- backend/serviço de recebimento do formulário;
- CMS, se houver necessidade real de conteúdo editável na primeira versão;
- analytics e rastreamento, respeitando privacidade e consentimento aplicáveis.

Nenhuma dessas decisões deve ser fechada por hábito de stack: elas precisam ser escolhidas depois de definir o comportamento do componente da hero, a operação do formulário e a necessidade de edição de conteúdo.

## 11. Backlog de Decisões

### Antes da implementação visual

- Consolidar a hero já produzida e seus estados de interação.
- Definir sistema visual mínimo: tipografia, cor de ênfase, tokens e regras de motion.
- Estruturar visualmente a seção de processo e validar sua leitura.

### Antes da publicação

- Definir a copy final de hero, processo, formulário e footer.
- Fechar campos obrigatórios, ferramenta de recebimento, responsável pela triagem e resposta pós-envio.
- Definir stack, hospedagem, domínio e tratamento de dados do formulário.
- Testar responsividade, acessibilidade, redução de movimento, carregamento e envio do formulário.

### Futuro, após a primeira versão

- Avaliar inclusão de cases, portfólio, prova social, FAQ e páginas internas a partir de trabalhos e objeções reais.
- Substituir ou complementar abstrações visuais por evidências de trabalho publicado quando houver material adequado.
