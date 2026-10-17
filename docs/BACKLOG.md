# Backlog do projeto

Atualizado em 2026-10-17. Fonte da fila e da última entrega; evidências detalhadas ficam no [histórico](archive/EXECUTION_HISTORY.md). Requisitos pertencem à [especificação](02-WEBSITE_SPEC.md), procedimentos a [WORKFLOW.md](WORKFLOW.md), e decisões do hero a [HERO.md](HERO.md).

## Continuidade prioritária — arquitetura agêntica

- **Direção:** implementar Antigravity + Codex, adaptando as [duas](refs/stack-referencia-4-camadas.md) [referências](architecture-reference.md). A modularização foi publicada em `f368281`; implantação local autorizada pelo pedido “Implemente o plano”.
- **Implantado:** contexto global privado por responsabilidade, vault/Canvas e vistas Obsidian, skill compartilhada de descoberta; Paperclip `2026.1012.0` local com projeto e dois executores; ponte Bun de contexto, sessões por tarefa, exclusão por projeto, evidências e retorno para revisão. Configuração registra fontes globais/locais permitidas por projeto, sem caminhos físicos no contrato público.
- **Papéis:** Antigravity executa frontend/visual e coordenação criativa; Codex engenharia estrutural/revisão técnica; Luca mantém direção e aprovação. Paperclip é a autoridade de estado; arquivos da ponte são evidências e continuidade, sem outra fila.
- **Validação real:** ambos CLIs leram as mesmas fontes; passagem de resultado Antigravity → Codex; retomada `agy` com a mesma conversa; runs finais de ambos terminaram com exit 0 e tickets em revisão humana. Testes detectam fonte alterada, falta de fonte, cópia derivada desatualizada, concorrência, timeout, falha e replay. Evidências e limitações em [ORCHESTRATION](ORCHESTRATION.md) e no histórico.
- **Limite atual:** ponte habilita somente leitura. Escrita de frontend/engenharia e inspeção visual pelo agente no navegador ainda não foram habilitadas/validadas. O navegador desta sessão confirmou o painel Paperclip, não a capacidade visual do `agy`. Aprovação criativa dos resultados não foi concedida.
- **Ferramentas:** Obsidian instalado abriu o vault/Canvas; Paperclip usa PostgreSQL embutido para sua operação. Isso não escolhe banco do website ou embeddings. Supabase/pgvector/Fathom e demais exemplos permanecem referências; Gemini CLI não foi instalado nem substituiu Antigravity. Maestri não é dependência.
- **Próximo trabalho:** definir a pequena mudança isolada do piloto de escrita, implementar permissões/escopo executáveis e validar frontend → navegador → revisão, preservando fluxos Impeccable. Depois avaliar produtividade e necessidades reais. Sem retomar hero, adicionar serviços ou publicar por reflexo.

## Estado atual

- Website informado pelo usuário: `https://www.augeocreative.com`. Hero, CTA e matriz publicados; Processo e formulário ainda previstos. Domínio informado não comprova redirecionamento canônico.
- Última publicação registrada: reparo de colisão CTA/indicativo em `aa12d8a`, deploy Production confirmado em 16/10. Última suíte registrada: 26/26 em 1,5 min e build aprovado; são evidências daquele código, sem nova execução nesta modularização.
- Hero: bloco 2 implementado, com avaliação visual global e fechamento metodológico pendentes. Aprovação do fundo mobile foi específica. A correção de 16/10 não encerra o bloco 2; não há autorização automática para blocos 3–6.
- Repositório informado pelo GitHub em 16/10: `lucavalente93/augeo-v1-landing`; remoto local ainda aponta ao nome anterior. Sem mudança de remoto ou nova consulta à plataforma.

## Fila por frente

| Frente | Próxima ação ou dependência | Limite |
| --- | --- | --- |
| Arquitetura agêntica | Habilitar e validar piloto de escrita delimitada e ciclo visual com navegador, após a integração de leitura comprovada | Ponte atual somente leitura; sem aprovação criativa, habilitação de escrita ou publicação implícita. |
| Hero | Avaliação do usuário e reconciliação das etapas metodológicas do bloco 2 | Sequência e critérios em HERO; não antecipar movimento, otimização ou acabamento. |
| Qualidade | Cobrir isoladamente o ponteiro vindo da coluna esquerda; considerar limites de Chromium/emulação no fechamento | Sem aparelhos físicos/outros motores, zoom real, CLS ou perfil de frames em hardware comprovados. |
| Limpeza técnica | Avaliar remoção de `pixel`, escopo do cue, divisão de tests/matrix.spec.ts e movimentação de assets | Propostas separadas; não são parte da migração nominal concluída. |
| Figma | Conferir adequação dos dois PNGs locais antes de retomar importação manual | Ainda não rastreados; disponibilidade não comprova origem, equivalência, importação ou aprovação. Proposta em HERO. |
| Landing | Definir copy/Processo e implementar formulário real em #entrada | Resolver campos, recebimento, armazenamento, privacidade, triagem e retorno conforme especificação e AUGEO; preservar footer visual mobile. |
| Publicação | Definir redirecionamento/canonical e metadados quando em escopo | Pro da Vercel e WhatsApp Business adiados até concluir o site; nenhuma contratação autorizada. |

