# AUGEO — instruções do projeto

## Organização e fontes de contexto

Este arquivo define a rotina de trabalho e encaminha a leitura dos documentos. O estado de execução pertence ao handoff da frente correspondente; arquitetura e requisitos pertencem à especificação.

- [Hero — ponto de retomada](docs/HERO_HANDOFF.md): progresso, decisões, evidências, pendências e próxima ação do hero.
- [Auditoria e plano do hero](docs/HERO_AUDIT_AND_IMPROVEMENT_PLAN.md): briefing, sequência de implementação, critérios de aceitação e referências; a auditoria é histórica.
- [Especificação do website](docs/02-WEBSITE_SPEC.md): arquitetura, requisitos e limites da landing.
- [Produto](PRODUCT.md): resumo para a skill. [Contexto estratégico](docs/CONTEXT.md) e [operação interna](docs/03-INTERNAL.md): aprofundamento conforme a tarefa.

Até agora, a frente de refinamento do hero e os documentos existentes podem ser encaminhados diretamente por estas instruções. Um índice separado de orquestração acrescentaria manutenção e duplicação sem resolver uma necessidade presente. Se surgirem várias frentes simultâneas, reavaliar a necessidade de um índice próprio com função e nome explícitos.

## Retomada e continuidade

- Ao iniciar uma tarefa neste repositório, consultar o handoff da frente pertinente, a próxima ação e os limites registrados; para o hero, começar por `docs/HERO_HANDOFF.md`. Ler outros documentos apenas quando necessários à tarefa.
- Conferir o estado real do Git e os arquivos relevantes antes de agir. Preservar alterações existentes; registros de testes e auditorias anteriores são evidências históricas, não validação automática do código atual.
- Usar o contexto sem exigir que o usuário peça leitura ou prepare uma mensagem de transferência entre chats. Uma nova tarefa ou sessão não autoriza retomar automaticamente pendências, ampliar escopo ou considerar aprovada uma entrega que aguarda avaliação.
- Atualizar o handoff pertinente após cada entrega ou bloco, validação concluída, decisão material, mudança de escopo ou impedimento. Registrar também correções relevantes feitas pelo usuário; não esperar um aviso de encerramento do chat.
- Antes da resposta final de uma tarefa com avanço material, conferir se o registro contém estado atual, decisões, mudanças, evidências, limitações e próxima ação. Informar brevemente a atualização com um link. Em perguntas sem alteração de contexto, não produzir atualizações artificiais.
- Manter o registro compacto e atual: atualizar as seções existentes, sem transcrever conversas nem duplicar a especificação. Distinguir implementação, testes, avaliação do usuário e conclusão do fluxo metodológico. Registrar comandos realmente executados e artefatos relevantes; identificar capturas temporárias e não depender delas como única fonte de contexto.
- Em Plan Mode, propor as atualizações necessárias sem escrever arquivos nem afirmar que os registros foram salvos. Persistir essas alterações quando a implementação estiver autorizada e o modo permitir escrita.
- Trabalhar pelos blocos e pontos de avaliação acordados. Não interpretar a manutenção automática do handoff como aprovação para avançar ao bloco seguinte.

As atualizações por marco reduzem a perda de contexto. Uma interrupção abrupta pode ocorrer antes do registro do último avanço; na retomada, reconciliar o handoff com o Git e a implementação.

## Impeccable

- Seguir os fluxos completos dos comandos/playbooks aplicáveis, incluindo os prescritos pelo handoff, e informar qual fluxo está sendo aplicado.
- Registrar etapas exigidas, evidências, artefatos e eventuais omissões ou pendências. Distinguir leitura do playbook, uso de suas orientações, execução de ferramenta CLI e conclusão do fluxo completo; nunca declarar um comando concluído apenas porque seu playbook foi lido.
- Preservar as decisões confirmadas e os resultados existentes ao completar etapas pendentes. Não fabricar execuções anteriores nem repetir verificações sem necessidade. Consultar o handoff para o estado metodológico atual de cada bloco.

## Git e preferências

- Por padrão, commit e push ficam a cargo do usuário; executar essas ações apenas quando ele solicitar explicitamente. Quando necessário, fornecer comandos para commits separados por responsabilidade; manter implementação e testes correspondentes juntos.
- Escrever assuntos e corpos de commits Git em inglês, seguindo Conventional Commits (`type(scope): description`, com escopo quando útil) e separando responsabilidades em commits coerentes.
- Em Plan Mode, identificar cada referência anexada utilizada por rótulo e caminho local exato. Não acrescentar esses caminhos à entrega planejada sem solicitação.
