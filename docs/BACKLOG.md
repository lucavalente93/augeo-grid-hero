# Backlog do projeto

Atualizado em 2026-10-17. Fonte da fila e da última entrega; evidências detalhadas ficam no [histórico](archive/EXECUTION_HISTORY.md). Requisitos pertencem à [especificação](02-WEBSITE_SPEC.md), procedimentos a [WORKFLOW.md](WORKFLOW.md), e decisões do hero a [HERO.md](HERO.md).

## Estado atual

- Website informado pelo usuário: `https://www.augeocreative.com`. Hero, CTA e matriz publicados; Processo e formulário ainda previstos. Domínio informado não comprova redirecionamento canônico.
- Última publicação registrada: reparo de colisão CTA/indicativo em `aa12d8a`, deploy Production confirmado em 16/10. Última suíte registrada: 26/26 em 1,5 min e build aprovado; são evidências daquele código, sem nova execução nesta modularização.
- Hero: bloco 2 implementado, com avaliação visual global e fechamento metodológico pendentes. Aprovação do fundo mobile foi específica. A correção de 16/10 não encerra o bloco 2; não há autorização automática para blocos 3–6.
- Repositório informado pelo GitHub em 16/10: `lucavalente93/augeo-v1-landing`; remoto local ainda aponta ao nome anterior. Sem mudança de remoto ou nova consulta à plataforma.

## Fila por frente

| Frente | Próxima ação ou dependência | Limite |
| --- | --- | --- |
| Documentação | Revisar a organização implementada e então definir o contrato da futura orquestração | Módulos locais; sem mecanismo de delegação, papéis de agentes ou contexto global adotados. |
| Hero | Avaliação do usuário e reconciliação das etapas metodológicas do bloco 2 | Sequência e critérios em HERO; não antecipar movimento, otimização ou acabamento. |
| Qualidade | Cobrir isoladamente o ponteiro vindo da coluna esquerda; considerar limites de Chromium/emulação no fechamento | Sem aparelhos físicos/outros motores, zoom real, CLS ou perfil de frames em hardware comprovados. |
| Limpeza técnica | Avaliar remoção de `pixel`, escopo do cue, divisão de tests/matrix.spec.ts e movimentação de assets | Propostas separadas; não são parte da migração nominal concluída. |
| Figma | Conferir adequação dos dois PNGs locais antes de retomar importação manual | Ainda não rastreados; disponibilidade não comprova origem, equivalência, importação ou aprovação. Proposta em HERO. |
| Landing | Definir copy/Processo e implementar formulário real em #entrada | Resolver campos, recebimento, armazenamento, privacidade, triagem e retorno conforme especificação e AUGEO; preservar footer visual mobile. |
| Publicação | Definir redirecionamento/canonical e metadados quando em escopo | Pro da Vercel e WhatsApp Business adiados até concluir o site; nenhuma contratação autorizada. |

O diagnóstico de sockets/EPERM está encerrado e seu fallback está em WORKFLOW. A espera HTTP inicial do runner é uma observação distinta, a investigar somente se voltar a impedir execução necessária. Avisos ResizeObserver na rodada sintética de 16/10 não tiveram causa isolada e não devem ser atribuídos à correção sem evidência.

## Última entrega — modularização documental — 2026-10-17

- Separados contexto da agência e resumo da skill; requisitos da landing mantidos na especificação. Estado/decisões/propostas do hero consolidados; procedimentos retirados da cronologia; fila separada do histórico.
- Históricos e auditoria preservados em archive, com estado explícito e links atualizados. Referências externas e guia privado preservados. Estrutura anterior substituída sem correspondência 1:1 e sem limite fixo de arquivos.
- Verificação aprovada: 88 links locais, 14 âncoras e seis referências do moodboard; preservação textual de auditoria, cronologia, implementação, decisões e contexto da agência. Caminho/schema de PRODUCT e referências externas preservados; nenhum consumidor ativo dos nomes removidos. `git diff --check` aprovado. Compatibilidade da skill conferida estaticamente, sem executar launcher. Sem alteração de aplicação, teste funcional, fluxo Impeccable, commit, push ou publicação nesta etapa.
- Próxima ação: avaliar a modularização e definir escopo, responsabilidades e mecanismo da futura orquestração. Nenhum bloco visual retomado.


## Preparação de publicação documental — 2026-10-17

Usuário autorizou staging, commit e push após o showcase. GitHub CLI confirmou autenticação, repositório `lucavalente93/augeo-v1-landing` e main remota em `aa12d8a`, mesma base local. Referências já estavam movidas para `docs/refs/`; links ativos ajustados e SHA-256 do ZIP/captura comparados aos blobs anteriores, idênticos. Conferidos 88 links locais, 14 âncoras e schema de PRODUCT. Publicação reúne documentação e renomes relacionados; PNGs Figma e guia privado ficam fora. Resultado do envio e SHA remoto serão conferidos por gh e informados na entrega. Sem nova suíte/build ou verificação de deploy por esta mudança documental.
