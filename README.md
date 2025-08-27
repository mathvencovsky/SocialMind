# SocialMind

![Build](https://img.shields.io/github/actions/workflow/status/YOUR-USERNAME/SocialMind/ci.yml?branch=main)
![Lint](https://img.shields.io/badge/lint-eslint-blue)
![Tests](https://img.shields.io/badge/tests-vitest-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-yellow)

> SocialMind is a platform (in development) for **intelligent social media profile analysis** (influencers and brands).  
> It uses **AI and advanced metrics** to deliver insights about engagement, campaigns, and growth — inspired by tools like Modash.io.

---

## Features (Work in Progress)

- **Profile Dashboard**
  - Followers, average engagement rate (ER), views, and campaigns summary.
  - Compare **organic posts** vs. **sponsored campaigns**.
  - Followers growth chart with peak detection.

- **Profile Comparison**
  - Compare up to two similar profiles in terms of:
    - Followers
    - Engagement rate (ER)
    - Average views
    - Campaigns

- **Campaigns**
  - Register and track executed campaigns.
  - Performance analytics (likes, comments, shares, ER).

- **Audience**
  - Audience segmentation (gender, age, location).
  - Audience quality metrics.

- **Reports**
  - Generate reports comparing **organic content** vs. **sponsored content**.
  - Import from CSV/JSON and export to PDF (in progress).

---

## Tech Stack

- React 18 + Vite
- TypeScript
- TailwindCSS
- Recharts
- Framer Motion
- Vitest
- ESLint (flat) + Prettier
- Husky + lint-staged

---

## Getting Started

```bash
git clone https://github.com/YOUR-USERNAME/SocialMind.git
cd SocialMind
npm install
npm run dev
# open http://localhost:5173
```

---

## Available Scripts

- `npm run dev` → start development server
- `npm run build` → build for production
- `npm run preview` → preview the production build
- `npm run lint` → run ESLint
- `npm run lint:fix` → fix lint issues
- `npm run format` → format with Prettier
- `npm run test` → run unit tests (Vitest)

---

## Project Structure

```
src/
 ├─ components/        # Shared UI components (Card, Button, etc.)
 ├─ features/          # Main features (Profile, Audience, Campaigns, Benchmark, Reports)
 ├─ fixtures/          # Mocked data
 ├─ lib/               # Business logic (analytics)
 ├─ types/             # Domain types
 ├─ utils/             # Helpers (CSV, constants)
 ├─ pages/             # Application pages
 └─ app/               # App root
```

---

## Roadmap

- [x] Initial prototype with tabs
- [x] Profile comparison
- [x] Basic reporting
- [ ] Enhanced CSV/PDF exports
- [ ] Integration with real social media APIs
- [ ] Customizable dashboards
- [ ] Authentication & multi-user support

---

## Contributing

1. Fork the project  
2. Create your feature branch: `git checkout -b feat/my-feature`  
3. Commit your changes: `git commit -m "feat: add my feature"`  
4. Push to the branch: `git push origin feat/my-feature`  
5. Open a Pull Request  

> PRs must pass CI checks (lint + test).

---

## License

MIT © MVP
