# Auditoria de nomenclatura — 2026-10-13

Pedido original: avaliar nomes confusos em praticamente todo o projeto e procurar uma skill útil. As tabelas abaixo registram a auditoria inicial; a migração posterior está delimitada na seção seguinte, com estado e validações em BACKLOG.md.

## Migração autorizada — 2026-10-13

Usuário autorizou retomar a refatoração após formalizar o fallback dos testes. Escopo desta migração: prioridades 1/2, props da imagem, nomes da demo e do teste do indicador, helpers dos testes e seletores/custom properties relacionados. Os mapeamentos abaixo orientam a implementação; valores, fórmulas, asserções e estrutura permanecem iguais. `.cue-study` será `.hero-page`, preservando a camada de escopo e a especificidade. Remoção de `pixel`, eliminação desse escopo, divisão da suíte e movimentação de assets continuam separadas no backlog. Resultados atuais pertencem ao [BACKLOG.md](BACKLOG.md); os registros da auditoria inicial abaixo são históricos.

Migração implementada e validada: build aprovado, suíte final 24/24 em 19,1 s no contexto autorizado e oito pares de capturas idênticos. Além das renomeações, corrigida a sincronização do teste de suspensão para aguardar tarefas pendentes de animação, preservando as asserções; detalhes, comandos e limites no backlog. O escopo `.cue-study` agora é `.hero-page`.

Revisão de 2026-10-13: usuário pediu assegurar o uso da candidata recomendada e proteger a refatoração contra regressões. A skill escolhida é `coding-standards` de `affaan-m/ECC`; seu [SKILL.md original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) foi lido integralmente nesta revisão e suas orientações de nomes descritivos, funções com verbos, simplicidade e testes foram aplicadas ao protocolo abaixo. Não houve instalação local nem implementação de renomeações. Trabalhos futuros e avaliações foram consolidados em [BACKLOG.md](BACKLOG.md).

## Skill adotada e protocolo de segurança da refatoração

Uso obrigatório de `affaan-m/ECC@coding-standards` na futura migração, também registrado no [AGENTS.md](../AGENTS.md). É uma referência geral de nomenclatura, não um novo projeto de arquitetura: seus exemplos de Next.js, imutabilidade, memoização e divisão de funções não autorizam mudar os buffers mutáveis, a física ou o ciclo canvas desta matriz. A própria fonte inclui mutação intencional por desempenho entre seus exemplos documentados. Preservar as convenções de arquivo já utilizadas; PascalCase nos exemplos da skill não obriga renomear todos os arquivos do projeto.

1. Registrar o conjunto atual → proposto por bloco e buscar todos os usos antes da edição. Renomear identificadores respeitando escopo e tipos; não fazer substituições globais de palavras como `step`, `title`, `from`, `to` ou `source`.
2. Migrar declarações e consumidores juntos: imports/exports, props, landing e demo `?demo=matrix`, seletores CSS/Playwright, consultas DOM, custom properties e referências operacionais. Para `.cue-study`, uma troca de nome preservando escopo e especificidade é mais conservadora que remover o seletor; a remoção exige análise própria.
3. Preservar valores, fórmulas, unidades efetivas, ordem dos desenhos e listeners, cleanup dos observers, estrutura DOM, dimensões, temas, reduced motion, touch/scroll e destinos dos links. Acrescentar uma unidade ao nome não autoriza converter o valor. A API da matriz continua genérica.
4. Separar propostas que excedem renomeação: remover `pixel`, eliminar escopos CSS, reorganizar testes, mover assets ou extrair funções. Não otimizar o warp, mudar timings ou avançar blocos visuais durante esta entrega.
5. Rodar `bun run build` e `bun run test` antes e depois das mudanças. Manter as asserções e contextos existentes; atualizar apenas referências/descritivos pertinentes. Investigar qualquer falha em vez de relaxar asserções ou reduzir a suíte para obter sucesso.
6. Se classes, seletores ou caminhos mudarem, comparar capturas equivalentes antes/depois da landing e demo, nos temas, preferências de movimento e viewports pertinentes. Build não detecta seletor CSS que deixou de corresponder; a revisão visual complementa os testes.
7. Revisar o diff e buscar referências antigas nos arquivos ativos. Manter nomes antigos nas evidências históricas quando descrevem o código daquela data; não reescrever o histórico como se a migração já existisse. Rodar `git diff --check` e registrar resultados/limites no backlog, conforme a orientação vigente do usuário.

