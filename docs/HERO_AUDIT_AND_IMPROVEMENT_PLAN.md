# AUGEO — auditoria, briefing e continuidade pela metodologia Impeccable

Data da auditoria: 2026-10-07  
Projeto: `/home/luca/augeo/modular-bw-landing`  
Alvo estável: `src/App.tsx` — hero da página inicial  
Modo da superfície: **Persuade**  
Estado da execução e validações: [HERO_HANDOFF.md](HERO_HANDOFF.md). A Parte I e os anexos registram a auditoria histórica; as Partes II–III especificam o refinamento.

## Protocolo de retomada para o próximo agente

Este documento contém três entregas distintas: **Parte I — relatório no formato de `audit`; Parte II — briefing organizado pelos campos de `shape`; Parte III — encaminhamento aos comandos de implementação**. Os anexos preservam contexto, evidências e referências. A combinação em um único arquivo é um handoff do projeto; não existe uma alegação de que este arquivo seja um template universal da Impeccable.

O usuário pediu uma auditoria, um plano alinhado ao moodboard e este registro para outro chat. Depois esclareceu que deseja diferenças visuais perceptíveis, além das correções técnicas. O próximo agente deve trabalhar dentro da metodologia da skill e respeitar as decisões já confirmadas.

### Fontes de verdade e ordem de leitura

1. Ler `/home/luca/.agents/skills/impeccable/SKILL.md` e instruções locais aplicáveis. Executar `/home/luca/.agents/skills/impeccable/scripts/impeccable context --target src/App.tsx` **uma vez na nova sessão**, com cwd na raiz deste projeto. Seguir o resultado e o fallback documentado se o launcher falhar.
2. Começar por [HERO_HANDOFF.md](HERO_HANDOFF.md), fonte única de progresso e próxima ação, e por `docs/PRODUCT.md` (a partir da raiz do projeto), resumo do produto para a skill. Ler a Parte II e o trecho da Parte III correspondente ao bloco atual. Consultar `CONTEXT.md` para aprofundamento estratégico e `02-WEBSITE_SPEC.md` para arquitetura ou outras seções; não exigir releitura integral desses arquivos em toda retomada. Conferir código, Git e visual renderizado; as medidas da auditoria são históricas.
3. Consultar a Parte I para evidências técnicas e os anexos para baseline/referências, quando necessários ao bloco. Para cada comando usado, carregar seu playbook antes de executá-lo. O diretório dos playbooks é `/home/luca/.agents/skills/impeccable/reference/`.
4. Preservar o mundo visual já estabelecido no código. A ausência de `DESIGN.md` não transforma o projeto em greenfield e não exige reiniciar `init`. Trata-se de refinamento local: não iniciar sorteio de conceitos, torneio de identidades ou redesign completo sem mudança explícita de escopo.
5. Para planejamento, usar `shape.md`; para amplificação, `bolder.md`; para ajustes, os playbooks indicados na Parte III. Ler `craft-floor.md` imediatamente antes de editar UI, depois de resolvida a direção; não carregá-lo apenas para planejamento.
6. Se o usuário pedir explicitamente a implementação deste documento, essa instrução autoriza executar a proposta dentro do escopo registrado. Se pedir apenas exploração ou planejamento, apresentar a síntese do briefing para confirmação/correção conforme `shape.md` e parar antes de escrever UI. Não repetir perguntas cujas respostas constam na Parte II.

**Artefatos:** este arquivo não é `DESIGN.md` nem um snapshot formal de `critique`. Não copiá-lo para esses formatos, nem fabricar uma execução anterior de comandos. O eventual `DESIGN.md` segue `document.md`; uma futura execução de `critique` segue integralmente `critique.md`, incluindo seu próprio fluxo de avaliação e persistência.

Preferência do usuário: assuntos e corpos de commits Git em inglês. Em Plan Mode, identificar referências usadas por rótulo e caminho local exato. Caminhos de referências pertencem ao handoff, não à interface ou à documentação do sistema visual, salvo solicitação.

## Parte I — Audit: relatório técnico

Playbook: `/home/luca/.agents/skills/impeccable/reference/audit.md`. Esta parte registra fatos verificáveis da implementação. Julgamentos estéticos e alternativas de composição ficam na Parte II; a auditoria não implementa correções.

### Implementation Integrity Verdict — veredito de integridade

**PASS quanto à existência de um sistema visual coerente e específico da AUGEO.** O símbolo existente, o lettering listrado e a deformação compartilhada constituem uma assinatura reconhecível. Esse veredito não equivale a aprovação para publicação: EXPLORE apresenta uma ação sem destino real e há limitações responsivas e de desempenho.

Detector CLI: zero achados. Detector no navegador: uma ocorrência de listras repetidas, verificada como escolha intencional da linguagem CRT, não contabilizada como defeito técnico. A qualidade visual não é demonstrada apenas por um detector limpo.

### Audit Health Score

