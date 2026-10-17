# AUGEO

Protótipo da landing em React, TypeScript e Vite. Use **Bun 1.4.0** para instalar dependências e executar as ferramentas do projeto.

Website atual informado pelo usuário: [www.augeocreative.com](https://www.augeocreative.com). A publicação existente ainda não inclui Processo e formulário de entrada.

## Instalação e desenvolvimento

```sh
bun install --frozen-lockfile
bun run dev
```

Abra `http://localhost:5173`. A demonstração independente da matriz fica em `http://localhost:5173/?demo=matrix`.

## Build e preview

```sh
bun run build
bun run preview
```

## Testes

```sh
bunx --bun playwright install chromium
bun run test
```

`bun run test` executa a suíte Playwright e inicia Vite na porta 5173 quando não existe um servidor disponível. Para usar um Chromium já instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com o caminho do executável.

O `bunfig.toml` força o runtime Bun nos scripts e nos executáveis chamados por eles. Os tipos `@types/node` e o import `node:url` atendem às APIs compatíveis usadas pelo Vite; não exigem um runtime Node.js separado. `bun.lock` é o único lockfile do projeto.

## Organização e continuidade

- `src/`: aplicação, estilos e assets; `components/` e `lib/`: matriz compartilhada, demo e utilitários.
- `tests/`: regressões da matriz, layout do hero e triângulos.
- `docs/`: fontes por responsabilidade — agência, resumo do produto, requisitos do website, hero, procedimentos e fila.
- `docs/archive/`: evidências históricas e auditoria original, consultadas por necessidade.
- `docs/refs/`: ZIP e captura histórica; PNGs Figma locais ainda não rastreados. Moodboard e estudos da marca ficam em `src/assets/`.

Comece por [AGENTS.md](AGENTS.md) para o mapa de fontes, ou pelo [backlog](docs/BACKLOG.md) para a fila. O resumo da skill permanece em `docs/PRODUCT.md`. O protótipo anterior HTML/JavaScript foi retirado; aplicação e demo são as entradas atuais. Guia pessoal e `.codex/` continuam locais e ignorados pelo Git.

A organização documental prepara a futura orquestração Antigravity/Codex. As duas referências arquiteturais são contexto conceitual; nenhum armazenamento global ou mecanismo de orquestração foi instalado.
