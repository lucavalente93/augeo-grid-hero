# Backlog do projeto

Atualizado em 2026-10-13. Aqui ficam continuidade operacional, trabalho técnico, testes, tooling, commits, publicações e evidências de execução. [HERO_HANDOFF.md](HERO_HANDOFF.md) descreve somente a implementação persistente e a direção do hero; [HERO_DECISIONS_AND_IDEAS.md](HERO_DECISIONS_AND_IDEAS.md) guarda decisões anteriores, alternativas, ideias e avaliações pendentes. Requisitos detalhados pertencem ao [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md) e à [especificação](02-WEBSITE_SPEC.md).

## Estado operacional e próxima ação

- Base publicada na `main`: `43e7ab1` reúne refatoração/testes; `044e8bd` reúne a reorganização documental. Consulta GitHub/Vercel confirmou o último deploy anterior a esta revisão em 2026-10-13 às 10:11 BRT, produção/Ready, associado a `044e8bd`, então último commit remoto da `main`.
- Última validação da aplicação: `bun run build` aprovado e `bun run test` **24/24 em 18,5 s**, Chromium, dois workers, servidor iniciado separadamente. Código da aplicação não alterado nesta revisão documental; testes não repetidos.
- Site publicado em `augeocreative.com` e `www.augeocreative.com`; usuário confirmou acesso e nova verificação HTTPS retornou HTTP 200 em ambos. DNS Hostinger e e-mail comercial preservados. Redirecionamento canônico entre os endereços ainda pendente.
- Especificação revisada integralmente contra código e contexto: stack, matriz, copy, temas, assets, domínio e publicação descritos como bases existentes; Processo e formulário continuam previstos; matriz como footer visual mobile e CTA de conversão já implementados. Pro/WhatsApp Business adiados por decisão do usuário.
- Revisão da especificação publicada em `ea09147`, com push confirmado por gh. Consolidação posterior para seis documentos concluída localmente, conforme pedido do usuário; incluída no commit local solicitado após a correção da especificação. Avaliações do hero permanecem no [registro de decisões](HERO_DECISIONS_AND_IDEAS.md#avaliações-e-decisões-ainda-abertas).

## Tooling — restrição de sockets no sandbox; diagnóstico encerrado

- **Conclusão corrigida em 2026-10-13:** o bloqueio de sockets TCP observado no executor restrito era causado pela política do sandbox. O launcher recebia `type=managed/network=restricted`, com `CODEX_SANDBOX_NETWORK_DISABLED=1`; Python e Node mínimos falhavam antes de bind/listen, independentemente de Vite ou Playwright. Execuções aprovadas fora do sandbox já passavam; com o perfil confirmado `danger-full-access`, o Vite também abriu a porta sem EPERM. Não há evidência de defeito na aplicação causando esse bloqueio. A regra exata do filtro não foi identificada e não é necessária para encerrar esse diagnóstico.
- **Correção da condução:** a investigação se prolongou além do necessário após os controles mínimos e o sucesso fora do sandbox. Hipóteses sobre Bun/Node, subprocessos, host IPv4/IPv6, editor, resíduos do VS Code e reload do TOML não demonstraram causalidade e não devem voltar como pendências. A restrição do executor deveria ter sido priorizada e o fallback usado mais cedo. Nenhuma alteração em Vite, Playwright ou Bun foi necessária para resolver o EPERM.
- **WSL mirrored:** após o usuário informar a mudança de `.wslconfig`, uma sondagem Python no sandbox ainda falhou em `socket.socket(AF_INET, SOCK_STREAM)` com errno 1, antes de bind/listen. Mirrored não resolveu o bloqueio naquele executor. Não foi conferida a aplicação efetiva da configuração Windows nem feita comparação NAT/mirrored fora do sandbox; eventual benefício adicional permanece desconhecido, sem investigação pendente.
- **Procedimento vigente:** permanece a rotina previamente acordada em AGENTS.md: uma tentativa de `bun run test` no sandbox por bloco e, diante do EPERM conhecido, solicitação de execução fora dele com aprovação. A execução com Full Access acima foi autorizada especificamente pelo usuário nesta sessão; seu sucesso é evidência do diagnóstico, não recomendação para habilitar Full Access nem autorização permanente. Não repetir sondagens nem modificar a aplicação para contornar a restrição. Inspeção visual/interativa continua usando `dev-browser`.

### Evidências de execução e limites

- **Antes da migração de nomes:** `bun run build` passou no sandbox; uma tentativa de `bun run test` restrita falhou com EPERM antes dos testes. O mesmo comando, aprovado fora do sandbox, iniciou seu próprio Vite em 5173 e passou **24/24 em 17,8 s**, Chromium/Bun 1.4.2, sem variável especial de navegador ou mudança de configuração.
- **Com Full Access, em 2026-10-13:** primeira execução de `bun run test` aguardou a consulta inicial ao servidor, sem EPERM, e foi interrompida (exit 130). `curl --max-time 5 -I http://127.0.0.1:5173` expirou; `ss -ltnp` não mostrou listener nessa porta. Segunda execução, `DEBUG=pw:webserver timeout --signal=INT --kill-after=5s 90s bun run test`, confirmou a espera no HTTP GET inicial. Iniciado separadamente `bun run dev --port 5173`: Vite abriu a porta em 371 ms; o runner recebeu HTTP 200 e reutilizou o servidor conforme `reuseExistingServer: true`. Suíte aprovada: **24/24 em 24,8 s**, Chromium, dois workers, exit 0, sem retries. Servidor auxiliar encerrado depois. Capturas da suíte em `test-results/` são temporárias/ignoradas.
- **Espera HTTP distinta do EPERM:** causa ainda não determinada. A rodada de 24,8 s validou a suíte com servidor iniciado separadamente; não validou a inicialização automática com a porta inicialmente fechada nesse ambiente. A rodada posterior de 18,5 s também usou servidor auxiliar. Execuções anteriores fora do sandbox já demonstraram inicialização automática. Não atribuir essa espera ao mirrored, ao sandbox ou ao código sem evidência; investigar apenas se voltar a impedir uma execução necessária.
- **Limpeza do editor, trabalho separado:** remoção autorizada de `/home/lvalente/.vscode-server`, `/home/lvalente/.config/Code` e `/home/lvalente/.cache/vscode-ripgrep` concluída e ausência conferida naquele bloco (antes: 894 MB, 12 KB e 2 MB). Zed, Codex e Windows preservados. A limpeza não resolveu o EPERM e não deve ser apresentada como correção de rede.
- **Registro e escopo:** as evidências decisivas estão nesta seção; detalhes técnicos transferidos abaixo são consulta histórica, sem fila de investigação. A correção do diagnóstico consolidou a conclusão no backlog. A alteração indevida da rotina em AGENTS.md para execução direta com Full Access foi desfeita após correção explícita do usuário; a política anterior foi restaurada. `git diff --check` aprovado. Sem alteração de código/configuração de execução, novos testes, commit ou push; alterações locais anteriores preservadas. Naquele bloco, a próxima ação era revisar a migração de nomes; o estado operacional vigente está no início deste arquivo.

## Nomenclatura — migração implementada e validada

- **Autorização e skill:** usuário autorizou retomar a refatoração após formalizar o fallback. `coding-standards` de `affaan-m/ECC` relida na fonte original e aplicada à migração conforme [protocolo e auditoria de nomenclatura](BACKLOG.md#auditoria-de-nomenclatura--referência-histórica-e-protocolo); não instalada localmente. Revisão `vercel:react-best-practices` aplicada aos TSX: dependências dos efeitos, refs, listeners/cleanup, tipos, nomes acessíveis e estrutura conferidos. Sem novo fluxo visual Impeccable, alteração de composição ou avanço de bloco do hero.
- **Implementação:** prioridades 1/2 migradas: `MATRIX_MOTION.simulationStepSeconds`, `ARTWORK_WARP.sampleSpacingPx`, tempos/IDs/índices de estado, endpoints/limiares do pulso, observers, funções de controle e buffers/interpolação RGBA. Props públicas agora `titleArtworkSrc`/`enableArtworkMotion`, com consumidor do App migrado; API continua genérica. Demo agora `KineticMatrixDemo` em `components/ui/kinetic-matrix-demo.tsx`; indicador em `tests/scroll-cue.spec.ts`. Helpers e descrição mobile dos testes esclarecidos. Seletores da landing, CSS, queries e Playwright migrados juntos; `.cue-study` tornou-se `.hero-page`, mantendo escopo/especificidade. Variáveis CSS explicitam coordenada vertical e cores.
- **Conferência nominal:** normalização inversa dos mapeamentos comparada aos nove arquivos originais preservados temporariamente confirmou igualdade integral antes do ajuste de sincronização descrito abaixo. Valores, fórmulas, estrutura DOM e asserções eram idênticos. Busca de nomes antigos em fontes/consumidores ativos e revisão do diff concluídas; histórico documental preservado. Primeira checagem do build detectou referências incompletas no App; corrigidas antes da validação final. `bun run build` posterior passou no sandbox.
- **Falha de sincronização encontrada:** duas rodadas completas após renomear passaram 23/24 (19,0 s e 19,3 s). Mesmo teste de suspensão/retomada falhou por comparação de ponto flutuante (~5,7e-14 ms) e, depois, avanço de um frame durante pausa pendente. Caso isolado, sem alteração de asserção, passou 1/1 em 1,5 s. Ajuste adicional somente no teste: aguardar `Animation.ready` antes de medir tempos; usar polling na comparação final de retomada, com o mesmo limite. Igualdade estrita durante suspensão preservada; sem tolerância nova, retries configurados ou mudança na animação. A [especificação Web Animations](https://www.w3.org/TR/web-animations-1/#current-ready-promise) fundamenta a espera pela tarefa pendente de play/pause.
- **Validação final:** `bun run test tests/scroll-cue.spec.ts --grep 'offscreen and hidden-document' --repeat-each=5 --workers=1` aprovado fora do sandbox, **5/5 em 6,1 s**. Em seguida, `bun run test` aprovado fora do sandbox, **24/24 em 19,1 s**, Chromium, dois workers, sem retries. A rodada final utilizou o servidor já disponível em 5173, conforme `reuseExistingServer`; as rodadas anteriores demonstraram a inicialização pelo próprio webServer. A única tentativa restrita após a migração reproduziu o EPERM conhecido antes dos testes; verificações posteriores usaram o contexto autorizado sem novas sondagens. `bun run build` e `git diff --check` passaram no sandbox. Nenhuma configuração Playwright/Vite/Bun modificada.
- **Validação visual/interativa:** `dev-browser --headless -b augeo-naming -t 45 run /tmp/augeo-naming-before.js` e equivalente `after.js`, aprovados fora do sandbox; servidor próprio `bun run dev --host 127.0.0.1 --port 5174 --strictPort`, separado do servidor da suíte em 5173. Landing/demo × desktop 1440×900/mobile 390×844 × claro/escuro × movimento normal/reduzido = 16 contextos em cada fase. Medidas/estilos coletados iguais antes/depois, sem overflow/erros JS; quatro interações na landing verificaram mudança do lettering e retorno exato ao repouso em cada fase. Oito pares de PNGs em movimento reduzido idênticos byte a byte; inspeção visual de desktop escuro/mobile claro concluída. Capturas `/tmp/augeo-naming-{before,after}-*.png` e JSONs `~/.dev-browser/v1/tmp/augeo-naming-{before,after}.json` são temporários. Evidências essenciais registradas aqui; sem aparelhos físicos/outros motores.
- **Trabalhos separados, ainda não implementados:** remover a identidade `pixel`, eliminar a camada de escopo do cue, dividir `tests/matrix.spec.ts`, mover/renomear assets e otimizar o warp. Naquela entrega, a próxima ação era revisão do diff; limpezas estruturais e blocos visuais continuavam sem autorização automática. Sem commit/push naquele bloco de implementação; publicação posterior registrada abaixo. A captura de referência mobile foi removida depois com autorização do usuário.

## Histórico de preparação dos commits — 2026-10-13

- Usuário autorizou os commits da refatoração e da reorganização documental, sem redeploy. Implementação e testes reunidos em `43e7ab1` (`refactor(hero): clarify matrix and hero naming`), incluindo a sincronização do teste de suspensão/retomada. A divisão de `tests/matrix.spec.ts` e outras limpezas estruturais continuam pendentes; não foram incluídas como trabalho realizado.
- A documentação acompanha em commit separado: auditoria de nomenclatura, reorganização já existente do handoff, backlog de continuidade, README e instruções do projeto. Nenhum registro novo foi acrescentado ao handoff neste bloco. O diagnóstico do EPERM permanece compacto no backlog para evitar repetição; a política anterior de sandbox/aprovação foi preservada, sem recomendação permanente de Full Access.
- Verificação para os commits: `bun run build` e `git diff --check` passaram. Sem mudança de código desde a suíte **24/24 em 24,8 s** registrada acima; não foi repetida sem necessidade. Links Markdown locais dos documentos a publicar conferidos. A captura de referência mobile ficou fora dos commits e foi removida posteriormente com autorização do usuário. Esta preparação antecedeu o push registrado na seção seguinte.

## Verificação e publicação da refatoração — 2026-10-13

- Usuário autorizou verificar o projeto e fazer push. `bun run build` aprovado; servidor auxiliar iniciado com `bun run dev --port 5173` (Vite pronto em 177 ms) e reutilizado por `bun run test`: **24/24 em 18,5 s**, Chromium, dois workers, sem retries. Servidor encerrado depois; sem alterações na aplicação desde a validação anterior. `git fetch origin main` concluído; branch sem commits remotos exclusivos antes do envio.
- Preferência por `gh` para operações do GitHub registrada em AGENTS.md; operações Git locais e push usam Git quando não há equivalente no gh. Consulta `gh repo view` confirmou `lucavalente93/augeo-grid-hero`, branch padrão `main`. `git diff --check` aprovado.
- Push para `origin/main` autorizado e concluído; referência remota conferida pelo GitHub CLI. Documentação, preferência pelo gh e evidências de validação consolidadas no mesmo commit documental, separado da implementação e dos testes. A integração Git pode disparar deploy automático; nenhum redeploy manual executado ou resultado remoto de deploy declarado. Configuração Vercel, dependências e estrutura visual preservadas. Captura de referência mobile mantida fora dos commits e posteriormente removida com autorização do usuário. Próxima ação: avaliação do usuário; sem retomada automática de outras frentes.

## Trabalho técnico ainda pendente

- Cobrir isoladamente o ponteiro vindo da coluna esquerda; os listeners existem, mas a suíte atual não demonstra esse trajeto específico.
- Reconciliar o fechamento metodológico do bloco 2: os ajustes de 09/10 não declararam os fluxos completos de `layout`, `typeset` e `polish` concluídos. A execução posterior da suíte não substitui as etapas ausentes. Ver histórico abaixo.
- Cobertura ainda limitada a Chromium/emulação: sem aparelhos físicos/outros motores, zoom real, CLS ou perfil de frames em hardware. Essas limitações devem informar o fechamento, não gerar repetição automática de verificações já válidas.
- Limpezas separadas da migração nominal: remover a identidade `pixel`, eliminar a camada de escopo do cue, dividir `tests/matrix.spec.ts`, mover/renomear assets e otimizar o warp. Sem implementação autorizada neste bloco; propostas e dependências visuais ficam no registro de decisões.
- Figma: recuperar ou regenerar `docs/references/figma/augeo-matrix-light-2x.png` e `docs/references/figma/augeo-hero-dark-left-light-matrix-preview-2x.png`, ausentes no checkout e no Git. A geração histórica não prova disponibilidade atual. Ver contexto de importação/edição no [registro de decisões](HERO_DECISIONS_AND_IDEAS.md#propostas-de-figma--frente-independente).
- Implementar Processo e formulário de entrada comercial conforme a especificação em frente própria, preservando o footer visual mobile existente. Definição dos destinos está no registro de decisões; não criar seção artificial para satisfazer testes.

## Histórico técnico transferido do hero

Os registros abaixo preservam evidências nas datas das execuções. Comandos npm/npx, nomes antigos, falhas e estados de staging descrevem aquele momento. Não são validação do código atual nem pendências vigentes. Aprovação visual e ideias de composição foram separadas em HERO_DECISIONS_AND_IDEAS.md. Artefatos em `/tmp` e `test-results/` são temporários.

### Diagnóstico restrito de sockets — 2026-10-13

- Comandos executados: `bun run test --workers=1 --global-timeout=10000`, `bunx vite --host 127.0.0.1 --port 5173 --strictPort`, `bun run dev --host 127.0.0.1 --port 5173 --strictPort` e controles mínimos Node/Bun/Python. Todos falharam no executor restrito; Python isolou errno 1 na criação TCP IPv4/IPv6, antes de bind/listen, nos quatro hosts e portas 0/5173. Isso já afastava a aplicação como causa. Não repetir essas sondagens.
- Processo diagnóstico: `NoNewPrivs: 1`, `Seccomp: 2`, um filtro; strace impedido por `PTRACE_TRACEME: Operation not permitted`. O diagnóstico inicial ainda qualificava o sandbox como hipótese; a conclusão consolidada acima incorpora o sucesso fora dele e com Full Access, sem alegar conhecimento da regra exata do filtro.
- Runner inspecionado em fonte instalada: shell, cwd da configuração, detached no Linux, pipes e defaults BROWSER=none/FORCE_COLOR=1/DEBUG_COLORS=1. Aviso de cores não demonstrou causalidade. Ensaios mínimos de filhos sem stdout eram inconclusivos. `DEBUG=pw:webserver` mostrou subprocesso iniciado, `ECONNREFUSED` e EPERM posterior no Vite. Shim Bun 1.4.2 versus Node 24.14.1 não explicou a falha comum. `/tmp/augeo-bind-probe.cjs` é temporário; nenhum ajuste em runtime/host foi necessário.
- Conferência documental antes da refatoração: `git diff --check` e 34 links locais aprovados; dois PNGs Figma ausentes identificados. Resultado 24/24 em 17,6 s fora do sandbox registrado como base anterior à migração de nomes.

### Auditoria de nomes — 2026-10-13

- Sandbox/busca: tentativa inicial e nova tentativa após reinício ainda falharam com EROFS no tempdir; pedidos de execução escalada interrompidos pelo usuário. Usuário identificou o diretório temporário somente leitura, criou `~/.cache/bun-tmp` e mostrou busca bem-sucedida em seu shell. Repetidas nesta sessão `TMPDIR="$HOME/.cache/bun-tmp" bunx --bun skills find naming` e busca por `"coding standards"`: ambas código 0, sem EROFS, mas retornaram "No skills found". Diferença de resultados não diagnosticada; sucesso do tempdir não comprova funcionamento de todos os recursos da sandbox.
- `find-skills`: playbook e leaderboard consultados, buscas CLI executadas, candidatas conferidas via web. `affaan-m/ECC@coding-standards`: conteúdo original lido, cerca de 4,7 mil instalações na página e 278 mil estrelas no repositório; referência geral comunitária, sem glossário específico da matriz. Alternativa `pproenca/dot-skills@clean-code-ts-react`: apresentação lida, 157 instalações/214 estrelas; regras completas não verificadas. Nenhuma skill instalada nem fluxo integral dessas candidatas aplicado. Fontes e comando opcional com Bun no relatório.
- Validação: `git diff --check` aprovado. Só documentação alterada; sem build/teste, alteração visual, novo fluxo Impeccable, commit/push ou publicação.

Diagnóstico nominal e fontes estão em [protocolo e auditoria de nomenclatura](BACKLOG.md#auditoria-de-nomenclatura--referência-histórica-e-protocolo); migração e validações posteriores estão na seção Nomenclatura acima.

### Continuidade do fundo mobile e publicação — 2026-10-13

- Correção em `src/styles.css`: fundo existente compartilhado por `--hero-panel-background`; somente no mobile, pseudo-elemento da copy estende a superfície em 70 px até o topo, com isolamento de empilhamento e sem interceptar ponteiros. Um único gradiente cobre cabeçalho e texto até a matriz, sem reinício na antiga divisão. Geometria do conteúdo e tratamento desktop preservados.
- Validação: `bun run build`, `git diff --check` e `bun run test` aprovados (**24/24**, 18,6 s, Chromium). Primeira tentativa da suíte bloqueada por `EPERM` na porta; execução autorizada fora do sandbox passou. Ensaio temporário `bun run test tests/panel-inspection.spec.ts` aprovado (**1/1**): viewport 393×852, dark/reduced motion, superfície inicia em y=0 e termina junto à matriz. Captura `/tmp/augeo-mobile-panel-393x852.png` inspecionada visualmente; teste temporário removido. Artefato temporário, não referência persistente. Sem aparelhos físicos ou outros motores; nenhum novo fluxo Impeccable aplicado/concluído.
- Avaliação/publicação: usuário aprovou a correção ("Ótimo") e autorizou commit/push e deploy usando os CLIs GitHub/Vercel instalados e autenticados. Skills `vercel-cli` e `deployments-cicd` consultadas; `gh auth status` e `gh repo view` confirmaram usuário/repositório (a primeira checagem restrita não validou login; fora do sandbox passou), `git fetch origin main` confirmou alinhamento (0/0), e `vercel project inspect augeo-grid-hero --scope augeocreative --non-interactive` confirmou o projeto Vite `prj_SrK36bHFjy5Ns6eQvOW8OvuqXGRX`. Commit `6b1092b` (`fix(hero): extend mobile panel background behind header`) enviado à `main` com Git; `gh` usado para autenticação/conferência, pois commit/push são operações Git.
- Deploy CLI: `vercel deploy /tmp/augeo-release-6b1092b --prod --project prj_SrK36bHFjy5Ns6eQvOW8OvuqXGRX --scope augeocreative --non-interactive --yes --meta githubCommitSha=6b1092b --meta githubCommitRef=main` concluído com **READY**, deployment `dpl_7Ldjtrbh53QzTST4MeXQyeuRW8Zo` ([painel](https://vercel.com/augeocreative/augeo-grid-hero/7Ldjtrbh53QzTST4MeXQyeuRW8Zo)), alias [produção](https://augeo-grid-hero.vercel.app/). Fonte exportada com `git archive HEAD` para pasta temporária, excluindo o print não rastreado; instalação/build remotos usaram Bun. `vercel inspect` confirmou produção, aliases e build de 21 s. Integração Git continua existente e também pode construir os pushes.
- Verificação pública: HTTP 200; HTML referencia os assets locais aprovados (`index-C2woN7yW.js`, `index-BJa9LR_t.css`); SHA-256 do CSS publicado idêntico ao local (`4d032f1750046b3e8597a5dff1cd41398dfa760289b749113cfc5fbae2a7a7a6`). `vercel logs` desta implantação, com `--level error --since 1h`, não retornou logs; isso não verifica erros de navegador. Captura/inspeção visual são locais, sem novo ensaio visual remoto ou aparelhos físicos. Drains/monitoramento não consultados. Arquivos `/tmp/augeo-panel-production.*` e pasta de exportação são temporários.
- Estado: implementação aprovada e publicada; resultado registrado em commit documental separado. Usuário pediu explicação do ganho dos CLIs e comparação de gasto; não há telemetria histórica comparável de tempo, tokens ou custo para calcular médias/percentuais.

### Publicação do redesenho mobile — 2026-10-13

- Usuário autorizou commit de todas as mudanças, push na `main` do GitHub e atualização da implantação Vercel. Correção de entendimento: o componente inteiro do grid passou para o footer do hero mobile, acompanhado de mudanças de ergonomia/acessibilidade e escala do lettering; não é apenas um ajuste decorativo. CSS mobile confirma lettering em `min(85%, 360px)` e padding responsivo, preservando a geometria do SVG.
- Validação atual: `bun run build`, `git diff --check` e `bun run test` aprovados (**24/24**, 18,8 s, Chromium). A tentativa inicial da suíte foi bloqueada por `EPERM` na porta; execução autorizada fora do sandbox passou. `git fetch origin main` confirmou branch alinhado ao remoto antes da publicação. Nenhum novo fluxo Impeccable aplicado nesta publicação.
- Publicação: commit `23e1a62` (`feat(hero): redesign mobile matrix footer and expose CTA`) criado com implementação, testes e handoff; `git push origin main` aprovado, de `d496103` para `23e1a62`. O usuário reforçou preferência pelo plugin `@Vercel` para operar a plataforma.
- Vercel: skills `vercel-cli` e `deployments-cicd` consultadas. O plugin está instalado, mas nenhuma ferramenta Vercel foi exposta nesta sessão e a consulta MCP retornou `unknown MCP server 'vercel'`. Tentativa de CLI interrompida pelo usuário; publicação realizada pela integração Git existente. A API pública do GitHub confirmou status Vercel `success` / `Deployment has completed` para `23e1a62`, ambiente `Production`, deployment GitHub `7030792535`, Vercel `E6eC8qjBhhcXy2SP6sHXCSvqdURQ` ([painel](https://vercel.com/augeocreative/augeo-grid-hero/E6eC8qjBhhcXy2SP6sHXCSvqdURQ)).
- Verificação de produção: [site público](https://augeo-grid-hero.vercel.app/) respondeu HTTP 200; HTML referencia os mesmos assets JS/CSS do build local validado. CSS servido comparado por SHA-256 com o build local, idêntico. Arquivos `/tmp/augeo-production.html` e `/tmp/augeo-production.css` são temporários. Sem inspeção visual do deploy, logs de runtime ou aparelhos físicos nesta publicação; validação funcional permanece a suíte local. Resultado de publicação registrado em commit documental separado, sem alteração adicional da UI.

### Validação do footer mobile — 2026-10-13

- **Testes e Cobertura**:
  - [tests/matrix.spec.ts](../tests/matrix.spec.ts): asserções mobile atualizadas para verificar que a matriz inicia na borda lateral completa (`deck.x === 0`), a ordem vertical é estritamente mantida (`intro -> cta -> deck`), e o lettering AUGEO permanece completamente acima da dobra em todos os viewports de teste (incluindo 320×600).
- **Validação**: `bun run build` aprovado sem erros; `bun run test` aprovado com **24/24 testes** (19,1s em Chromium). Sem commit/push, conforme diretriz padrão.

### Validação do painel e CTA — 2026-10-12

Skill `design-taste-frontend` usada na implementação do painel; não constitui execução de novo fluxo completo Impeccable.

- Testes e Cobertura:
  - [tests/matrix.spec.ts](../tests/matrix.spec.ts): asserção de alinhamento expandida para verificar que o CTA também compartilha a borda de 48px (`--hero-copy-inset`) junto com título, apoio, símbolo e triângulos nos quatro viewports desktop cobertos.
  - [tests/scroll-cue-preview.spec.ts](../tests/scroll-cue.spec.ts): eliminada instabilidade de precisão de ponto flutuante na medição do tempo pausado da animação.
- Validação: `bun run build` aprovado sem erros de tipos; `bun run test` aprovado com **24/24 testes** (18,1s em Chromium). Sem commit/push, conforme diretriz padrão.

A sincronização de suspensão recebeu ajuste adicional na migração de nomes; o resultado nominal desta rodada não garante estabilidade das rodadas posteriores.

### Revisão, staging e integração dos temas/ponteiro — 2026-10-12

Atribuição ao Gemini Flash informada pelo usuário, sem identificação do autor pelo diff. Rótulos técnicos `0x…` continuavam no canvas: não havia evidência de remoção integral de ruído decorativo ou conformidade estrita com craft-floor.

- Validação desta revisão: `bun run build` e `git diff --check` aprovados; `bun run test` passou com **24/24 testes** em Chromium (34,2 s). A primeira tentativa foi bloqueada por `EPERM` ao abrir a porta 5173; a execução fora do sandbox passou. Capturas da suíte em `test-results/` são artefatos locais ignorados, não referências persistentes.
- Impeccable: o registro recebido relatava detector sem achados (`[]`); resultado preservado como relato anterior, sem reexecução nesta revisão. Nenhum novo playbook ou workflow Impeccable aplicado/concluído. Permanecem os limites metodológicos dos ajustes anteriores.
- Staging: `git add -- components/ui/kinetic-matrix.tsx src/styles.css tests/matrix.spec.ts docs/HERO_HANDOFF.md` executado; os quatro arquivos estão no índice e os PNGs permanecem não rastreados. Escrita no índice exigiu execução fora do sandbox após bloqueio de `.git/index.lock`. `git diff --cached --check`, estatísticas e status conferidos; sem commit/push.
- Publicação autorizada posteriormente pelo usuário: commit `42caf9b` (`feat(hero): unify themes and extend matrix pointer interaction`) enviado com sucesso por `git push origin main`. A primeira tentativa foi rejeitada porque o remoto tinha `73fd268` (`fix(hero): preserve lettering counters`); `git fetch origin main` e rebase integraram a correção. Conflito somente neste handoff, resolvido preservando ambos os registros; SVG remoto preservado. Após integração, `bun run build`, `git diff --check` e `bun run test` aprovados (**24/24**, 32,9 s). PNGs continuam fora do versionamento. Este registro de publicação segue em commit documental separado; nenhum deploy foi verificado.
- Limite desta revisão: a suíte aprovada não comprovou isoladamente a reação ao ponteiro vindo da coluna esquerda.

### Validação local do contra-forma SVG — 2026-10-11

- Build de produção `bun run build` aprovado; `git diff --check` aprovado.
- Renderização local independente do SVG convertida para PNG e inspecionada: “A” vazado, “O” vazado e scanlines preservadas. A URL de produção não respondeu nesta sessão, portanto a renderização remota não foi confirmada naquela entrega.
- Alteração limitada a `src/assets/augeo-lettering.svg`; sem commit/push. Artefatos de inspeção em `/tmp/augeo-lettering*.png` são temporários.

Publicação posterior integrou o SVG remoto em `73fd268`; renderização remota naquele navegador ainda exige avaliação específica, registrada no documento de decisões.

### Inspeção e snapshots Figma — 2026-10-10

- Skill `figma-use` e referências de API/gotchas consultadas. Duas chamadas read-only de `use_figma` executadas: páginas/componentes e hierarquia/cores. Arquivo `wtc641vxh05ubxXIgrtzMy`, página `0:1`; layout mestre `5:41`, instância desktop 1440×900 `5:64`, coluna esquerda `5:42`, textos mestre `5:10` (`5:11` título, `5:12` apoio), marca mestre `5:13` (raster `5:14`), indicador mestre `5:25` (`5:27`/`5:28` triângulos), matriz mestre `5:29` (raster de fundo `5:30`), lettering mestre `5:15` (linhas vetoriais `7:51`). A referência enviada aponta para a instância de textos `5:45`.

- Impedimento: `get_screenshot` recusado por limite de chamadas Figma MCP do plano Starter; chamada seguinte `use_figma` para consultar variáveis e screenshot também recusada pelo mesmo limite. Sem captura visual, escrita no Figma, novo raster, implementação web ou testes. Fluxo de edição/validação Figma incompleto; nenhum workflow Impeccable novo executado ou declarado concluído. Alterações locais anteriores em CSS/testes/handoff preservadas, sem commit/push.

- Capturas via Playwright/Chromium e Bun, viewport 1440×900, DPR 2, light/reduced motion, com estilos temporários no navegador. Matriz sem lettering: 1614×1800 px, área CSS 806,390625×900; prévia: 2880×1800 px. A geometria e a imagem do Figma eram limites preservados, não prova de equivalência vetorial com a web.
- Comandos: `bun run dev --host 127.0.0.1 --port 5173`; `bun /tmp/augeo-light-snapshot.cjs` falhou no Chromium restrito e passou com escalada; PNGs conferidos por `file`, prévia inspecionada. Sem mudança permanente de código, suíte ou novo workflow Impeccable.
- O registro original dizia PNGs persistidos. A conferência posterior encontrou os dois arquivos ausentes no checkout e no Git: essa alegação de disponibilidade foi corrigida. Importação e aprovação não foram confirmadas; não declarar a edição concluída.

### Fluxos do alinhamento e apoio — 2026-10-09

- Workflows aplicados nesta tarefa: `layout` e `typeset`, seguidos da revisão disponível de `polish`. CLI `context --target src/styles.css` realmente executada; implementação e handoff consultados; playbooks e `craft-floor` lidos. Avaliações realizadas em sequência no próprio agente, com evidência de fonte, antes dos scans: hero Persuade, título primário/apoio secundário; Hanken local variável e peso 620 preservados; grupo textual com intervalo de 30 px, sem novas caixas. Tese: uma borda esquerda comum à marca, mensagem e indicador, com maior presença do apoio. Container e media queries mobile existentes preservados. Estados de formulário, carregamento, erro e conteúdo vazio não se aplicam a esse ajuste estático.
- Scans iniciais `detect --json --scope layout src/styles.css` e `--scope type` sem achados; detector geral final `detect --json src/styles.css` sem achados. `bun run build` aprovado e diff sem erros. Teste existente de posição atualizado para igualdade das bordas esquerdas de símbolo, título, apoio e triângulos nos quatro tamanhos desktop já cobertos; teste atualizado ainda não executado.
- Reajuste autorizado para 48 px: continuação do workflow `layout`, com orientações de `polish` já lidas e `craft-floor` relido antes da edição. Verificação da fonte confirma o token compartilhado nos três seletores desktop e overrides mobile de 20 px. Novo `bun run build`, detector geral e `git diff --check` aprovados; sem repetir tentativas de preview/Chromium já bloqueadas. Conferência visual não realizada nessa entrega; workflows completos não declarados.
- Limites: `bun run dev --host 127.0.0.1 --port 5173` bloqueado por `EPERM` ao abrir porta; tentativa direta de iniciar Chromium pelo Playwright também bloqueada pelo sandbox (`sandbox_host_linux.cc`, `shutdown: Operation not permitted`). Sem nova captura ou validação renderizada, interação, zoom, contraste computado ou suíte Playwright nesta sessão. Evidências anteriores são históricas. Por isso, os fluxos completos de `layout`, `typeset` e `polish` não são declarados concluídos; a entrega não incluiu inspeção visual desktop/mobile, incluindo telas desktop baixas.

### Registro, migração Bun e limpeza — 2026-10-09

Solicitado registrar os commits atrasados antes de migrar o tooling para Bun e limpar arquivos obsoletos. A implementação existente foi preservada: EXPLORE removido, triângulos com cores alternadas, título dimensionado pela coluna (Hanken 620), divisão 44/56, temas e faixa mobile. Nenhuma nova direção visual ou avanço de bloco.

Validação atual antes do commit: `bun --bun run build` aprovado; `git diff --check` aprovado. A tentativa de iniciar Vite com `bun --bun run dev --port 5173` falhou por restrição de abertura de porta no sandbox desta sessão (`EPERM`), inclusive em `127.0.0.1`; o usuário confirmou que `bun run dev` abre normalmente essa porta no seu terminal. A suíte completa em Chromium ainda não foi revalidada nesta sessão; resultados anteriores abaixo são históricos. Os registros Impeccable foram preservados, sem novo comando/playbook ou declaração de fluxo concluído.

Implementação registrada em `7f5f33c` (`feat(hero): replace Explore with animated triangle cue`). A regra pendente do guia pessoal foi registrada em `30a2dec` (`chore(git): ignore local personal guide`); guia mantido local e fora do versionamento.

#### Tooling exclusivo com Bun

- `packageManager` definido como `bun@1.4.0`; `bun.lock` versionado e lockfile npm retirado. `bunfig.toml` com `[run] bun = true` força o runtime nos scripts e executáveis chamados. Playwright inicia o servidor com `bun run dev --port 5173`. README e instruções operacionais atualizados; comandos históricos de validação preservados.
- Vite, TypeScript, Playwright, tipos `@types/node` e import `node:url` preservados. São necessários à ferramenta/configuração existente e compatíveis com Bun; não foi adicionada dependência de runtime Node.js.
- `bun install --frozen-lockfile`, `bun run build`, descoberta de **24 testes** por `bun run test --list` e `git diff --check` aprovados. `bun run which node` resolve o shim `/tmp/bun-node-34cbb9a40/node`, apontando para `/home/luca/.bun/bin/bun`.
- `bun run test --global-timeout 15000` não iniciou a suíte por `EPERM` ao abrir o servidor na porta 5173. Preview também bloqueado pelo sandbox ao abrir 4173. Esses resultados não contradizem a execução normal no terminal do usuário.
- Tentativa isolada dos dois testes de lógica pelo runner Playwright, com configuração temporária sem servidor, excedeu o timeout do worker; reprodução mínima de IPC Bun também não recebeu a mensagem. Causa não determinada nesta sessão. Os mesmos dois testes existentes passaram via adaptador temporário para `bun:test`: **2 aprovados, 10 filtrados, 1.634 assertions**. Isso valida a lógica, não a suíte Playwright inteira.
- Artefatos diagnósticos em `/tmp/augeo-bun-logic.config.ts`, `/tmp/augeo-bun-motion.test.ts` e `/tmp/augeo-bun-ipc*` são temporários e não versionados. Nenhum fluxo Impeccable reexecutado ou bloco visual encerrado nesta manutenção.

Migração registrada em `d856668` (`chore(runtime): standardize project tooling on Bun`). A verificação adicional `bun run node -e` confirmou `process.versions.bun = "1.4.0"` e `process.execPath = "/home/luca/.bun/bin/bun"`, inclusive ao chamar o nome compatível `node` pelo runner do projeto.

#### Limpeza conservadora e conferência final

- Protótipo anterior `legacy.html` e `augeo-field.js` removidos: não são entradas da aplicação atual nem dependências dos módulos ativos. `lucide-react`, sem importações após a retirada de EXPLORE, removido do manifesto e lockfile; as demais resoluções do lockfile foram preservadas.
- ZIP movido para `docs/references/segments.zip` e captura para `docs/references/bugs/2026-10-06-14:37:39-screenshot.png`. Ambos mantêm SHA-256 idêntico e renome de 100% no Git. Moodboard, estudos da marca, fontes/licenças, demonstração `?demo=matrix`, componentes e utilitários ativos preservados. README atualizado com a organização.
- `.codex/` ignorado por conter configuração local e caminhos específicos desta máquina; arquivo local preservado. Guia pessoal segue ignorado. Nenhuma alteração visual adicional ou novo workflow Impeccable nesta limpeza.
- Após a limpeza: `bun install --frozen-lockfile` e `bun run build` aprovados; os dois testes existentes de lógica passaram novamente pelo adaptador temporário `bun:test` (2 aprovados, 10 filtrados, 1.634 assertions). `bun run test --list` confirmou os mesmos 24 testes. Todos os 22 links Markdown relativos dos documentos compartilhados têm destinos existentes; diff sem erros.
- Nova tentativa integrada `bun run test --global-timeout 15000` continuou bloqueada ao iniciar Vite (`EPERM` no sandbox). Diagnóstico IPC com serialização avançada também não recebeu mensagem em cinco segundos; nenhuma correção especulativa ou fallback Node.js foi introduzido. Suíte completa, preview no navegador e comunicação dos workers Bun/Playwright continuam sem validação nesta sessão.

Manutenção implementada e separada em quatro commits locais. Push solicitado posteriormente pelo usuário: `git push origin main` falhou por permissões inválidas em `/etc/ssh/ssh_config.d/20-systemd-ssh-proxy.conf`; tentativa com override temporário `core.sshCommand='ssh -F /dev/null -o BatchMode=yes'` falhou na resolução de `github.com`. Nenhuma configuração SSH/remote foi alterada permanentemente; commits permanecem locais. Este impedimento foi registrado em commit documental adicional.

### Contraste alternado do indicativo — histórico

- Fluxos Impeccable `animate` → `polish` reaplicados ao indicador, usando contexto CLI e playbooks já lidos na sessão; implementação, testes, handoff e capturas anteriores consultados. `craft-floor` relido imediatamente antes de editar. Tese: contraste descendente com cores trocadas em cada passagem, pausa entre pulsos; orçamento continua limitado a dois caminhos pequenos. Estados de formulário/erro/carregamento e feedback de controle não se aplicam. Geometria, tema, ponta, interrupção e diff conferidos, sem conclusão dos blocos do hero inteiro.
- Build aprovado (`npm run build`). Testes atualizados para primeira passagem, inversão e retorno às cores iniciais nos dois temas, além de pausa/retomada, reduced motion, dimensões e ponta. Primeira execução encontrou troca prematura de camada na pausa anterior à segunda passagem; corrigida mantendo `z-index: 1` até 49,999% do ciclo. Execução final `npx playwright test tests/scroll-cue-preview.spec.ts`: **12/12 aprovados**. Sem nova execução da suíte da matriz; 24/24 anteriores são evidência histórica.
- Uma rodada visual agrupada após a correção: claro/escuro em 1440×900, 900×600, 768×600 e 844×390, mobile 390×844, 320×740 e 320×600. Capturas temporárias não versionadas em `test-results/scroll-cue/`; detalhes em `/tmp/cue-alternating-colors.png` e panorama `/tmp/cue-alternating-layout.png`. Ponta integral e troca de cor confirmadas. Detector manual executado uma vez sobre `src/styles.css`, sem achados, antes da correção pontual de camada; não repetido. Diff final sem erros.

Limites dessa execução: Chromium/emulação, sem aparelhos físicos/outros motores ou medição de frames em hardware. Aba oculta testada via estado sintético. Naquela versão, a coluna lateral era clara em ambos os temas e o pulso branco tinha pouco contraste; o painel/tema foi alterado depois. Alterações locais anteriores preservadas; sem commit/push.

### Retirada de EXPLORE e reversão da rodada 38/62 — histórico

- Retirada localizada de EXPLORE: build e 14/14 testes aprovados, detector geral sem achados e diff sem erros. Sem novo fluxo completo de refinamento.
- Rodada 38/62 rejeitada: suíte 15/15 naquele alvo; seus resultados não validam a restauração. Na reversão, build e 16 testes em execuções separadas (15 + confirmação de desktop curto), detector geral e diff aprovados. Captura restaurada com lettering inspecionada. Os resultados/capturas da rodada rejeitada não validam a entrega restaurada.

### Bloco 1 e evolução inicial do bloco 2 — histórico

- Bloco 1: build aprovado, 12/12 testes Playwright em Chromium e detector CLI sem achados. O teste de EXPLORE verifica leitura acessível, ausência de ação/foco e ausência de navegação; substituiu o teste com seção injetada.
- Correção antecipada de EXPLORE: build aprovado, 12/12 testes passando, detector sem achados e capturas inspecionadas com movimento reduzido em desktop, desktop curto e mobile. Em 1440×900, a coluna passou de aproximadamente 288 px para 405 px, incluindo a seta. Links locais da documentação verificados.

- Mobile: copy seguida, após 24 px, por EXPLORE + matriz. Matriz de 288–340 px; o mínimo de 288 px acomoda a coluna de aproximadamente 286 px, inclusive em 320×600. AUGEO inteiro na primeira tela em 390×844 e 320×740; nesta última, o artwork termina em aproximadamente y=535 px, ante y=849 px na captura anterior.
- Validação: build aprovado, 13/13 testes Playwright em Chromium e detector CLI sem achados. Inspeção visual nos cinco viewports previstos e confirmação adicional em 320×600, nos temas claro/escuro. Fonte raiz a 200% sem overflow horizontal nos cinco viewports previstos; esse ensaio não equivale a zoom real do navegador.
- Testes preservam leitura/foco do indicativo, temas, toque emulado, deformação limitada, retorno ao repouso e abertura do “A”. Capturas de comparação antes/depois disponíveis localmente em `test-results/hero-block2/`; são artefatos temporários não versionados.
- Limites: validação em Chromium, sem ensaio em aparelhos físicos ou outros motores. Introdução finita e otimização de desempenho não foram antecipadas; os loops automáticos não foram alterados naquela entrega.

### Guia pessoal, produto e assets — 2026-10-08

- Criado, a pedido do usuário, um guia pessoal informal em docs, excluído do versionamento por regra específica no `.gitignore`. Guia complementado com explicação individual dos blocos 1–6, seus objetivos, trabalhos, condições de conclusão e estados; isso encerra a solicitação documental, sem fechar blocos de implementação. Conteúdo privado não incorporado aos documentos compartilhados. Exclusão confirmada com `git check-ignore -v`, ausência confirmada em `git ls-files` e links locais do guia verificados.
- Fluxo aplicado: orientação de metodologia pelo caminho **Workflow questions** do routing da Impeccable. `impeccable context` realmente executado; resolveu `docs/PRODUCT.md`, sem DESIGN.md ou briefing formal de superfície. Documentos de produto, estratégia, arquitetura, operação e estágio cruzados com o código e referências dos playbooks. Nenhum fluxo de refinamento declarado concluído por essa leitura.
- Entrega apenas documental: sem alteração de UI, nova suíte, detector, auditoria, critique ou polish. O estado metodológico do bloco 2 foi preservado. Push anterior confirmado pelo usuário; sem novo commit/push nesta entrega.

#### Organização do documento de produto — 2026-10-08

- `PRODUCT.md` (singular) movido para `docs/PRODUCT.md`, sem alterar o conteúdo. Links de entrada no AGENTS e neste handoff atualizados; a orientação de retomada no plano agora explicita o caminho a partir da raiz. Para consultar o contexto de produto da skill, usar esse documento como fonte existente, sem criar uma cópia concorrente na raiz.
- Links locais de todos os documentos Markdown do projeto e caminhos citados no documento de produto verificados após a movimentação; diff sem erros de whitespace. Nenhuma alteração de código nesta etapa; build e 13 testes da reorganização dos assets permanecem a validação técnica pertinente.
- Commit de assets: `f862438` (`refactor(assets): centralize logo and moodboard assets`). A movimentação deste documento foi registrada separadamente em `docs(product): move product context into docs`; push realizado pelo usuário, conforme confirmação posterior nesta conversa. As tentativas anteriores do agente falharam por configuração SSH e DNS; o branch local agora está alinhado ao `origin/main` conhecido localmente. Não houve verificação remota adicional ou ensaio de produção nesta atualização. Nenhuma configuração SSH ou remote foi alterado.

#### Organização dos assets — 2026-10-08

- Moodboard centralizado em `src/assets/moodboard-modular/` e marca/estudo tipográfico em `src/assets/logo/`. Import do símbolo, resumo do produto e referências do plano atualizados, inclusive os seis caminhos absolutos e o índice CSV. Lettering e fontes atuais preservados.
- Integridade: 38 arquivos comparados por SHA-256 antes/depois, sem alteração de conteúdo; Git reconheceu 38 renomes com 100% de identidade em index temporário, sem modificar o index real. Verificadas 33 referências locais da documentação e as 33 entradas do CSV; nenhum caminho operacional antigo encontrado na busca do projeto.
- Validação desta reorganização: `npm run build` aprovado; `npx playwright test` com 13/13 testes aprovados em Chromium; verificação adicional temporária no navegador confirmou o símbolo no novo caminho, com dimensões naturais positivas e sem falhas de requisição. `git diff --check` aprovado. Ensaio adicional e manifesto de hashes estão em `/tmp/augeo-assets-runtime-check/` e `/tmp/augeo-assets-move-manifest.json`, são temporários e não constituem a única evidência.
- Tentativa inicial por `npm test` não iniciou o servidor por restrição de porta (`EPERM`); execução pelo comando Playwright autorizado passou. Nenhuma mudança visual ou avanço dos blocos do hero; pendências Impeccable e avaliação do bloco 2 preservadas. Sem commit/push; `.codex/` e `bun.lock` preexistentes preservados.
- Limites: `legacy.html` já referencia `./augeo-logo.png`, ausente antes da movimentação; não corrigido nesta tarefa. A busca cobre arquivos acessíveis do projeto, sem garantir atalhos externos desconhecidos.

### Validações das prévias superadas — histórico

- Células quadradas: build e detector geral `[]`; 15 testes permanentes aprovados em execuções separadas, após falha mobile por destruição de contexto e confirmação isolada sem edição da UI. Captura temporária removida; servidor inicialmente encontrou EPERM, sem mudança de configuração. Capturas/GIF em `/tmp/augeo-grid-cue-preview/`; correção localizada sem polish ou novo fluxo completo.
- Prévia de curvas: playbook animate aplicado com inspeção/repouso/reduced motion, sem scans iniciais por escopo, perfil de hardware ou suspensão; sem conclusão integral de layout/typeset/animate e sem polish. Build/detector `[]`; suíte ampliada a 15 testes. Sobreposição de 5 px em 844×390 corrigida pela altura compacta. Capturas em `/tmp/augeo-explore-desktop/` e `/tmp/augeo-scroll-preview/`; GIF de 40 frames com tempos controlados de 100 ms, ampliado 3×. O replay do GIF não representa loop infinito no site. Sem navegação real para Processo.
- Pivot de setas: inspeção de implementação/moodboard e descoberta de shape; sem UI/testes ou fluxo completo nessa exploração. Panorama `/tmp/augeo-moodboard-review.jpg` temporário. Propostas estão no registro de decisões.

### EXPLORE desktop e reiteração — 2026-10-08

A direção dessa versão de EXPLORE está no registro de decisões; abaixo ficam somente suas verificações.

- `layout` e `typeset`: avaliações visuais/source antes dos scans, tese, implementação e verificação disponíveis executadas. Detalhes técnicos transferidos para as evidências complementares deste backlog. CLI realmente executada: `context --target src`, `detect` inicial/final com escopos layout/type e geral final (todos `[]`); nenhum verbo CLI homônimo, `polish`, novo audit ou critique.
- Validação: `npm run build` aprovado; `npx playwright test` com 14/14 testes permanentes aprovados em Chromium. Novo teste cobre cinco viewports desktop, dois temas e duas preferências de movimento: sete letras equidistantes, contenção, fonte Hanken, leitura acessível e ausência de overflow horizontal. Capturas reduzidas em `/tmp/augeo-explore-desktop/`; inspeção também da captura mobile da suíte. Alturas: 400 px em 1920×1080, 360 px em 1440×900 e 320 px nos desktops curtos. `git diff --check` aprovado.
- Limites: Chromium/emulação; sem aparelhos físicos, outros motores, zoom real ou nova medição de CLS/rede. Primeira execução não iniciou o servidor; tentativa separada de Vite explicitou `EPERM` de porta. Nova execução normal de Playwright iniciou o servidor e passou. Artefatos de captura são temporários; decisões e medidas ficam neste registro.

- **Fluxos:** `shape` confirmado pela autorização. `layout`/`typeset`: avaliação visual independente, scans iniciais, tese, implementação e verificação por evidências; `bolder`: teste de estrutura e preservação de identidade/escopo; `adapt`: contextos, estratégia, implementação e verificação disponível, com lacunas de hardware/motores explicitadas. Passos e evidências complementares estão abaixo. Não confundir esses fluxos com execução CLI de verbos homônimos: as ferramentas executadas foram `context`, `detect`, build e Playwright.
- **Validação:** build aprovado e execução final com 14/14 testes aprovados (13 permanentes + ensaio temporário de estresse). Nove viewports com fonte raiz a 200%, expansão sintética e fallback sem overflow; rede simulada e bloqueio de fontes mantiveram leitura disponível. Scans de layout/type antes/depois e scan geral final retornaram `[]`. Inspeção agrupada em nove viewports, claro/escuro e movimento reduzido, com revisão independente dos tamanhos principais sem falha material. Contraste de apoio/indicativo aproximadamente 5,8:1. Capturas e métricas temporárias em `/tmp/augeo-block2-reiteration/`; medidas essenciais transcritas no registro.
- **Limites:** Chromium/emulação; sem dispositivos físicos, outros motores, zoom real ou medição de CLS. Em 4K, os limites de escala deixam a composição muito esparsa. Nenhum novo audit, critique ou polish foi declarado concluído. Preservadas alterações locais preexistentes em `.gitignore`, handoff, `.codex/` e `bun.lock`; sem commit/push.

### Estado metodológico histórico

No bloco 2 foram lidos os playbooks `shape`, `bolder`, `layout`, `typeset` e `adapt`, e suas orientações foram utilizadas na implementação. Isso não constituiu a conclusão dos fluxos completos de cada comando. Foram executados o launcher `context`, o detector `detect`, build, testes e inspeções visuais. Não existe uma nova execução completa de `audit` ou `polish`; a auditoria registrada continua histórica.

O usuário pediu que esta distinção fosse persistida. A preferência está em `/home/luca/.codex/AGENTS.md`: seguir os fluxos completos aplicáveis, informar qual está sendo aplicado e registrar etapas, evidências, artefatos, omissões e pendências. Nunca declarar um comando concluído apenas porque seu playbook foi lido.

A reiteração acima executou as etapas disponíveis e documentou as lacunas de `adapt`; a leitura anterior não constitui conclusão. Preservar a implementação e as decisões confirmadas, sem fabricar evidências ou repetir verificações sem necessidade. A pontuação histórica da auditoria não é resultado pós-implementação.

A referência pessoal em `/home/luca/.codex/AGENTS.md` é um caminho histórico. A rotina compartilhada vigente está no AGENTS.md do repositório. Testes posteriores cobrem regressões, sem substituir avaliações pendentes ou fechar fluxos ausentes.

### Evidências complementares da reiteração — 2026-10-08

Transferidas de HERO_BLOCK2_REITERATION.md. Descrições de DOM, fontes e tamanhos nas verificações são do alvo histórico; direção atual é a do handoff.

`impeccable context --target src/App.tsx` foi executado uma vez na etapa de planejamento desta sessão: resolveu `docs/PRODUCT.md`, sem DESIGN.md ou briefing formal. Foram lidos os playbooks aplicáveis; `craft-floor.md` foi relido imediatamente antes das edições. Não houve uma execução CLI de comandos chamados `layout`, `typeset`, `bolder` ou `adapt`: o trabalho abaixo executa seus playbooks, com as ferramentas realmente nomeadas.

#### Verificação dos playbooks históricos

| Fluxo | Verificação e alcance |
|---|---|
| `shape` | Briefing reaproveitado dos documentos, pergunta estruturada sobre abrangência tipográfica, direção apresentada e explicitamente autorizada por “Implemente o plano”. Planejamento encerrado antes da implementação. |
| `layout` | Capturas atuais mostram hierarquia no teste de silhueta, proximidade entre título/apoio, separação da matriz e cadência da coluna. DOM mantém copy → indicativo acessível → matriz; o único foco é a marca. Ampliação/expansão verificadas em ensaio runtime. Scan final de layout retorna `[]`. |
| `typeset` | Papéis distintos: título 620, apoio 400 e mono 400 menor; famílias existentes preservadas, texto real legível nos tamanhos principais. Fonte local carregada, fallback visível; sem medição de CLS ou zoom real. Scan final de type retorna `[]`. |
| `bolder` | Teste de estrutura sem depender de brilho: massa mais aberta do título, assinatura preservada e percurso lateral mais quieto. Amplificação concentrada no título e contraponto gráfico; nenhuma fonte, cor ou claim nova. Fora do alvo preservado. |
| `adapt` | Origem desktop com split/ponteiro; destino mobile com copy seguida da faixa/matriz, touch e sem hover obrigatório. Capturas portrait/landscape, ampliação, 320 px e 4K; suíte cobre toque sintetizado e recuperação do artwork. Verificação disponível concluída, mas ensaios físicos e outros motores permanecem pendentes. |

Inspeção agrupada em dois temas, movimento reduzido e nove tamanhos: 1440×900, 900×600, 768×700, 768×600, 390×844, 320×740, 320×600, 844×390 e 3840×2160. Uma rodada após implementação e uma confirmação sem novas mudanças de UI. A revisão independente dos principais tamanhos não encontrou falha material. Em 4K, os tetos de título/assinatura deixam a composição muito esparsa; preservados nesta reiteração localizada.

Scans finais com escopos `layout`, `type` e geral retornaram `[]`. `npm run build` passou. A suíte permanente de 13 testes passou após a implementação; o teste do indicativo foi ajustado para verificar ausência da varredura removida. Na execução final, passaram 14/14 testes: os 13 permanentes e um ensaio temporário de estresse. Esse ensaio conferiu os nove tamanhos com fonte raiz a 200%, expansão sintética de título/apoio e fallback Arial, sem overflow horizontal nem sobreposição título/apoio, com seta contida no indicativo. Rede simulada a 100 ms/200 kB por segundo carregou ambas as fontes; bloqueio de WOFF2 manteve texto visível e sem overflow. Não houve medição de deslocamento cumulativo de layout. A primeira versão do ensaio excedeu 30 segundos após manter throttling na navegação de fallback; o ensaio foi corrigido para separar os estados de rede e passou, sem nova edição da UI. Algumas tentativas de iniciar o servidor falharam por restrição de porta; as execuções efetivas usaram `npx playwright test`.

#### Artefatos e limitações da reiteração

Capturas, medidas antes/depois e scripts de ensaio estão em `/tmp/augeo-block2-reiteration/`, são temporários e não versionados. Este registro preserva as decisões e medidas relevantes, sem depender dos arquivos temporários para retomada.

Validação disponível em Chromium. Sem iPhone/Android/tablet físicos, Safari/Firefox/Edge ou verificação em outros sistemas. Fonte raiz a 200% não equivale a zoom real. Rede lenta foi simulada por CDP; não representa uma medição de performance em hardware móvel. Não foi executado novo `audit`, `critique`, `polish` ou fluxo completo de `new-work`; `polish` permanece no bloco 6 e extração de DESIGN.md no bloco 5.

Naquela entrega, a próxima ação era avaliação visual do usuário do bloco 2. Os limites de cobertura de `adapt` permanecem registrados; a entrega não autoriza avançar automaticamente para movimento ou fechar os blocos seguintes.

## Conexão do domínio próprio — 2026-10-13

Estado final: DNS validado, usuário confirmou site online e HTTPS dos dois endereços foi confirmado na revisão da especificação abaixo. Os itens seguintes registram as etapas anteriores; redirecionamento canônico permanece pendente.

- Após o usuário ajustar a zona na Hostinger: `dig` confirmou os dois A recomendados e o CNAME www; MX preservados. Nova execução de `vercel domains verify` para cada endereço retornou `configured_correctly`, `ok: true`, sem conflitos. HTTP de www respondeu 200 pela Vercel, com ETag igual ao endereço de produção `.vercel.app`; HTTPS dos domínios próprios falhou com `curl` código 35 (`unexpected eof while reading`), inclusive com `--noproxy '*'`. HTTPS do `.vercel.app` respondeu 200. `vercel certs ls --scope augeocreative` não listou certificados; isso, isoladamente, não determina o estado dos certificados automáticos. DNS concluído; próximo passo é confirmar HTTPS dos dois endereços e configurar o redirecionamento canônico pendente.
- Usuário autorizou conectar o domínio ao site já publicado, mantendo o plano atual e adiando Pro/WhatsApp Business para depois da conclusão do site. E-mail comercial existente: `hello@augeocreative.com`.
- Skill `vercel:domains` aplicada. Git inicialmente limpo; `vercel whoami`, `vercel project ls` e `vercel project inspect augeo-grid-hero --scope augeocreative --non-interactive` confirmaram conta, equipe e projeto `prj_SrK36bHFjy5Ns6eQvOW8OvuqXGRX`.
- `vercel domains add www.augeocreative.com augeo-grid-hero --scope augeocreative --non-interactive` e equivalente para `augeocreative.com` concluídos com `domain_added`. Nenhum novo deploy, commit ou push.
- `dig` confirmou DNS externo na Hostinger (`helios.dns-parking.com`/`aster.dns-parking.com`), A raiz `2.57.91.91`, CNAME www para a raiz e MX `mx1.hostinger.com`/`mx2.hostinger.com`. Nenhum registro DNS alterado.
- `vercel domains verify` executado uma vez por endereço com `--project augeo-grid-hero --scope augeocreative --json`: ambos vinculados/verificados quanto à propriedade, mas com `invalid_configuration` no apontamento. Valores retornados: A `@` → `216.198.79.1` e `64.29.17.1`; CNAME `www` → `854fde2e385e7678.vercel-dns-017.com`. Conexão pública/HTTPS ainda pendentes.
- Disponibilidade de sessão para DNS investigada com CLI `dev-browser` (`--help`, `status`, `browsers`, `chrome --list`); nenhum navegador/sessão em execução disponível. Sem acesso autenticado à Hostinger nesta execução. Próxima ação: usuário atualizar os registros do site na zona DNS da Hostinger, preservando MX/TXT de e-mail e nameservers; depois verificar propagação e HTTPS. Redirecionamento canônico ainda não configurado. Sem alteração de UI ou nova suíte funcional.

## Organização documental concluída — 2026-10-13

- Correção explícita do usuário: handoff limitado à implementação persistente e direção visual/conceitual; execução técnica e registros cronológicos neste backlog; antecedentes, propostas e avaliações em HERO_DECISIONS_AND_IDEAS.md. Essa regra substitui a divisão anterior que tratava o handoff como arquivo histórico.
- Implementação conferida em App, CSS, ScrollCue, matriz e física; descrições atuais usam os nomes pós-refatoração. Estados antigos de EXPLORE, faixa mobile, CTA oculto e 38/62 foram separados e marcados como superados. Registros de testes, fluxos, commits, deploys e artefatos foram transferidos com seus limites.
- Referências à captura mobile removida não alegam mais que ela está preservada/disponível. AGENTS, README e encaminhamentos do plano/especificação foram ajustados. Naquela reorganização, HERO_BLOCK2_REITERATION.md conservou apenas o encaminhamento; esse arquivo foi posteriormente removido na consolidação para seis documentos.
- Verificação documental: 59 links locais, incluindo quatro âncoras, aprovados por script Python; `git diff --check` aprovado. Busca de referências obsoletas à função dos documentos e ao nome da captura removida concluída, sem ocorrências do arquivo removido. Diff limitado a Markdown; sem build/teste novo por não haver alteração de código. Sem novo fluxo Impeccable ou deploy manual. Após a entrega, usuário autorizou commit/push e reforçou uso do GitHub CLI: gh para consultar o repositório e conferir o SHA remoto; Git para staging, commit e push, sem equivalentes no gh. A publicação acompanha em um único commit documental, sem commit separado para registrar o envio.

## Revisão integral da especificação e publicação documental — 2026-10-13

- Solicitação do usuário: atualizar toda `02-WEBSITE_SPEC.md`, sobretudo seções 10/11 e matriz, depois commit/push das atualizações. Revisão cruzou App/main, CSS, package/Vite, handoff, decisões, backlog, produto e contexto estratégico.
- Corrigidos escopo publicado versus landing completa, fluxo ainda sem destino `#entrada`, matriz já implementada, temas unificados, tipografia/paleta/tokens existentes, assets e copy aplicados. Seções 10/11 distinguem base técnica definida, integrações futuras e requisitos para completar a landing. `PRODUCT.md` sincronizado para não manter o estado anterior de protótipo/copy integralmente indefinida. Nenhuma alteração da UI ou decisão de arquitetura comercial nova.
- Evidência de produção: `curl -sSI --max-time 15` para HTTPS raiz e www retornou HTTP/2 200 em ambos, mesmo ETag `4b0333cf11ee7f604edb78874a6d5412`; supera a falha TLS inicial registrada na conexão do domínio, sem apagar seu histórico. Confirma HTTPS/acesso, sem teste visual, entrega de e-mail ou formulário. Usuário também confirmou o primeiro site em produção.
- Validação documental: `git diff --check` aprovado e 18 links locais dos três documentos revisados conferidos por script Python, sem erros, antes do commit; sem build/suíte funcional por alteração somente Markdown. Sem novo fluxo Impeccable, deploy manual ou avanço de bloco. Commit/push autorizados nesta entrega; integração Git pode gerar deploy automático. Próxima ação após envio: novas frentes somente conforme pedido do usuário.

## Auditoria de nomenclatura — referência histórica e protocolo

Relatório de 2026-10-13 antes mantido em documento separado. As tabelas são o diagnóstico anterior à migração; estado implementado e validações estão em “Nomenclatura — migração implementada e validada” acima. O protocolo e as exceções continuam aplicáveis a futuras refatorações.

Pedido original: avaliar nomes confusos em praticamente todo o projeto e procurar uma skill útil. As tabelas abaixo registram a auditoria inicial; a migração posterior está delimitada na seção seguinte, com estado e validações em BACKLOG.md.

### Migração autorizada — 2026-10-13

Usuário autorizou retomar a refatoração após formalizar o fallback dos testes. Escopo desta migração: prioridades 1/2, props da imagem, nomes da demo e do teste do indicador, helpers dos testes e seletores/custom properties relacionados. Os mapeamentos abaixo orientam a implementação; valores, fórmulas, asserções e estrutura permanecem iguais. `.cue-study` será `.hero-page`, preservando a camada de escopo e a especificidade. Remoção de `pixel`, eliminação desse escopo, divisão da suíte e movimentação de assets continuam separadas no backlog. Resultados atuais pertencem ao [BACKLOG.md](BACKLOG.md); os registros da auditoria inicial abaixo são históricos.

Migração implementada e validada: build aprovado, suíte final 24/24 em 19,1 s no contexto autorizado e oito pares de capturas idênticos. Além das renomeações, corrigida a sincronização do teste de suspensão para aguardar tarefas pendentes de animação, preservando as asserções; detalhes, comandos e limites no backlog. O escopo `.cue-study` agora é `.hero-page`.

Revisão de 2026-10-13: usuário pediu assegurar o uso da candidata recomendada e proteger a refatoração contra regressões. A skill escolhida é `coding-standards` de `affaan-m/ECC`; seu [SKILL.md original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) foi lido integralmente nesta revisão e suas orientações de nomes descritivos, funções com verbos, simplicidade e testes foram aplicadas ao protocolo abaixo. Não houve instalação local nem implementação de renomeações. Trabalhos futuros e avaliações foram consolidados em [BACKLOG.md](BACKLOG.md).

### Skill adotada e protocolo de segurança da refatoração

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

### Diagnóstico

O principal problema é a perda de significado: nomes não dizem se o valor é um índice, tempo, ID, retângulo, posição ou buffer. A concentração é maior no efeito principal de `components/ui/kinetic-matrix.tsx`, que reúne simulação, desenho, deformação da imagem e ciclo de animação. Ali, nomes curtos vivem por centenas de linhas e cruzam responsabilidades. Em callbacks pequenos, a mesma concisão costuma ser aceitável.

Há também resquícios de demonstração/estudo nos nomes de componentes, seletores e arquivos de teste. Configurações e pontos de entrada têm nomes convencionais claros; não há motivo para renomear tudo. O componente da matriz tem demonstração independente e suporte a texto/imagem arbitrários: sua generalidade é real. Não substituir todo `artwork` por `augeoLettering` dentro da API compartilhada.

### Prioridade 1 — nomes que escondem tipo, unidade ou significado

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

### Prioridade 2 — responsabilidades e buffers

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

### CSS, componentes, arquivos e testes

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

### Critério proposto para futuras alterações

1. Nomear o conceito e o papel: índice, bounds, timestamp, buffer, query ou observer quando isso evita ambiguidade.
2. Usar verbos nas funções (`update`, `read`, `draw`, `create`, `advance`) acompanhados do objeto da ação quando o escopo não o deixa evidente.
3. Nomear booleanos como perguntas/estados (`isMatrixInViewport`) e flags de configuração como ações habilitadas (`enableArtworkMotion`).
4. Explicitar unidades nas fronteiras entre segundos/milissegundos e pixels CSS/bitmap. Não misturar nomes de tempo e distância como `step`.
5. Usar um vocabulário consistente: matriz/grade → nós e ligações; pulso percorre ligação; onda nasce da interação; artwork é a imagem genérica, lettering AUGEO é seu uso no hero.
6. Preservar nomes convencionais e abreviações matemáticas de escopo curto. Evitar prefixar tudo com AUGEO ou criar nomes enormes.

### Skills e evidências — auditoria inicial

- `find-skills` aplicada: leitura do playbook, consulta inicial ao leaderboard e buscas CLI. Após o usuário preparar `~/.cache/bun-tmp`, `TMPDIR="$HOME/.cache/bun-tmp" bunx --bun skills find naming` e a busca por `"coding standards"` terminaram com código 0, sem EROFS, mas retornaram "No skills found" nesta execução. O usuário havia obtido candidatas com a mesma busca em seu shell. A causa da diferença de resultados não foi determinada; isso não comprova que não existam skills.
- Candidata geral: [coding-standards de affaan-m/ECC](https://www.skills.sh/affaan-m/ecc/coding-standards), cerca de 4,7 mil instalações na página consultada; [repositório](https://github.com/affaan-m/ECC) com cerca de 278 mil estrelas. Fonte comunitária, não skill oficial TypeScript/React. [Conteúdo original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) inspecionado: nomes descritivos, funções com verbos e nomes de arquivos/testes. É uma referência geral, não um glossário desta matriz; regras amplas de imutabilidade não devem ser aplicadas cegamente aos buffers da simulação.
- Alternativa específica: [clean-code-ts-react de pproenca/dot-skills](https://www.skills.sh/pproenca/dot-skills/clean-code-ts-react), 157 instalações na página consultada e [repositório](https://github.com/pproenca/dot-skills) com 214 estrelas. Apresentação inspecionada, enfatiza TypeScript/React e exceções contextuais; regras completas não foram verificadas. Menor evidência de adoção, não é a recomendação principal.
- Se houver interesse em instalar apenas a candidata geral: `TMPDIR="$HOME/.cache/bun-tmp" bunx --bun skills add affaan-m/ECC --skill coding-standards`. Comando fornecido, não executado. Nenhuma skill foi instalada nem seu fluxo integral aplicado ao código.
- Inspeção estática dos fontes TS/TSX, CSS completo, testes completos, configurações, README, SVG do lettering, organização dos arquivos, índice CSV, estrutura dos documentos e trechos pertinentes de produto/especificação. Não foi uma revisão integral de todo o texto estratégico nem de arquivos binários/dependências.
- Nenhum código alterado, build/teste executado, commit/push ou fluxo Impeccable aplicado nesta entrega. Validação documental: `git diff --check`. Próxima etapa sugerida: migrar primeiro os nomes ambíguos da simulação e os resquícios de prévia, preservando comportamento; build e suíte existente seriam a validação dessa futura refatoração.

## Consolidação para seis documentos — 2026-10-13

- Usuário pediu reduzir os onze documentos a cinco ou seis. Mantidos PRODUCT, 02-WEBSITE_SPEC, HERO_HANDOFF, BACKLOG, HERO_DECISIONS_AND_IDEAS e HERO_AUDIT_AND_IMPROVEMENT_PLAN. Sem novo índice ou arquivos de encaminhamento.
- Contexto estratégico e operação interna incorporados como seções de PRODUCT; implementação técnica desatualizada da operação reconciliada com a especificação. Rascunhos de copy preservados na especificação e identificados como não implementados/sem aprovação final registrada. Auditoria nominal e protocolo movidos para este backlog, com tabelas explicitamente históricas. Encaminhamento do bloco 2 removido porque seu conteúdo já havia sido distribuído.
- AGENTS, README e referências dos documentos ajustados aos destinos e âncoras. Mantida a separação entre implementação/direção, execução e decisões, sem fechar avaliações ou avançar blocos. Somente Markdown alterado; sem build/suíte funcional ou novo fluxo Impeccable.
- Verificação: seis documentos em docs; script Python aprovou 57 links locais, incluindo oito âncoras, e `git diff --check` passou; referências operacionais aos cinco arquivos removidos verificadas. Nomes de arquivos antigos em registros históricos preservados quando explicam a transferência. Consolidação incluída no commit local posteriormente solicitado pelo usuário; push desta rodada não solicitado.

## Correção de footer mobile, conversão e hover — 2026-10-13

- Usuário corrigiu a descrição: a matriz inteira já virou o footer mobile, o botão de conversão existe e a composição reativa em hover está implementada. Especificação ajustada em estado publicado, arquitetura, função/campo visual do hero e pendências; retiradas as negativas redundantes e a apresentação do footer como entrega ausente. Formulário `#entrada` permanece previsto, conforme App; não confundir botão de conversão existente com recebimento de dados implementado.
- Handoff, produto e decisão de composição mobile sincronizados. Nenhuma mudança de UI; consolidação para seis documentos preservada. Usuário solicitou salvar todas as alterações locais em commit, sem novo pedido de push.
- Verificação documental: links locais/âncoras e `git diff --check` conferidos antes do commit. Sem nova suíte/build por mudança somente Markdown. Próxima ação: novas alterações conforme pedido do usuário; commit local desta rodada inclui consolidação e correções relacionadas.
