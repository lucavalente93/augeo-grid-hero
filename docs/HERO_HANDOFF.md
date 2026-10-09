# Hero — ponto de retomada

Atualizado em 2026-10-09. Para tarefas do hero, leia este arquivo primeiro; ele concentra o estado atual. A rotina de leitura e atualização dos registros está no [AGENTS.md do projeto](../AGENTS.md). O [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md) guarda a especificação, as evidências da auditoria e as referências visuais, sem substituir este registro de progresso.

## Registro das implementações pendentes — 2026-10-09

Solicitado registrar os commits atrasados antes de migrar o tooling para Bun e limpar arquivos obsoletos. A implementação existente foi preservada: EXPLORE removido, triângulos com cores alternadas, título dimensionado pela coluna (Hanken 620), divisão 44/56, temas e faixa mobile. Nenhuma nova direção visual ou avanço de bloco.

Validação atual antes do commit: `bun --bun run build` aprovado; `git diff --check` aprovado. A tentativa de iniciar Vite com `bun --bun run dev --port 5173` falhou por restrição de abertura de porta no sandbox desta sessão (`EPERM`), inclusive em `127.0.0.1`; o usuário confirmou que `bun run dev` abre normalmente essa porta no seu terminal. A suíte completa em Chromium ainda não foi revalidada nesta sessão; resultados anteriores abaixo são históricos. Os registros Impeccable foram preservados, sem novo comando/playbook ou declaração de fluxo concluído.

Implementação registrada em `7f5f33c` (`feat(hero): replace Explore with animated triangle cue`). A regra pendente do guia pessoal foi separada em commit próprio; guia mantido local e fora do versionamento. Próxima ação de manutenção: migrar os comandos para Bun e realizar limpeza conservadora. A próxima ação visual continua sendo avaliação do indicador pelo usuário.

## Ajuste atual — cores alternadas a cada passagem

Solicitação mais recente implementada: onde o pulso começou claro, a passagem seguinte começa escura e vice-versa, continuamente. Primeira passagem: superior branco suave `#e2e2df`, inferior carvão `#20201f`; segunda: superior carvão, inferior branco suave; terceira repete a primeira. Mesma sequência nos dois temas, preservando seus cinzas de repouso.

- Geometria aprovada preservada: dois triângulos de 36×27 px, segundo 18 px abaixo do primeiro, sobreposição de 9 px; composição 36×45 centralizada em contêiner 36×63. Dois SVGs sobrepostos com o mesmo viewBox; o SVG ativo fica acima do outro, incluindo a ponta inteira na área compartilhada. Eixo lateral, limite inferior, hero e mobile oculto preservados. Indicador decorativo sem ação/foco.
- Ritmo aprovado preservado: uma passagem a cada 2,8 s, defasagem superior/inferior de 980 ms, atrasos iniciais 300/1280 ms. Keyframes de 5,6 s contêm duas passagens, uma por cor; isso permite alternância infinita sem acelerar/desacelerar os pulsos. Apenas fill e ordem de pintura local, sem deslocamento/layout/dependências. Pausa fora da tela/aba oculta retoma tempo e fase de cor; reduced motion estático cinza.
- Histórico imediato: tamanho ampliado em 50%; ciclo reduzido em frequência de 1,6 para 2,8 s; ponta superior antes encoberta corrigida com SVGs separados; inferior anteriormente fixo em preto e extremos depois suavizados. A introdução finita de dois ciclos e cores fixas por triângulo estão superadas. Não retomar 38/62 ou outros blocos do hero.
- Fluxos Impeccable `animate` → `polish` reaplicados ao indicador, usando contexto CLI e playbooks já lidos na sessão; implementação, testes, handoff e capturas anteriores consultados. `craft-floor` relido imediatamente antes de editar. Tese: contraste descendente com cores trocadas em cada passagem, pausa entre pulsos; orçamento continua limitado a dois caminhos pequenos. Estados de formulário/erro/carregamento e feedback de controle não se aplicam. Geometria, tema, ponta, interrupção e diff conferidos, sem conclusão dos blocos do hero inteiro.
- Build aprovado (`npm run build`). Testes atualizados para primeira passagem, inversão e retorno às cores iniciais nos dois temas, além de pausa/retomada, reduced motion, dimensões e ponta. Primeira execução encontrou troca prematura de camada na pausa anterior à segunda passagem; corrigida mantendo `z-index: 1` até 49,999% do ciclo. Execução final `npx playwright test tests/scroll-cue-preview.spec.ts`: **12/12 aprovados**. Sem nova execução da suíte da matriz; 24/24 anteriores são evidência histórica.
- Uma rodada visual agrupada após a correção: claro/escuro em 1440×900, 900×600, 768×600 e 844×390, mobile 390×844, 320×740 e 320×600. Capturas temporárias não versionadas em `test-results/scroll-cue/`; detalhes em `/tmp/cue-alternating-colors.png` e panorama `/tmp/cue-alternating-layout.png`. Ponta integral e troca de cor confirmadas. Detector manual executado uma vez sobre `src/styles.css`, sem achados, antes da correção pontual de camada; não repetido. Diff final sem erros.

