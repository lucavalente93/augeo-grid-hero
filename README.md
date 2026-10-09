# AUGEO

Protótipo da landing em React, TypeScript e Vite. Use **Bun 1.4.0** para instalar dependências e executar as ferramentas do projeto.

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

- `src/`: aplicação, estilos e assets.
- `components/` e `lib/`: matriz compartilhada, demonstração e utilitários.
- `tests/`: regressões da matriz e do indicador de triângulos.
- `docs/`: produto, especificação e registros de implementação.

Consulte [AGENTS.md](AGENTS.md) para a rotina de trabalho e [o handoff do hero](docs/HERO_HANDOFF.md) para o estado atual.