**Base verificada nesta revisão:** `bun run build` aprovado; `bun run test` passou com **24/24 testes em 17,6 s**, Chromium, em execução autorizada fora da sandbox. As tentativas restritas falharam antes da suíte por `EPERM` ao abrir a porta do Vite; o primeiro pedido de execução escalada foi interrompido, e o usuário pediu repetir o teste. A suíte cobre matemática do warp, retorno ao repouso, canvas, temas/reduced motion, responsividade, toque, lettering e suspensão/retomada do indicador. Não comprova isoladamente o ponteiro vindo da coluna esquerda nem aparelhos físicos/outros motores; essa pendência está no backlog.

Não há garantia absoluta antecipada de ausência de regressão. A entrega das renomeações dependerá desses resultados sobre o código alterado; a base aprovada não deve ser apresentada como validação de uma refatoração ainda não executada.

## Diagnóstico

O principal problema é a perda de significado: nomes não dizem se o valor é um índice, tempo, ID, retângulo, posição ou buffer. A concentração é maior no efeito principal de `components/ui/kinetic-matrix.tsx`, que reúne simulação, desenho, deformação da imagem e ciclo de animação. Ali, nomes curtos vivem por centenas de linhas e cruzam responsabilidades. Em callbacks pequenos, a mesma concisão costuma ser aceitável.

Há também resquícios de demonstração/estudo nos nomes de componentes, seletores e arquivos de teste. Configurações e pontos de entrada têm nomes convencionais claros; não há motivo para renomear tudo. O componente da matriz tem demonstração independente e suporte a texto/imagem arbitrários: sua generalidade é real. Não substituir todo `artwork` por `augeoLettering` dentro da API compartilhada.

## Prioridade 1 — nomes que escondem tipo, unidade ou significado

| Local | Nome atual | O que representa | Proposta |
| --- | --- | --- | --- |
| `lib/matrix-motion.ts:2` | `MOTION` | Configuração da simulação da matriz | `MATRIX_MOTION` |
| `lib/matrix-motion.ts:4` | `MOTION.step` | Intervalo fixo de simulação, em segundos | `simulationStepSeconds` |
| `lib/matrix-motion.ts:22` | `ARTWORK_WARP.step` | Distância horizontal entre amostras, em pixels CSS | `sampleSpacingPx` |
| `components/ui/kinetic-matrix.tsx:70` | `frame` | ID retornado por requestAnimationFrame | `animationFrameId` |
| `components/ui/kinetic-matrix.tsx:66` | `clock` | Tempo acumulado da simulação, em segundos | `simulationTimeSeconds` |
| `components/ui/kinetic-matrix.tsx:70` | `lastTime` | Timestamp de performance/requestAnimationFrame, em milissegundos | `lastFrameTimeMs` |
| `components/ui/kinetic-matrix.tsx:70` | `accumulator` | Tempo ainda não consumido pela simulação | `pendingSimulationSeconds` |
| `components/ui/kinetic-matrix.tsx:65` | `artworkElapsed` | Tempo acumulado para o próximo desenho da imagem | `pendingArtworkRenderSeconds` |
| `components/ui/kinetic-matrix.tsx:66–68` | `nextPulse`, `quietUntil`, `lastImpulse`, `inspectedSince` | Instantes na escala temporal da simulação | `nextPulseAtSeconds`, `pulsesResumeAtSeconds`, `lastImpulseAtSeconds`, `nodeHoverStartedAtSeconds` |
| `components/ui/kinetic-matrix.tsx:68` | `inspected`, `nearest` | Índices de nós; `-1` indica ausência | `hoveredNodeIndex`, `nearestNodeIndex` |
| `components/ui/kinetic-matrix.tsx:12` | `Pulse.from`, `Pulse.to` | Índices dos nós extremos, não posições nem objetos | `fromNodeIndex`, `toNodeIndex` |
| `components/ui/kinetic-matrix.tsx:205` | `a`, `b` | Nós de origem e destino do pulso | `startNode`, `endNode` |
| `src/App.tsx:16–18` | `title`, `center`, `alignArtwork` | DOMRect do heading, centro vertical relativo ao hero e escrita dessa coordenada em CSS | `headingBounds`, `headingCenterY`, `updateHeroHeadingCenter` |

