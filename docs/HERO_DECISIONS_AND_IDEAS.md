# Hero — decisões e ideias

Consolidado em 2026-10-13. Aqui ficam os antecedentes da composição, propostas não implementadas, avaliações pendentes e alternativas superadas. A implementação persistente e a direção atual estão em [HERO_HANDOFF.md](HERO_HANDOFF.md); execução, testes, tooling e publicações estão em [BACKLOG.md](BACKLOG.md). Este registro não autoriza retomar propostas nem avançar blocos.

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
| Expor CTA e transformar o mobile | Usuário pediu matriz inteira como footer retangular, recuos simétricos e rolagem vertical pela área da matriz | Incorporada |
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

O usuário autorizou preparar snapshots locais para importação manual, esclarecendo que o limite MCP não impedia esse caminho. Houve geração registrada, mas os PNGs estão ausentes no checkout; disponibilidade e bloqueios técnicos ficam no backlog. Sem confirmação de importação no fill `5:30`, inversão dos vetores, avaliação ou conclusão da edição. Recuperar os artefatos é pré-requisito para a via manual.

## Alternativas e direções superadas

### EXPLORE e coluna lateral

O plano original previa EXPLORE AQUI como coluna vertical de continuidade para Processo; a entrada comercial tinha destino distinto. Até Processo existir, o texto não deveria ter ação/foco. No mobile, a coluna ocuparia uma faixa clara estreita ao lado da matriz, abaixo da copy. Essa configuração chegou a ser implementada, mas foi substituída.

A primeira evolução do bloco 2 usou título Hanken 750/86 px/0,98, apoio de 36ch e faixa mobile de 64 px. A reiteração adotou título 620/1,02 pela largura do container; o indicador usava mono 16 px, envelope de 320–440 px, seta de 48 px e intervalos de 24 px. Mobile conservava mono 14 px e seta de 40 px. Esses valores descrevem versões anteriores, não a composição persistente.

Uma rodada posterior deixou EXPLORE único, em Hanken 620/20 px, percurso de 320–400 px em `40dvh`. O usuário considerou a seta literal inadequada e a palavra sem vividez, pediu percurso próximo de 80% da tela e funcionamento independente entre letras e novo indicador. A intenção de continuidade por scroll persistiu; a solução tipográfica foi abandonada.

### Curvas e células

Referências R13, R14, R22 e R32 orientaram uma hipótese de pequenas lâminas curvas com passagem descendente; não foram copiadas como assets. A prévia implementada usou EXPLORE em 78dvh/Hanken 450/16 px, contraste das letras encerrado em 2,53 s e cinco traços curvos de 24×40 px com duas passagens encerradas em 3,7 s. O movimento não dependia de hover.

O usuário rejeitou as curvas: a geometria do campo à direita era quadrada, e o moodboard não se sobrepunha a ela. A correção experimentou três células quadradas de 4×4 px, avanço vertical de 9 px e duas passagens encerradas em 3,5 s. Essa prévia também não recebeu aprovação; o pivot seguinte abandonou EXPLORE e as células.

No planejamento de setas retro/analógicas, R03, imagem 20 (`20_07acc8112263277-6011554ed4087-png.png`) e imagem 28 (`28_933varivln4-jpg.jpg`) informaram duas hipóteses: devolver margem à copy e alinhar marca/texto/indicador, ou manter faixa lateral estreita para setas. Forma, quantidade e movimento ainda estavam abertos naquele momento. O eixo comum foi incorporado depois; a faixa lateral alternativa não permanece aprovada.

### Rodada 38/62 e primeiros triângulos

A experiência 38/62 foi rejeitada; o usuário determinou reverter tudo exceto os triângulos. Foram restaurados divisão 44/56, margens, copy, tamanho/alinhamento do lettering, temas anteriores, EXPLORE e faixa mobile. A nova prop de tema da matriz foi retirada. Não retomar a experiência sem novo pedido.

Os primeiros triângulos tinham 24×18 px, separados inicialmente por 6 px, envelope 24×42 px e contraste finito de 3,58 s. A geometria, frequência e cores foram reiteradas até a versão atual. Introdução de apenas dois ciclos, cores fixas por triângulo, inferior sempre preto e extremos de branco/preto intensos são estados superados. A correção de sobreposição preservou a ponta do triângulo ativo com SVGs separados.

### Mobile anterior e CTA oculto

A faixa lateral de 64 px e a matriz quadrada de 288–340 px pertencem ao mobile anterior. O mobile chegou a ser tratado como frente sem conceito definido; esse estado foi superado pelo footer retangular. O CTA foi inicialmente ocultado no mobile para preservar a dobra de 320×600, mas o usuário pediu expô-lo e reorganizar o hero inteiro. Não recuperar o CTA oculto, a faixa vazia ou a matriz quadrada como restrições atuais.

## Referências de contexto

- [Plano e auditoria](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md): briefing original, critérios e moodboard; EXPLORE, faixa mobile e paletas antigas são referências históricas superadas por este registro.
- [Produto](PRODUCT.md) e [contexto estratégico](CONTEXT.md): posicionamento para futuras revisões de copy.
- [Especificação](02-WEBSITE_SPEC.md): arquitetura e integração das seções futuras.

As ideias acima preservam sua origem e seu estado. Uma proposta pendente, uma execução passada e uma aprovação visual são fatos diferentes.
