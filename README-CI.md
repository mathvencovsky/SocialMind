
# GitHub Actions CI (SocialMind)

## Como usar
1. Faça commit desta pasta `.github/workflows/ci.yml` no repositório.
2. Garanta que `eslint`, `prettier`, `vitest` e `@vitejs/plugin-react` estão listados no `devDependencies`.
3. O workflow roda em Node 18 e 20: typecheck, lint, prettier check, testes e build.

## Badge
Substitua `USER` e `REPO` abaixo:
![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)
