# Hero — implementação e direção

Base conferida no código em 2026-10-13. Este documento descreve a composição persistente e a direção visual/conceitual do hero. [BACKLOG.md](BACKLOG.md) reúne execução, verificações e trabalho técnico; [HERO_DECISIONS_AND_IDEAS.md](HERO_DECISIONS_AND_IDEAS.md) reúne decisões anteriores, propostas e avaliações pendentes. A arquitetura da landing pertence à [especificação](02-WEBSITE_SPEC.md).

## Conceito e hierarquia

A AUGEO se apresenta pelo contexto do negócio e pela conexão entre marca, website, aquisição e operação digital. O hero cumpre o papel Persuade: mensagem editorial à esquerda e assinatura AUGEO no campo da matriz à direita. A própria composição demonstra direção e execução, sem acrescentar clientes, métricas ou promessas não documentadas.

A linguagem combina **estrutura precisa e comportamento instável**: título sólido e legível, lettering listrado, grade modular e deformação localizada. Símbolo, lettering e fontes locais sustentam a identidade. O moodboard orienta geometria, ritmo e hierarquia; suas imagens não são decoração a ser incorporada à página. As referências estão no [anexo do plano](HERO_AUDIT_AND_IMPROVEMENT_PLAN.md#anexo-c--moodboard-e-rastreabilidade).

Copy aplicada:

- Título: “Presença digital com direção.”, em três linhas.
- Apoio: “O contexto do seu negócio define como conectamos marca, website, aquisição e operação digital.”
- Botão de conversão: “Apresentar negócio”, com destino `#entrada`.

A assinatura gráfica contrapõe o título; o apoio fica agrupado à mensagem, e o indicativo de continuidade ocupa a borda inferior esquerda no desktop. A composição estática mantém a leitura da marca quando o visitante prefere movimento reduzido.

## Composição desktop

A partir de 768 px, o hero usa duas colunas **44/56**, com altura mínima de 100dvh. A coluna textual concentra símbolo, título, apoio e CTA; a matriz ocupa todo o painel direito. Marca, texto, CTA e triângulos compartilham o recuo de **48 px**. O cabeçalho fica absoluto sobre a coluna textual, com altura de 96 px e símbolo de 66 px.

O título usa Hanken Grotesk local, peso **620**, entrelinha **1,02** e tracking **−0,035em**. A escala responde à largura útil da coluna (`clamp(2rem, 19.5cqw, 6rem)`), com três spans, largura máxima de 11ch e 2 px inferiores para os descendentes. O apoio usa entrelinha 1,5, largura máxima de 34ch e escala de 18–24 px; janelas curtas têm ajustes próprios de escala e espaçamento.

O painel textual tem iluminação radial branca de 2% sobre o fundo do tema, com divisória vertical de 1 px. O CTA usa cores invertidas do tema, foco laranja, brilho no hover e redução de escala ao pressionar. Permanece em linha única no desktop.

## Composição mobile

Abaixo de 768 px, cabeçalho e hero seguem fluxo vertical. O cabeçalho tem 70 px, símbolo de 58 px e recuo de 20 px. A copy usa recuos simétricos de 20 px; título, apoio e CTA antecedem a matriz. O CTA fica visível, com altura mínima de 44 px e margem superior de 24 px.

A matriz inteira foi reposicionada como **footer visual do hero mobile**, de largura integral e altura `clamp(140px, 22dvh, 180px)`, com divisória superior de 1 px e margem automática acima. O lettering fica centralizado nesse painel e usa `min(85%, 360px)`. `touch-action: pan-y` permite rolagem vertical pela área da matriz.

A superfície da copy se estende pelos 70 px do cabeçalho: um único fundo cobre símbolo e texto até a matriz, sem reiniciar a iluminação na divisão entre cabeçalho e hero. O indicativo de triângulos fica oculto no mobile.

## Temas e marca

| Elemento | Claro | Escuro |
| --- | --- | --- |
| Fundo | `#f7f7f5` | `#06070a` |
| Texto | `#111111` | `#f7f7f5` |
| Apoio/repouso do indicativo | `#61615d` | `#9e9ea2` |
| Bordas | preto a 8% | branco a 8% |
| Acento/foco | `#ff482c` | `#ff482c` |

A preferência do sistema e as classes explícitas `.light`/`.dark` controlam os temas. No escuro, o símbolo é invertido com opacidade 0,92 e o lettering com opacidade 0,88. O fundo CSS da matriz usa o token do tema; o canvas desenha sua superfície correspondente. A camada CRT do hero tem scanlines mais discretas que as da demo: 0,03 no claro e 0,0567 no escuro.

O lettering preserva geometria, proporção, listras e contra-formas. No SVG, “A” e “O” declaram `fill-rule="evenodd"` diretamente nos caminhos preenchidos pelo padrão CRT. No desktop, sua largura é `min(88%, 680px)`; o centro vertical acompanha o centro do título, medido no hero e publicado em `--hero-heading-center-y`. O alinhamento observa hero, título, apoio e CTA. No mobile, o centro é o da matriz.

## Matriz e interação persistentes

`KineticMatrix` continua um componente compartilhado, com demo em `?demo=matrix`. O hero passa `title="AUGEO"`, `titleArtworkSrc`, `enableArtworkMotion` e `gridSpacing={72}`; o padrão da demo é 58 px. A grade adapta o espaçamento às dimensões disponíveis, preservando nós e ligações no campo visível.

A composição reativa em hover já está implementada: grade e lettering respondem ao mesmo campo de ponteiro e ondas, com escala própria para a imagem. O ponteiro também é acompanhado no ancestral `.hero`, incluindo a coluna esquerda; clique/toque produz uma onda. Ao encerrar a interação, a deformação converge ao repouso sem rebote. O warp usa um mapa horizontal comum às scanlines para evitar ruptura das letras, com deslocamento máximo de 6 px e diferença máxima de 2 px entre amostras de 8 px.

O ciclo atual da matriz mantém pulsos automáticos contínuos, além das respostas pontuais. Pausa fora da tela e com documento oculto; movimento reduzido mantém grade e lettering estáticos. Rótulos técnicos `0x…` ainda aparecem após inspeção prolongada de um nó.

## Indicativo de continuidade

Dois triângulos sólidos transmitem direção descendente no desktop: cada um mede 36×27 px, com o segundo 18 px abaixo do primeiro e sobreposição de 9 px. O conjunto de 36×45 px fica centralizado no contêiner de 36×63 px. SVGs separados garantem que a ponta ativa seja pintada integralmente na interseção.

Uma passagem ocorre a cada **2,8 s**, com defasagem de **980 ms** entre os triângulos. O ciclo CSS de 5,6 s contém duas passagens: superior claro/inferior escuro, depois superior escuro/inferior claro, usando `#e2e2df` e `#20201f`. Os atrasos iniciais são 300/1280 ms. A mudança afeta fill e ordem de pintura, mantendo a geometria imóvel. Pausa fora da tela/aba oculta conserva tempo e fase; movimento reduzido usa cinza estático.

O indicativo atual é decorativo, `aria-hidden`, sem clique ou foco. Seu sentido é continuidade por scroll; o CTA comercial tem outra função. EXPLORE e a seta anterior não fazem parte do hero implementado. O CTA aponta para `#entrada`; essa seção ainda não existe na aplicação atual.

## Fontes da implementação

- [src/App.tsx](../src/App.tsx): estrutura, copy, CTA, props e alinhamento.
- [src/styles.css](../src/styles.css): composição, temas, tipografia e animação do indicativo.
- [src/components/ScrollCue.tsx](../src/components/ScrollCue.tsx): triângulos e pausa/retomada.
- [components/ui/kinetic-matrix.tsx](../components/ui/kinetic-matrix.tsx) e [lib/matrix-motion.ts](../lib/matrix-motion.ts): grade, campo de interação e warp.
- [src/assets/augeo-lettering.svg](../src/assets/augeo-lettering.svg): marca listrada e contra-formas.