| Dimensão | Nota | Evidência principal |
|---|---:|---|
| Acessibilidade | 3/4 | Bons contrastes, nomes acessíveis, foco visível e movimento reduzido funcional |
| Desempenho | 2/4 | Deformação ativa do lettering apresenta custo elevado na thread principal |
| Responsividade | 3/4 | Sem overflow horizontal nos casos inspecionados; composição mobile e desktop curto precisam de ajuste |
| Temas | 2/4 | Tokens coexistem com cores duplicadas no CSS e no canvas |
| Integridade | 3/4 | Sistema visual coerente; único botão de avanço não possui destino real |
| **Total** | **13/20** | **Aceitável, com melhorias concentradas e verificáveis** |

### Executive Summary — resumo executivo

- **13/20 — Acceptable:** melhorias significativas e localizadas, segundo as faixas do playbook.
- **5 achados técnicos:** P0 = 0; P1 = 1; P2 = 3; P3 = 1.
- Prioridades: ação EXPLORE sem destino; espaço excessivo em mobile/desktop curto; custo da deformação ativa; movimento automático contínuo.
- Próximos passos: corrigir a semântica do indicativo, aplicar a adaptação já escolhida, limitar a introdução e otimizar o warp. Aumentar a expressividade visual conforme o briefing separado.
- A copy e a intensidade visual das scanlines, antes misturadas à lista técnica, são tratadas como julgamentos de design na Parte II. Não foram contadas como violações técnicas para inflar o total.

### Detailed Findings by Severity — achados por severidade

#### A01 — P1 Major: EXPLORE não tem destino real

- **Location:** `src/App.tsx:18` e `src/App.tsx:37`, função `explore` e botão `.explore`.
- **Category:** Implementation Integrity.
- **Evidence:** `main > .hero + section` retorna `null`. Clique e Enter não alteram `scrollY`. O teste existente injeta uma seção artificial antes de verificar a navegação.
- **Impact:** a única ação de avanço apresentada não pode ser concluída. É uma dependência conhecida do protótipo, não uma regressão do reposicionamento anterior.
- **WCAG/Standard:** nenhuma violação normativa específica declarada; falha funcional observada.
- **Recommendation:** conforme decisão do usuário, apresentar EXPLORE como texto não focável enquanto Processo não existir; integrar posteriormente um link nativo explícito a `#processo`, junto da seção real. Não inventar uma seção apenas para satisfazer o teste.
- **Suggested command:** `$impeccable harden src/App.tsx`.

#### A02 — P2 Minor: composição responsiva depende de reservas fixas excessivas

- **Location:** `src/styles.css:96`, `:100`, `:130`, `:137` e `:142`; regras de EXPLORE e media queries do hero.
- **Category:** Responsive Design.
- **Evidence:** em 390×844, indicativo 44×241 px e matriz em y≈637; em 320×740, matriz em y≈699. O hero mede aproximadamente 641 px em 900×600 e 710 px em 768×600. Há padding inferior de 263 px no desktop curto e reserva de 283 px no mobile.
- **Impact:** o lettering não aparece na primeira tela menor e a composição curta fica desequilibrada. Alturas fixas de letras também são frágeis a ampliação.
- **WCAG/Standard:** não foi comprovada violação de zoom/reflow. Fonte raiz a 200% passou sem overflow; sobreposição foi observada apenas em um estresse separado que duplicava artificialmente os tamanhos computados das letras.
- **Recommendation:** remover reservas de espaço compensatórias, usar a linha mobile EXPLORE + matriz escolhida pelo usuário e dimensionar caixas de letras proporcionalmente à fonte.
- **Suggested command:** `$impeccable adapt src/App.tsx`, apoiado por `$impeccable layout src/App.tsx` e `$impeccable typeset src/App.tsx`.

#### A03 — P2 Minor: warp do lettering tem custo elevado durante interação

- **Location:** `components/ui/kinetic-matrix.tsx:108`, `:128` e `:285`, amostragem de pixels em `drawArtwork` e loop de desenho.
- **Category:** Performance.
- **Evidence:** medidas em Chromium headless, Vite local, viewport 1440×900, sem CPU throttling:

| Cenário | Callback RAF |
|---|---|
| DPR 2, repouso, 3 s | Mediana 1,3 ms; p95 3,5 ms; sem long tasks |
| DPR 2, ponteiro sobre lettering + clique, 3 s | Mediana 24 ms; p95 33 ms; quatro long tasks de 57–72 ms |
| Repetição ativa DPR 2, 2,5 s | Mediana 24 ms; p95 28,8 ms |
| Repetição ativa DPR 1, 2,5 s | Mediana 4,3 ms; p95 21,2 ms |

- **Impact:** os callbacks da interação excedem frequentemente o orçamento de 16,7 ms de um quadro de 60 Hz no ambiente medido. Não converter esses tempos em uma alegação de FPS real ou resultado em celular físico.
- **WCAG/Standard:** não aplicável; diagnóstico de desempenho.
- **Recommendation:** pré-calcular o mapa horizontal por quadro, reutilizar buffers e evitar redesenhar deformações idênticas. Preservar resolução, interpolação, abertura do “A” e retorno exato ao repouso. Comparar no mesmo cenário DPR 2.
- **Suggested command:** `$impeccable optimize components/ui/kinetic-matrix.tsx`.