Limites: Chromium/emulação, sem aparelhos físicos/outros motores ou medição de frames em hardware. Aba oculta testada via estado sintético. Branco suave tem pouco contraste sobre a coluna lateral clara existente, em ambos os temas; preservado por solicitação de alternância sem ampliar a tarefa ao fundo do hero. Alterações locais anteriores preservadas; sem commit/push. Próxima ação: avaliação do indicador pelo usuário, sem avançar aos outros blocos.

## Histórico — retirada de EXPLORE


Após confirmar a restauração, o usuário pediu retirar apenas EXPLORE. Removidos palavra, markup acessível, seta antiga, estilos e keyframes exclusivos. Triângulos preservados na posição lateral; divisão 44/56, margens, tipografia, símbolo, lettering, temas e faixa mobile de 64 px permanecem como restaurados. Não retomar a rodada 38/62. Sem commit/push. As seções abaixo documentam o histórico, não uma instrução para recolocar EXPLORE. O lettering conserva as decisões presentes no início da rodada (SVG, listras, proporções, interação e largura min(88%, 680px)); não foi recuperada uma versão antiga da marca. Validação deste ajuste: build e 14/14 testes aprovados, detector geral sem achados e diff sem erros.

## Correção mais recente — reversão da rodada 38/62

O usuário rejeitou a rodada e determinou: reverter tudo com exceção dos triângulos. A divisão 44/56, margens, copy, tamanho/alinhamento do lettering, temas anteriores da matriz, EXPLORE e faixa mobile de 64 px foram restaurados ao estado local encontrado no início desta sessão. API de KineticMatrix restaurada, sem a nova prop de tema. Mantidos apenas dois triângulos sólidos de 24×18 px com intervalo de 6 px no componente ScrollCue, no posicionamento anterior do indicativo lateral. Movimento de contraste finito (3,58 s), pausa fora da tela/aba oculta e reduced motion estático. Nenhuma reformulação da matriz ou polish; sem commit/push.

Validação restaurada: build aprovado, 16 testes aprovados em execuções separadas (15 + confirmação de desktop curto), detector geral sem achados e diff sem erros. Lettering presente na captura restaurada inspecionada; detalhes no registro da reiteração.

A rodada 38/62 e suas capturas estão superadas. Não retomá-la sem novo pedido. Preservadas as alterações locais anteriores. Próxima ação: avaliação do estado restaurado com os triângulos.

## Onde estamos

Refinamento do hero, com parada ao concluir cada bloco para informar o usuário. O bloco 1 está registrado como concluído; o bloco 2 foi reiterado a pedido do usuário e aguarda avaliação visual. As etapas disponíveis de `shape`, `layout`, `typeset` e `bolder` foram executadas e registradas; a cobertura de `adapt` permanece limitada a Chromium/emulação, sem aparelhos físicos ou outros motores. Ver o registro da reiteração antes de avançar.

