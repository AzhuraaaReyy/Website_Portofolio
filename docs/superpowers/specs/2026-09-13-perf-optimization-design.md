# Design Spec: Performance Optimization

> Status: APPROVED (user memilih **Pendekatan C** — lazy sections + vendor split + optimasi font/reflow)

## Context

Lighthouse desktop pada dev server (`localhost:5173`) menunjukkan performa rendah:

| Metric | Nilai |
| --- | --- |
| Performance | 30% |
| FCP | 22.0s |
| LCP | 46.1s |
| TBT | 600ms |
| Speed Index | 31.5s |
| CLS | 0 |

Diagnosis utama (angka dev server — over-estimasi, tapi struktur masalahnya nyata di produksi):

- **Bundle raksasa:** 3.9MB (1.3MB gzip) via satu entry — `react-icons/si` (13MB dev), `drei` (10MB dev), `three` (5.7MB dev).
- **LCP jauh:** `h1` di Hero ditahan ~18.7s oleh render element; network chain `card.glb` 2.4MB memakan 17.9s.
- **Forced reflow:** `Navbar` membaca `offsetTop` di setiap scroll event (129ms).
- **8 REST calls** ke `api.github.com/repos?per_page=100&type=all` (dev fallback tanpa token).
- **Render-blocking Google Fonts** via `@import` di `index.css`.

## Goal

Menurunkan beban awal halaman tanpa mengubah desain sama sekali (desain final).

## Cakupan (Task ID)

1. **Vendor code-splitting** (`vite.config.ts`) — grup vendor dikelompokkan (react/three/gsap/animation/icons/common) via `build.rolldownOptions.output.codeSplitting.groups`.
2. **Font & resource hints** (`index.html` + `index.css`) — hapus `@import` Google Fonts render-blocking; tambah preconnect dan `link rel=stylesheet` font. `--font-mono` tetap self-hosted via Fontsource (`JetBrains Mono Variable`) — **pastikan tidak dobel-load**.
3. **Lazy-load section** — buat `LazySection` + `SectionSkeleton`, `App.tsx` pakai `React.lazy` untuk semua section kecuali Navbar/Hero/Footer.
4. **Hapus forced reflow Navbar** — scroll-spy pindah ke observer di `LazySection`; Navbar cukup `setScrolled` dengan rAF-throttle.
5. **Hero 3D lazy internal** — `ParticleCanvas` dibungkus `React.lazy` + `Suspense` fallback kosong, sehingga three-vendor tidak menghalangi LCP `h1`.
6. **Defer fetch GitHub** — `useGithubStats` muat cache dulu, jaringan ditunda sampai `requestIdleCallback` (fallback `setTimeout`).
7. **Hentikan alokasi per-frame** di `MorphingParticles` — reuse buffer morph target.
8. **Verifikasi akhir + dokumentasi** — build, lint, sanity `vercel dev` — **tanpa commit** (user commit sendiri).

## Non-Goals

- Tidak ada backend baru, tidak ada perubahan konten (`portfolioData.ts` tak disentuh).
- Tidak mengubah desain visual/animasi.
- Tidak membuat branch/worktree; tidak commit.
- Tidak menghapus layer fallback REST GitHub (behaviour lama dipertahankan).

## Constraints Konkret