#### A04 — P2 Minor: movimento automático permanece contínuo

- **Location:** `src/styles.css:98`; `components/ui/kinetic-matrix.tsx:257`, `:272` e `:386`.
- **Category:** Accessibility.
- **Evidence:** scan de 3,2 s em loop infinito e pulsos contínuos sem controle local. A preferência de movimento reduzido funciona: zero callbacks/desenhos no segundo medido, scan oculto e artwork estático.
- **Impact:** falta uma pausa natural durante a leitura para quem não configurou a preferência no sistema.
- **WCAG/Standard:** considerar [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) e [G4](https://www.w3.org/WAI/WCAG22/Techniques/general/G4). Não declarar violação incondicional: mecanismos do sistema/usuário são relevantes e a preferência demonstravelmente funciona.
- **Recommendation:** seguir a escolha confirmada de introdução curta, concluindo todo movimento automático em até quatro segundos no plano proposto; manter respostas pontuais a interação e o estado estático com movimento reduzido.
- **Suggested command:** `$impeccable animate src/App.tsx`.

#### A05 — P3 Polish: cores compartilhadas estão duplicadas

- **Location:** `src/styles.css:33`, `:87`, `:95` e `:109`; `components/ui/kinetic-matrix.tsx:168` e `:335`.
- **Category:** Theming.
- **Evidence:** tokens coexistem com valores literais de cor no CSS e canvas. O tema escuro muda a matriz, mantendo o painel de conteúdo claro.
- **Impact:** futuras alterações de paleta exigem mudanças em locais distintos, com risco de divergência. A composição dividida permanece legível e não é, por si, um defeito de tema.
- **WCAG/Standard:** nenhuma falha de contraste demonstrada neste achado.
- **Recommendation:** preservar o tema dividido e compartilhar os valores utilizados; documentar a decisão após conferir a implementação.
- **Suggested command:** `$impeccable polish src/App.tsx`; registrar o sistema com `$impeccable document`.

As linhas acima identificam a versão auditada. Se o código mudou, localizar o componente/regra correspondente antes de agir.

### Patterns & Systemic Issues — padrões sistêmicos

- Reservas fixas de padding compensam a posição do indicativo e enfraquecem a composição em diferentes alturas.
- A suíte existente cobre comportamentos isolados, mas a seção injetada não comprova um caminho real de navegação; também não cobre presença da marca na primeira dobra nem custo de interação em DPR 2.
- CSS e canvas compartilham linguagem visual, mas duplicam parte dos valores de cor.

### Positive Findings — pontos positivos e falsos positivos

- Contraste aproximado sobre `#f7f7f5`: título 17,60:1; apoio 5,80:1; EXPLORE 9,39:1. Foco laranja aproximadamente 3,15:1.
- Landmarks, nomes acessíveis e foco de teclado presentes. Canvases decorativos ocultos de tecnologias assistivas.
- Nenhum overflow horizontal nos viewports inspecionados.
- Toque emulado produz deformação e retorno ao mesmo hash de pixels em repouso. Rolagem iniciada sobre a matriz continua funcionando; `pointercancel`/`pointerleave` limpam a interação. Não há evidência para adicionar `touch-action:none`.
- Quando totalmente fora da tela, o canvas teve zero callbacks no segundo medido. A suspensão por aba oculta foi verificada no código, não em ensaio separado de troca de abas.
- Ausência de interação de teclado na matriz não é automaticamente um defeito: ela é decorativa e não expõe função essencial.
- Detector CLI executado uma vez sobre markup e estilos: saída `[]`, zero achados.
- Detector no navegador sinalizou uma ocorrência de `REPEATING-GRADIENT STRIPES`, correspondente à textura CRT. É uma escolha visual intencional, não um defeito comprovado pelo detector. O ajuste de intensidade decorre da leitura visual.
- Overlay foi injetado com sucesso em navegador headless; não houve apresentação de overlay visível ao usuário.

### Recommended Actions — ações recomendadas pelo diagnóstico

| Prioridade | Comando | Achado e resultado esperado |
|---|---|---|
| P1 | `$impeccable harden src/App.tsx` | A01: eliminar a ação sem destino mantendo a indicação visual escolhida |
| P2 | `$impeccable adapt src/App.tsx` | A02: recompor mobile e janelas curtas; recorrer a `layout`/`typeset` para estrutura e letras |
| P2 | `$impeccable animate src/App.tsx` | A04: introdução finita e interação posterior funcional |
| P2 | `$impeccable optimize components/ui/kinetic-matrix.tsx` | A03: reduzir custo do warp com comparação equivalente |
| P3 | `$impeccable document` | A05: registrar a propriedade das cores e o sistema resultante |
| Final | `$impeccable polish src/App.tsx` | Fechar os achados assumidos, resolver divergências de cor e validar o resultado completo |

Os comandos podem ser solicitados individualmente, em conjunto ou em outra ordem pelo usuário. A Parte III organiza uma sequência específica para este projeto, incluindo a evolução visual desejada. Reexecutar `$impeccable audit src/App.tsx` depois das correções, quando solicitado ou como reavaliação planejada, para comparar achados e pontuação; não relatar a nota atual como nota pós-implementação.

## Parte II — Shape: briefing visual e funcional

Playbook: `/home/luca/.agents/skills/impeccable/reference/shape.md`. A estrutura abaixo usa seus sete campos. O briefing reaproveita a entrevista já realizada; as propostas de composição e copy não são apresentadas como valores literalmente aprovados pelo usuário.

### 1. Job and audience — papel e público

Modo **Persuade**: apresentar a AUGEO a negócios e profissionais que possuem operação, produto, acervo ou conteúdo real e precisam de presença digital coerente. O hero deve demonstrar direção e capacidade de execução e tornar o posicionamento compreensível.

### 2. Outcome and proof — resultado e evidência

O visitante deve entender que a AUGEO parte do contexto do negócio para conectar direção e implementação. A própria execução visual é a prova disponível. A marca e a matriz precisam ter presença na primeira tela mobile, e a versão desktop deve mostrar evolução estética perceptível em repouso.

A navegação para Processo é uma integração futura. Nesta etapa, o indicativo não promete uma ação disponível. Não inventar clientes, métricas, cases ou alegações de resultado.

### 3. Selected direction — direção de trabalho proposta

**Mundo visual estabelecido:** símbolo original, lettering AUGEO listrado, tipografia local, claro/escuro e matriz com deformação localizada. A falta de `DESIGN.md` não autoriza substituir esse mundo.

**Tese da composição:** uma grande assinatura AUGEO ocupa o campo à direita; o título forma um bloco editorial relacionado a ela; a coluna EXPLORE delimita a borda e conduz o olhar para Processo, abaixo do hero; a grade serve como estrutura mais quieta. A amplificação principal pertence ao lettering. Ajustar título, apoio e coluna para sustentar esse pico, evitando tornar todos os elementos igualmente dominantes.

**Tese da interação:** uma introdução breve apresenta o campo; depois, deformação local responde ao visitante e retorna ao repouso. A composição estática deve ser suficiente para quem prefere movimento reduzido.

A revisão estética deve passar pelo teste de estrutura de `bolder.md`: remover mentalmente a copy e verificar se a hierarquia e os elementos da marca ainda sustentam a composição. Aumentar números de fonte isoladamente não cumpre esse objetivo.

### 4. Scope and boundaries — escopo e decisões confirmadas

Estas escolhas já foram respondidas; não reabrir a mesma entrevista sem uma nova incompatibilidade concreta:

1. **Refinar a base atual**, preservando a composição com texto e matriz, em vez de substituir a identidade visual.
2. **Incluir revisão do título e texto de apoio**, aproximando a mensagem do posicionamento documentado.
3. **Desktop:** preservar EXPLORE com letras em coluna no centro vertical da borda esquerda.
4. **Mobile:** após o texto, colocar a coluna EXPLORE em uma faixa clara estreita **ao lado da matriz**, eliminando a faixa vazia de largura inteira. A coluna continua abaixo da copy, não ao lado dela.
5. **Destino:** preparar EXPLORE para a futura seção Processo. Enquanto essa seção não existir, preservar a indicação visual **sem clique e sem semântica de botão/link ativo**.
6. **Movimento:** uma entrada automática curta, concluída em até cinco segundos, seguida apenas de respostas pontuais a hover/toque. O plano adota quatro segundos como limite de implementação.

- Refinamento restrito ao hero e à documentação/testes necessários.
- Processo e formulário continuam como etapas futuras. O caminho comercial completo depende delas.
- Nenhuma API externa ou serviço será acrescentado.
- Preservar marca, símbolo e artwork existentes. Não trocar a identidade por uma nova direção visual.
- Não adicionar fontes, bibliotecas de animação, fotografia, 3D, cases ou números apenas como decoração.
- O moodboard informa princípios de composição e comportamento; não autoriza importar todas as suas imagens para o website.

### 5. States and ranges — estados e faixas

- Desktop amplo, intermediário e curto; mobile de 320 e 390 px; conteúdo ampliado em fluxo natural.
- Temas claro e escuro da matriz, com painel textual claro em ambos.
- Introdução, repouso, hover, toque, cancelamento da interação, saída de tela, aba oculta e movimento reduzido.
- EXPLORE sem destino nesta etapa e futura versão com link real para Processo.
- Fonte local carregando, quebra do título, contraste do lettering e preservação das hastes/abertura do “A”.

### 6. Interaction and layout — hierarquia e comportamento

- Desktop: partir da composição 44/56; aproximar a relação óptica entre título e lettering e manter a coluna na extrema esquerda, centralizada verticalmente.
- Mobile: copy em largura disponível, seguida de uma linha com coluna EXPLORE em faixa clara e matriz ao lado; ambas abaixo da mensagem.
- Eliminar espaços de compensação vazios. A tipografia acompanha a largura e permite aumento do conteúdo, sem recortar para forçar a primeira dobra.
- Manter h1 sólido e lettering listrado; tornar a grade mais espaçada e subordinada, com contraste localizado na interação.
- O indicativo sem destino é texto acessível, sem foco ou aparência de ação disponível. Com destino futuro, será link nativo explícito.

### 7. Constraints and open decisions — restrições e propostas

**Confirmado:** escopo de refinamento, autorização para revisar texto, localização desktop, nova relação mobile, destino futuro e movimento automático curto. Essas escolhas estão transcritas acima e não precisam de nova entrevista.

**Proposta do agente:** a copy literal abaixo, o papel mais dominante de AUGEO, os alinhamentos e os valores dimensionais do anexo de implementação. São um ponto de partida concreto para a evolução solicitada; não confundir com tokens do sistema já aprovado.

- Título proposto: **“Presença digital com direção.”**
- Apoio proposto: **“O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.”**
- Preservar Hanken Grotesk e Share Tech Mono nesta proposta. A revisão de texto é permitida; novos fatos e promessas não são.

**Fechamento de `shape`:** numa sessão de planejamento, apresentar este briefing para confirmação ou correção e encerrar sem código. Numa sessão em que o usuário já pede implementar este documento, aproveitar essa autorização; não criar uma aprovação duplicada para escolhas contidas no pedido. Se uma mudança material extrapolar o escopo, esclarecer apenas essa mudança.

## Parte III — Plano de execução com os playbooks

A sequência abaixo é uma recomendação do projeto, construída com os comandos da skill. Não é uma cadeia obrigatória universal da Impeccable. Ler cada playbook aplicável; os nomes não servem apenas como etiquetas para um plano de CSS.

### Roteamento

| Etapa | Playbook | Trabalho concreto | Condição de saída |
|---|---|---|---|
| Briefing | `shape.md` | Reutilizar a Parte II e resolver apenas alguma lacuna material ainda existente | Direção e escopo compreendidos; confirmação conforme a instrução corrente do usuário |
| Mensagem e integridade | `clarify.md`, `harden.md` | Revisar copy/descrição de busca e tratar A01 | Mensagem verdadeira; ausência de controle sem destino |
| Evolução visual | `bolder.md`, `layout.md`, `typeset.md`, `adapt.md` | Amplificar a assinatura existente, organizar hierarquia e recompor mobile | Diferença visual identificável em repouso e adaptação sem conflitos |
| Movimento | `animate.md` | Aplicar introdução finita e estados de interação | Tese de movimento cumprida, sem loop automático permanente no hero |
| Desempenho | `optimize.md` | Otimizar o warp preservando a imagem | Comparação equivalente registra a melhoria sem perda de legibilidade |
| Registro do sistema | `document.md` | Extrair o sistema efetivamente implementado | `DESIGN.md` no formato exigido pelo comando; regras da superfície mantidas no briefing/handoff |
| Acabamento | `polish.md` | Fechar os achados assumidos e conferir o caminho completo | Resultado visual e funcional validado e documentação coerente |

### Hipóteses concretas de composição para implementação

Esta seção complementa o briefing com parâmetros de trabalho; não substitui a avaliação de composição dos playbooks.

O primeiro plano concentrava-se em corrigir problemas de funcionamento e encaixe. Essas correções continuam necessárias, mas sozinhas não atendem à expectativa visual expressa na revisão do usuário. A entrega deve apresentar diferenças reconhecíveis também em uma captura estática do desktop.

Usar os elementos já existentes para construir uma hierarquia mais expressiva: **AUGEO como grande assinatura gráfica, título como bloco editorial compacto, EXPLORE como coluna periférica deliberada e grade como suporte mais espaçado**. As referências R05, R11, R14 e R21 orientam relações de escala, massa e espaço; R03 e R23 orientam a deformação localizada.

As propostas abaixo são a direção recomendada para implementação, não escolhas de valores exatos previamente aprovadas pelo usuário. Os valores são pontos de partida para composição e devem ser conferidos com o conteúdo real, sem comprometer as decisões confirmadas na Parte II.

#### Lettering AUGEO

- **Estado auditado:** Largura limitada a 527 px e aproximadamente 78,2% da área interna.
- **Proposta:** Elevar a largura para aproximadamente 88% da área interna e o limite desktop para 680 px; manter o SVG inteiro e sua proporção.
- **Resultado esperado:** A marca ocupa mais do campo visual e passa a ser a principal massa gráfica à direita, inclusive em repouso.

#### Título

- **Estado auditado:** Hanken 700, 76,32 px em 1440 px; composição determinada por `max-width:11ch` e balanceamento automático.
- **Proposta:** Em desktop amplo, trabalhar próximo de 84–88 px, peso 750, entrelinha 0,96–1; organizar a nova copy em três linhas: “Presença” / “digital com” / “direção.”.
- **Resultado esperado:** Um bloco tipográfico mais denso e intencional, com ritmo de pôster editorial e sem palavras quebradas arbitrariamente.

#### Relação título–marca

- **Estado auditado:** Texto e lettering centralizados em caixas independentes.
- **Proposta:** Alinhar opticamente o centro do lettering ao centro do bloco do título, deixando o apoio abaixo desse eixo; preservar separação física entre os painéis.
- **Resultado esperado:** Título e marca passam a se relacionar como uma única composição, em vez de duas peças centralizadas isoladamente.

#### Texto de apoio

- **Estado auditado:** Cinza, medida de até 440 px e 30 px de intervalo.
- **Proposta:** Limitar a aproximadamente 34–38 caracteres por linha, entrelinha próxima de 1,5 e intervalo de 28–32 px; manter contraste de leitura.
- **Resultado esperado:** Um grupo secundário compacto, com respiro claro e menor competição com a massa do título.

#### EXPLORE desktop

**Função confirmada pelo usuário em 2026-10-07:** a coluna deve ficar bem alongada na lateral e sugerir continuidade para a seção abaixo (Processo). Não basta ampliar sua presença editorial: a direção descendente precisa ser reconhecível em repouso, também com movimento reduzido. A seta inferior estática reforça essa leitura. O estado temporário sem clique não altera essa intenção; o link só será ativado com a seção real.

- **Estado auditado:** Fonte de 22 px, avanço vertical de 24 px; coluna de aproximadamente 288 px.
- **Proposta:** Fonte próxima de 24 px, avanço vertical proporcional próximo de 1,3em e intervalo de 0,6em entre palavras; centralização na mesma faixa extrema esquerda.
- **Resultado esperado:** Coluna alongada, legível e editorial, coerente com R14, que conduz o olhar para baixo e indica continuidade para Processo. Preservar centralização desktop e dimensionamento proporcional em janelas curtas.

#### Grade em repouso

- **Estado auditado:** Malha regular de aproximadamente 58 px e textura de scanlines distribuída por todo o campo.
- **Proposta:** Abrir a malha para aproximadamente 72 px no desktop amplo, mantendo densidade adequada em campos menores; reduzir a intensidade das scanlines em um terço.
- **Resultado esperado:** Mais espaço entre linhas e menos competição com as listras do lettering; a diferença deve ser visível antes de qualquer interação.

#### Contraste durante interação

- **Estado auditado:** Linhas e nós reagem localmente, sobre textura contínua.
- **Proposta:** Concentrar o contraste mais alto na região deformada e manter o restante da malha discreto, sem aumentar a amplitude do warp do lettering.
- **Resultado esperado:** A interação revela uma estrutura coerente e localizada, inspirada em R03/R23, enquanto a marca continua legível.

#### Mobile

- **Estado auditado:** Copy, coluna de 241 px e matriz em três blocos sucessivos.
- **Proposta:** Copy seguida por uma composição conjunta: faixa clara de EXPLORE à esquerda e matriz à direita; lettering aproveita mais da largura interna disponível.
- **Resultado esperado:** A assinatura visual aparece na primeira tela e a coluna passa a participar da composição da matriz.

Preservar Hanken Grotesk no conteúdo e Share Tech Mono no indicativo nesta proposta. A diferença estética vem de escala, composição, alinhamento, densidade e contraste. O símbolo original acompanha o alinhamento do bloco de conteúdo; evitar ampliá-lo para competir com o lettering maior.

Em 1440×900, usar a divisão 44/56 como base e conferir em conjunto o aumento do lettering, o título de três linhas e a coluna vertical. Em larguras intermediárias e janelas curtas, reduzir a escala tipográfica e o avanço da coluna para manter a composição inteira legível. Não aplicar os valores desktop amplo como mínimos fixos.

### Interfaces e implementação funcional

- Preparar EXPLORE para link explícito a `#processo`, ativado somente quando a seção real existir. Nesta etapa, usar texto acessível sem cursor de ação ou estados de botão.
- Proposta de interface interna: `motionMode?: 'ambient' | 'intro'` em `KineticMatrixProps`, padrão `ambient` para manter compatibilidade com a demonstração compartilhada; o hero usa `intro`. Não há API externa nova.
- No hero, concluir todos os pulsos automáticos em até quatro segundos, não apenas parar sua geração nesse instante. O scan percorre a coluna uma única vez.
- Separar permissão de movimento de execução momentânea do loop: o repouso após a entrada deve permitir novos eventos sem reativar animação ambiente contínua.
- Pré-calcular mapa horizontal de amostragem por quadro, reutilizar buffers e evitar desenhos idênticos; preservar DPR, interpolação, limite de deformação e retorno exato ao repouso.
- Usar faixa mobile de 64 px, intervalo após a copy de 24 px e matriz de 280–340 px como pontos de partida; ajustar com o conteúdo real e os critérios abaixo.
- Remover padding compensatório de 263 px no desktop curto e reserva de 283 px no mobile. Fonte de título próxima de 44 px em 320 px é uma hipótese de escala, não um mínimo fixo que impeça ampliação.
- Compartilhar os valores de cor relevantes entre CSS/canvas e manter o painel claro com a matriz responsiva ao tema.

### Documentação de saída conforme `document`

O futuro `DESIGN.md` deve descrever o sistema extraído da implementação, não copiar este plano. Ler `document.md` integralmente na execução e seguir seu fluxo de extração, linguagem qualitativa, arquivos auxiliares e validação. Se já existir `DESIGN.md`, seguir as instruções de atualização do playbook e a autorização da sessão; não sobrescrever silenciosamente.

O formato tem frontmatter YAML opcional com tokens reais e até oito seções canônicas nesta ordem: `Overview`, `Colors`, `Typography`, `Layout`, `Elevation & Depth`, `Shapes`, `Components`, `Do's and Don'ts`. Omitir seções irrelevantes. Não transformar hipóteses de medidas em tokens normativos antes de verificar o resultado.

Registrar o modo Persuade e a estratégia específica do hero no briefing da superfície, seguindo os mecanismos da skill; atualizar `docs/HERO_HANDOFF.md` com o estado implementado e a dependência de Processo. Os caminhos absolutos do moodboard permanecem neste handoff, não no produto ou no sistema visual.

### Critérios de aceitação e verificação

- Comparar capturas antes/depois em 1440×900, no mesmo tema e em repouso. Devem ser perceptíveis: lettering maior, bloco de título mais construído, relação de alinhamento entre título e marca, coluna EXPLORE mais presente e malha mais espaçada. Trocar apenas a copy ou ajustar paddings não satisfaz o objetivo estético.
- Verificar a composição estática antes de avaliar animações: a qualidade visual precisa se sustentar com movimento reduzido e sem interação.
- Conferir o lettering ampliado sem cortes, perda das listras ou fechamento da abertura do “A”; conferir o título sem divisões arbitrárias de palavras.
- Testar 1440×900, 900×600, 768×600, 390×844 e 320×740 nos temas claro e escuro.
- Em desktop curto, o hero deve caber na altura disponível com a copy normal, sem cortes ou sobreposição com marca/indicativo.
- No mobile com escala normal, AUGEO deve aparecer inteiro na primeira tela. Com texto ampliado, priorizar leitura e fluxo natural sem cortes em vez de forçar tudo na primeira dobra.
- Não haver overflow horizontal, inclusive com fonte raiz ampliada. Distinguir esse teste de zoom real do navegador; não declarar conformidade que não foi verificada.
- EXPLORE deve sugerir continuidade descendente em repouso e com movimento reduzido, com coluna alongada e seta inferior, sem competir com AUGEO nem sobrepor símbolo/copy. Enquanto sem destino real, não aparece na ordem de foco como ação disponível; verificar leitura acessível. Com Processo implementado, validar o link nativo para `#processo`.
- Confirmar repouso após a introdução, retomada por hover/toque, retorno ao repouso, limpeza após `pointercancel` e ausência de bloqueio da rolagem touch.
- Confirmar movimento reduzido desde a abertura e após mudança da preferência durante a interação.
- Comparar tempos de callbacks antes/depois em 1440×900, DPR 2, no mesmo cenário de ponteiro sobre o lettering e clique. Reportar mediana, p95 e long tasks sem convertê-los indevidamente em FPS ou alegações sobre aparelhos físicos.
- Preservar os testes de legibilidade, deformação limitada e abertura do “A”.
- Atualizar intencionalmente testes que pressupõem animação infinita, a copy antiga ou EXPLORE como botão ativo. Não manter o teste de uma seção injetada como prova de navegação real no protótipo.
- Executar `bun run build` e os testes Playwright pertinentes com `bun run test`. Durante a última alteração do hero, os 12 testes existentes passaram; isso é histórico, não substitui validação da futura implementação.
- Executar uma checagem final do detector conforme a skill, depois das alterações, e interpretar os achados no contexto da direção visual.

### Encerramento

Seguir o processo de verificação da skill na sessão de implementação. Usar os achados deste documento como backlog manual; não presumir que `$impeccable polish` encontrou um snapshot de critique inexistente. Na entrega, informar quais achados foram resolvidos, quais propostas visuais foram efetivamente implementadas e quais dependências permanecem, com evidência apropriada.

## Anexo A — Contexto e estado auditado

A AUGEO Creative é uma agência de direção, presença e operação digital. A contratação começa pelo entendimento do negócio. Marca, website, aquisição e operação são conectados conforme esse diagnóstico. A página deve demonstrar critério pela própria execução; não há autorização para inventar cases, clientes, métricas, depoimentos ou promessas de resultado.

O protótipo contém apenas o hero. Processo e formulário de entrada estão previstos na especificação, mas ainda não existem na página.

### Implementação existente

- React, TypeScript e Vite; estilos globais em `src/styles.css`.
- Composição do hero em `src/App.tsx`.
- Matriz e lettering reativos em `components/ui/kinetic-matrix.tsx`, com cálculos compartilhados em `lib/matrix-motion.ts`.
- Símbolo existente em `src/assets/logo/symbol.png`; lettering em `src/assets/augeo-lettering.svg`.
- Hanken Grotesk no título e texto; Share Tech Mono no EXPLORE; fontes locais.
- Desktop dividido em 44% para conteúdo e 56% para a matriz.
- EXPLORE AQUI com uma letra por linha, maior e centralizado verticalmente na extrema esquerda do desktop.
- No mobile atual, EXPLORE fica abaixo do texto, seguido pela matriz em outro bloco.
- Painel de conteúdo claro; matriz acompanha a preferência de tema do sistema e as classes explícitas de tema.
- Movimento reduzido, suspensão fora da tela, tratamento de cancelamento do ponteiro e retorno do lettering ao repouso já existem.

A posição desktop de EXPLORE e o deslocamento do conteúdo/marca foram implementados em uma tarefa anterior. Não desfazer esse trabalho. No início e no fim desta auditoria, havia alterações locais em `src/styles.css`, `tests/matrix.spec.ts` e `docs/HERO_HANDOFF.md`, além de `.codex/` e `bun.lock` não rastreados. Esses itens antecedem este documento; verificar o estado atual antes de editar e preservar trabalho alheio.

## Anexo B — Método, evidências e limites

Foram realizadas duas avaliações independentes: leitura visual (`hero_visual_review`) e auditoria técnica (`hero_technical_audit`). A avaliação visual foi concluída antes da síntese com os resultados do detector.

- Inspeção das **30 imagens locais** do moodboard, incluindo a sequência do GIF, e dos metadados CSV e três arquivos `.webloc`.
- Inspeção visual do hero real em Chromium/Playwright, desktop e mobile, temas claro e escuro.
- Viewports principais: 1440×900, 900×600, 768×700, 768×600, 390×844 e 320×740.
- Verificações adicionais: viewport CSS 320×256, ampliação da fonte raiz, estresse sintético de texto, teclado, movimento reduzido, toque sintetizado via CDP e matriz fora da tela.
- Performance medida em servidor Vite de desenvolvimento local, sem CPU throttling. Os números são tempos de callbacks, não uma medição independente de FPS nem resultados de um telefone físico.
- Os três atalhos externos não forneceram evidência visual utilizável: Instagram e YouTube não puderam ser recuperados; NONYMOUS retornou uma página de espera. A direção visual está ancorada nos arquivos locais.
- O código do projeto não foi alterado durante a auditoria. As duas avaliações independentes forneceram evidências para este relatório; não declarar que foi concluído o fluxo formal completo de `$impeccable critique`. Não existe snapshot de critique persistido. O comando `audit` não exige esse snapshot.

Capturas e scripts temporários não são dependências deste plano. As medidas relevantes foram transcritas abaixo; recriar previews quando houver implementação.

## Anexo C — Moodboard e rastreabilidade

Síntese: **estrutura precisa, comportamento instável**. Letras sólidas e legíveis sustentam a mensagem; o lettering listrado e a deformação localizada expressam a assinatura visual. A coluna vertical é um recurso editorial deliberado. A grade deve apoiar essa composição, com maior contraste na interação e menor intensidade em repouso.

As 30 imagens da pasta foram consultadas. Elas se agrupam em construção modular/tipográfica, campos e interferência óptica, hierarquia editorial e imagens humanas/materiais sob tratamento técnico. As seis referências abaixo são as âncoras adotadas no plano. Seus caminhos absolutos servem à rastreabilidade deste handoff; não copiá-los para a interface nem para `DESIGN.md`.

| Rótulo | Aplicação no plano | Caminho local exato |
|---|---|---|
| **R03 — Campo de vetores** | Resposta direcional coerente da matriz | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/3_85014b6c322d3421d1e5f22d42a7a4b1-jpg-288x286.jpg` |
| **R05 — Letra construída A.1.2** | Letra dominante e geometria subordinada | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/5_275254008_4712068832256131_2977912509754557411_....jpg` |
| **R11 — BRUTALISMUS** | Ritmo das listras e contraste tipográfico | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/11_240492466_1645658692307797_1961337462483073695_....jpg` |
| **R14 — TOKYO / Pharmacy Books** | Coluna vertical como elemento editorial | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/14_pharmacy-books.png` |
| **R21 — Air Force 1 / Utility** | Informação nas bordas e espaço central amplo | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/21_tumblr_pmunkies1s1slr2p9o1_500-jpg.jpg` |
| **R23 — Forma de onda sobre grade** | Estrutura estável com transformação localizada | `/home/luca/augeo/modular-bw-landing/src/assets/moodboard-modular/23_7d3da37efd339e4f043b0d73ac7bd67385fb26be-jpg.jpg` |

O índice original com títulos e metadados está em `src/assets/moodboard-modular/augeo.csv`. Atalhos examinados como metadados, sem evidência visual utilizável: `10_nike-adapt-bb-logo-exploration-and-pattern.webloc`, `17_nonymous-better-faster-cheaper.webloc` e `27_syn_phon-graphic-notation-by-candas-sisman.webloc`.