| Bloco | Estado | Entrega |
|---|---|---|
| 1 — Mensagem e integridade | Concluído | Copy e descrição de busca alinhadas; retirada a ação sem destino (A01) |
| 2 — Evolução visual | Reiterado; avaliação visual pendente e limites de adapt registrados | Título dimensionado pela coluna; EXPLORE removido e substituído por dois triângulos de contraste alternado; base visual preservada |
| 3 — Movimento | Próximo após avaliação e fechamento do bloco 2 | Introdução de até quatro segundos; repouso e respostas pontuais |
| 4 — Desempenho | Pendente | Otimização do warp, comparação em DPR 2 e preservação da imagem |
| 5 — Registro do sistema | Pendente | DESIGN.md extraído da implementação e briefing da superfície |
| 6 — Acabamento | Pendente | Validação integrada e fechamento dos achados |

## Histórico — intenção de EXPLORE (superada)

Esta seção descreve uma direção anterior, substituída pela retirada de EXPLORE e pelos triângulos registrados no início do documento. Não orienta a implementação atual.

É um **indicativo vertical de continuidade para Processo**, abaixo do hero. Deve conduzir o olhar para baixo: coluna alongada na borda esquerda, letras em sequência descendente e seta inferior. O alongamento faz parte da evolução visual; a centralização vertical desktop permanece. A hero mobile é uma frente independente, ainda sem conceito definido; sua apresentação atual é provisória.

O estado temporário como texto vem do plano, achado A01 e Parte II §4, item 5: enquanto Processo não existir, não há clique nem semântica de botão/link ativo. Isso preserva o indicativo visual, não elimina sua função de continuidade. Quando a seção real existir, trocar o contêiner por link nativo `href="#processo"`, com foco e nome acessível coerentes. Não criar uma seção artificial apenas para ativar o controle ou passar testes.

Evolução anterior: coluna ampliada para fonte de 24 px e avanço de 1,3em; esses valores são históricos e foram substituídos na reiteração abaixo. O estado atual desktop é a prévia descrita abaixo: EXPLORE em Hanken Grotesk 450/16 px, percurso de 78dvh e componente independente de três células quadradas. Mobile conserva fonte mono de 14 px, seta de 40 px e faixa provisória de 64 px; apenas o texto compartilhado foi atualizado. O movimento finito da matriz permanece no bloco 3.

## Estado implementado e validação

- Mensagem aplicada: “Presença digital com direção.” O apoio parte do contexto do negócio para conectar marca, website, aquisição e operação digital.
- Base preservada: símbolo original, Hanken Grotesk local, lettering AUGEO listrado, divisão desktop 44/56, temas da matriz, deformação localizada, retorno exato ao repouso e versão estática com movimento reduzido.
- Bloco 1: build aprovado, 12/12 testes Playwright em Chromium e detector CLI sem achados. O teste de EXPLORE verifica leitura acessível, ausência de ação/foco e ausência de navegação; substituiu o teste com seção injetada.
- Correção antecipada de EXPLORE: build aprovado, 12/12 testes passando, detector sem achados e capturas inspecionadas com movimento reduzido em desktop, desktop curto e mobile. Em 1440×900, a coluna passou de aproximadamente 288 px para 405 px, incluindo a seta. Links locais da documentação verificados.

### Overview explicativo local — 2026-10-08

- Criado, a pedido do usuário, um guia pessoal informal em docs, excluído do versionamento por regra específica no `.gitignore`. Guia complementado com explicação individual dos blocos 1–6, seus objetivos, trabalhos, condições de conclusão e estados; isso encerra a solicitação documental, sem fechar blocos de implementação. Conteúdo privado não incorporado aos documentos compartilhados. Exclusão confirmada com `git check-ignore -v`, ausência confirmada em `git ls-files` e links locais do guia verificados.
- Fluxo aplicado: orientação de metodologia pelo caminho **Workflow questions** do routing da Impeccable. `impeccable context` realmente executado; resolveu `docs/PRODUCT.md`, sem DESIGN.md ou briefing formal de superfície. Documentos de produto, estratégia, arquitetura, operação e estágio cruzados com o código e referências dos playbooks. Nenhum fluxo de refinamento declarado concluído por essa leitura.
- Entrega apenas documental: sem alteração de UI, nova suíte, detector, auditoria, critique ou polish. Pendências e ponto de avaliação do bloco 2 preservados; próxima ação do hero permanece a registrada abaixo. Push anterior confirmado pelo usuário; sem novo commit/push nesta entrega.

