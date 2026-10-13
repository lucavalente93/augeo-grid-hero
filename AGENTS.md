# AUGEO — instruções do projeto

## Organização e fontes de contexto

Este arquivo define a rotina de trabalho e encaminha a leitura dos documentos. Implementação persistente, execução técnica e histórico de decisões têm fontes distintas; arquitetura e requisitos pertencem à especificação.

- [Hero — implementação e direção](docs/HERO_HANDOFF.md): composição persistente, comportamento implementado e direção visual/conceitual atual.
- [Backlog](docs/BACKLOG.md): continuidade operacional, trabalho técnico, testes, tooling, commits, publicações e evidências de execução, incluindo registros cronológicos.
- [Hero — decisões e ideias](docs/HERO_DECISIONS_AND_IDEAS.md): antecedentes, alternativas superadas, propostas não implementadas, ideias e avaliações/decisões pendentes.
- [Auditoria e plano do hero](docs/HERO_AUDIT_AND_IMPROVEMENT_PLAN.md): briefing, sequência de implementação, critérios de aceitação e referências; a auditoria é histórica.
- [Especificação do website](docs/02-WEBSITE_SPEC.md): arquitetura, requisitos e limites da landing.
- [Produto](docs/PRODUCT.md): resumo para a skill, contexto estratégico e operação interna em seções próprias. Rascunhos de copy pertencem à especificação; auditoria e protocolo de nomenclatura ficam no backlog.

A documentação em `docs/` fica limitada a seis arquivos; consolidar novos registros no documento pertinente, sem criar relatórios ou encaminhamentos separados por padrão.

Até agora, a frente de refinamento do hero e os documentos existentes podem ser encaminhados diretamente por estas instruções. Um índice separado de orquestração acrescentaria manutenção e duplicação sem resolver uma necessidade presente. Se surgirem várias frentes simultâneas, reavaliar a necessidade de um índice próprio com função e nome explícitos.

## Retomada e continuidade

- Divisão definida pelo usuário em 2026-10-13: `docs/HERO_HANDOFF.md` contém somente implementação persistente do hero e direção visual/conceitual. Registros técnicos/cronológicos pertencem a `docs/BACKLOG.md`; decisões anteriores, propostas, ideias e avaliações pendentes pertencem a `docs/HERO_DECISIONS_AND_IDEAS.md`. Isso substitui a orientação anterior que tratava o handoff como arquivo histórico. Não acrescentar diário, testes, tooling, commits ou publicações ao handoff.
- Ao iniciar uma tarefa do hero, ler o handoff para a base persistente e o backlog para o estado operacional e a próxima ação. Consultar o registro de decisões quando a tarefa depender de avaliações, propostas ou antecedentes. Ler os demais documentos conforme necessário.
- Conferir o estado real do Git e os arquivos relevantes antes de agir. Preservar alterações existentes; registros de testes e auditorias anteriores são evidências históricas, não validação automática do código atual.
- Usar o contexto sem exigir que o usuário peça leitura ou prepare uma transferência entre chats. Uma nova tarefa ou sessão não autoriza retomar pendências, ampliar escopo ou considerar aprovada uma entrega que aguarda avaliação.
- Após cada entrega ou bloco, registrar execução, verificações, limitações e próxima ação no backlog. Atualizar o handoff apenas quando mudar a implementação persistente ou a direção atual do hero; atualizar o registro de decisões quando mudar o estado de uma proposta, alternativa ou avaliação. Registrar correções do usuário no documento pertinente, sem esperar encerramento do chat.
- Antes da resposta final de uma tarefa com avanço material, conferir os registros pertinentes e informar brevemente a atualização com um link. Em perguntas sem alteração de contexto, não produzir atualizações artificiais.
- Manter os documentos compactos e coerentes, sem transcrever conversas ou duplicar a especificação. Distinguir implementação, testes, avaliação do usuário e conclusão dos fluxos metodológicos. Registrar comandos realmente executados e artefatos relevantes no backlog; identificar capturas temporárias e não depender delas como única fonte de contexto.
- Em Plan Mode, propor as atualizações necessárias sem escrever arquivos nem afirmar que foram salvas. Persistir quando a implementação estiver autorizada e o modo permitir escrita.
- Trabalhar pelos blocos e pontos de avaliação acordados. A manutenção dos registros não autoriza avanço ao bloco seguinte.

