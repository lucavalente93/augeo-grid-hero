# Hero — ponto de retomada

Atualizado em 2026-10-08. Para tarefas do hero, leia este arquivo primeiro; ele concentra o estado atual. A rotina de leitura e atualização dos registros está no [AGENTS.md do projeto](../AGENTS.md). O [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md) guarda a especificação, as evidências da auditoria e as referências visuais, sem substituir este registro de progresso.

## Onde estamos

Refinamento do hero, com parada ao concluir cada bloco para informar o usuário. O bloco 1 está registrado como concluído; o bloco 2 está implementado e validado tecnicamente, mas seus fluxos completos da Impeccable não foram concluídos. A evolução visual aguarda avaliação do usuário e a pendência metodológica deve ser tratada antes de avançar.

| Bloco | Estado | Entrega |
|---|---|---|
| 1 — Mensagem e integridade | Concluído | Copy e descrição de busca alinhadas; retirada a ação sem destino (A01) |
| 2 — Evolução visual | Implementado; avaliação visual e fluxos Impeccable pendentes | Lettering maior, título editorial, alinhamento título–marca, grade mais quieta e faixa mobile EXPLORE + matriz |
| 3 — Movimento | Próximo após avaliação e fechamento do bloco 2 | Introdução de até quatro segundos; repouso e respostas pontuais |
| 4 — Desempenho | Pendente | Otimização do warp, comparação em DPR 2 e preservação da imagem |
| 5 — Registro do sistema | Pendente | DESIGN.md extraído da implementação e briefing da superfície |
| 6 — Acabamento | Pendente | Validação integrada e fechamento dos achados |

## EXPLORE AQUI: intenção e estado

É um **indicativo vertical de continuidade para Processo**, abaixo do hero. Deve conduzir o olhar para baixo: coluna alongada na borda esquerda, letras em sequência descendente e seta inferior. O alongamento faz parte da evolução visual; a centralização vertical desktop permanece. No mobile, a coluna integrará uma faixa clara estreita ao lado da matriz, abaixo da copy.

O estado temporário como texto vem do plano, achado A01 e Parte II §4, item 5: enquanto Processo não existir, não há clique nem semântica de botão/link ativo. Isso preserva o indicativo visual, não elimina sua função de continuidade. Quando a seção real existir, trocar o contêiner por link nativo `href="#processo"`, com foco e nome acessível coerentes. Não criar uma seção artificial apenas para ativar o controle ou passar testes.

Correção antecipada preservada: coluna desktop ampliada para fonte de 24 px e avanço de 1,3em, com redução em janelas curtas; seta descendente estática também visível com movimento reduzido. Letras continuam sendo texto em Share Tech Mono. O bloco 2 acrescentou a composição mobile conjunta: faixa clara de 64 px ao lado da matriz, abaixo da copy. O movimento finito permanece no bloco 3.

## Estado implementado e validação

- Mensagem aplicada: “Presença digital com direção.” O apoio parte do contexto do negócio para conectar marca, website, aquisição e operação digital.
- Base preservada: símbolo original, Hanken Grotesk local, lettering AUGEO listrado, divisão desktop 44/56, temas da matriz, deformação localizada, retorno exato ao repouso e versão estática com movimento reduzido.
- Bloco 1: build aprovado, 12/12 testes Playwright em Chromium e detector CLI sem achados. O teste de EXPLORE verifica leitura acessível, ausência de ação/foco e ausência de navegação; substituiu o teste com seção injetada.
- Correção antecipada de EXPLORE: build aprovado, 12/12 testes passando, detector sem achados e capturas inspecionadas com movimento reduzido em desktop, desktop curto e mobile. Em 1440×900, a coluna passou de aproximadamente 288 px para 405 px, incluindo a seta. Links locais da documentação verificados.

### Bloco 2 — evolução visual implementada

