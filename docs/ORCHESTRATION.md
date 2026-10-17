# Orquestração Antigravity/Codex

Pesquisa, plano e implementação de 2026-10-17. **Estado: implantação local autorizada pelo usuário; piloto em validação.** Este documento trata do novo contrato entre executores; não substitui requisitos, decisões visuais ou procedimentos dos módulos existentes.

**Antecedente — contrato v0.1:** o pedido “Vamos lá” autoriza concretizar coordenação e estrutura para revisão. O usuário acrescentou a escolha entre interface gratuita semelhante ao Maestri e TUI. Esta versão fecha a proposta de responsabilidades, conteúdo, tarefa e aceite; inclui comparação de interfaces, sem instalar/adotar uma delas. As seções técnicas abaixo descrevem a opção de ponte própria, cuja necessidade deve ser reavaliada após o piloto da interface.

**Limite de adoção:** serviços citados nas referências externas não integram a arquitetura definida. Paperclip usa PostgreSQL embutido para seu estado operacional. Banco do website, embeddings e transcrição continuam sem escolha. O futuro contexto global deve registrar ferramentas efetivamente adotadas; exemplos e hipóteses permanecem na documentação conceitual. Visualização do conhecimento é requisito; Obsidian já está instalado e o store foi preparado como vault, sem plugins adicionais.


## Implantação local autorizada — 17/10

O pedido “Implemente o plano” autoriza a configuração local Paperclip + Antigravity CLI + Codex, contexto compartilhado e vault. As seções de pesquisa abaixo preservam a evolução da proposta; este bloco define o estado atual. Não há mudança visual, commit, push ou publicação.

- Código da integração: diretório `agent-orchestrator` irmão deste projeto. Instalação por Bun; Paperclip `2026.1012.0` fixado. Não depende do clone de pesquisa `paperclip`.
- Configuração: `$XDG_CONFIG_HOME/augeo-orchestrator/config.json` (fallback `~/.config`); estado em `~/.local/state/augeo-orchestrator`. JSON substitui o TOML proposto para leitura/validação direta, sem outra dependência. Nenhum segredo nesse registro.
- Conhecimento: `global-context-store` irmão deste projeto, privado. Agência, negócio, marca e governança migrados com conferência de cobertura; original e manifesto preservados em estado privado. AUGEO local contém somente aplicação ao website. PRODUCT mantém caminho/schema.
- Obsidian: abrir o store como vault. Notas com propriedades, links e sete vistas locais derivadas com origem/hash. `augeo-orchestrator views augeo-website` regenera vistas; `views-check` detecta derivação desatualizada; `context` sempre lê os originais. Sem busca por embeddings.
- Descoberta: skill `augeo-context` canônica no store, exposta por links nos diretórios globais dos executores; não substitui skills existentes.
- Paperclip: organização AUGEO, projeto AUGEO Website e dois executores por domínio; sem organograma fictício. Painel local em `http://127.0.0.1:3100`. Heartbeats periódicos dos agentes desativados.
- Transporte: adaptador `process` chama a ponte Bun para ambos os executores no piloto. Isso uniformiza a captura de contexto/base e revisão; o adaptador nativo Codex continua disponível para evolução. O Paperclip é a única autoridade de estado da tarefa; arquivos locais são evidências e mapeamento de sessões.
- Contrato executado: resolve o ticket pelo ID do run; confere projeto/atribuição; captura fontes/hash, HEAD/diff e manifesto dos arquivos; usa trava por projeto; chama CLI com sandbox e leitura; retoma pelo ID de sessão da tarefa; publica resultado em `in_review` com interação humana pendente, ou impedimento em `blocked`. A interação tem continuação `none`; a ponte não reassina o ticket durante o próprio run. Nunca usa `--continue` global nem seleciona outra tarefa da inbox.
- Permissões: credenciais Paperclip são removidas do ambiente do modelo. A ponte escreve o retorno. O piloto não habilita escrita de produto; `plan`/sandbox e instruções não constituem prova de isolamento total do CLI. Não há bypass de permissões. Alterações externas detectadas invalidam a verificação, sem reversão automática.

Comandos: `augeo-orchestrator context augeo-website` resolve fontes; `augeo-orchestrator views augeo-website` atualiza o grafo derivado. No diretório da integração, `bun test` e `bun run typecheck` validam a ponte; `bun run paperclip run --data-dir <raiz-de-estado>/paperclip` inicia o servidor em foreground. Sem serviço de boot instalado. Procedimento completo de operação/recuperação no README da integração local.

### Evidência do piloto de leitura

- Antigravity: `AUG-1`, sessão `dd25618f-fa70-43dd-a86b-20b5cd78f3bc`. Run inicial `1b9409e6-6756-499f-96fc-6dad53923a47` teve resultado recuperado após correção do parser; retomada `08368458-8d02-4381-af74-94e467f9101e` concluiu com exit 0, mesma sessão e recibo de publicação.
- Codex: `AUG-2` executou fontes comuns; `AUG-3` recebeu/revisou o resultado Antigravity. O piloto encontrou cancelamento na reassinação do próprio ticket; fluxo corrigido para interação humana sem reassinação. Verificação final vinculada `AUG-4`, run `81babd42-f8c0-42c3-9bd9-4cd2ed8756be`, concluiu com exit 0 e recibo de publicação.
- 12 testes Bun e typecheck; inclui invalidação de fonte e vista, isolamento de projeto/fontes, timeout, falha/recovery, sessão por tarefa, exclusão de escritores e replay sem nova execução. Testes com executores falsos são distintos dos runs reais acima.
- Painel carregado em Chromium, três tarefas iniciais visíveis e sem erro de página. Obsidian registrado preservando vault anterior; `Architecture.canvas` confirmado no workspace carregado. Captura do painel e evidências ficam no estado privado.
- Backup inicial PostgreSQL restaurado em banco descartável: 1 organização, 2 agentes e 3 tarefas, removido após conferência. Exportação inicial: 12 arquivos, duas ressalvas; exportação não preserva todo o histórico operacional. Exportação final gerou 14 arquivos, mantendo duas ressalvas. Backup final do banco e pacote privado de 1,1 MB com código, vault, configuração, evidências e dados de recuperação foram preservados; integridade gzip conferida. Recuperação integral de toda a instalação ainda não foi testada.

**Próxima etapa delimitada:** escrita e ciclo frontend/navegador do executor ainda não estão habilitados. O piloto comprovou transporte, contexto, revisão e retomada em leitura; não comprova paridade do CLI com a IDE nem aprovação criativa. Os trechos seguintes preservam a pesquisa e o plano mais amplo; onde descreverem uma opção anterior, prevalece o estado implementado acima.

## Entendimento e delegação

A modularização publicada em `f368281` preparou contexto local e continuidade. O objetivo seguinte é compartilhar conhecimento e procedimentos, coordenar Antigravity e Codex e validar entregas com pouca intervenção operacional de Luca.