O comentário inicial de `matrix-motion.ts` já informa segundos e pixels CSS. A proposta torna essa distinção visível nos usos, especialmente ao cruzar com milissegundos de APIs do navegador. Não acrescentar sufixos a toda variável indiscriminadamente: usar onde há mistura ou fronteira entre escalas.

## Prioridade 2 — responsabilidades e buffers

| Local | Nome atual | Proposta e motivo |
| --- | --- | --- |
| `kinetic-matrix.tsx:39–40` | `preference`, `update` | `reducedMotionQuery`, `updateMotionPreference`: identificar a preferência e a ação |
| `kinetic-matrix.tsx:69–71` | `dark`, `visible`, `theme` | `isDarkTheme`, `isMatrixInViewport`, `darkSchemeQuery`: distinguir tema aplicado, interseção e preferência do sistema |
| `kinetic-matrix.tsx:231,296` | `step`, `syncLoop` | `advanceSimulation`, `syncAnimationLoop`: separar atualização física do controle de agendamento |
| `kinetic-matrix.tsx:305,360` | `resize`, `visibility` | `resizeObserver`, `intersectionObserver`: são objetos observadores |
| `kinetic-matrix.tsx:408–411` | `leave`, `move` | `clearPointerPosition`, `updatePointerPosition`: descrevem a ação, inclusive quando chamadas em pointerup/cancel/down |
| `ScrollCue.tsx:10–14` | `visible`, `sync`, `observer` | `isCueInViewport`, `syncCueAnimationState`, `intersectionObserver` |
| `kinetic-matrix.tsx:104–125` | `source`, `output`, `target` | `sourceRgba`, `outputRgba`, `outputPixelOffset`: dois buffers e um offset, não três objetos equivalentes |
| `kinetic-matrix.tsx:113–118` | `col`, `colMix`, `left`, `mix` | `sampleIndex`, `sampleBlend`, `leftSourcePixelX`, `pixelBlend`: diferenciar interpolação das amostras e dos pixels |
| `matrix-motion.ts:45` | `age` | `waveProgress`: local é `wave.age / impulseDuration`, um progresso normalizado; `wave.age` é tempo |
| `matrix-motion.ts:104–112` | `pulseStops`, `stops` | `createPulseProgressThresholds`, `progressThresholds`: são limiares normalizados usados na progressão por degraus; desenho final mistura essa progressão com a contínua |

`pixel(value)` em `kinetic-matrix.tsx:172` apenas devolve `value`. Seu nome sugere arredondamento/conversão que não ocorre. A recomendação é remover essa função identidade em uma futura limpeza, não inventar outro nome. Isso ultrapassa uma troca puramente nominal e deve aparecer como tal no diff.

`ctx`, `dt`, `x/y`, `dx/dy` e `i` não são defeitos por si só. Coordenadas e contadores locais são convenções úteis; em funções matemáticas pequenas, nomes curtos podem ser mais legíveis. Se dois contextos canvas coexistem, explicitar `gridContext` e `artworkContext` passa a ajudar. `approach`, `randomBetween`, `displacementAt`, `MatrixNode` e `KineticMatrix` descrevem operações/conceitos reais.

