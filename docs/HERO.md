# Hero — estado, decisões e continuidade

Implementação conferida no código em 2026-10-16; documentação reorganizada em 2026-10-17. As seções de composição descrevem o que existe; decisões e propostas têm estados explícitos. Execução e fila: [BACKLOG.md](BACKLOG.md). Procedimentos: [WORKFLOW.md](WORKFLOW.md). Requisitos da landing: [especificação](02-WEBSITE_SPEC.md).

## Conceito e hierarquia

A AUGEO se apresenta pelo contexto do negócio e pela conexão entre marca, website, aquisição e operação digital. O hero cumpre o papel Persuade: mensagem editorial à esquerda e assinatura AUGEO no campo da matriz à direita. A própria composição demonstra direção e execução, sem acrescentar clientes, métricas ou promessas não documentadas.

A linguagem combina **estrutura precisa e comportamento instável**: título sólido e legível, lettering listrado, grade modular e deformação localizada. Símbolo, lettering e fontes locais sustentam a identidade. O moodboard orienta geometria, ritmo e hierarquia; suas imagens não são decoração a ser incorporada à página. As referências estão no [anexo do plano](archive/HERO_AUDIT_2026-10-07.md#anexo-c--moodboard-e-rastreabilidade).

Copy aplicada:

- Título: “Presença digital com direção.”, em três linhas.
- Apoio: “O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.”
- Botão de conversão: “Apresentar negócio”, com destino `#entrada`.

A assinatura gráfica contrapõe o título; o apoio fica agrupado à mensagem, e o indicativo de continuidade ocupa a borda inferior esquerda no desktop. A composição estática mantém a leitura da marca quando o visitante prefere movimento reduzido.

## Composição desktop

A partir de 768 px, o hero usa duas colunas **44/56**, com altura mínima de 100dvh. A coluna textual concentra símbolo, título, apoio e CTA; a matriz ocupa todo o painel direito. Marca, texto, CTA e triângulos compartilham o recuo de **48 px**. O cabeçalho fica absoluto sobre a coluna textual, com altura de 96 px e símbolo de 66 px.

O título usa Hanken Grotesk local, peso **620**, entrelinha **1,02** e tracking **−0,035em**. A escala responde à largura útil da coluna (`clamp(2rem, 19.5cqw, 6rem)`), com três spans, largura máxima de 11ch e 2 px inferiores para os descendentes. O apoio usa entrelinha 1,5, largura máxima de 34ch e escala de 18–24 px; janelas curtas têm ajustes próprios de escala e espaçamento.

O painel textual tem iluminação radial branca de 2% sobre o fundo do tema, com divisória vertical de 1 px. O CTA usa cores invertidas do tema, foco laranja, brilho no hover e redução de escala ao pressionar. Permanece em linha única no desktop.

## Composição mobile

Abaixo de 768 px, cabeçalho e hero seguem fluxo vertical. O cabeçalho tem 70 px, símbolo de 58 px e recuo de 20 px. A copy usa recuos simétricos de 20 px; título, apoio e CTA antecedem a matriz. O CTA fica visível, com altura mínima de 44 px e margem superior de 24 px.

A matriz inteira foi reposicionada como **footer visual do hero mobile**, de largura integral e altura `clamp(140px, 22dvh, 180px)`, com divisória superior de 1 px e margem automática acima. O lettering fica centralizado nesse painel e usa `min(85%, 360px)`. `touch-action: pan-y` permite rolagem vertical pela área da matriz.

A superfície da copy se estende pelos 70 px do cabeçalho: um único fundo cobre símbolo e texto até a matriz, sem reiniciar a iluminação na divisão entre cabeçalho e hero. O indicativo de triângulos fica oculto no mobile.

## Temas e marca

| Elemento | Claro | Escuro |
| --- | --- | --- |
| Fundo | `#f7f7f5` | `#06070a` |
| Texto | `#111111` | `#f7f7f5` |
| Apoio/repouso do indicativo | `#61615d` | `#9e9ea2` |
| Bordas | preto a 8% | branco a 8% |
| Acento/foco | `#ff482c` | `#ff482c` |

A preferência do sistema e as classes explícitas `.light`/`.dark` controlam os temas. No escuro, o símbolo é invertido com opacidade 0,92 e o lettering com opacidade 0,88. O fundo CSS da matriz usa o token do tema; o canvas desenha sua superfície correspondente. A camada CRT do hero tem scanlines mais discretas que as da demo: 0,03 no claro e 0,0567 no escuro.

O lettering preserva geometria, proporção, listras e contra-formas. No SVG, “A” e “O” declaram `fill-rule="evenodd"` diretamente nos caminhos preenchidos pelo padrão CRT. No desktop, sua largura é `min(88%, 680px)`; o centro vertical acompanha o centro do título, medido no hero e publicado em `--hero-heading-center-y`. O alinhamento observa hero, título, apoio e CTA. No mobile, o centro é o da matriz.

## Matriz e interação persistentes

`KineticMatrix` continua um componente compartilhado, com demo em `?demo=matrix`. O hero passa `title="AUGEO"`, `titleArtworkSrc`, `enableArtworkMotion` e `gridSpacing={72}`; o padrão da demo é 58 px. A grade adapta o espaçamento às dimensões disponíveis, preservando nós e ligações no campo visível.

A composição reativa em hover já está implementada: grade e lettering respondem ao mesmo campo de ponteiro e ondas, com escala própria para a imagem. O ponteiro também é acompanhado no ancestral `.hero`, incluindo a coluna esquerda; clique/toque produz uma onda. Ao encerrar a interação, a deformação converge ao repouso sem rebote. O warp usa um mapa horizontal comum às scanlines para evitar ruptura das letras, com deslocamento máximo de 6 px e diferença máxima de 2 px entre amostras de 8 px.

O ciclo atual da matriz mantém pulsos automáticos contínuos, além das respostas pontuais. Pausa fora da tela e com documento oculto; movimento reduzido mantém grade e lettering estáticos. Rótulos técnicos `0x…` ainda aparecem após inspeção prolongada de um nó.

## Indicativo de continuidade

Dois triângulos sólidos transmitem direção descendente no desktop: cada um mede 36×27 px, com o segundo 18 px abaixo do primeiro e sobreposição de 9 px. O conjunto de 36×45 px fica centralizado no contêiner de 36×63 px. SVGs separados garantem que a ponta ativa seja pintada integralmente na interseção.

Uma passagem ocorre a cada **2,8 s**, com defasagem de **980 ms** entre os triângulos. O ciclo CSS de 5,6 s contém duas passagens: superior claro/inferior escuro, depois superior escuro/inferior claro, usando `#e2e2df` e `#20201f`. Os atrasos iniciais são 300/1280 ms. A mudança afeta fill e ordem de pintura, mantendo a geometria imóvel. Pausa fora da tela/aba oculta conserva tempo e fase; movimento reduzido usa cinza estático.

No desktop, o indicativo participa do fluxo da `.hero-copy`, depois do grupo `.hero-content` (título, apoio e CTA). Margens verticais automáticas centralizam esse grupo no espaço disponível; o indicativo fica junto à base do painel, com margem superior mínima de 32 px e recuo inferior de 28 px. Sua dimensão não encolhe no flex: variantes maiores ou com conteúdo intrínseco reservam o próprio espaço. Quando o conteúdo não cabe na altura da janela, o hero cresce e a página permite rolagem; não há coordenada vertical baseada no viewport nem altura do indicativo duplicada no cálculo de afastamento. A matriz acompanha a altura do hero.

O indicativo atual é decorativo, `aria-hidden`, sem clique ou foco. Seu sentido é continuidade por scroll; o CTA comercial tem outra função. EXPLORE e a seta anterior não fazem parte do hero implementado. O CTA aponta para `#entrada`; essa seção ainda não existe na aplicação atual.

## Fontes da implementação

- [src/App.tsx](../src/App.tsx): estrutura, copy, CTA, props e alinhamento.
- [src/styles.css](../src/styles.css): composição, temas, tipografia e animação do indicativo.
- [src/components/ScrollCue.tsx](../src/components/ScrollCue.tsx): triângulos e pausa/retomada.
- [components/ui/kinetic-matrix.tsx](../components/ui/kinetic-matrix.tsx) e [lib/matrix-motion.ts](../lib/matrix-motion.ts): grade, campo de interação e warp.
- [src/assets/augeo-lettering.svg](../src/assets/augeo-lettering.svg): marca listrada e contra-formas.

## Decisões incorporadas à base atual

| Decisão | Origem e efeito | Estado |
| --- | --- | --- |
| Preservar a identidade | Refinar símbolo original, lettering listrado, fontes locais e campo modular; o moodboard informa princípios, não uma identidade substituta | Incorporada |
| Revisar título e apoio | Mensagem adotada: “Presença digital com direção.”; contexto do negócio conecta marca, website, aquisição e operação digital | Incorporada |
| Manter desktop 44/56 | Campo da matriz como contraponto gráfico ao texto; restauração após rejeição da experiência 38/62 | Incorporada |
| Dimensionar o título pela coluna | Peso inicial 750/entrelinha 0,98 substituído por Hanken 620/1,02; escala pela largura útil | Incorporada |
| Ampliar a assinatura | Lettering passou do limite de 527 px para `min(88%, 680px)` no hero desktop, preservando SVG e proporção | Incorporada |
| Alinhar título e assinatura | Centro do lettering acompanha o centro do heading desktop; no mobile acompanha a matriz | Incorporada |
| Reunir elementos no eixo de 48 px | Em 09/10, recuo de aproximadamente 32 px foi considerado próximo demais da borda; usuário autorizou 48 px para marca, título, apoio e triângulos | Incorporada |
| Dar mais presença ao apoio | Escala 18–24 px e recuos mobile de 20 px; posteriormente medida condensada a 34ch e margem desktop de 28 px | Incorporada |
| Retirar EXPLORE | Após restaurar a composição, usuário pediu remover a palavra e sua seta, preservando os triângulos | Incorporada |
| Alternar contraste dos triângulos | Aumentar a geometria em 50%, reduzir frequência para 2,8 s por passagem, preservar ponta e trocar cores a cada passagem | Incorporada |
| Unificar temas e ampliar o campo de ponteiro | Tema escuro também na coluna textual; listeners no hero permitem alcançar a matriz a partir do painel esquerdo | Incorporada |
| Materialidade do painel e CTA | Iluminação radial sutil, divisória de 1 px e CTA comercial no painel textual | Incorporada |
| Expor CTA e transformar o mobile | Matriz inteira como footer visual retangular abaixo da copy e do botão de conversão, com recuos simétricos e rolagem vertical pela área da matriz | Incorporada; nomenclatura reafirmada pelo usuário em 13/10 |
| Manter fundo contínuo no mobile | Correção do fundo atrás do cabeçalho aprovada pelo usuário; um único painel cobre símbolo e texto | Incorporada e aprovada |
| Preservar contra-formas | Preenchimento direto dos caminhos A/O com `evenodd`, sem alterar geometria ou interação | Incorporada |

Implementação não equivale a aprovação visual global. A aprovação da correção do fundo mobile é específica; não encerra todo o bloco 2.

## Avaliações e decisões ainda abertas

| Tema | O que falta decidir ou avaliar | Limite |
| --- | --- | --- |
| Composição desktop | Avaliação do usuário após alinhamento, apoio maior, painel e indicador | Sem fechamento visual global registrado |
| Hero mobile | Conferência da versão publicada no dispositivo do usuário | Correção do fundo aprovada; avaliação em aparelho é distinta |
| Contra-forma no deploy | Confirmar visualmente A/O no navegador e viewport do relato de 11/10 | Correção SVG já publicada; não há nova publicação pendente por esse motivo |
| Integração de continuidade | Quando Processo existir, usar link nativo para `#processo` com foco/nome acessível coerentes | Indicativo atual permanece decorativo; não restaurar EXPLORE |
| Entrada comercial | Conectar “Apresentar negócio” ao formulário real de `#entrada` | CTA e continuidade têm destinos diferentes; seção ainda ausente |
| Introdução da matriz | Entrada concluída em até quatro segundos, depois repouso e respostas pontuais | Bloco 3 ainda não implementado; loops atuais continuam. Não estender essa proposta aos triângulos sem decisão própria |
| Desempenho do warp | Otimizar e comparar em DPR 2 preservando imagem | Bloco 4 depende da avaliação do anterior |
| Registro do sistema | Extrair `DESIGN.md` da implementação | Bloco 5 ainda não iniciado; não substituir por um relatório histórico |
| Acabamento | Validação integrada e fluxo completo de `polish` | Bloco 6 ainda não iniciado |
| Escala em 4K | Limites de título/assinatura deixaram a composição esparsa na reiteração histórica | Observação, sem nova direção autorizada |

O bloco 1 foi registrado como concluído. O bloco 2 foi implementado e reiterado, com pendências visuais e metodológicas. Não há autorização para avançar automaticamente ao bloco 3. A auditoria de 07/10 é um baseline histórico; seus achados precisam ser reconciliados com a implementação antes de orientar nova tarefa.

## Propostas de Figma — frente independente

Pedido de 10/10: inverter a hierarquia da referência [AUGEO HERO](https://www.figma.com/design/wtc641vxh05ubxXIgrtzMy/AUGEO-HERO?node-id=5-45), com coluna esquerda dark, matriz light e marca/tipografia invertidas. Dimensões, divisão 44/56, posições, tipografia e máscaras seriam preservadas. Essa edição não determinava mudança permanente na landing.

A proposta de dois tons claros de intensidades diferentes nos triângulos do Figma não foi aplicada nem avaliada. Não autoriza uma nova animação web. A prévia local usou esquerda `#111111`, título `#f7f7f5`, apoio `#b7b7b2`, marca invertida e triângulos `#e2e2df`/`#858580`. O lettering do Figma é vetorial próprio; a prévia web não comprova equivalência pixel a pixel.

O usuário autorizou preparar snapshots locais para importação manual, esclarecendo que o limite MCP não impedia esse caminho. Os PNGs, ausentes na conferência anterior, estão presentes localmente na conferência de 17/10: `docs/refs/figma/augeo-matrix-light-2x.png` e `docs/refs/figma/augeo-hero-dark-left-light-matrix-preview-2x.png`, ainda não rastreados pelo Git. Disponibilidade local não comprova origem, equivalência visual, importação no fill `5:30`, inversão dos vetores, avaliação ou conclusão da edição. Conferir adequação dos artefatos antes de retomar a via manual; evidências técnicas ficam no [histórico](archive/EXECUTION_HISTORY.md).


## Plano vigente por blocos

Esta sequência mantém os fluxos do plano original sem recuperar suas escolhas superadas. Ler integralmente o playbook aplicável na execução, conforme [WORKFLOW.md](WORKFLOW.md#impeccable). Não executar blocos pendentes só porque estão documentados.

| Bloco | Fluxos e trabalho | Estado e condição de saída |
| --- | --- | --- |
| 1 — Mensagem e integridade | `clarify`, `harden`: copy verdadeira e retirada da falsa ação EXPLORE | Conclusão histórica para aquele alvo; não certifica o CTA comercial atual, cuja seção ainda não existe. |
| 2 — Evolução visual | `shape`, `bolder`, `layout`, `typeset`, `adapt`: hierarquia, tipografia e composição responsiva | Implementado e reiterado; avaliação visual global e reconciliação das etapas metodológicas continuam pendentes. |
| 3 — Movimento | `animate`: entrada da matriz em até quatro segundos, incluindo término dos pulsos; depois repouso com respostas locais | Não implementado. Não aplicar esse limite aos triângulos sem decisão específica; preservar a demo ambiente e permitir interação após a introdução. |
| 4 — Desempenho | `optimize`: localizar gargalo e comparar antes/depois no mesmo cenário DPR 2, 1440×900, ponteiro sobre lettering + clique | Pendente, após avaliação do bloco anterior. Registrar mediana/p95 dos callbacks e long tasks; preservar resolução, listras, contra-formas, interpolação e retorno ao repouso. |
| 5 — Sistema visual | `document`: extrair sistema da implementação, com confirmação/refinamento e artefatos exigidos pelo playbook | DESIGN.md, sidecar e briefing formal da superfície pendentes. Este arquivo não os substitui. `extract` somente quando houver trabalho real de reutilização. |
| 6 — Acabamento | `polish`: verificar o caminho em escopo e os achados ainda assumidos | Pendente. Sem snapshot formal de critique; usar achados manuais e evidências válidas, sem fabricar fluxos ou nota de auditoria. |

Para o movimento, `motionMode?: 'ambient' | 'intro'` era uma proposta de interface; não existe no componente atual e sua adoção deve ser avaliada na implementação. Para o warp, pré-cálculo do mapa horizontal e reutilização de buffers são hipóteses a medir, não ganhos já demonstrados.

### Critérios atuais de verificação

- Preservar identidade, divisão 44/56, temas unificados, copy legível, mobile com matriz inferior/CTA visível e indicativo decorativo. Não restaurar EXPLORE, faixa lateral mobile, tema dividido, CTA oculto ou experiência 38/62 rejeitada.
- Comparar composição em repouso, claro/escuro e movimento reduzido, antes de avaliar animação. Cobrir 1440×900, 900×600, 768×600, 390×844 e 320×740, além dos extremos pertinentes ao alvo.
- Conteúdo e indicativo permanecem separados; desktop pode crescer e permitir rolagem. Ampliação de texto não deve recortar conteúdo nem gerar overflow horizontal. Fonte raiz aumentada não equivale a zoom real.
- No mobile normal, preservar a assinatura inteira na primeira tela nos contextos de teste existentes; com texto ampliado, priorizar leitura e fluxo natural.
- Para mudanças de movimento, verificar introdução/repouso/interação, cancelamento, retorno exato, mudança de preferência reduzida, saída de tela e aba oculta. Preservar touch/scroll, letras e contra-formas.
- Para alterações funcionais, executar build e suíte pertinentes conforme WORKFLOW; para visual, usar inspeção renderizada e detector aplicável. Resultados em Chromium/emulação não comprovam aparelhos físicos ou outros motores.

Os critérios antigos e a nota 13/20 pertencem à [auditoria histórica](archive/HERO_AUDIT_2026-10-07.md). Alternativas e sua rejeição estão no [histórico](archive/EXECUTION_HISTORY.md#alternativas-visuais-superadas). A correção de colisão de 16/10 está implementada/publicada, com avaliação visual do usuário ainda pendente; não encerra o bloco 2.