As referências [Stack em quatro camadas](refs/stack-referencia-4-camadas.md) e [Architecture Reference](architecture-reference.md) descrevem essencialmente a mesma topologia: contexto global, skills, orquestrador/juiz com Codex executor e ferramentas externas. Ambas deixam Antigravity para integração futura. Atribuir agora a coordenação ao Antigravity é uma adaptação proposta, não uma decisão documentada nem uma superioridade de modelo demonstrada.

| Responsável | Papel proposto |
| --- | --- |
| Luca | Direção geral e criativa, prioridades, escolha de caminhos e aprovação final. Autorizações já dadas acompanham a tarefa. |
| Antigravity | Executor de frontend/visual: componentes, CSS, layout, responsividade, motion, implementação e iteração no navegador. Também é o coordenador inicial proposto para briefing, pesquisa, decomposição e revisão criativa. |
| Codex | Executor de arquitetura, backend, integrações, automações e refatorações estruturais; revisão técnica e verificações. Pode contribuir em frontend quando a tarefa pedir, sem exclusividade sobre escrita de código. |

**Correção do usuário:** Antigravity tem capacidade de execução e deve ser responsável também por frontend/visual. A formulação anterior o restringia excessivamente a coordenação/revisão. A divisão por domínio incorpora esta preferência; a escolha de Antigravity como coordenador inicial continua proposta. Cada tarefa tem um responsável por escrita, que pode ser qualquer um dos dois. A recomendação de aceitação do coordenador não substitui aprovação criativa de Luca.