## CSS, componentes, arquivos e testes

| Nome atual | Avaliação | Proposta |
| --- | --- | --- |
| `DemoOne` / `components/ui/demo.tsx` | Número arbitrário não identifica o que demonstra | `KineticMatrixDemo` / `kinetic-matrix-demo.tsx` |
| `.nav` | Aplicada ao header; atualmente não há um elemento nav | `.site-header` |
| `.intro` | Parágrafo de apoio específico do hero com seletor global | `.hero-description` |
| `.cue-study` | Nome de estudo na página normal; usos encontrados apenas delimitam CSS do cue | Remover essa camada de escopo se desnecessária, ou usar um estado real; não perpetuar o nome de estudo |
| `.matrix-deck` | Metáfora de área/painel, não falha grave | `.hero-matrix-panel` se houver padronização por responsabilidade |
| `.augeo-matrix` | Identifica a marca, mas os overrides diferenciam a matriz do hero da demo | `.hero-matrix` |
| `--hero-title-center` | Coordenada vertical relativa ao hero | `--hero-heading-center-y` |
| `--cue-rest`, `--cue-contrast`, `--cue-next-contrast` | Guardam cores; "contrast" pode parecer razão/medida de contraste | `--cue-rest-color`, `--cue-first-peak-color`, `--cue-second-peak-color` |
| `scroll-cue-preview.spec.ts` | Testa o componente em uso na landing; preview não descreve mais seu papel | `scroll-cue.spec.ts` |
| `tests/matrix.spec.ts` | Mistura matemática da deformação, comportamento canvas e layout do hero | Em eventual reorganização: `matrix-motion.spec.ts`, `kinetic-matrix.spec.ts`, `hero-layout.spec.ts` |
| Teste mobile: "preserves the matrix position" | Formulação histórica; agora afirma matriz nas bordas e abaixo do CTA | Descrever a matriz como painel inferior e o lettering acima da dobra |

Nos testes, `states`, `times`, `paused`, `hidden`, `leading`, `paintedTriangle`, `check`, `axis` e `opening` podem virar `readAnimationStates`, `readAnimationTimesMs`, `pausedAnimationTimesMs`, `hiddenAnimationTimesMs`, `activeTriangleIndex`, `topmostTriangleIndex`, `expectBoundedMonotonicShifts`, `alignmentBounds` e `measureAOpening`. Nem todo callback exige expansão; priorizar os que ocultam coleção, índice ou a evidência medida. `rowInk` conta pixels opacos por linha: `countOpaquePixelsByRow` explica o resultado melhor.

As props `titleArtwork` e `reactiveArtwork` são compreensíveis, mas podem ficar mais precisas como `titleArtworkSrc` e `enableArtworkMotion`. O `title` público é texto/conteúdo acessível, diferente do DOMRect chamado `title` no App. API compartilhada, markup, CSS e seletores Playwright devem ser migrados juntos em qualquer renomeação.

`App.tsx`, `main.tsx`, `vite.config.ts`, `playwright.config.ts`, `tsconfig.json`, `bunfig.toml`, `index.html`, `root`, aliases do shadcn e tokens como `--background`/`--foreground` são convenções claras neste contexto. `cn` em `lib/utils.ts` segue a convenção do helper de classes usado com shadcn; renomear só por ser curto daria pouco ganho. O nome do pacote ainda termina em `prototype`, coerente com a descrição do README.