- React 19 + TS strict (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`) — build gagal jika ada unused var.
- Vite 8/Rolldown: `manualChunks` legasi **tidak dipakai**; pakai `build.rolldownOptions.output.codeSplitting.groups` (field `priority`).
- `chunkSizeWarningLimit: 1400` (three-vendor di atas itu wajar hingga Task 5 efektif).
- Tailwind v4: theme tokens dari `src/index.css`, jangan pakai hex raw.
- Semua teks UI tetap Bahasa Indonesia; `lang="id"`.
- Skeleton harus memakai `blueprint-grid`/`grid-size` custom `@utility` agar estetika konsisten.
- Semua animasi baru hormati `prefers-reduced-motion` (`useReducedMotion`).

## Layout Sebelum vs Sesudah (konkret)

### `src/index.html` — tambah di `<head>`:
- `<link rel="preconnect" href="https://fonts.googleapis.com">`
- `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- `<link rel="preconnect" href="https://api.github.com">`
- `<link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net">`
- 2 `<link rel="stylesheet">` (Inter+Space Grotesk; Chakra Petch+Orbitron+Rajdhani+Share Tech Mono) — **tanpa JetBrains Mono** di daftar Google.

### `src/index.css` — hapus line 1–2 (`@import` Google Fonts). Pertahankan Fontsource JetBrains Mono dan override `--font-mono: "JetBrains Mono Variable"` di `@theme inline`.

### `vite.config.ts` — `codeSplitting.groups`:
- react-vendor (priority 30): react, react-dom, react-dom/client, react/jsx-runtime
- three-vendor (priority 20): three, @react-three/fiber, @react-three/drei
- gsap-vendor (priority 15): gsap, @gsap/react
- animation-vendor (priority 14): framer-motion, motion
- icons-vendor (priority 12): lucide-react, react-icons
- common (minShareCount 2, minSize 15000, priority 5)

### `src/components/ui/LazySection.tsx` (baru)
Props: `id`, `minHeight?`, `children`, `onActive?`, `forceActive?`, `eager?`.
Dua `IntersectionObserver` pada wrapper:
1. load-trigger: `rootMargin: "600px 0px"` → `setLoaded(true)`.
2. scroll-spy: `rootMargin: "-30% 0px -50% 0px", threshold: 0.1` → `onActive(id)` bila intersect; `forceActive` bypass.
`id` ditaruh di wrapper **hanya jika belum loaded** (supaya anchor/querySelector `#about` tetap bekerja), setelah loaded `id` dihapus — section asli (yang punya id sendiri) jadi target.

### `src/components/ui/SectionSkeleton.tsx` (baru)
Props: `minHeight?` (default `min-h-[70vh]`). Elemen div kelas `blueprint-grid grid-size animate-pulse ...` dengan `style={{ contentVisibility: "auto", containIntrinsicSize: "auto 70vh" }}`, `aria-hidden="true"`, pointer-events none.

### `src/App.tsx` (rewrite)
- Eager: `Navbar`, `Hero`, `Footer`.
- `React.lazy` via `.then((m) => ({ default: m.X }))` untuk: About, Skills, Projects, Stats, Experience, Contact.
- Hero dibungkus `<LazySection id="home" eager>`.
- Stats menerima `summary/loading/error/hasStaleData/onRetry` dari `useGithubStats` di App, diteruskan ke children render prop.
- Scroll-spy global App DIHAPUS (digantikan LazySection observer per-section).
- `main` membungkus semua `LazySection`.

### `src/components/Navbar.tsx` (modify)
- Hapus loop `offsetTop` di `handleScroll` (sumber forced reflow 129ms).
- Efek scroll hanya `setScrolled(window.scrollY > 20)` dengan rAF-throttle.
- Hapus `navLinks` dari dependency effect → fix oxlint exhaustive-deps warning (Navbar.tsx:101).

### `src/components/Hero.tsx` (modify)
- Ganti `import { ParticleCanvas }` statis dengan `const ParticleCanvas = lazy(() => import("./3d/ParticleCanvas").then((m) => ({ default: m.ParticleCanvas })))`.
- Bungkus `<ParticleCanvas>` dalam `<Suspense fallback={<div absolute inset-0 pointer-events-none aria-hidden />}>` agar layout identik saat chunk three-vendor dimuat.

### `src/hooks/useGithubStats.ts` (modify)
- Baca cache tetap sinkron (sebelum jaringan).
- Jaringan via `requestIdleCallback` (fallback `setTimeout(∞, 0)`). Cleanup membatalkan idle/timeout + `cancelled` flag.

### `src/components/3d/MorphingParticles.tsx` (modify)
- `const morphTarget = useMemo(() => new Float32Array(particleCount * 3), [particleCount])`.
- Di `useFrame`, tulis lerp langsung ke `morphTarget`, `target = morphTarget` — tanpa `new Float32Array` per-frame.

## Unchanged
- `portfolioData.ts`, `levelingConfig.ts`, `levelingEngine.ts`, `githubApi.ts`, `api/leveling.ts`, `.env.example`, komponen lain (About/Skills/Projects/Stats/Experience/Contact/Footer) kecuali yang tercantum di atas.
- Behaviour scroll-spy Navbar (menu tetap highlight benar via props).