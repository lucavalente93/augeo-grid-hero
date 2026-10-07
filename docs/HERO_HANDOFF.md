# Hero — ponto de retomada

Atualizado em 2026-10-07. Leia este arquivo primeiro; ele concentra o estado atual. O [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md) guarda a especificação, as evidências da auditoria e as referências visuais, sem substituir este registro de progresso.

## Onde estamos

Refinamento do hero, com parada ao concluir cada bloco para informar o usuário. O bloco 1 está concluído. Uma correção antecipada de EXPLORE foi aplicada a pedido do usuário; o bloco 2 completo ainda está por executar.

| Bloco | Estado | Entrega |
|---|---|---|
| 1 — Mensagem e integridade | Concluído | Copy e descrição de busca alinhadas; retirada a ação sem destino (A01) |
| 2 — Evolução visual | Próximo; EXPLORE antecipado | Lettering maior, título editorial, alinhamento título–marca, grade mais quieta e faixa mobile EXPLORE + matriz |
| 3 — Movimento | Pendente | Introdução de até quatro segundos; repouso e respostas pontuais |
| 4 — Desempenho | Pendente | Otimização do warp, comparação em DPR 2 e preservação da imagem |
| 5 — Registro do sistema | Pendente | DESIGN.md extraído da implementação e briefing da superfície |
| 6 — Acabamento | Pendente | Validação integrada e fechamento dos achados |

## EXPLORE AQUI: intenção e estado

É um **indicativo vertical de continuidade para Processo**, abaixo do hero. Deve conduzir o olhar para baixo: coluna alongada na borda esquerda, letras em sequência descendente e seta inferior. O alongamento faz parte da evolução visual; a centralização vertical desktop permanece. No mobile, a coluna integrará uma faixa clara estreita ao lado da matriz, abaixo da copy.

O estado temporário como texto vem do plano, achado A01 e Parte II §4, item 5: enquanto Processo não existir, não há clique nem semântica de botão/link ativo. Isso preserva o indicativo visual, não elimina sua função de continuidade. Quando a seção real existir, trocar o contêiner por link nativo `href="#processo"`, com foco e nome acessível coerentes. Não criar uma seção artificial apenas para ativar o controle ou passar testes.

Correção antecipada: coluna desktop ampliada para fonte de 24 px e avanço de 1,3em, com redução em janelas curtas; seta descendente estática também visível com movimento reduzido. Letras continuam sendo texto em Share Tech Mono. A composição mobile conjunta e o movimento finito permanecem nos blocos 2 e 3.

## Estado implementado e validação

- Mensagem aplicada: “Presença digital com direção.” O apoio parte do contexto do negócio para conectar marca, website, aquisição e operação digital.
- Base preservada: símbolo original, Hanken Grotesk local, lettering AUGEO listrado, divisão desktop 44/56, temas da matriz, deformação localizada, retorno exato ao repouso e versão estática com movimento reduzido.
- Bloco 1: build aprovado, 12/12 testes Playwright em Chromium e detector CLI sem achados. O teste de EXPLORE verifica leitura acessível, ausência de ação/foco e ausência de navegação; substituiu o teste com seção injetada.
- Correção antecipada de EXPLORE: build aprovado, 12/12 testes passando, detector sem achados e capturas inspecionadas com movimento reduzido em desktop, desktop curto e mobile. Em 1440×900, a coluna passou de aproximadamente 288 px para 405 px, incluindo a seta. Links locais da documentação verificados.

## Próxima ação e limites

Executar o bloco 2 pela Parte III do plano. Conferir em conjunto a assinatura AUGEO maior, o título, a coluna alongada e a primeira tela mobile; evitar tratar a composição atual como resultado final. Depois, seguir os blocos 3–6.

O trabalho atual consolida apenas o hero. Processo, formulário e footer pertencem à continuidade da landing. EXPLORE leva a Processo; o CTA comercial futuro leva ao formulário. São destinos diferentes.

## Leitura por necessidade

- **Retomada e progresso:** este arquivo.
- **Execução do próximo bloco:** Parte II (direção) e Parte III (implementação e aceitação) do [plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md). Parte I e anexos são consulta histórica, técnica e visual.
- **Resumo do produto para a skill:** [PRODUCT.md](../PRODUCT.md).
- **Posicionamento aprofundado:** [CONTEXT.md](CONTEXT.md), quando a tarefa envolver estratégia ou copy além do briefing.
- **Arquitetura da landing:** [02-WEBSITE_SPEC.md](02-WEBSITE_SPEC.md), quando a tarefa envolver outras seções ou entrada comercial.
- **Operação interna:** [03-INTERNAL.md](03-INTERNAL.md); dispensável para refinar o hero.

Preservar alterações locais anteriores à sessão. A auditoria do plano é um baseline histórico; o código e as verificações atuais determinam o estado implementado.