Os nomes longos/hash dos assets do moodboard vêm da coleção e têm índice CSV e referências documentais; são pouco memoráveis, mas não recomendaria renomear a coleção sem migrar sua rastreabilidade. `symbol.png` poderia ser `augeo-symbol.png` para facilitar busca fora da pasta. Não foi feita auditoria visual dos binários. Na auditoria inicial, a dificuldade documental era a mistura de seções históricas intituladas "Próxima ação", com rumos superados. A reorganização posterior separou implementação/direção em [HERO_HANDOFF.md](HERO_HANDOFF.md), execução técnica em [BACKLOG.md](BACKLOG.md) e antecedentes/propostas em [HERO_DECISIONS_AND_IDEAS.md](HERO_DECISIONS_AND_IDEAS.md).

## Critério proposto para futuras alterações

1. Nomear o conceito e o papel: índice, bounds, timestamp, buffer, query ou observer quando isso evita ambiguidade.
2. Usar verbos nas funções (`update`, `read`, `draw`, `create`, `advance`) acompanhados do objeto da ação quando o escopo não o deixa evidente.
3. Nomear booleanos como perguntas/estados (`isMatrixInViewport`) e flags de configuração como ações habilitadas (`enableArtworkMotion`).
4. Explicitar unidades nas fronteiras entre segundos/milissegundos e pixels CSS/bitmap. Não misturar nomes de tempo e distância como `step`.
5. Usar um vocabulário consistente: matriz/grade → nós e ligações; pulso percorre ligação; onda nasce da interação; artwork é a imagem genérica, lettering AUGEO é seu uso no hero.
6. Preservar nomes convencionais e abreviações matemáticas de escopo curto. Evitar prefixar tudo com AUGEO ou criar nomes enormes.

## Skills e evidências — auditoria inicial

- `find-skills` aplicada: leitura do playbook, consulta inicial ao leaderboard e buscas CLI. Após o usuário preparar `~/.cache/bun-tmp`, `TMPDIR="$HOME/.cache/bun-tmp" bunx --bun skills find naming` e a busca por `"coding standards"` terminaram com código 0, sem EROFS, mas retornaram "No skills found" nesta execução. O usuário havia obtido candidatas com a mesma busca em seu shell. A causa da diferença de resultados não foi determinada; isso não comprova que não existam skills.
- Candidata geral: [coding-standards de affaan-m/ECC](https://www.skills.sh/affaan-m/ecc/coding-standards), cerca de 4,7 mil instalações na página consultada; [repositório](https://github.com/affaan-m/ECC) com cerca de 278 mil estrelas. Fonte comunitária, não skill oficial TypeScript/React. [Conteúdo original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) inspecionado: nomes descritivos, funções com verbos e nomes de arquivos/testes. É uma referência geral, não um glossário desta matriz; regras amplas de imutabilidade não devem ser aplicadas cegamente aos buffers da simulação.
- Alternativa específica: [clean-code-ts-react de pproenca/dot-skills](https://www.skills.sh/pproenca/dot-skills/clean-code-ts-react), 157 instalações na página consultada e [repositório](https://github.com/pproenca/dot-skills) com 214 estrelas. Apresentação inspecionada, enfatiza TypeScript/React e exceções contextuais; regras completas não foram verificadas. Menor evidência de adoção, não é a recomendação principal.
- Se houver interesse em instalar apenas a candidata geral: `TMPDIR="$HOME/.cache/bun-tmp" bunx --bun skills add affaan-m/ECC --skill coding-standards`. Comando fornecido, não executado. Nenhuma skill foi instalada nem seu fluxo integral aplicado ao código.
- Inspeção estática dos fontes TS/TSX, CSS completo, testes completos, configurações, README, SVG do lettering, organização dos arquivos, índice CSV, estrutura dos documentos e trechos pertinentes de produto/especificação. Não foi uma revisão integral de todo o texto estratégico nem de arquivos binários/dependências.
- Nenhum código alterado, build/teste executado, commit/push ou fluxo Impeccable aplicado nesta entrega. Validação documental: `git diff --check`. Próxima etapa sugerida: migrar primeiro os nomes ambíguos da simulação e os resquícios de prévia, preservando comportamento; build e suíte existente seriam a validação dessa futura refatoração.