Uma interrupção pode anteceder o registro do último avanço; na retomada, reconciliar o backlog e o handoff com o Git e a implementação.

## Impeccable

- Seguir os fluxos completos dos comandos/playbooks aplicáveis, incluindo os prescritos pelo plano e pelo estado metodológico no backlog, e informar qual fluxo está sendo aplicado.
- Registrar etapas exigidas, evidências, artefatos e eventuais omissões ou pendências. Distinguir leitura do playbook, uso de suas orientações, execução de ferramenta CLI e conclusão do fluxo completo; nunca declarar um comando concluído apenas porque seu playbook foi lido.
- Preservar as decisões confirmadas e os resultados existentes ao completar etapas pendentes. Não fabricar execuções anteriores nem repetir verificações sem necessidade. Consultar o backlog para evidências e estado metodológico de cada bloco, e o registro de decisões para avaliações/autorizações pendentes.

## Git e preferências

- Priorizar GitHub CLI (`gh`) nas operações do GitHub quando houver comando equivalente disponível, como consulta de repositórios, PRs, issues, checks e releases. Não substituir essas operações por Git, chamadas HTTP ou outras ferramentas sem necessidade. Para operações locais sem equivalente no `gh`, como staging e criação de commits, usar Git. A disponibilidade do `gh` não autoriza commit, push ou publicação sem pedido explícito do usuário.

- Na refatoração de nomenclatura, aplicar `coding-standards` de `affaan-m/ECC`, lendo seu [SKILL.md original](https://raw.githubusercontent.com/affaan-m/ECC/main/skills/coding-standards/SKILL.md) antes das mudanças. Escopo, exceções para a simulação e verificações obrigatórias estão em [protocolo e auditoria de nomenclatura](docs/BACKLOG.md#auditoria-de-nomenclatura--referência-histórica-e-protocolo). A leitura remota não equivale a instalação local. Preservar comportamento e migrar referências relacionadas juntas.

- Usar Bun para instalação e execução: `bun install --frozen-lockfile`, `bun run dev`, `bun run build`, `bun run preview` e `bun run test` (Playwright). O `bunfig.toml` força Bun nos executáveis dos scripts; manter somente `bun.lock`. Para instalar Chromium, usar `bunx --bun playwright install chromium`.

## Validação e fallback de execução

Alguns executores bloqueiam sockets com `EPERM`, independentemente do Playwright. Tentar `bun run test` no sandbox uma vez por bloco de validação; diante desse erro conhecido ao iniciar o servidor, solicitar execução fora dele com aprovação. Não repetir sondagens IPv4/IPv6, Vite, Node, Python ou subprocessos sem novas evidências, nem alterar configurações para contornar a restrição. Registrar comando, quantidade, resultado e contexto em `docs/BACKLOG.md`. Usar `bun run test` para regressões funcionais e `dev-browser` para inspeção visual/interativa, com procedimentos de execução próprios. Reabrir a investigação se aprovações repetidas prejudicarem significativamente o desenvolvimento.

## Commits

- Por padrão, commit e push ficam a cargo do usuário; executar essas ações apenas quando ele solicitar explicitamente. Quando necessário, fornecer comandos para commits separados por responsabilidade; manter implementação e testes correspondentes juntos.
- Escrever assuntos e corpos de commits Git em inglês, seguindo Conventional Commits (`type(scope): description`, com escopo quando útil) e separando responsabilidades em commits coerentes.
- Em Plan Mode, identificar cada referência anexada utilizada por rótulo e caminho local exato. Não acrescentar esses caminhos à entrega planejada sem solicitação.
