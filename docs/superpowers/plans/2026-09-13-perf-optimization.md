# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menurunkan beban awal portofolio (Lighthouse desktop 30%) melalui vendor code-splitting, lazy-load section, optimasi font, dan penghapusan forced reflow — tanpa mengubah desain.

**Architecture:** Chunk statis dipecah ke grup vendor via Rolldown `codeSplitting.groups`; section dirender on-demand dengan `LazySection` (IntersectionObserver + Suspense). Scroll-spy dipindah dari `offsetTop` per-scroll ke observer; 3D & fetch GitHub didefer agar tidak menahan first paint.

**Tech Stack:** Vite 8 (Rolldown), React 19, TypeScript strict, Tailwind v4, oxlint.

**Spec:** `docs/superpowers/specs/2026-09-13-perf-optimization-design.md`

## Global Constraints

- React 19 + TS strict (`noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`) — build gagal jika ada unused variable.
- Vite 8/Rolldown: pakai `build.rolldownOptions.output.codeSplitting.groups` (field `priority`); JANGAN pakai `manualChunks` legasi.
- `chunkSizeWarningLimit: 1400`; warning ukuran chunk diperbolehkan (three-vendor 3.2MB wajar hingga Task 5).
- Semua teks UI Bahasa Indonesia; `lang="id"`.
- Skeleton memakai `blueprint-grid`/`grid-size` custom `@utility` dari `src/index.css`.
- Animasi baru hormati `prefers-reduced-motion` via `useReducedMotion`.
- **TIDAK commit, TIDAK membuat branch/worktree** — eksekusi di branch aktif; user commit sendiri.
- Design final: tidak ada perubahan visual/animasi yang terlihat pengguna.
- Verifikasi tiap task: `npm run build` (type-check dulu) dan `npm run lint`.

---

### Task 1: Vendor Code-Splitting di `vite.config.ts`

**Files:**
- Modify: `vite.config.ts`

**Produces:** Chunk terpisah: `react-vendor`, `three-vendor`, `gsap-vendor`, `animation-vendor`, `icons-vendor`, plus grup `common` untuk modul kecil berbagi >1.

- [ ] **Step 1: Rewrite `build.rolldownOptions.output.codeSplitting.groups`**

