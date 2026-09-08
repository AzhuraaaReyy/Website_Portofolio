# AGENTS.md

Single-package React 19 + TypeScript + Vite portfolio SPA (no backend, no tests). All site content is hardcoded, all UI text is in **Indonesian** (`index.html` uses `lang="id"`).

## Commands
- `npm run dev` — Vite dev server (HMR)
- `npm run build` — `tsc -b && vite build` (type-check first, then production bundle to `dist/`)
- `npm run lint` — **oxlint** (not ESLint)
- `npm run preview` — preview the production build
- No test framework/suite configured.

## Architecture
- Content is centralized in `src/data/portfolioData.ts` (profile, skills, projects, timeline) with TypeScript interfaces. Edit that file to change site content, not the components.
- Sections/components: `src/components/` (Navbar, Hero, About, Skills, Projects, Experience, Contact, Footer). 3D/WebGL in `src/components/3d/`; reusable UI/decor in `src/components/ui/`.
- Root `App.tsx` (`src/App.tsx`) manages scroll-spy via `IntersectionObserver`.
- `dist/` is gitignored but left locally (deploy output) — don't rely on it being committed.

## Conventions & quirks
- Tailwind **v4** CSS-based config lives in `src/index.css` via `@theme` tokens (`--color-blueprint-*`, `--font-*`). Use those theme tokens, not raw hex. `tailwind.config.js` is stale v3-style duplication — the real source of truth is `index.css`.
- Custom `@utility` classes (`blueprint-grid`, `grid-size`) are also defined in `src/index.css`.
- `src/App.css` is leftover Vite boilerplate and unused — do not import it.
- Respect `prefers-reduced-motion` via the existing `useReducedMotion` hook (`src/hooks/useReducedMotion.ts`) whenever adding animation.
- Animation stack: Framer Motion + GSAP (ScrollTrigger). 3D via Three.js + `@react-three/fiber`/drei.
- Styling is fairly strict TypeScript (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` in `tsconfig.app.json`) — clean unused vars or `npm run build` fails.