### Organização do documento de produto — 2026-10-08

- `PRODUCT.md` (singular) movido para `docs/PRODUCT.md`, sem alterar o conteúdo. Links de entrada no AGENTS e neste handoff atualizados; a orientação de retomada no plano agora explicita o caminho a partir da raiz. Para consultar o contexto de produto da skill, usar esse documento como fonte existente, sem criar uma cópia concorrente na raiz.
- Links locais de todos os documentos Markdown do projeto e caminhos citados no documento de produto verificados após a movimentação; diff sem erros de whitespace. Nenhuma alteração de código nesta etapa; build e 13 testes da reorganização dos assets permanecem a validação técnica pertinente.
- Commit de assets: `f862438` (`refactor(assets): centralize logo and moodboard assets`). A movimentação deste documento foi registrada separadamente em `docs(product): move product context into docs`; push realizado pelo usuário, conforme confirmação posterior nesta conversa. As tentativas anteriores do agente falharam por configuração SSH e DNS; o branch local agora está alinhado ao `origin/main` conhecido localmente. Não houve verificação remota adicional ou ensaio de produção nesta atualização. Nenhuma configuração SSH ou remote foi alterado.

### Organização dos assets — 2026-10-08

- Moodboard centralizado em `src/assets/moodboard-modular/` e marca/estudo tipográfico em `src/assets/logo/`. Import do símbolo, resumo do produto e referências do plano atualizados, inclusive os seis caminhos absolutos e o índice CSV. Lettering e fontes atuais preservados.
- Integridade: 38 arquivos comparados por SHA-256 antes/depois, sem alteração de conteúdo; Git reconheceu 38 renomes com 100% de identidade em index temporário, sem modificar o index real. Verificadas 33 referências locais da documentação e as 33 entradas do CSV; nenhum caminho operacional antigo encontrado na busca do projeto.
- Validação desta reorganização: `npm run build` aprovado; `npx playwright test` com 13/13 testes aprovados em Chromium; verificação adicional temporária no navegador confirmou o símbolo no novo caminho, com dimensões naturais positivas e sem falhas de requisição. `git diff --check` aprovado. Ensaio adicional e manifesto de hashes estão em `/tmp/augeo-assets-runtime-check/` e `/tmp/augeo-assets-move-manifest.json`, são temporários e não constituem a única evidência.
- Tentativa inicial por `npm test` não iniciou o servidor por restrição de porta (`EPERM`); execução pelo comando Playwright autorizado passou. Nenhuma mudança visual ou avanço dos blocos do hero; pendências Impeccable e avaliação do bloco 2 preservadas. Sem commit/push; `.codex/` e `bun.lock` preexistentes preservados.
- Limites: `legacy.html` já referencia `./augeo-logo.png`, ausente antes da movimentação; não corrigido nesta tarefa. A busca cobre arquivos acessíveis do projeto, sem garantir atalhos externos desconhecidos. Próxima ação do hero permanece a registrada abaixo.

### Bloco 2 — evolução visual implementada

