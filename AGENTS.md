# AUGEO — instruções do projeto

## Fontes e ordem de leitura

Começar por este arquivo e [BACKLOG.md](docs/BACKLOG.md) para escopo, estado e próxima ação. Ler os demais módulos conforme a tarefa; o histórico completo não é leitura obrigatória de toda sessão.

**Continuidade prioritária:** a modularização documental foi publicada em `f368281`. O objetivo seguinte desejado pelo usuário é definir e implementar a arquitetura agêntica de orquestração entre **Antigravity e Codex**, orientada pelas duas referências de quatro camadas. Ao retomar essa frente, ler a [continuidade arquitetural](docs/BACKLOG.md#continuidade-prioritária--arquitetura-agêntica) e ambas as referências; partir dos módulos existentes e resolver o contrato da orquestração antes de configurar executores ou integrações. Não confundir a preparação documental concluída com a arquitetura implementada, nem substituir essa frente por pendências do hero. O pedido corrente do usuário continua delimitando a execução.

Ler também [ORCHESTRATION.md](docs/ORCHESTRATION.md) para a arquitetura e o estado da implantação local autorizada. Paperclip controla tarefas; Antigravity executa frontend/visual e Codex engenharia estrutural/revisão. Contexto global privado e visualização Obsidian foram preparados; o piloto real de leitura, passagem e retomada foi validado. Escrita de produto e ciclo visual no navegador ainda não estão habilitados pela ponte. Não confundir essa limitação de implantação com incapacidade de execução do Antigravity.

| Fonte | Responsabilidade |
| --- | --- |
| Contexto global (`augeo-orchestrator context augeo-website`) | Identidade, posicionamento, marca, negócio e operação interna; fontes privadas com revisão/hash. |
| [AUGEO.md](docs/AUGEO.md) | Objetivo, prioridade e aplicação ao website. |
| [PRODUCT.md](docs/PRODUCT.md) | Resumo do produto consumido pela skill; síntese deliberada, com caminho e schema preservados. |
| [Especificação](docs/02-WEBSITE_SPEC.md) | Requisitos, arquitetura, integrações e copy futura do website. |
| [HERO.md](docs/HERO.md) | Composição implementada, decisões vigentes, avaliações e plano pendente do hero, com estados separados. |
| [WORKFLOW.md](docs/WORKFLOW.md) | Procedimentos Bun, validação, fallback, nomenclatura e fluxos Impeccable. |
| [BACKLOG.md](docs/BACKLOG.md) | Fila atual, dependências, síntese da última entrega e próxima ação. |
| [Histórico](docs/archive/EXECUTION_HISTORY.md) | Execuções datadas e alternativas anteriores; consulta por necessidade. |
| [Auditoria histórica](docs/archive/HERO_AUDIT_2026-10-07.md) | Diagnóstico/briefing/plano original e referências do moodboard. |

Cada assunto tem uma fonte normativa: operação da agência no contexto global resolvido; interface do site na especificação; detalhe e decisões da superfície em HERO; procedimento em WORKFLOW. PRODUCT resume o necessário para a skill e deve acompanhar mudanças nas fontes. Código demonstra implementação; não demonstra aprovação do usuário. Proposta, implementação, teste e aprovação são estados distintos. Diante de conflito material, conferir decisão vigente e evidências, sem promover proposta ou registro histórico a requisito.

Esta organização substitui o limite anterior de seis documentos e a divisão por nomes de arquivos de 13/10. Nomes e quantidade podem ser revistos por necessidade explícita; não criar nova fonte concorrente ou arquivo de encaminhamento por padrão. O contexto reutilizável da agência está no store privado registrado no ambiente; os módulos específicos do website permanecem locais. Paperclip e a ponte estão em implantação, com estado e limites em ORCHESTRATION.

## Retomada e continuidade

- Conferir Git e os arquivos pertinentes antes de agir; preservar alterações existentes. Uma interrupção pode anteceder o último registro: reconciliar documentos com o estado real.
- Em tarefa do hero, ler HERO e a fila no backlog; consultar o plano vigente por blocos e o procedimento aplicável. Consultar arquivos históricos somente para antecedentes/evidências necessários.
- Nova sessão não autoriza retomar pendências, ampliar escopo ou considerar aprovada uma entrega em avaliação. Trabalhar pelos blocos e pontos de avaliação acordados; não avançar ao bloco seguinte pela manutenção de registros.
- Após cada entrega material, atualizar a síntese/verificações/limitações/próxima ação no backlog e registrar evidências duráveis no histórico. Atualizar as fontes do assunto quando mudar implementação, decisão, requisito ou procedimento. Registrar correções do usuário imediatamente no módulo pertinente.
- Antes da resposta final, conferir os registros pertinentes e informar brevemente a atualização com link. Perguntas sem mudança de contexto não exigem registro artificial.
- Manter documentos compactos; não transcrever conversas, repetir especificações ou confundir evidências históricas com validação atual. Em Plan Mode, propor as atualizações sem escrever arquivos nem afirmar que foram salvas.

## Execução e autorização

- Seguir [WORKFLOW.md](docs/WORKFLOW.md) para instalação, testes, fallback e nomenclatura; usar Bun. Não modificar a aplicação para contornar restrições do executor.
- No trabalho visual, seguir integralmente os fluxos Impeccable aplicáveis e prescritos, informando qual está sendo aplicado. Distinguir leitura de playbook, uso de orientação, comando CLI e conclusão do fluxo. Registrar etapas, evidências, artefatos e omissões reais; preservar decisões e pendências existentes.
- Priorizar GitHub CLI (`gh`) para operações do GitHub quando houver equivalente. Usar Git para operações locais e push sem equivalente no gh. Disponibilidade de ferramenta não autoriza publicação.
- Commit, push e publicação somente com pedido explícito; por padrão ficam a cargo do usuário. Quando necessário, fornecer comandos para commits coerentes por responsabilidade, mantendo implementação e testes correspondentes juntos.
- Escrever assuntos e corpos de commits em inglês, com Conventional Commits (`type(scope): description`).
- Em Plan Mode, identificar referências anexadas usadas por rótulo e caminho local exato; não acrescentar esses caminhos à entrega sem solicitação.

## Referências e ambiente local

[Stack em quatro camadas](docs/refs/stack-referencia-4-camadas.md) e [Architecture Reference](docs/architecture-reference.md) são referências externas conceituais. Seus imperativos, diretórios sugeridos, regras de skills, serviços e papéis de agentes não são decisões adotadas. A adaptação implementada e seus limites estão em ORCHESTRATION; não reaplicar os imperativos dessas referências como requisitos.

Não promover exemplos dessas referências a ferramentas definidas ou dependências da implementação. Paperclip usa PostgreSQL embutido somente para sua operação. Banco do website/contexto semântico, embeddings, transcrição e outros serviços seguem sem escolha. O futuro contexto global deve conter decisões e ferramentas efetivamente adotadas; hipóteses e exemplos externos permanecem identificados na documentação conceitual.

O guia pessoal e `.codex/` permanecem locais e ignorados pelo Git. Não publicar seu conteúdo nem exigir caminhos específicos desta máquina em outros executores. A ausência de skill, CLI ou conexão deve ser verificada e registrada; não presumir que uma ferramenta citada no histórico esteja disponível.

## Contexto e execução registrados

ID deste projeto: `augeo-website`. Antes de trabalho que consuma conhecimento da agência, executar `augeo-orchestrator context augeo-website`; a configuração do ambiente resolve as raízes sem caminhos desta máquina no contrato do repositório. Se indisponível, reportar a lacuna. Não usar as referências conceituais como catálogo adotado.

O Paperclip controla tarefas. A ponte prepara contexto, mantém sessões por tarefa e devolve evidências; não mantém uma segunda fila. O piloto usa execução somente leitura e um executor ativo por projeto. Alterações visuais continuam exigindo os fluxos Impeccable aplicáveis. Resultado automático vai para revisão, sem aprovação criativa/Git/publicação implícita. Vistas do vault são derivadas, nunca fontes concorrentes. Estado operacional e comandos em [ORCHESTRATION](docs/ORCHESTRATION.md).