O diagnóstico de sockets/EPERM está encerrado e seu fallback está em WORKFLOW. A espera HTTP inicial do runner é uma observação distinta, a investigar somente se voltar a impedir execução necessária. Avisos ResizeObserver na rodada sintética de 16/10 não tiveram causa isolada e não devem ser atribuídos à correção sem evidência.

## Última entrega — implantação local da orquestração — 2026-10-17

- Fontes reutilizáveis de AUGEO migradas com conferência de cobertura; AUGEO local contém aplicação ao website; PRODUCT preserva caminho/schema. AGENTS, especificação e consumidores atualizados. Guia pessoal e mudanças preexistentes preservados.
- Guia humano integrado ao README da integração: entrada pelo painel, instância/processos, passagem explícita, árvore e navegação Obsidian/Graph View/Canvas. Sem novo documento concorrente; detalhes técnicos preservados.
- Integração e dependências fora da landing. `augeo-orchestrator` resolve contexto, atualiza/confere vistas e passa resultados entre executores. `augeo-paperclip` inicia o painel local em foreground; sem serviço de boot. Código e operação no README local da integração.
- **Verificação:** 12 testes da ponte e TypeScript aprovados; painel Paperclip inspecionado em Chromium sem erro de página; ambos CLIs executados; passagem vinculada e retomada real verificadas; backup PostgreSQL restaurado em banco descartável com 1 organização, 2 agentes e 3 tarefas (snapshot inicial), depois removido. Exportação inicial gerou 12 arquivos e duas ressalvas de fidelidade.
- Falhas reais encontradas e corrigidas: extração opcional musl, hidratação upstream de symlinks Postgres, status `SUCCESS`, exigência de responsável pela revisão e cancelamento do próprio processo por reassinação. Recuperações preservaram saída e evidências; nenhuma repetição de ação de produto. Resultados finais de Antigravity/Codex estão em revisão, com interação humana e sem trava pendente.
- **Limitações:** escrita/ciclo visual do executor não validados; descoberta da skill em cada superfície gráfica não comprovada só pela instalação; custo do adaptador process não normalizado no painel. Backup do banco testado não é teste de desastre de toda a instalação. Sem alteração da aplicação, fluxo visual Impeccable, commit, push ou publicação.

## Entrega anterior — modularização documental — 2026-10-17

- Separados contexto da agência e resumo da skill; requisitos da landing mantidos na especificação. Estado/decisões/propostas do hero consolidados; procedimentos retirados da cronologia; fila separada do histórico.
- Históricos e auditoria preservados em archive, com estado explícito e links atualizados. Referências externas e guia privado preservados. Estrutura anterior substituída sem correspondência 1:1 e sem limite fixo de arquivos.
- Verificação aprovada: 88 links locais, 14 âncoras e seis referências do moodboard; preservação textual de auditoria, cronologia, implementação, decisões e contexto da agência. Caminho/schema de PRODUCT e referências externas preservados; nenhum consumidor ativo dos nomes removidos. `git diff --check` aprovado. Compatibilidade da skill conferida estaticamente, sem executar launcher. Sem alteração de aplicação, teste funcional, fluxo Impeccable, commit, push ou publicação nesta etapa.
- Próxima ação: definir escopo, responsabilidades e mecanismo da arquitetura de orquestração Antigravity/Codex sobre a modularização publicada. Nenhum bloco visual retomado.


## Preparação de publicação documental — 2026-10-17

Usuário autorizou staging, commit e push após o showcase. GitHub CLI confirmou autenticação, repositório `lucavalente93/augeo-v1-landing` e main remota em `aa12d8a`, mesma base local. Referências já estavam movidas para `docs/refs/`; links ativos ajustados e SHA-256 do ZIP/captura comparados aos blobs anteriores, idênticos. Conferidos 88 links locais, 14 âncoras e schema de PRODUCT. Publicação reúne documentação e renomes relacionados; PNGs Figma e guia privado ficam fora. Resultado do envio e SHA remoto serão conferidos por gh e informados na entrega. Sem nova suíte/build ou verificação de deploy por esta mudança documental.
