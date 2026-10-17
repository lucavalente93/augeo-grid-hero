# Procedimentos do projeto

Procedimentos vigentes para execução e validação. [AGENTS.md](../AGENTS.md) define autorização, fontes e rotina de continuidade. [BACKLOG.md](BACKLOG.md) contém a fila; [histórico](archive/EXECUTION_HISTORY.md) preserva resultados datados. Procedimento não comprova execução anterior.

## Bun e validação

Usar Bun para instalação e execução: `bun install --frozen-lockfile`, `bun run dev`, `bun run build`, `bun run preview` e `bun run test` (Playwright). O `bunfig.toml` força Bun nos executáveis dos scripts; manter somente `bun.lock`. Para instalar Chromium, usar `bunx --bun playwright install chromium`.

Alguns executores bloqueiam sockets com `EPERM`, independentemente do Playwright. Tentar `bun run test` no sandbox uma vez por bloco de validação; diante desse erro conhecido ao iniciar o servidor, solicitar execução fora dele com aprovação. Não repetir sondagens IPv4/IPv6, Vite, Node, Python ou subprocessos sem novas evidências, nem alterar configurações para contornar a restrição. Registrar comando, quantidade, resultado e contexto no histórico, com síntese do bloco em `docs/BACKLOG.md`. Usar `bun run test` para regressões funcionais e `dev-browser` para inspeção visual/interativa, com procedimentos de execução próprios. Reabrir a investigação se aprovações repetidas prejudicarem significativamente o desenvolvimento.

## Impeccable

- Seguir os fluxos completos dos comandos/playbooks aplicáveis, incluindo os prescritos pelo plano e pelo estado metodológico no backlog, e informar qual fluxo está sendo aplicado.
- Registrar etapas exigidas, evidências, artefatos e eventuais omissões ou pendências. Distinguir leitura do playbook, uso de suas orientações, execução de ferramenta CLI e conclusão do fluxo completo; nunca declarar um comando concluído apenas porque seu playbook foi lido.
- Preservar as decisões confirmadas e os resultados existentes ao completar etapas pendentes. Não fabricar execuções anteriores nem repetir verificações sem necessidade. Consultar o histórico para evidências, o backlog para a fila e HERO para estado metodológico, avaliações e limites dos blocos.

Na retomada de trabalho visual, localizar a skill disponível no executor, ler seu SKILL.md e carregar o playbook de cada fluxo antes de executá-lo. Executar o launcher `impeccable context --target <alvo>` uma vez na sessão, com cwd neste projeto; respeitar o fallback da skill se falhar. O resumo existente permanece em `docs/PRODUCT.md`, com marcador `impeccable:product-schema 1`. Caminhos absolutos registrados em auditorias identificam o ambiente original, não uma instalação garantida em outro agente.

Preservar o mundo visual existente. Ausência de DESIGN.md não autoriza recomeçar a identidade ou reiniciar a entrevista por reflexo. Para planejamento visual usar `shape`; antes de editar UI, ler `craft-floor` conforme o fluxo da skill. Revisão documental não inicia fluxos visuais.

A sequência, estados e critérios do hero estão em [HERO.md](HERO.md#plano-vigente-por-blocos). `document` deve extrair a implementação e cumprir seus artefatos/validações; não copiar auditoria ou hipóteses como tokens aprovados. Não existe snapshot formal de critique registrado; uma futura execução deve seguir seu fluxo completo. Não atualizar nota histórica sem nova auditoria.

## Nomenclatura

Aplicar `coding-standards` de `affaan-m/ECC`, lendo o [SKILL.md original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) antes da refatoração. Leitura remota não equivale a instalação local. A migração de 13/10 foi implementada; tabelas do diagnóstico anterior estão no histórico e não são fila de renomeações.

A skill é orientação geral: exemplos de Next.js, imutabilidade, memoização e nomes de arquivos não autorizam trocar stack, buffers mutáveis, física ou ciclo canvas. Preservar convenções existentes e mutação intencional por desempenho.

1. Registrar o conjunto atual → proposto por bloco e buscar todos os usos antes da edição. Renomear identificadores respeitando escopo e tipos; não fazer substituições globais de palavras como `step`, `title`, `from`, `to` ou `source`.
2. Migrar declarações e consumidores juntos: imports/exports, props, landing e demo `?demo=matrix`, seletores CSS/Playwright, consultas DOM, custom properties e referências operacionais. O escopo atual `.hero-page` deve ser preservado em renomeações; sua remoção exige análise própria.
3. Preservar valores, fórmulas, unidades efetivas, ordem dos desenhos e listeners, cleanup dos observers, estrutura DOM, dimensões, temas, reduced motion, touch/scroll e destinos dos links. Acrescentar uma unidade ao nome não autoriza converter o valor. A API da matriz continua genérica.
4. Separar propostas que excedem renomeação: remover `pixel`, eliminar escopos CSS, reorganizar testes, mover assets ou extrair funções. Não otimizar o warp, mudar timings ou avançar blocos visuais durante uma migração nominal.
5. Rodar `bun run build` e `bun run test` antes e depois das mudanças. Manter as asserções e contextos existentes; atualizar apenas referências/descritivos pertinentes. Investigar qualquer falha em vez de relaxar asserções ou reduzir a suíte para obter sucesso.
6. Se classes, seletores ou caminhos mudarem, comparar capturas equivalentes antes/depois da landing e demo, nos temas, preferências de movimento e viewports pertinentes. Build não detecta seletor CSS que deixou de corresponder; a revisão visual complementa os testes.
7. Revisar o diff e buscar referências antigas nos arquivos ativos. Manter nomes antigos nas evidências históricas quando descrevem o código daquela data; não reescrever o histórico como se a migração já existisse. Rodar `git diff --check` e registrar resultados/limites no backlog, conforme a orientação vigente do usuário.

### Convenções de nomenclatura

1. Nomear o conceito e o papel: índice, bounds, timestamp, buffer, query ou observer quando isso evita ambiguidade.
2. Usar verbos nas funções (`update`, `read`, `draw`, `create`, `advance`) acompanhados do objeto da ação quando o escopo não o deixa evidente.
3. Nomear booleanos como perguntas/estados (`isMatrixInViewport`) e flags de configuração como ações habilitadas (`enableArtworkMotion`).
4. Explicitar unidades nas fronteiras entre segundos/milissegundos e pixels CSS/bitmap. Não misturar nomes de tempo e distância como `step`.
5. Usar um vocabulário consistente: matriz/grade → nós e ligações; pulso percorre ligação; onda nasce da interação; artwork é a imagem genérica, lettering AUGEO é seu uso no hero.
6. Preservar nomes convencionais e abreviações matemáticas de escopo curto. Evitar prefixar tudo com AUGEO ou criar nomes enormes.

## Evidências e registro

Registrar comando realmente executado, quantidade/resultado, contexto, limitações e artefatos relevantes. Identificar capturas em `/tmp` e `test-results/` como temporárias e preservar os fatos necessários no histórico; não depender só desses arquivos. Atualizar a síntese do bloco e próxima ação no backlog.

Verificações devem corresponder ao alvo: alteração apenas documental requer conferir conteúdo, links, âncoras, referências ativas e diff; não repetir build/suíte funcional sem alteração ou preocupação que os justifique. Em código, executar checks pertinentes; em visual, conferir também renderização e interação. Histórico não valida automaticamente o código atual.