- Lettering em 88% da área interna, com limite de 680 px: aproximadamente 639 px em 1440×900, ante 527 px. SVG, proporção, listras e abertura do “A” preservados.
- Título em Hanken 750, 86 px no desktop amplo, entrelinha 0,98 e três linhas editoriais. Apoio limitado a 36ch, com intervalo de 30 px e entrelinha 1,5. Copy do bloco 1 preservada.
- Centro do lettering acompanha o centro do título desktop por medição com `ResizeObserver`; o componente acompanha mudanças no quadro de posicionamento para manter a origem do campo de interação correta. No mobile, lettering centralizado na matriz.
- Grade do hero com espaçamento máximo de 72 px e scanlines um terço mais discretas nos dois temas. Nova prop opcional `gridSpacing` preserva o padrão de 58 px da demonstração compartilhada.
- Removidas reservas compensatórias de 263/283 px. Hero em 900×600 e 768×600 agora mede 600 px de altura, com conteúdo normal inteiro e sem sobreposição.
- Mobile: copy seguida, após 24 px, por EXPLORE + matriz. Matriz de 288–340 px; o mínimo de 288 px acomoda a coluna de aproximadamente 286 px, inclusive em 320×600. AUGEO inteiro na primeira tela em 390×844 e 320×740; nesta última, o artwork termina em aproximadamente y=535 px, ante y=849 px na captura anterior.
- Validação: build aprovado, 13/13 testes Playwright em Chromium e detector CLI sem achados. Inspeção visual nos cinco viewports previstos e confirmação adicional em 320×600, nos temas claro/escuro. Fonte raiz a 200% sem overflow horizontal nos cinco viewports previstos; esse ensaio não equivale a zoom real do navegador.
- Testes preservam leitura/foco do indicativo, temas, toque emulado, deformação limitada, retorno ao repouso e abertura do “A”. Capturas de comparação antes/depois disponíveis localmente em `test-results/hero-block2/`; são artefatos temporários não versionados.
- Limites: validação em Chromium, sem ensaio em aparelhos físicos ou outros motores. Introdução finita e otimização de desempenho não foram antecipadas; loops automáticos atuais permanecem até o bloco 3.

## Próxima ação e limites

### Pivot em planejamento — retirada de EXPLORE

O usuário abandonou EXPLORE e pediu planejar a redistribuição/realinhamento do espaço liberado, considerando somente setas com linguagem retro/analógica no lado esquerdo. As três células também deixam de constituir direção aprovada. Código ainda conserva a prévia anterior; não houve implementação deste pivot.

Referências ampliadas nesta avaliação: R03 (campo de vetores), imagem 20 (`20_07acc8112263277-6011554ed4087-png.png`, geometria angular gráfica) e imagem 28 (`28_933varivln4-jpg.jpg`, seta de orientação em diagrama analógico). Hipótese recomendada: devolver parte da margem à copy e alinhar marca/título/apoio e um indicativo inferior pelo mesmo eixo; alternativa em discussão: faixa lateral estreita para setas. Pergunta estruturada enviada sobre essa decisão espacial; forma, quantidade e movimento serão definidos a partir da escolha. Não preencher automaticamente toda a coluna revogada.

Fluxo atual: descoberta/briefing de shape, com inspeção de implementação e referências; nenhuma direção confirmada, novo fluxo de layout ou typeset concluído, teste executado ou UI alterada nesta etapa. Mobile independente, sem avanço ao bloco 3; sem commit/push.

### Prévia atual — células do grid, após correção visual

O usuário rejeitou as cinco curvas: a geometria do grid à direita é quadrada, e curvas adicionais não combinam com a composição. O moodboard não se sobrepõe à geometria já estabelecida no hero. Substituído o desenho do componente por três células quadradas de 4×4 px, empilhadas com avanço de 9 px. Movimento descendente discreto transmitido entre células, duas passagens encerradas em 3,5 s; reduced motion estático. Sem curvas, ponta de seta ou trilho. Três células permitem reconhecer a direção sequencial com menos massa; é hipótese visual a avaliar, não nova decisão aprovada pelo usuário.

EXPLORE permanece em 78dvh/Hanken 450/16 px; título, marca, matriz e mobile preservados. Geometria reduzida a SVG rects no mesmo componente. CLI realmente executada: build e detector geral (`[]`). Testes ajustados para três células e término finito. Execução: 15 passaram (14 permanentes + captura temporária); o teste mobile ampliado foi interrompido por destruição do contexto durante navegação e passou na confirmação isolada, sem edição de UI. Assim, os 15 testes permanentes têm resultado aprovado, em execuções separadas. Captura temporária removida da suíte. Tentativas de servidor com EPERM seguidas de execução normal disponível; sem alteração de configuração. Capturas/GIF atuais em `/tmp/augeo-grid-cue-preview/`, substituindo os artefatos curvos anteriores. Fluxo é correção localizada da prévia para avaliação, sem novo comando completo Impeccable, polish ou avanço de bloco. Sem commit/push. Próxima ação: avaliar o resultado visual antes de fechar bloco 2.

