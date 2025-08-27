
# 🌐 SocialMind

![Build](https://img.shields.io/github/actions/workflow/status/SEU-USUARIO/SocialMind/ci.yml?branch=main)
![Lint](https://img.shields.io/badge/lint-eslint-blue)
![Tests](https://img.shields.io/badge/tests-vitest-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

> 🚀 Plataforma em desenvolvimento para **análise inteligente de perfis de redes sociais** (influenciadores e empresas), utilizando **IA e métricas avançadas** para oferecer insights de engajamento, campanhas e crescimento — inspirado em ferramentas como Modash.io.

---

## ✨ Funcionalidades (em andamento)

- 📊 **Dashboard de Perfil**
  - Resumo de seguidores, engajamento médio (ER), visualizações e número de campanhas.
  - Comparação entre posts **orgânicos** e de **campanha**.
  - Gráfico de crescimento de seguidores com identificação de picos.

- 🔍 **Comparação de Perfis**
  - Compare até dois perfis semelhantes em métricas de:
    - Seguidores
    - Engajamento (ER)
    - Visualizações médias
    - Campanhas ativas

- 📈 **Campanhas**
  - Registro e visualização de campanhas executadas.
  - Análise de performance (likes, comentários, shares, ER).

- 🧑‍🤝‍🧑 **Audiência**
  - Segmentação de seguidores (gênero, idade, localização).
  - Métricas de qualidade da audiência.

- 📑 **Relatórios**
  - Geração de relatórios comparativos entre **conteúdo orgânico** e **patrocinado**.
  - Import de CSV/JSON e exportação para PDF (em progresso).

---

## 🛠️ Tecnologias Utilizadas

- React 18 + Vite
- TypeScript
- TailwindCSS
- Recharts
- Framer Motion
- Vitest
- ESLint (flat) + Prettier
- Husky + lint-staged

---

## 🚀 Como rodar localmente

```bash
git clone https://github.com/SEU-USUARIO/SocialMind.git
cd SocialMind
npm install
npm run dev
# abre http://localhost:5173
```

---

## 🧪 Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build produção
- `npm run preview` — preview do build
- `npm run lint` — checagem ESLint
- `npm run lint:fix` — correções automáticas
- `npm run format` — Prettier
- `npm run test` — testes unitários (Vitest)

---

## 📂 Estrutura

```
src/
 ├─ components/          # UI compartilhada
 ├─ features/            # Módulos (Profile, Audience, Campaigns, Benchmark, Reports)
 ├─ fixtures/            # Dados mockados
 ├─ lib/                 # Regras de negócio (analytics)
 ├─ types/               # Tipos de domínio
 ├─ utils/               # Helpers (CSV, constantes)
 ├─ pages/               # Páginas (Dashboard)
 └─ app/                 # App root
```

---

## 📌 Roadmap

- [x] Protótipo com abas
- [x] Comparador de perfis
- [x] Relatórios Orgânico x Campanha
- [ ] Exportações CSV/PDF aprimoradas
- [ ] Integração com APIs reais
- [ ] Dashboard customizável
- [ ] Autenticação / espaços de trabalho

---

## 🤝 Contribuindo

1. Faça fork
2. Crie sua branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: descrição"`
4. Push: `git push origin feat/minha-feature`
5. Abra um PR

> Dica: PRs devem passar na pipeline (lint + test).

---

## 📜 Licença

MIT © MVP