Ganti blok konfigurasi build dengan:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1400,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/(react|react-dom)(\/|$)/,
              priority: 30,
            },
            {
              name: "three-vendor",
              test: /node_modules\/(three|@react-three\/fiber|@react-three\/drei)(\/|$)/,
              priority: 20,
            },
            {
              name: "gsap-vendor",
              test: /node_modules\/(gsap|@gsap\/react)(\/|$)/,
              priority: 15,
            },
            {
              name: "animation-vendor",
              test: /node_modules\/(framer-motion|motion)(\/|$)/,
              priority: 14,
            },
            {
              name: "icons-vendor",
              test: /node_modules\/(lucide-react|react-icons)(\/|$)/,
              priority: 12,
            },
            {
              name: "common",
              minShareCount: 2,
              minSize: 15000,
              priority: 5,
            },
          ],
        },
      },
    },
  },
});
```

- [ ] **Step 2: Verifikasi**

Run: `npm run build`
Expected: PASS; kolom daftar `dist/assets/*.js` menampilkan chunk `react-vendor-*`, `three-vendor-*`, `gsap-vendor-*`, `animation-vendor-*`, `icons-vendor-*`. `three-vendor` masih besar (~3.2MB) — wajar hingga Task 5.

---

### Task 2: Font & Resource Hints

**Files:**
- Modify: `src/index.css` (hapus baris 1–2 `@import` Google Fonts)
- Modify: `src/index.html` (tambah preconnect + 2 stylesheet link)

**Consumes:** Task 1 infrastruktur (tidak wajib untuk task ini).

- [ ] **Step 1: Hapus Google Fonts `@import` dari `index.css`**

Hapus dua baris paling atas `src/index.css` yang berbentuk `@import url("https://fonts.googleapis.com/css2?family=...")`. Pertahankan import Fontsource (`@import "@fontsource/jetbrains-mono/...";`) yang menyusul — ini penyedia `--font-mono`.

- [ ] **Step 2: Pastikan `--font-mono` tanpa dobel-load**

Di `src/index.css`, cek blok `@theme inline` memiliki `--font-mono: "JetBrains Mono Variable", ...applied...` (Fontsource menyediakan family `JetBrains Mono Variable`). Jika masih memakai `"JetBrains Mono"` untuk fallback, biarkan — variabel Fontsource adalah sumber utama.

- [ ] **Step 3: Tambah preconnect & stylesheet di `index.html`**

Di dalam `<head>` (sebelum CSS), tambahkan:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://api.github.com" />
<link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap"
/>
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
/>
```

Catatan: JetBrains Mono TIDAK di daftar Google (self-hosted via Fontsource). Chakra Petch/Orbitron/Rajdhani/Share Tech Mono tidak dipakai komponen (hanya `App.css` yang tidak diimpor) tapi dipertahankan agar desain aman.

- [ ] **Step 4: Verifikasi**

Run: `npm run build`
Expected: PASS; tidak ada error terkait font.

---

### Task 3: Lazy-Load Section

**Files:**
- Create: `src/components/ui/SectionSkeleton.tsx`
- Create: `src/components/ui/LazySection.tsx`
- Modify: `src/App.tsx` (rewrite)

**Consumes:** Task 1, Task 2.

**Produces:**
- `SectionSkeleton` props: `{ minHeight?: string }`
- `LazySection` props: `{ id: string; minHeight?: string; eager?: boolean; onActive?: (id: string) => void; forceActive?: boolean; children: ReactNode }`
- `App.tsx` mengekspor `App` component; Navbar menerima prop `activeSection` berupa `string`.

- [ ] **Step 1: Buat `src/components/ui/SectionSkeleton.tsx`**

```tsx
interface SectionSkeletonProps {
  minHeight?: string;
}

export function SectionSkeleton({
  minHeight = "min-h-[70vh]",
}: SectionSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-full blueprint-grid grid-size ${minHeight} animate-pulse`}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 70vh",
      }}
    />
  );
}
```

- [ ] **Step 2: Buat `src/components/ui/LazySection.tsx`**

```tsx
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { SectionSkeleton } from "./SectionSkeleton";

interface LazySectionProps {
  id: string;
  minHeight?: string;
  eager?: boolean;
  onActive?: (id: string) => void;
  forceActive?: boolean;
  children: ReactNode;
}

export function LazySection({
  id,
  minHeight,
  eager = false,
  onActive,
  forceActive = false,
  children,
}: LazySectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(eager);

  useEffect(() => {
    if (loaded || eager) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded, eager]);

  useEffect(() => {
    if (!onActive) return;
    const el = wrapRef.current;
    if (!el) return;

    if (forceActive) {
      onActive(id);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loaded, forceActive, onActive, id]);

  return (
    <div ref={wrapRef} id={loaded ? undefined : id}>
      {loaded ? (
        <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `src/App.tsx`**

Pola (baca dulu `App.tsx` saat ini untuk mempertahankan `useGithubStats` + render Stats):

```tsx
import { lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { LazySection } from "./components/ui/LazySection";
import { useGithubStats } from "./hooks/useGithubStats";

const About = lazy(() =>
  import("./components/About").then((m) => ({ default: m.About })),
);
// ... sama untuk Skills, Projects, Stats, Experience, Contact
```

Rendеr utama:

```tsx
export function App() {
  const [activeSection, setActiveSection] = useState("home");
  const githubStats = useGithubStats();

  return (
    <>
      <Navbar activeSection={activeSection} />
      <main>
        <LazySection id="home" eager>
          <Hero />
        </LazySection>
        <LazySection id="about" onActive={setActiveSection}>
          <About />
        </LazySection>
        {/* ... Skill, Projects, dsb, masing-masing id sesuai section.id-nya */}
        <LazySection id="statistik" onActive={setActiveSection}>
          <Stats {...githubStats} />
        </LazySection>
      </main>
      <Footer />
    </>
  );
}
```

Perhatian:
- Bagian yang dirender ke `Navbar` harus eksplisit `Navbar` menerima prop `activeSection` (cek signature saat ini).
- Hapus `useEffect`/`IntersectionObserver` scroll-spy lama di App (digantikan LazySection).
- Pastikan tidak ada unused imports (TS strict bisa gagal).
- `Stats` di-render sebagai anak `<Suspense>` di dalam `LazySection`, props sesuai `useGithubStats()`: `{ summary, loading, error, hasStaleData, retry }`.

- [ ] **Step 4: Verifikasi**

Run: `npm run build`
Expected: PASS. Tambahan: `dist/index.html` hanya merefer entry `index-*.js`; chunk `About-*.js`, `Skills-*.js`, `Stats-*.js`, `Projects-*.js`, `Experience-*.js`, `Contact-*.js` terpisah di `dist/assets/`.

---

### Task 4: Hilangkan Forced Reflow Navbar

**Files:**
- Modify: `src/components/Navbar.tsx` (effect scroll)

**Consumes:** Task 3 (Navbar menerima `activeSection`).

- [ ] **Step 1: Ganti effect scroll**

Di `Navbar.tsx`, hapus `navLinks` dari deps dan loop `offsetTop`. Ganti body effect menjadi:

```tsx
useEffect(() => {
  let ticking = false;

  const handleScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setScrolled(window.scrollY > 20);
      ticking = false;
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

- [ ] **Step 2: Verifikasi**

Run: `npm run lint`
Expected: PASS tanpa warning. (Warning oxlint `exhaustive-deps` di `Navbar.tsx:101` harus lenyap karena `navLinks` tidak lagi deps effect.)

Run: `npm run build`
Expected: PASS.

---

### Task 5: Hero 3D Lazy Internal

**Files:**
- Modify: `src/components/Hero.tsx`

**Consumes:** Task 3 (Hero dalam `LazySection eager`).

- [ ] **Step 1: Ganti import `ParticleCanvas` dengan lazy**

```tsx
import { lazy, Suspense } from "react";

const ParticleCanvas = lazy(() =>
  import("./3d/ParticleCanvas").then((m) => ({ default: m.ParticleCanvas })),
);
```

- [ ] **Step 2: Bungkus render dengan Suspense**

```tsx
<Suspense
  fallback={
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  }
>
  <ParticleCanvas scrollProgress={scrollProgress} />
</Suspense>
```

- [ ] **Step 3: Verifikasi**

Run: `npm run build`
Expected: PASS; chunk `three-vendor-*.js` + `ParticleCanvas-*.js` di daftar asset, dan `h1` LCP tidak lagi ditunda oleh three-vendor (di produksi, chunk di-import setelah commit H1).

---

### Task 6: Defer Fetch GitHub

**Files:**
- Modify: `src/hooks/useGithubStats.ts`

**Consumes:** Task 3 (Stats di-load on-demand; hook dipanggil di App).

- [ ] **Step 1: Defer jaringan ke idle**

Di dalam `useEffect([attempt])` hook, `run()` tetap sama, tapi panggilannya diganti:

```tsx
let idleId: number | undefined;
let timeoutId: ReturnType<typeof setTimeout> | undefined;
const schedule = () => run();

if (typeof window.requestIdleCallback === "function") {
  idleId = window.requestIdleCallback(schedule);
} else {
  timeoutId = setTimeout(schedule, 0);
}

return () => {
  cancelled = true;
  if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
    window.cancelIdleCallback(idleId);
  }
  if (timeoutId !== undefined) clearTimeout(timeoutId);
};
```

(Perhatikan: `run()` sudah set `cancelled` false di awal scope effect — pastikan flag masih ada.)

- [ ] **Step 2: Verifikasi**

Run: `npm run build`
Expected: PASS. Perilaku: cache fresh langsung tampil (sync), refresh jaringan menyusul saat idle.

---

### Task 7: Hentikan Alokasi Per-Frame di `MorphingParticles`

**Files:**
- Modify: `src/components/3d/MorphingParticles.tsx`

**Consumes:** Task 5 (chunk 3D diisi morphing).

- [ ] **Step 1: Tambah buffer reuse**

Setelah `initialPositions` `useMemo`:

```tsx
const morphTarget = useMemo(() => {
  return new Float32Array(particleCount * 3);
}, [particleCount]);
```

- [ ] **Step 2: Tulis lerp ke buffer reuse**

Di `useFrame`, ganti tiga cabang morph agar target memakai `morphTarget` dan `target = morphTarget;` (bukan `new Float32Array`). Contoh cabang pertama:

```tsx
const t = scrollProgress / 0.33;
for (let i = 0; i < particleCount * 3; i++) {
  morphTarget[i] = THREE.MathUtils.lerp(spherePos[i], dbPos[i], t);
}
target = morphTarget;
```

Lakukan sama untuk cabang kedua (`dbPos→reactPos`) dan ketiga (`reactPos→gridPos`, `t = Math.min(1, (scrollProgress - 0.66) / 0.34)`).

- [ ] **Step 3: Verifikasi**

Run: `npm run build`
Expected: PASS; tidak ada alokasi `new Float32Array` di `useFrame`.

---

### Task 8: Verifikasi Akhir & Dokumentasi

**Files:**
- Create: `docs/superpowers/specs/2026-09-13-perf-optimization-design.md`
- Create: `docs/superpowers/plans/2026-09-13-perf-optimization.md`

**Consumes:** semua task di atas.

- [ ] **Step 1: Tulis dokumen spec**

Salin isi dari dokumen desain yang disetujui (Approach C) ke `docs/superpowers/specs/2026-09-13-perf-optimization-design.md`.

- [ ] **Step 2: Tulis dokumen plan**

Dokumen ini (`docs/superpowers/plans/2026-09-13-perf-optimization.md`) dengan seluruh task di atas.

- [ ] **Step 3: Verifikasi penuh**

Run: `npm run lint`
Expected: PASS (0 warning).

Run: `npm run build`
Expected: PASS; `built in ...`.

- [ ] **Step 4: Sanity `${npx vercel dev}` (opsional, bila Vercel CLI & token tersedia)**

Run: `npx vercel dev` lalu buka `http://localhost:3000` (atau port yang dipilih) — pastikan halaman render tanpa error dan statistik GitHub sinkron (2xx).

- [ ] **Step 5: Lihat status git (JANGAN commit)**

Run: `git status --short`
Expected: daftar file termodifikasi (vite.config.ts, index.html, index.css, App.tsx, Navbar.tsx, Hero.tsx, useGithubStats.ts, MorphingParticles.tsx + 2 file baru ui/* + docs). **Tidak di-stage, tidak di-commit** — serahkan ke user.