### Prévia anterior — EXPLORE e onda descendente (rejeitada)

O usuário autorizou mostrar a ideia e depois substituir a versão atual. Implementação desktop ativa na rota normal, sem flag ou variante de URL: EXPLORE em Hanken 450/16 px ocupa 78dvh (702 px em 1440×900), com sete letras distribuídas. Novo componente `src/components/ScrollCue.tsx`, independente das letras: cinco traços curvos em SVG de 24×40 px, passagem descendente duas vezes, encerrada em 3,7 s. Em janelas de até 500 px de altura, componente com 32 px para evitar sobreposição à última letra. Letras recebem uma passagem de contraste descendente, encerrada em 2,53 s; sem hover. Ambos estáticos em movimento reduzido. Indicativo permanece sem ação/foco até Processo existir.

Referências R13/R22/R32 orientam módulos, curvas e repetição; geometria própria em SVG, sem nova imagem ou dependência. Título, assinatura e matriz preservados. Mobile mantém apresentação anterior e seta provisória; hero mobile independente. Esta é uma prévia para avaliação, não aprovação visual nem encerramento do bloco 2/3.

Metodologia: playbook animate aplicado à prévia — função de continuidade definida pelo usuário, tese de passagem descendente finita, implementação CSS/SVG, inspeção e teste de repouso/reduced motion. Orientações de layout/typeset preservam hierarquia e ritmo; avaliação visual das referências separada do detector. Não declarar fluxos completos layout/typeset/animate encerrados: sem novos scans iniciais por escopo, sem perfil de performance/hardware, ensaio de suspensão por aba/offscreen ou refinamento integrado do bloco 3. Nenhum polish executado.

Evidências: build aprovado e detector geral `[]`; suíte ampliada para 15 testes, incluindo término finito, mudança de reduced motion e geometria independente. Primeira rodada identificou sobreposição de 5 px em 844×390, corrigida pela altura compacta do componente. Capturas em `/tmp/augeo-explore-desktop/`; hero estático e GIF ampliado do componente em `/tmp/augeo-scroll-preview/hero.png` e `movimento.gif`. GIF gerado de 40 frames do navegador com tempos de animação controlados (100 ms), ampliado 3×; replay do arquivo não representa loop infinito no site. Capturas temporárias, decisões/medidas persistidas aqui. Limitações: Chromium/emulação; sem teste de navegação real para Processo, que ainda não existe.

Próxima ação: avaliação visual desta prévia; não avançar à matriz do bloco 3. Sem commit/push. Alterações anteriores preservadas.

### Correção do usuário e direção em estudo — continuidade por scroll

A entrega desktop abaixo não foi aprovada visualmente. O usuário considera a seta literal inadequada e EXPLORE sem vividez; esclareceu que o indicativo deve sugerir continuidade por scroll para a próxima seção. EXPLORE deve percorrer quase 80% da tela verticalmente. Letras e novo indicativo precisam funcionar independentemente. Limites de 320–400 px e tese baseada em hover deixam de representar a intenção atual; código ainda conserva esses valores até nova implementação.

Moodboard local inspecionado por panorama das imagens e leitura ampliada de R13 (`13_untitled.jpg`), R14 (`14_pharmacy-books.png`), R22 (`22_image-png.png`) e R32 (`32_764862903_17908699779452504_1618777655514147151....jpg`). Proposta em estudo: substituir trilho/ponta por sequência pequena de lâminas curvas com deslocamento descendente transmitido entre módulos; EXPLORE longo e sólido, com uma passagem breve de contraste de cima para baixo. Movimento deve comunicar scroll, sem dependência de hover. Referências orientam forma/ritmo; não são copiadas como assets.

Nesta etapa houve inspeção visual e leitura dos playbooks `shape`/`animate`; nenhum fluxo completo de animate ou shape foi declarado concluído, nenhuma UI ou teste alterado. Direção ainda proposta, pendente de avaliação; timing, geometria final e estados serão definidos antes de implementação. Mobile continua frente independente; não avançar à reformulação da matriz do bloco 3. Panorama temporário em `/tmp/augeo-moodboard-review.jpg`.