- Lettering em 88% da área interna, com limite de 680 px: aproximadamente 639 px em 1440×900, ante 527 px. SVG, proporção, listras e abertura do “A” preservados.
- Título em Hanken 750, 86 px no desktop amplo, entrelinha 0,98 e três linhas editoriais. Apoio limitado a 36ch, com intervalo de 30 px e entrelinha 1,5. Copy do bloco 1 preservada.
- Centro do lettering acompanha o centro do título desktop por medição com `ResizeObserver`; o componente acompanha mudanças no quadro de posicionamento para manter a origem do campo de interação correta. No mobile, lettering centralizado na matriz.
- Grade do hero com espaçamento máximo de 72 px e scanlines um terço mais discretas nos dois temas. Nova prop opcional `gridSpacing` preserva o padrão de 58 px da demonstração compartilhada.
- Removidas reservas compensatórias de 263/283 px. Hero em 900×600 e 768×600 agora mede 600 px de altura, com conteúdo normal inteiro e sem sobreposição.
- Mobile: copy seguida, após 24 px, por EXPLORE + matriz. Matriz de 288–340 px; o mínimo de 288 px acomoda a coluna de aproximadamente 286 px, inclusive em 320×600. AUGEO inteiro na primeira tela em 390×844 e 320×740; nesta última, o artwork termina em aproximadamente y=535 px, ante y=849 px na captura anterior.
- Validação: build aprovado, 13/13 testes Playwright em Chromium e detector CLI sem achados. Inspeção visual nos cinco viewports previstos e confirmação adicional em 320×600, nos temas claro/escuro. Fonte raiz a 200% sem overflow horizontal nos cinco viewports previstos; esse ensaio não equivale a zoom real do navegador.
- Testes preservam leitura/foco do indicativo, temas, toque emulado, deformação limitada, retorno ao repouso e abertura do “A”. Capturas de comparação antes/depois disponíveis localmente em `test-results/hero-block2/`; são artefatos temporários não versionados.
- Limites: validação em Chromium, sem ensaio em aparelhos físicos ou outros motores. Introdução finita e otimização de desempenho não foram antecipadas; loops automáticos atuais permanecem até o bloco 3.

## Próxima ação e limites

### Pendência metodológica confirmada nesta conversa

No bloco 2 foram lidos os playbooks `shape`, `bolder`, `layout`, `typeset` e `adapt`, e suas orientações foram utilizadas na implementação. Isso não constituiu a conclusão dos fluxos completos de cada comando. Foram executados o launcher `context`, o detector `detect`, build, testes e inspeções visuais. Não existe uma nova execução completa de `audit` ou `polish`; a auditoria registrada continua histórica, e `polish` pertence ao bloco 6.

O usuário pediu que esta distinção fosse persistida. A preferência está em `/home/luca/.codex/AGENTS.md`: seguir os fluxos completos aplicáveis, informar qual está sendo aplicado e registrar etapas, evidências, artefatos, omissões e pendências. Nunca declarar um comando concluído apenas porque seu playbook foi lido.

Na retomada, identificar e completar as etapas ainda necessárias dos fluxos aplicáveis ao bloco 2, preservando a implementação e as decisões confirmadas. Não fabricar execuções ou artefatos anteriores nem repetir verificações sem necessidade. Apresentar o resultado para avaliação visual e parar, conforme a entrega por bloco confirmada. Após avaliação e fechamento dessas pendências, retomar o bloco 3 pela Parte III do plano: introdução concluída em até quatro segundos, seguida de repouso e respostas pontuais. Depois, seguir os blocos 4–6. Não registrar a pontuação histórica da auditoria como resultado pós-implementação.

O trabalho atual consolida apenas o hero. Processo, formulário e footer pertencem à continuidade da landing. EXPLORE leva a Processo; o CTA comercial futuro leva ao formulário. São destinos diferentes.

## Leitura por necessidade

- **Rotina de trabalho e continuidade:** [AGENTS.md](../AGENTS.md), criado em 2026-10-08 para orientar a retomada e a atualização por marcos sem pedidos explícitos de handoff. Links e diff verificados nesta entrega; carregamento e aplicação em uma nova sessão ainda não verificados. Nenhuma alteração de UI ou nova validação do hero foi realizada nesta entrega.
- **Retomada e progresso:** este arquivo.
- **Execução do próximo bloco:** Parte II (direção) e Parte III (implementação e aceitação) do [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md). Parte I e anexos são consulta histórica, técnica e visual.
- **Resumo do produto para a skill:** [PRODUCT.md](../PRODUCT.md).
- **Posicionamento aprofundado:** [CONTEXT.md](CONTEXT.md), quando a tarefa envolver estratégia ou copy além do briefing.
- **Arquitetura da landing:** [02-WEBSITE_SPEC.md](02-WEBSITE_SPEC.md), quando a tarefa envolver outras seções ou entrada comercial.
- **Operação interna:** [03-INTERNAL.md](03-INTERNAL.md); dispensável para refinar o hero.

Preservar alterações locais anteriores à sessão. A auditoria do plano é um baseline histórico; o código e as verificações atuais determinam o estado implementado.
