
# Patch ESLint: Como aplicar

1. **Apague** o arquivo `.eslintignore` da raiz do projeto (ESLint 9 não usa mais esse arquivo; já temos `ignores` no `eslint.config.js`).
2. Extraia este zip **por cima** do seu projeto SocialMind, substituindo os arquivos:
   - `src/components/ui/select.tsx`
   - `src/lib/analytics.ts`
   - `src/features/benchmark/BenchmarkSection.tsx`
   - `src/features/profile/ProfileSection.tsx`
   - `src/features/reports/ReportsSection.tsx`
   - `src/lib/__tests__/analytics.test.ts`
   - `src/utils/csv.ts`
3. Rode:
   ```bash
   npm run lint:fix
   npm run test
   npm run dev
   ```