### Rodada anterior — EXPLORE desktop, 2026-10-08

- Direção autorizada: uma palavra, Hanken Grotesk 620, letras sólidas de 20 px; percurso de 320–400 px em `40dvh`, seta de 48 px e intervalo terminal de 24 px. Divisão EXPLORE/AQUI e intervalo entre palavras removidos. Nome acessível “Explore”, sem clique, destino ou foco. Tratamento desktop a partir de 768 px; título, assinatura, matriz, interação e API pública preservados.
- Mobile: somente texto compartilhado alterado. Fonte/altura/seta/estrutura provisórias preservadas. Sua futura hero é uma frente independente, sem conceito definido, e não condiciona o fechamento visual desktop. Testes mobile desta rodada são regressão, não conclusão de `adapt`.
- `layout` e `typeset`: avaliações visuais/source antes dos scans, tese, implementação e verificação disponíveis executadas. Registro detalhado em [HERO_BLOCK2_REITERATION.md](HERO_BLOCK2_REITERATION.md), seção da rodada atual. CLI realmente executada: `context --target src`, `detect` inicial/final com escopos layout/type e geral final (todos `[]`); nenhum verbo CLI homônimo, `polish`, novo audit ou critique.
- Validação: `npm run build` aprovado; `npx playwright test` com 14/14 testes permanentes aprovados em Chromium. Novo teste cobre cinco viewports desktop, dois temas e duas preferências de movimento: sete letras equidistantes, contenção, fonte Hanken, leitura acessível e ausência de overflow horizontal. Capturas reduzidas em `/tmp/augeo-explore-desktop/`; inspeção também da captura mobile da suíte. Alturas: 400 px em 1920×1080, 360 px em 1440×900 e 320 px nos desktops curtos. `git diff --check` aprovado.
- Limites: Chromium/emulação; sem aparelhos físicos, outros motores, zoom real ou nova medição de CLS/rede. Primeira execução não iniciou o servidor; tentativa separada de Vite explicitou `EPERM` de porta. Nova execução normal de Playwright iniciou o servidor e passou. Artefatos de captura são temporários; decisões e medidas ficam neste registro.
- Próxima ação: avaliação visual do usuário do bloco 2 desktop. Parar antes do bloco 3. Hero mobile permanece independente; sem commit/push, preservadas alterações locais anteriores.

### Reiteração anterior do bloco 2 — histórico de 2026-10-08

- **Correção e autorização:** o usuário apontou falta de coesão/sutileza entre EXPLORE e seta e uso insuficiente do espaço pela tipografia; depois autorizou implementar o plano. A aprovação visual continua pendente.
- **Mudanças:** título Hanken 620/1,02, escala pela largura útil com container (aproximadamente 94,9 px em 1440×900), mantendo copy e três linhas. Coluna desktop centralizada na margem lateral, envelope de 320–440 px, letras de 16 px, intervalos de 24 px e seta longa de 48 px. Mobile mantém faixa de 64 px, letras de 14 px e seta de 40 px, altura vinculada à matriz e margens de 24 px. Varredura duplicada removida para estabilidade visual; sem antecipar o movimento da matriz do bloco 3.
- **Fluxos:** `shape` confirmado pela autorização. `layout`/`typeset`: avaliação visual independente, scans iniciais, tese, implementação e verificação por evidências; `bolder`: teste de estrutura e preservação de identidade/escopo; `adapt`: contextos, estratégia, implementação e verificação disponível, com lacunas de hardware/motores explicitadas. Passos e evidências estão em [HERO_BLOCK2_REITERATION.md](HERO_BLOCK2_REITERATION.md). Não confundir esses fluxos com execução CLI de verbos homônimos: as ferramentas executadas foram `context`, `detect`, build e Playwright.
- **Validação:** build aprovado e execução final com 14/14 testes aprovados (13 permanentes + ensaio temporário de estresse). Nove viewports com fonte raiz a 200%, expansão sintética e fallback sem overflow; rede simulada e bloqueio de fontes mantiveram leitura disponível. Scans de layout/type antes/depois e scan geral final retornaram `[]`. Inspeção agrupada em nove viewports, claro/escuro e movimento reduzido, com revisão independente dos tamanhos principais sem falha material. Contraste de apoio/indicativo aproximadamente 5,8:1. Capturas e métricas temporárias em `/tmp/augeo-block2-reiteration/`; medidas essenciais transcritas no registro.
- **Limites:** Chromium/emulação; sem dispositivos físicos, outros motores, zoom real ou medição de CLS. Em 4K, os limites de escala deixam a composição muito esparsa. A extração de DESIGN.md continua no bloco 5; nenhum novo audit, critique ou polish foi declarado concluído. Preservadas alterações locais preexistentes em `.gitignore`, handoff, `.codex/` e `bun.lock`; sem commit/push.
- **Próxima ação:** avaliação visual do usuário desta reiteração do bloco 2. Não avançar automaticamente ao bloco 3; manter os limites de `adapt` explícitos na decisão de fechamento.

