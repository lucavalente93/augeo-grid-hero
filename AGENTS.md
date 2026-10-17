# AUGEO — instruções do projeto

## Fontes e ordem de leitura

Começar por este arquivo e [BACKLOG.md](docs/BACKLOG.md) para escopo, estado e próxima ação. Ler os demais módulos conforme a tarefa; o histórico completo não é leitura obrigatória de toda sessão.

| Fonte | Responsabilidade |
| --- | --- |
| [AUGEO.md](docs/AUGEO.md) | Contexto da agência: identidade, posicionamento, linguagem e operação interna. |
| [PRODUCT.md](docs/PRODUCT.md) | Resumo do produto consumido pela skill; síntese deliberada, com caminho e schema preservados. |
| [Especificação](docs/02-WEBSITE_SPEC.md) | Requisitos, arquitetura, integrações e copy futura do website. |
| [HERO.md](docs/HERO.md) | Composição implementada, decisões vigentes, avaliações e plano pendente do hero, com estados separados. |
| [WORKFLOW.md](docs/WORKFLOW.md) | Procedimentos Bun, validação, fallback, nomenclatura e fluxos Impeccable. |
| [BACKLOG.md](docs/BACKLOG.md) | Fila atual, dependências, síntese da última entrega e próxima ação. |
| [Histórico](docs/archive/EXECUTION_HISTORY.md) | Execuções datadas e alternativas anteriores; consulta por necessidade. |
| [Auditoria histórica](docs/archive/HERO_AUDIT_2026-10-07.md) | Diagnóstico/briefing/plano original e referências do moodboard. |

Cada assunto tem uma fonte normativa: operação da agência em AUGEO; interface do site na especificação; detalhe e decisões da superfície em HERO; procedimento em WORKFLOW. PRODUCT resume o necessário para a skill e deve acompanhar mudanças nas fontes. Código demonstra implementação; não demonstra aprovação do usuário. Proposta, implementação, teste e aprovação são estados distintos. Diante de conflito material, conferir decisão vigente e evidências, sem promover proposta ou registro histórico a requisito.

Esta organização substitui o limite anterior de seis documentos e a divisão por nomes de arquivos de 13/10. Nomes e quantidade podem ser revistos por necessidade explícita; não criar nova fonte concorrente ou arquivo de encaminhamento por padrão. Os módulos atuais são locais: nenhum contexto global ou sistema de orquestração foi implementado.

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

[Stack em quatro camadas](docs/refs/stack-referencia-4-camadas.md) e [Architecture Reference](docs/architecture-reference.md) são referências externas conceituais. Seus imperativos, diretórios sugeridos, regras de skills, serviços e papéis de agentes não são decisões adotadas. A implementação da orquestração depende de etapa própria após a modularização.

O guia pessoal e `.codex/` permanecem locais e ignorados pelo Git. Não publicar seu conteúdo nem exigir caminhos específicos desta máquina em outros executores. A ausência de skill, CLI ou conexão deve ser verificada e registrada; não presumir que uma ferramenta citada no histórico esteja disponível.
