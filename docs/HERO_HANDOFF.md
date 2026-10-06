# Hero — handoff

## PRONTO

- Composição responsiva do hero com o grid interativo e o lettering AUGEO.
- Grid e lettering reagem ao hover e à onda de clique ou toque. O lettering preserva as linhas de CRT, as hastes e o vão do “A” durante a deformação, e retorna exatamente à imagem original.
- Versão estática para `prefers-reduced-motion`. Os estados claro, escuro, desktop e mobile foram verificados; build e testes passaram.

## PENDENTE NO HERO

- Conectar **“EXPLORE AQUI”** à próxima seção de conteúdo quando ela existir. O botão já procura a seção seguinte e rola até ela por clique, toque ou teclado.

## IMPLEMENTADO NESTA ETAPA

- Removido o CTA desabilitado “Falar com a Augeo”.
- Adicionado **“EXPLORE AQUI”** no canto inferior esquerdo da parte clara do hero, com uma letra por linha e espaço entre as palavras.
- Letras renderizadas como texto em Share Tech Mono, com uma por linha, e faixa estreita de opacidade que percorre a coluna sem glow. A faixa para em `prefers-reduced-motion`.
- Título e texto de apoio usam Hanken Grotesk local. O título é sólido, em peso 700, para contrastar com o lettering AUGEO listrado/CRT; Archivo está incorporada como alternativa para o título caso a composição mude.
- As fontes são hospedadas localmente, com suas licenças em `src/assets/fonts/`.

## REFERÊNCIA VISUAL

- Pôster BRUTALISMUS: `/home/luca/augeo/modular-bw-landing/src/moodboard-modular/11_240492466_1645658692307797_1961337462483073695_....jpg`.