Early/late fusion descreve arquitetura de modelo, enquanto Antigravity, Codex e ChatGPT são ambientes/produtos. O [Google descreve Gemini como multimodal desde o treinamento](https://blog.google/innovation-and-ai/technology/ai/google-gemini-ai/); a [OpenAI também documenta modelos com processamento nativo de modalidades](https://developers.openai.com/blog/updates-audio-models). Isso não comprova a generalização de que todo Codex/ChatGPT seja late fusion, nem identifica a arquitetura exata do modelo ativo em cada ambiente. A decisão operacional de dar frontend/visual ao Antigravity não depende dessa generalização.

## Contrato revisável v0.1

### Coordenação e responsabilidade de escrita

Antigravity é a entrada principal proposta para demandas criativas e o coordenador inicial: prepara escopo, resolve contexto, divide trabalho e reúne evidências. Pode executar a tarefa visual inteira; não precisa delegar código visual ao Codex. Codex recebe tarefas estruturais/técnicas ou revisão, delimitadas pelo resultado pretendido. Lógica dentro de um componente não muda automaticamente a autoria: a tarefa declara seu responsável e seus arquivos, inclusive dependências compartilhadas.

Cada demanda possui um coordenador, e cada tarefa possui um executor. O coordenador pode executar uma tarefa própria, mas não abrir outro processo de si mesmo por padrão. Delegados retornam resultado ou impedimento ao coordenador, sem delegação circular. Um pedido iniciado no Codex pode ser preparado ali; transferir a coordenação exige registrar a troca e o mesmo ID da demanda, sem dois coordenadores ativos. Luca mantém direção e decisões materiais, recebendo perguntas somente quando faltarem informações necessárias, houver conflito de direção ou a ação exceder a autorização existente.

O executor verifica sua entrega; o outro agente pode revisá-la em leitura. No piloto, um escritor ativo por projeto, com passagem explícita de posse entre tarefas. Alterar escopo, código compartilhado ou decisões exige atualizar a tarefa antes de continuar. Não iniciar trabalhos paralelos sobre um checkout com alterações pendentes sem resolver a base. Commit, push e publicação conservam a exigência de pedido explícito do projeto.

### Interface, transporte e conhecimento

São três funções independentes: a interface mostra sessões e tarefas; o transporte entrega pedidos/resultados; o conhecimento permanece em Markdown com IDs e revisão. Um canvas de terminais não substitui o grafo do contexto. O vault de conhecimento tampouco executa os agentes. O contrato deve poder operar via TUI ou interface gráfica, preservando acesso aos arquivos, evidências, autorizações e responsabilidades.

Antes de construir uma ponte própria, testar se uma interface existente entrega a passagem entre os agentes e permite preservar esse contrato. Reutilizar o transporte disponível quando satisfizer os critérios; escrever somente o adaptador necessário para contexto/rastreabilidade. Não manter dois mecanismos concorrentes controlando estados ou encaminhando a mesma tarefa.

### Comparação de interfaces — pesquisa de 17/10

Ambiente desta sessão confirmado como Linux por `uname -s`. “Gratuito” nesta comparação refere-se à interface; contas, assinaturas ou consumo dos agentes continuam separados. Avaliação documental, sem instalação, benchmark ou integração testada. Maestri é considerado aqui o produto de `themaestri.app`, encontrado na pesquisa; a pergunta de identificação foi apresentada ao usuário, sem resposta registrada nesta versão.

| Opção | Evidência primária | Adequação ao contrato |
| --- | --- | --- |
| Maestri Free | [Página oficial](https://www.themaestri.app/en): um workspace gratuito e agentes ilimitados. [Linux](https://www.themaestri.app/en/linux): canvas, conexão de terminais e shell. | Viável como avaliação isolada de um projeto; não recomendado como base gratuita da operação entre projetos. Confirmar uso de `agy`, acesso ao contexto e retorno; CLI não comprova paridade com IDE. |
| TUIs nativas | CLIs Codex e `agy` já encontrados localmente; interfaces conferidas na pesquisa anterior. | Alternativa inicial viável, sem outra interface. A passagem entre tarefas ainda requer procedimento ou transporte; duas janelas não implementam orquestração automaticamente. |
| RunMaestro | [README](https://github.com/RunMaestro/Maestro): aplicativo aberto com licença AGPL e suporte a Codex; Antigravity não aparece na lista de provedores. | Não selecionar para esta dupla sem confirmar um adaptador funcional. |
| ShellX | [README](https://github.com/martinsbrezauckis/shellx): MIT, beta, Linux experimental, Codex/Antigravity; Host MCP desabilitado para Antigravity e execução Full Auto padrão. | Candidato secundário; declarar suporte aos dois não prova ferramentas equivalentes ou aderência às autorizações. |
| Octomynd Maestro | [README](https://github.com/Octomynd/octomynd-maestro): suporta a dupla e descreve commit/push/PR após revisão. | O fluxo publicado conflita com a política Git vigente se executado sem adaptação. Não adotar por padrão. |
| Paperclip | [Projeto MIT](https://github.com/paperclipai/paperclip): painel e servidor de gestão/orquestração, com projetos e agentes por organização. | Alternativa de plataforma, não só interface. Candidato em avaliação; Gemini CLI pode reduzir a necessidade de adaptador próprio, conforme análise abaixo. |

Outro canvas examinado, [Unity Agent Orchestrator](https://github.com/xnoname79/unity-agent-orchestrator), declara que ainda não escolheu licença. Não foi promovido a alternativa livre. Maestri e os produtos chamados Maestro são projetos distintos.

**Recomendação revisada após análise de viabilidade:** usar interfaces nativas e arquivos portáveis como base proposta; Maestri Free permanece apenas uma avaliação opcional de projeto único. O limite por workspace pesa contra sua adoção para a operação entre projetos. Isso substitui a recomendação anterior de priorizar seu piloto; não representa adoção de outra interface ou autorização para construir todo o transporte. Antes de implementar, conferir as capacidades reais das interfaces e definir o transporte mínimo. Antigravity mantém execução frontend/visual no ambiente apropriado; TUI não obriga abandonar IDE/navegador.

### Viabilidade do Maestri Free e custo de saída

Análise documental de 17/10, solicitada pelo usuário antes de assumir dependência. A [página Linux](https://www.themaestri.app/en/linux) confirma Free com um workspace e Pro com workspaces ilimitados, anunciado a US$ 18 em pagamento único nesta consulta. Não há compra autorizada. Segundo [Workspaces](https://www.themaestri.app/en/docs/workspaces), o workspace associa um projeto a diretório, layout, agentes e configurações. Portanto, agentes ilimitados não equivalem a projetos com ambientes salvos ilimitados.

| Uso pretendido | Avaliação para AUGEO |
| --- | --- |
| Este website, Codex e Antigravity | O limite de workspace comporta essa avaliação; integração efetiva ainda precisa ser testada. |
| Vários projetos/clientes com retorno ao ambiente de cada um | O Free não oferece múltiplos workspaces salvos. Isso conflita com a ergonomia desejada da operação entre projetos. |
| Vários diretórios dentro de um canvas | Não foi comprovada impossibilidade técnica; tampouco foi validado como solução adequada. Não recomendar um diretório pai compartilhado ou troca manual de diretórios apenas para contornar o limite. |
| Manter conhecimento fora do aplicativo | Viável como desenho: [Notes](https://www.themaestri.app/en/docs/notes) documenta arquivos Markdown em localização própria. Mesmo assim, testar acesso/remoção no Linux antes de anexar fontes canônicas. |
| Sair preservando automação e histórico | Exige trabalho: [Connections](https://www.themaestri.app/en/docs/connections) usa skill/CLI do aplicativo; o transporte precisa ser substituído se depender dela. |

As [partituras](https://www.themaestri.app/en/docs/partituras) podem exportar configurações/roles/conexões, mas excluem scrollback, estado em execução, exit codes e outras informações do runtime. Preservam um arranjo do Maestri, não uma migração executável para qualquer TUI. Histórico/resultados relevantes precisam de registro independente; a saída completa não foi testada.

Conclusão de engenharia: dependência dos dados pode ser pequena mantendo originais externos; dependência do fluxo pode ser significativa se delegação, papéis e evidências existirem só no aplicativo. O preço pago anunciado é limitado hoje, mas adotá-lo implicaria aceitar um produto comercial e suas condições futuras. Se operar sem pagar é critério, a base não deve exigir a edição Pro conforme a agência adicione projetos. Interfaces nativas também têm custo de operação/manutenção do transporte; a proposta é manter esse componente pequeno, sem construir um novo canvas.

Critério de saída para qualquer interface futura: encerrar o aplicativo e conseguir continuar uma tarefa por seus arquivos, fontes e resultado, sem reescrever contexto ou perder decisões. Conhecimento em Markdown, IDs e contratos permanecem independentes; somente a integração da interface é substituível. Nenhuma candidata entra no contexto global como ferramenta adotada.

### Paperclip e alternativa Gemini CLI — avaliação de 17/10

**Pedidos do usuário:** explorar `paperclip.ing` e distinguir sua função de uma solução intermediária; considerar Gemini CLI para a frente visual se puder executar Gemini 3.1 Pro com integração comprovada. Isso abre uma alternativa de runtime, não autoriza substituição imediata de Antigravity, instalação ou escolha de banco.

O [Paperclip](https://paperclip.ing/) reúne interface de gestão, tarefas, projetos, histórico, orçamento, aprovação e disparo de agentes. Classificação: plataforma de coordenação com backend e adaptadores. Pode ocupar a camada 3 e substituir parte do transporte/registro próprios, mas não fornece por si só o modelo, a execução visual ou o grafo do contexto. O desenho não exige reproduzir o organograma humano da agência nem instalar um conjunto de agentes “CEO/CTO” de exemplo.

| Aspecto | Evidência e implicação para AUGEO |
| --- | --- |
| Projetos e custo | O [projeto aberto MIT](https://github.com/paperclipai/paperclip) documenta múltiplas organizações/projetos; não apresenta a restrição comercial de um workspace do Maestri Free. A edição self-hosted não elimina custos dos agentes e da operação. |
| Infraestrutura | A [instalação](https://docs.paperclip.ing/guides/getting-started/installation/) requer Node e serviço local/web. A [persistência](https://docs.paperclip.ing/reference/deploy/database/) usa PostgreSQL, inclusive embutido no caminho local. Esse banco seria dependência interna da plataforma, não banco escolhido para o website ou contexto semântico; adoção ainda não ocorreu. |
| Codex | Existe [adaptador específico](https://docs.paperclip.ing/reference/adapters/codex/) para execução e continuidade. Compatibilidade com nosso CLI/configuração precisa de teste, incluindo instruções/skills e permissões. |
| Antigravity | A lista de [adaptadores](https://docs.paperclip.ing/reference/adapters/overview/) e as árvores completas de `master` e `v2026.1012.0` não trouxeram adaptador/caminho com esse nome. Isso não prova impossibilidade, mas não é suporte específico comprovado. |
| Extensão genérica | [Process](https://docs.paperclip.ing/reference/adapters/process/) inicia comandos, coleta logs/saída, sem continuidade de sessão nativa. A documentação o disponibiliza por API/importação, ainda sem seleção direta no dropdown. Um wrapper de `agy` continuaria sendo trabalho nosso. |
| Saída e recuperação | [Export/import](https://raw.githubusercontent.com/paperclipai/paperclip/master/docs/guides/board-operator/importing-and-exporting.md) inclui instruções, skills, projetos e tarefas selecionados, mas não preserva tudo: aprovações, custos e atividade têm limitações. A [recuperação integral](https://docs.paperclip.ing/how-to/back-up-and-restore-a-company/) exige banco e filesystem, além dos pacotes exportados. |

**Gemini CLI com o modelo pedido:** o [adaptador Paperclip](https://docs.paperclip.ing/reference/adapters/gemini-cli/) documenta `gemini_local`, seleção de `gemini-3.1-pro-preview`, retomada de sessão, skills e engines ACP/CLI. A interface documentada é uma integração específica, diferente de executar um comando genérico. Permissões, autenticação, quota e ferramentas da configuração efetiva ainda precisam ser conferidas; não transportar exemplos de `yolo`/sandbox sem avaliar o contrato vigente.

No [código oficial Gemini CLI v0.64.0](https://github.com/google-gemini/gemini-cli/blob/v0.64.0/packages/core/src/config/models.ts), `gemini-3.1-pro-preview` consta entre os modelos reconhecidos; há resolução por acesso/preview e alternativas de modelo. A [ficha Google](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview) confirma esse ID como preview e entrada de imagem, com saída textual. Acesso na conta não é comprovado pela existência do ID. Solicitar explicitamente o modelo e verificar o modelo efetivamente usado; troca não satisfaz o critério do usuário sem nova decisão.

O [CLI documenta leitura de imagens](https://github.com/google-gemini/gemini-cli/blob/v0.64.0/docs/tools/file-system.md) e [modo headless com eventos](https://github.com/google-gemini/gemini-cli/blob/v0.64.0/docs/cli/headless.md). Isso não replica automaticamente navegador, capturas e ferramentas de Antigravity. Plugins de conhecimento também não são requisito: o [LLM Wiki do Paperclip](https://docs.paperclip.ing/reference/plugins/llm-wiki/) está em alpha; não foi escolhido para substituir o store/vault e não comprova visualização equivalente ao grafo pretendido.

### Encaixe condicional e teste necessário

**Correção após pergunta do usuário:** ausência de adaptador específico não impede integrar Antigravity CLI. Paperclip pode iniciar `agy` pelo adaptador `process` ou por um adaptador externo próprio. Codex tem integração específica pronta; Antigravity exige completar esse elo. A opção Gemini CLI é alternativa de conveniência de integração, não pré-requisito para usar Paperclip nem motivo suficiente para substituir Antigravity.

O [`process` documentado](https://docs.paperclip.ing/reference/adapters/process/) aceita executável, argumentos e diretório; sua [implementação](https://github.com/paperclipai/paperclip/blob/master/server/src/adapters/process/execute.ts) inicia o processo e devolve stdout/stderr e exit status. O [`agy` headless](https://antigravity.google/docs/cli/headless/) oferece JSON/stream JSON, `conversation_id` e retomada por `--conversation`; a interface instalada foi reconferida por `agy --help`. Portanto, o CLI já oferece mecanismos para execução e continuidade; falta conectá-los ao ciclo de tarefas do Paperclip, não inventar essas capacidades no agente.

Integração mínima proposta: `Paperclip → process → wrapper → agy → resultado/tarefa Paperclip`. O wrapper resolveria o pedido/contexto, chamaria `agy` no projeto correto, registraria o `conversation_id` por tarefa, retomaria pelo ID explícito e devolveria resultado/erro/artefatos ao ticket. Não usar `--continue` global para tarefas distintas. Um adaptador específico posterior poderia mapear eventos, uso e retomada para os campos nativos do Paperclip. O adaptador genérico não interpreta automaticamente o JSON do `agy` nem estabelece esse protocolo por iniciar o processo.

Recomendação: conferir primeiro esse caminho com Antigravity CLI + Codex, preservando a preferência original de executor visual. Comparar o custo real do wrapper com `gemini_local` se necessário. Configuração inicial de `process` exige API/importação segundo a documentação atual. Isso é viabilidade técnica fundamentada, sem teste autenticado ou integração executada; modelo, permissões e ferramentas visuais continuam sujeitos ao teste próprio. Paperclip inicia um CLI, não incorpora a janela IDE do Antigravity.

No caminho alternativo com Gemini CLI, se validado, o desenho seria: Luca acompanha tarefas no Paperclip; Paperclip mantém estado operacional e chama `gemini_local` para a frente visual e `codex_local` para engenharia/revisão; os dois recebem o mesmo recorte autorizado dos Markdown globais/locais. O store/vault continua como conhecimento e visualização próprios; o PostgreSQL do Paperclip guarda sua operação. Não manter uma segunda ponte autônoma concorrendo pelo estado das tarefas. O adaptador de contexto pode continuar necessário.

Essa alternativa muda a base proposta e adiciona infraestrutura; não é adotada pela simples menção do usuário. A opção original em arquivos/interfaces nativas permanece disponível. Antigravity pode continuar como ambiente visual complementar; substituí-lo como executor principal requer equivalência demonstrada no ciclo de trabalho relevante.

Critérios de uma prova de conceito futura, antes de migração:

1. Versões fixadas, login e execução real do Gemini 3.1 Pro solicitado, com confirmação do modelo e custo/quota observáveis. Nenhum fallback silencioso aceito como sucesso.
2. Gemini e Codex leem as mesmas fontes e respeitam decisões/escopos, inclusive contexto fora do workspace e skills aplicáveis.
3. Uma tarefa passa de um agente ao outro, retorna evidência e retoma após interrupção, sem duplicar escrita ou exigir contexto recontado pelo usuário.
4. O executor visual lê captura real, edita uma superfície de teste isolada e inspeciona o resultado no navegador com as ferramentas configuradas. Produzir HTML sozinho não comprova esse ciclo.
5. Autorizações Git/publicação e execução por demanda são preservadas; horários/heartbeats não iniciam trabalho extra por padrão. Aprovação dentro do Paperclip não é garantia de restrição dos comandos do executor.
6. Exportação e backup/restore preservam o necessário; fontes continuam acessíveis fora do Paperclip. Não confundir pacote de configuração com histórico operacional completo.

Estado da pesquisa: GitHub confirmou Paperclip MIT e última release `v2026.1012.0`; Gemini CLI aberto/ativo com release `v0.64.0`. `gemini` não foi localizado no PATH desta sessão; `agy` e `codex` foram encontrados. Nenhum aplicativo, banco ou modelo foi iniciado. Suporte documentado e código consultado tornam a opção concreta para teste; não constituem implementação garantida.

## Pesquisa e implicações

- **Autoridade criativa:** [Imagining Design Workflows in Agentic AI Futures](https://arxiv.org/abs/2509.20731) consultou dez designers sobre agentes para referências e ideação, discutindo autoridade e expressão de intenção além do prompt. É um estudo exploratório; não compara esta stack nem comprova sua produtividade. Aplicação proposta: briefing visual e critérios explícitos, com escolha estética humana.
- **Produção por artefatos:** o [Adobe Run-Workflow MCP](https://helpx.adobe.com/firefly/web/work-with-enterprise-features/creative-production/run-workflow-mcp-overview.html) documenta submissão, ID de acompanhamento, monitoramento e resultados assíncronos. Aproveitar esse padrão para assets e versões. Não pressupor assinatura, conexão ou suporte homologado a Codex/Antigravity; a página lista outros clientes.
- **Complexidade progressiva:** [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) diferencia workflows previsíveis de agentes com roteamento dinâmico e recomenda começar simples. Aplicação: sequência explícita com retornos delimitados; paralelismo apenas com tarefas independentes e ganho observado.
- **Revisão:** os [artefatos do Antigravity](https://antigravity.google/docs/artifacts/) incluem planos, diffs, imagens e gravações de navegador. Isso sustenta sua candidatura para coordenação/revisão; a adequação concreta depende de piloto.
- **Interoperabilidade:** [skills do Codex](https://learn.chatgpt.com/docs/build-skills) e [skills do Antigravity](https://antigravity.google/docs/skills/) usam `SKILL.md` e suportam `.agents/skills` no projeto. As [regras do Antigravity](https://antigravity.google/docs/rules/) incluem descoberta de `AGENTS.md`. Compartilhar conteúdo canônico, conferindo descoberta nos dois ambientes; formato comum não garante ferramentas e permissões equivalentes.
- **Ponte inicial:** [Codex não interativo](https://learn.chatgpt.com/docs/non-interactive-mode) oferece `codex exec`, eventos JSONL e resposta por JSON Schema. O [Antigravity headless](https://antigravity.google/docs/cli/headless/) também oferece JSON e schema. Adaptadores locais e arquivos podem conectar os ambientes sem um terceiro orquestrador inicial.
- **Integração retirada:** a [documentação atual do Codex](https://learn.chatgpt.com/docs/mcp-server) informa a remoção de `codex mcp-server`. O App Server usa protocolo próprio, não substitui MCP diretamente e está experimental. Codex continua consumindo MCPs externos; esses dois sentidos de MCP são distintos.
- **Migração iminente:** o [Antigravity](https://antigravity.google/docs/migration/workflows-to-skills/) anuncia o fim da descoberta/execução dos diretórios legados de workflows em 19/10/2026. Preferir skills e conferir a versão instalada na implementação.

## Adaptação das quatro camadas

| Camada | Manter da referência | Adaptação para AUGEO |
| --- | --- | --- |
| 1 — Contexto | Conhecimento durável, indexado e carregado por necessidade | Preservar AGENTS e módulos. Índice privado entre projetos pode inicialmente apontar às fontes existentes. Extrair apenas conhecimento reutilizável, atualizando consumidores e evitando duas fontes normativas. |
| 2 — Procedimentos | Skills com passos, restrições e validação | `SKILL.md` com núcleo compartilhado e adaptações por executor onde necessárias. Três repetições são heurística, não obrigação. Preservar fluxos completos Impeccable prescritos. |
| 3 — Orquestração | Decomposição, executores e revisão | Antigravity coordena e executa frontend/visual; Codex executa engenharia estrutural e revisão técnica; Luca dirige e aprova. Estado fora dos chats e responsabilidade de escrita por tarefa. |
| 4 — Ferramentas | Interfaces MCP, CLI e APIs por necessidade | A proposta inicial usa arquivos, Git, Bun e navegador, com acesso verificado por executor. Nenhum banco ou serviço externo é herdado da referência. Conectores futuros dependem de necessidade e escolha próprias. |

Contexto global privado, configurável e sem depender dos caminhos desta máquina. Dados comerciais de clientes não vão automaticamente para este repositório. AGENTS roteia; o índice não injeta todos os clientes/skills em cada sessão. Acesso local do Codex não comprova acesso do Antigravity.

## Estrutura global proposta e adaptação das referências

A referência separa conhecimento global de código local. A adaptação acrescenta duas separações necessárias: código da ponte fora dos sites e estado das execuções fora do conhecimento normativo. A árvore abaixo preserva o desenho de referência; os destinos efetivos foram implantados conforme o bloco de estado atual, com Paperclip no lugar de uma fila própria. O projeto atual permanece onde está, sem migração obrigatória para `~/projects`.

```text
~/augeo/
├── global-context-store/                 # privado; conhecimento e procedimentos
│   ├── .obsidian/                       # configurações do vault; interface humana
│   ├── index.md                         # mapa por assunto, cliente e projeto
│   ├── governance.md                    # autoridade, revisão e atualização de fontes
│   ├── entities/augeo.md                # identidade, equipe e posicionamento
│   ├── business/augeo.md                # oferta, operação e pendências comerciais
│   ├── brandings/augeo.md               # linguagem e diretrizes de marca
│   ├── projects/augeo-website.md        # relações deste projeto com fontes globais
│   └── skills/                         # somente procedimentos reutilizáveis adotados
├── agent-orchestrator/                  # se necessário após avaliar transporte existente
│   ├── src/context.ts                  # resolve projeto/fontes e monta pacote
│   ├── src/tasks.ts                    # estados, posse da escrita, tentativas e retomada
│   ├── src/adapters/codex.ts            # subprocesso codex exec
│   ├── schemas/                        # contratos task/result/context
│   └── tests/                          # integridade da passagem e recuperação
└── modular-bw-landing/                  # este projeto, preservado
    ├── AGENTS.md                       # entrada e regras específicas do projeto
    ├── .agents/skills/                 # somente procedimentos próprios deste projeto
    ├── docs/                           # especificação, HERO, WORKFLOW, fila e histórico
    └── src/                            # implementação do site

~/.config/augeo-orchestrator/config.json # caminhos, projetos e executores; sem segredos
~/.local/state/augeo-orchestrator/
└── runs/<id>/                          # task.json, context.json, events.jsonl,
                                       # result.json e artifacts/
```

Os nomes da árvore representam o desenho original; os módulos efetivos da ponte estão descritos no estado atual e em seu README. Não são recursos nativos dos produtos. Configuração local associa um ID de projeto ao diretório real, cliente, fontes permitidas, skills e executores disponíveis. Assim, outra máquina usa a mesma arquitetura com caminhos diferentes. Credenciais continuam nos mecanismos de cada ferramenta, não no contexto nem no arquivo de projetos.

Esta é a árvore mínima proposta, não um conjunto de pastas a criar antecipadamente. `.obsidian` existirá se Obsidian for adotado. `clients`, `views` e `maps` só serão criados quando houver conteúdo ou vista concreta; não são pré-requisitos do piloto. A ponte própria e seus caminhos de estado/configuração são condicionais à escolha do transporte. O ID `augeo-website` identifica o projeto sem renomear seu repositório/diretório.

`index.md` relaciona assuntos e fontes; `governance.md` contém apenas regras comuns efetivamente adotadas de autoridade, atualização e aprovação. Os arquivos de empresa, negócio e marca mantêm responsabilidades separadas; `projects/augeo-website.md` relaciona essas fontes às rotas locais, sem copiar o backlog. Não criar um AGENTS genérico em `~/augeo` que injete regras nos demais projetos por herança acidental.

## Obsidian, grafo e recuperação semântica

**Requisito explicitado pelo usuário:** visualizar as relações do contexto é parte essencial do escopo, não acabamento posterior. Proposta: abrir `global-context-store` diretamente como vault Obsidian. O [vault é uma pasta local](https://help.obsidian.md/Files+and+folders/Manage+vaults); os agentes e Obsidian leem os mesmos Markdown. Não é necessária API/MCP para o acesso básico aos arquivos. Obsidian não coordena processos nem transmite automaticamente uma edição ao chat de um agente.

O [Graph View](https://help.obsidian.md/Plugins/Graph+view) mostra notas e seus links explícitos. [Canvas](https://help.obsidian.md/Plugins/Canvas) pode organizar briefings e mapas de trabalho. O desenho canônico de relações permanece em notas e links, pois a disposição espacial de cartões não é um contrato suficiente para o agente. Usar links Markdown compatíveis com repositórios e Obsidian; o [Obsidian suporta esse formato](https://help.obsidian.md/Linking+notes+and+files/Internal+links).

Relações mínimas úteis: projeto → cliente → marca; projeto → requisitos/decisões; procedimento → fontes que consome. Notas têm ID estável, tipo, responsável, estado e revisão/data; links representam relações deliberadas, não proximidade gerada por IA. Separar no grafo propostas, fontes vigentes e histórico; nenhuma ligação visual significa aprovação. Grafo local por projeto/cliente evita depender de um mapa global ilegível.

### Conexão com os documentos do projeto

Os documentos locais continuam canônicos no Git do projeto. A nota `projects/<projeto>/index.md` relaciona o projeto às fontes globais. Para visualizar também requisitos/decisões locais no mesmo grafo, a ponte gera recortes selecionados em `views/<projeto>/`, com origem, ID, revisão/hash e aviso de somente leitura. Os links internos dessas vistas são resolvidos para as notas correspondentes dentro do vault. Links a arquivos externos não se tornam automaticamente nós completos do grafo.

Editar contexto global no Obsidian altera a própria fonte. Editar especificação/HERO deve ocorrer na fonte do repositório, depois regenerar a vista. Se uma vista for editada, a ponte detecta divergência e impede tratá-la como fonte aprovada; não sobrescreve silenciosamente. Antes de montar tarefa, conferir hashes das fontes e atualizar vistas desatualizadas. Mudança humana durante tarefa em andamento invalida o contexto afetado e exige reconciliação. Os agentes consultam os originais resolvidos, não usam o snapshot do grafo como autoridade superior.

### Grafo visual e vetores têm funções distintas

O Graph View padrão representa links, não embeddings. Busca vetorial encontra proximidade de significado, inclusive sem link explícito. Ambas pertencem ao desenho de contexto, mas a segunda exige indexador/modelo e mecanismo de consulta. Não instalar um plugin de IA apenas para obter o grafo nativo.

Possibilidade conceitual futura, fora da implantação inicial: `fontes autorizadas → trechos + IDs/hashes/metadados → embeddings → índice → consulta → leitura do trecho original`. Caso essa capacidade venha a ser necessária, resultados deverão incluir origem/revisão e filtros de projeto/cliente e estado. Decisões obrigatórias continuam no roteamento explícito; similaridade não decide vigência. O índice seria derivado e reconstruível, com invalidação por alteração/exclusão.

A implantação inicial propõe Markdown, índice explícito e links, com visualização do conhecimento. Não exige banco, embeddings ou serviço de busca. Uma eventual busca semântica exige primeiro justificar a necessidade; só então comparar opções e escolher armazenamento, modelo e forma de execução. A lista de ferramentas da referência não antecipa essa escolha.

Critérios da integração visual: Luca consegue navegar marca → projeto → decisão/procedimento; os dois agentes recuperam a mesma fonte; edição global aparece na próxima tarefa; renomeação, exclusão e vista desatualizada são detectadas. Se busca semântica for adotada futuramente, sua especificação deverá exigir origem/revisão, isolamento de cliente e invalidação de conteúdo removido. Uma eventual projeção espacial dos embeddings exigiria visualização adicional; não é capacidade presumida do grafo nativo.

### O que migra e o que permanece

| Fonte atual | Destino proposto e tratamento |
| --- | --- |
| AUGEO: nome/descrição, público, posicionamento e equipe | `entities/augeo.md`; identidade e operação humana, sem converter sócios em papéis de agentes. |
| AUGEO: oferta, comercial/precificação, processo comercial, triagem e limites operacionais | `business/augeo.md`; conservar estimativas, faixa de referência e pendências sem transformá-las em promessas. |
| AUGEO: origem do nome, princípios de design/visual, direção de linguagem e restrições de marca | `brandings/augeo.md`; não promover valores específicos do hero a regra universal. Recursos criativos são repertório, não entregas contratadas. |
| AUGEO: julgamento humano e autoridade de decisão | `governance.md` para a regra comum; identidade da liderança permanece em `entities/augeo.md`, com vínculo explícito. |
| AUGEO: objetivo/prioridade e aplicação ao website | Permanecem locais, reconciliados com a especificação/backlog. |
| Especificação, HERO, backlog e histórico | Permanecem neste repositório. Contexto global não vira cópia da cronologia do site. |
| WORKFLOW | Bun e procedimentos próprios do repo permanecem. Método reutilizável pode virar skill global, mantendo instruções locais como complemento. |
| PRODUCT | Preservar caminho/schema; manter resumo da skill a partir das fontes resolvidas, com rastreabilidade. |
| Duas referências externas | Preservar como referência; esta proposta contém a adaptação, sem reescrever o benchmark como decisão aprovada. |

Na migração efetiva, auditar consumidores de AUGEO, separar os trechos, atualizar links/rotas e retirar o conteúdo global duplicado. Durante a transição, o AUGEO local continua normativo até a troca explícita de autoridade. Depois, o acesso privado ocorre pelo contexto resolvido. Para execução sem acesso ao store, exportar somente o recorte autorizado com origem/revisão e indicação de snapshot não editável como fonte; não copiar o store privado para o Git. Se execução exigir dado ausente, reportar a lacuna.

Consumidores já identificados para essa troca: AGENTS, PRODUCT e os links de operação interna/triagem na especificação. Reconciliar o objetivo/prioridade do website com especificação/backlog e então retirar AUGEO local como fonte concorrente; a remoção só ocorre após cobertura de todo o conteúdo e atualização dos consumidores. Evidências históricas continuam descrevendo seus caminhos originais. Material pessoal ignorado permanece privado e fora da migração automática.

Fontes globais terão ID estável, assunto/escopo, estado e responsável. Referências a fontes locais incluem projeto e caminho relativo; caminhos físicos são resolvidos na configuração do ambiente. Snapshots exportados carregam origem, hash e indicação de derivação; não recebem autoridade própria nem atualizações independentes. Acesso ausente é reportado como lacuna. Registro de ferramentas só inclui ferramenta adotada e capacidade verificada, nunca catálogo de exemplos.

### Como os agentes descobrem o global

1. Registrar a raiz do store e projetos na configuração da ponte. Índice/contexto não dependem de variáveis exportadas herdadas por um aplicativo gráfico.
2. Instalar uma skill pequena de entrada/delegação em cada superfície usada. Ela chama a ponte pelo caminho resolvido na instalação. O AGENTS local continua independente da máquina; a instalação global fornece o ponto de acesso local.
3. Expor apenas skills reutilizáveis selecionadas a cada executor por links simbólicos gerenciados e verificados, sem substituir skills existentes. Fonte única em `global-context-store/skills`; destinos de descoberta conforme tabela abaixo. Se uma superfície não resolver links corretamente, usar cópia gerada com revisão e verificação de sincronização, sem edição independente.
4. Antes de executar, a ponte lê AGENTS e o índice, resolve o recorte permitido, registra revisão/hash das fontes em `context.json` e fornece os caminhos/arquivos necessários ao executor. Markdown não é carregado automaticamente apenas por estar no store.

| Superfície | Destino de descoberta global das skills |
| --- | --- |
| Codex | `~/.agents/skills/<nome>/` |
| Antigravity App/IDE | `~/.gemini/config/skills/<nome>/` |
| Antigravity CLI | `~/.gemini/antigravity-cli/skills/<nome>/` |

Locais conforme [Codex](https://learn.chatgpt.com/docs/build-skills) e [Antigravity](https://antigravity.google/docs/skills/). Descoberta, leitura do store fora do workspace e permissões precisam ser verificadas em cada superfície efetivamente utilizada. Skills orientam; o adaptador controla estados/processos; o sandbox e as ferramentas disponíveis definem acesso efetivo.

## O que pluga aonde

- **Luca → Antigravity:** interface principal proposta; conversa, direção, aprovação e acompanhamento visual. O agente mantém a coordenação sem precisar de outro modelo gerente.
- **Antigravity → frontend:** trabalha diretamente no checkout do projeto, usa dev server/navegador e ferramentas criativas disponíveis, executa os procedimentos prescritos e entrega código e capturas.
- **Antigravity → ponte Bun → Codex CLI:** quando precisa de engenharia estrutural/revisão, submete uma tarefa. A ponte resolve contexto, valida escopo, registra a execução e inicia `codex exec` no diretório correto. Captura eventos e resposta estruturada e devolve o resultado ao coordenador.
- **Ponte → store + projeto:** lê apenas as fontes autorizadas para aquela tarefa; o estado vai para `runs/<id>`, não para o índice de conhecimento. O resultado só atualiza uma fonte normativa quando a tarefa e o responsável autorizam essa mudança.
- **Luca → Obsidian → store:** navega o grafo e edita fontes globais. A ponte resolve os arquivos atualizados no início de cada tarefa, sem exigir Obsidian aberto. Vistas de documentos locais são regeneradas a partir dos originais.
- **Executor → MCP/API/CLI de ferramenta:** Figma e ferramentas criativas no executor visual; GitHub, banco e infraestrutura no executor da tarefa técnica, conforme conexão verificada. Configurar conector em um aplicativo não o instala no outro. MCP conecta ferramentas; por si só não resolve o contrato de delegação entre ambientes.

Na implantação Paperclip, a ponte é um programa local determinístico chamado pelo adaptador `process`. A CLI resolve contexto/vistas, executa a tarefa exata e cria uma passagem vinculada. O servidor Paperclip submete/consulta tarefas e mantém o estado; não foi implementada uma segunda CLI de fila. O servidor roda em foreground; não há serviço de boot instalado.

| Capacidade | Ligação conceitual | Estado |
| --- | --- | --- |
| Visualização do contexto | Interface humana sobre os mesmos arquivos de conhecimento | Requisito; Obsidian proposto. |
| Ferramentas de criação e inspeção | Executor visual usa os conectores de que realmente dispõe | Inventariar por ambiente; não copiar conexões presumidas. |
| Armazenamento operacional | Produto que precisar persistir dados define seu próprio contrato | Nenhum banco escolhido para a orquestração; não é dependência do piloto. |
| Recuperação semântica | Consulta ao conhecimento, se índice/links se mostrarem insuficientes | Possibilidade futura; sem tecnologia ou implementação definida. |
| Transcrição, eventos e comunicação | Entradas/saídas externas, se houver demanda | Fora da implantação inicial; serviços não escolhidos. |
| Versionamento e publicação | Ferramentas do projeto conforme configuração e autorização reais | Preservar o ambiente existente; a proposta não define novas integrações. |

As quatro camadas são responsabilidades lógicas: uma interface visual dá acesso humano à camada 1; uma eventual integração de armazenamento atende a uma necessidade específica. A referência conceitual não constitui catálogo operacional nem obrigação de implantação.

### Exemplos externos preservados apenas como referência

As duas referências citam Supabase, Fathom, NotebookLM, n8n/Make e Evolution API; a pesquisa também examinou pgvector. Essas menções ilustram possibilidades e não selecionam fornecedores, banco, dependências ou tarefas futuras obrigatórias. Não exportar esses exemplos como ferramentas adotadas para o contexto global. A pesquisa não autoriza configuração nem uso desses serviços.

Cada demanda segue o coordenador registrado no contrato v0.1. Um futuro adaptador `agy` poderia permitir execução frontend delegada a partir de outra interface, após validação específica. `agy -p` cria/usa execução CLI, não envia automaticamente mensagem a um chat IDE já aberto. Navegador e ferramentas do IDE não são presumidos no modo headless. No caminho de ponte própria, a primeira direção proposta é Antigravity interativo → ponte → Codex, com execução visual no próprio Antigravity; no caminho de canvas, verificar a comunicação real entre as sessões escolhidas.

### Exemplo de ponta a ponta

Pedido hipotético: uma seção visual com formulário. Antigravity resolve briefing/marca e implementa a seção, componentes, estados e responsividade. Define o contrato dos campos junto com Codex. Delega validação de servidor, recebimento e armazenamento ao Codex pela ponte. Codex devolve implementação técnica e verificações; Antigravity integra a experiência, testa no navegador e apresenta a Luca. Revisão técnica de alterações visuais também pode ser delegada ao Codex. Publicação continua condicionada à autorização específica vigente.

O contrato UI/API deve ser definido antes das duas implementações. No piloto, executar sequencialmente no mesmo checkout para que o segundo executor veja os arquivos locais. Se paralelo, worktrees e integração explícita são necessários; separar por nomes de pastas não basta quando há componentes e contratos compartilhados.

## Contrato mínimo

Contrato v0.1 de referência, independente da interface. A ponte atual implementa o subconjunto de leitura descrito no estado atual; não valida integralmente todos os campos desta tabela por JSON Schema nem habilita escrita. Os schemas nativos Paperclip validam seus próprios registros.

| Registro | Campos obrigatórios e regra |
| --- | --- |
| Identificação | Versão do contrato, ID da demanda, ID da tarefa, tentativa e ID do projeto. Uma demanda pode conter várias tarefas. |
| Responsabilidade | Coordenador, executor e revisor quando aplicável. Declarar se o aceite é técnico pelo coordenador ou exige decisão criativa de Luca. |
| Pedido | Objetivo, entregável, exclusões e critérios de aceite observáveis. Não enviar apenas “continue” ou todo o histórico de chats. |
| Contexto | IDs das fontes, caminhos resolvidos, revisão/hash, estado de aprovação e decisões relevantes. Incluir referências visuais reais quando a tarefa depender delas. |
| Base | HEAD do Git e manifesto dos arquivos relevantes, incluindo diferenças locais não commitadas. SHA sozinho não descreve um checkout sujo. |
| Acesso | Modo leitura/escrita, arquivos permitidos e autorizações já concedidas. Permissões do runtime devem corresponder; texto no prompt não substitui controle efetivo. |
| Limites | Prazo/timeout, orçamento quando definido e máximo de correções. Não herdar liberdade irrestrita da interface escolhida. |
| Resultado | Mesmos IDs/tentativa, estado final, arquivos alterados/diff, critérios atendidos/falhos e verificações realmente executadas. Comando, resultado e contexto devem ser rastreáveis. |
| Evidência | Artefatos/capturas, viewport/tema/movimento quando pertinentes, limitações, alterações parciais e questão necessária se houver impedimento. |
| Revisão | Responsável, decisão, critérios e revisão exata do resultado. Aprovado tecnicamente não significa aprovado visualmente ou autorizado para publicação. |

Fluxo: coordenador prepara pedido → verifica fontes/base/acesso → registra tarefa pronta → concede escrita ao executor → recebe resultado → revisa critérios/evidências → registra aceite ou correção. A execução própria de frontend pelo Antigravity usa o mesmo registro, sem precisar passar pelo Codex.

| Estado | Condição para entrar/sair |
| --- | --- |
| `briefing` | Objetivo ou contexto em preparação; não executar mutações. |
| `pronta` | Critérios, fontes, responsável, base e autorizações resolvidos. |
| `execucao` | Executor único ativo, com escopo de escrita concedido. |
| `revisao` | Processo terminou, resultado identificado e evidências disponíveis; revisor confere a base correspondente. |
| `aguardando_decisao` | Falta decisão necessária; registrar questão e quem decide. Não avançar por tempo decorrido. |
| `concluida` | Aceite previsto para a tarefa registrado; passar posse da escrita à próxima tarefa. |
| `falhou` / `cancelada` | Registrar motivo e alterações parciais; confirmar parada do processo antes de liberar escrita. |

Revisão pode retornar à execução com nova tentativa vinculada ao resultado anterior. Proposta inicial: até duas rodadas de correção no mesmo escopo; divergência persistente vai ao coordenador/Luca conforme natureza da decisão. Falta de ferramenta vira lacuna, sem troca silenciosa do método ou relaxamento do aceite.

Um componente mantém o estado: o transporte escolhido ou a ponte, nunca ambos de forma independente. Coordenador pede transições; executor fornece resultado. Registrar arquivos finais atomicamente. Após interrupção, inspecionar processo, base e alterações parciais antes de retomar; não repetir mutações nem reverter trabalho humano automaticamente. Mudança de fonte/base relevante invalida o aceite anterior e requer reconciliação.

### Critérios de aceite do contrato e da estrutura

1. Duas sessões independentes encontram a mesma regra de marca, requisito local e decisão vigente usando o registro do projeto e o índice; nenhuma depende de o usuário repetir contexto.
2. Uma tarefa pode executar só no Antigravity ou ser delegada ao Codex com objetivo, arquivos, base e resultado reconhecíveis, sem exclusividade de autoria por produto.
3. Mesmo desligando a interface gráfica, é possível localizar pedido, fontes e resultado pelos arquivos/exportação; informação essencial não fica apenas em posições no canvas.
4. Alterar uma fonte global aparece na próxima resolução de contexto; edição durante execução e snapshot desatualizado geram reconciliação, sem promover derivação a fonte normativa.
5. O grafo permite navegar agência/marca → website → procedimento/decisão. Documentos locais preservam autoridade; vistas selecionadas indicam origem e revisão.
6. Interrupção, tarefa duplicada, fonte inacessível e mudança concorrente de arquivo não geram dois escritores ou conclusão sem evidência.
7. As referências e seu catálogo de serviços permanecem fora das ferramentas adotadas. O piloto funciona sem banco, embeddings ou transcrição.

Esses são critérios de verificação futura, ainda não testes executados. O aceite desta entrega é documental: contrato compreensível, destinos e consumidores mapeados, escolhas propostas separadas de decisões e limites preservados.

## Implantação gradual

| Etapa | Entrega | Critério para avançar |
| --- | --- | --- |
| 1. Contrato e interface | Rever contrato/estrutura; inventariar interfaces nativas e permissões; definir transporte mínimo. Maestri Free fica opcional para avaliação isolada | Recomendação de base sem dependência do Maestri; nenhuma interface adicional adotada ou piloto comprovado. |
| 2. Contexto global e Obsidian | Migrar conteúdos conforme tabela; índice, links, propriedades, vault e vistas; expor skills selecionadas aos executores | Navegação visual útil e leitura da mesma revisão pelos agentes; ausência, mudança e vista desatualizada detectadas. |
| 3. Transporte e piloto | Reutilizar transporte validado da interface ou construir adaptador mínimo em Bun; Antigravity executa visual e delega tarefa técnica/revisão | Ida e volta e recuperação conforme contrato; não duplicar uma orquestração que a interface já cumpra. |
| 4. Avaliação do piloto | Comparar tempo ativo de Luca, qualidade aceita, retrabalho e falhas; identificar necessidades reais de expansão | Cada necessidade tem justificativa e decisão próprias; sem contratação, banco ou busca semântica previstos por padrão. |

Primeiro piloto recomendado: auditoria somente leitura de superfície existente, com capturas e correções propostas. Depois, pequena mudança isolada escolhida por Luca para comprovar escrita e retorno. Isso não autoriza retomar blocos do hero. Trabalho visual futuro deve executar os fluxos Impeccable aplicáveis; esta pesquisa não executa esses fluxos.

Antigravity pode inicialmente chamar o adaptador pelo terminal conforme permissões verificadas. Adicionar MCP próprio apenas se descoberta de ferramentas/acompanhamento de jobs justificar: seria adaptador nosso sobre interface suportada, não o removido servidor Codex. Avaliar SDK/App Server quando sessões persistentes, eventos e aprovações justificarem a complexidade.

### Concorrência e recuperação

Começar sequencialmente: Antigravity escreve frontend/visual e Codex escreve a parte técnica delegada ou revisa, conforme tarefa. O revisor não altera simultaneamente os arquivos do executor. Trabalho paralelo exige diretórios/worktrees isolados e responsável por integração. Worktrees de HEAD não incluem alterações locais pendentes: reconciliar a base antes de delegar. Não criar commits automaticamente para facilitar isolamento. Base ou arquivos relevantes alterados durante execução exigem nova revisão antes de aplicar o resultado.

Logs brutos e transitórios ficam fora da documentação normativa; histórico preserva evidências e decisões necessárias. Assets precisam de origem, versão, finalidade e aprovação. Preservar resultados de links temporários antes de tratá-los como evidência durável. Falha de executor permite retomada manual pelo mesmo contrato.

## Evidências históricas da pesquisa — antes da implantação

- HEAD conferido: `f368281`. Alterações preexistentes em AGENTS, BACKLOG e histórico, além de PNGs não rastreados, preservadas.
- `command -v`: Codex, `agy`, Bun e gh disponíveis. `codex --version`: `0.163.0`. `codex --help`: antigo MCP server ausente; App Server experimental.
- `codex exec --help`: JSONL, JSON Schema, arquivo de resultado e diretório. `agy --help`: modo não interativo, JSON/stream JSON e schema. Isso verifica interfaces, não execução autenticada ou integração funcional. Versão do `agy` não determinada nesta rodada.
- Sem agentes filhos, tarefas de modelo nos CLIs, login, instalação, conexão, configuração global, serviço, alteração de aplicação, commit, push ou publicação. Navegador, acesso às contas, descoberta compartilhada e permissões efetivas ficam para o piloto.
- Nesta entrega: contrato v0.1 e árvore/migração concretizados para revisão. Os quatro destinos de contexto, ponte, configuração e estado foram consultados e estavam ausentes. Linux confirmado; pesquisa de interfaces e metadados/licenças/releases via web e `gh`, sem instalação ou execução dos aplicativos candidatos.
- Próxima ação proposta: avaliar contrato/interface e conferir capacidades nas superfícies escolhidas; então implantar contexto e transporte necessário e executar piloto. Expansões seguem por necessidade. Nenhuma ferramenta candidata foi incorporada ao contexto global.
