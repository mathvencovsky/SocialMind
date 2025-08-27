
# SocialMind — All-in-one

- React + Vite + Tailwind + Recharts
- ESLint v9 (flat) + Prettier
- Vitest
- Husky + lint-staged (pre-commit)

## Scripts
- `npm run dev` — desenvolvimento
- `npm run lint` / `npm run lint:fix` — lint
- `npm run format` — formatar com Prettier
- `npm run test` — testes

## Passo a passo
```bash
npm install
npx husky init  # garante hooks em sistemas onde permissão não veio
git init && git add . && git commit -m "init"  # dispara pre-commit nos próximos commits
npm run dev
```