### Histórico da pendência metodológica e continuidade

No bloco 2 foram lidos os playbooks `shape`, `bolder`, `layout`, `typeset` e `adapt`, e suas orientações foram utilizadas na implementação. Isso não constituiu a conclusão dos fluxos completos de cada comando. Foram executados o launcher `context`, o detector `detect`, build, testes e inspeções visuais. Não existe uma nova execução completa de `audit` ou `polish`; a auditoria registrada continua histórica, e `polish` pertence ao bloco 6.

O usuário pediu que esta distinção fosse persistida. A preferência está em `/home/luca/.codex/AGENTS.md`: seguir os fluxos completos aplicáveis, informar qual está sendo aplicado e registrar etapas, evidências, artefatos, omissões e pendências. Nunca declarar um comando concluído apenas porque seu playbook foi lido.

A reiteração acima executou as etapas disponíveis e documentou as lacunas remanescentes de `adapt`; consultar seu registro em vez de tratar a leitura anterior como conclusão. Preservar a implementação e as decisões confirmadas, sem fabricar evidências ou repetir verificações sem necessidade. Apresentar o resultado para avaliação visual e parar, conforme a entrega por bloco confirmada. Após avaliação e fechamento dessas pendências, retomar o bloco 3 pela Parte III do plano: introdução concluída em até quatro segundos, seguida de repouso e respostas pontuais. Depois, seguir os blocos 4–6. Não registrar a pontuação histórica da auditoria como resultado pós-implementação.

O trabalho atual consolida apenas o hero. Processo, formulário e footer pertencem à continuidade da landing. EXPLORE leva a Processo; o CTA comercial futuro leva ao formulário. São destinos diferentes.

## Leitura por necessidade

- **Rotina de trabalho e continuidade:** [AGENTS.md](../AGENTS.md), criado em 2026-10-08 para orientar a retomada e a atualização por marcos sem pedidos explícitos de handoff. Links e diff verificados nesta entrega; carregamento e aplicação em uma nova sessão ainda não verificados. Nenhuma alteração de UI ou nova validação do hero foi realizada nesta entrega.
- **Retomada e progresso:** este arquivo.
- **Execução do próximo bloco:** Parte II (direção) e Parte III (implementação e aceitação) do [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md). Parte I e anexos são consulta histórica, técnica e visual.
- **Resumo do produto para a skill:** [PRODUCT.md](PRODUCT.md).
- **Posicionamento aprofundado:** [CONTEXT.md](CONTEXT.md), quando a tarefa envolver estratégia ou copy além do briefing.
- **Arquitetura da landing:** [02-WEBSITE_SPEC.md](02-WEBSITE_SPEC.md), quando a tarefa envolver outras seções ou entrada comercial.
- **Operação interna:** [03-INTERNAL.md](03-INTERNAL.md); dispensável para refinar o hero.

Preservar alterações locais anteriores à sessão. A auditoria do plano é um baseline histórico; o código e as verificações atuais determinam o estado implementado.
