# Sistem Leveling (EXP & Level) Implementation Plan

> **Untuk agentic workers:** SUB-SKILL WAJIB: Gunakan superpowers:subagent-driven-development (disarankan) atau superpowers:executing-plans untuk mengimplementasikan plan ini tugas-per-tugas. Steps memakai checkbox (`- [ ]`).

**Goal:** Menambahkan sistem leveling (level 1–100) ke portfolio SPA yang menghitung EXP dari repositori GitHub publik (base + EXP bahasa), menampilkan HUD di Navbar dan section baru "Stats".

**Architecture:** Fetch data repositori + bahasa via GitHub REST API di satu custom hook (`useGithubStats`), hitung semua angka via modul fungsi murni (`levelingEngine.ts`) yang agnostik React. `App.tsx` memanggil hook sekali dan meneruskan data via props ke `Navbar` dan `Stats` (pola yang sama seperti `activeSection`). Gaya UI mengikuti RPG/HUD yang sudah ada (amber/teal, font mono, skew `-10deg`).

**Tech Stack:** React 19, TypeScript (strict: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`), Vite 8, Tailwind v4 (tokens `--color-blueprint-*`), Framer Motion, lucide-react, hook `useReducedMotion`.

**Spec:** `docs/superpowers/specs/2026-09-11-leveling-system-design.md`

## Global Constraints

- **TIDAK melakukan commit** dan **TIDAK membuat branch baru** — seluruh commit/branch dilakukan manual oleh pemilik repo. Setiap langkah "Commit" dalam plan diganti dengan langkah "Siap untuk komit manual".
- **Tidak ada test framework** di repo (per AGENTS.md). Verifikasi = `npm run build` (tsc type-check) + `npm run lint` (oxlint). Fungsi murni diyakinkan lewat input/output yang tercatat di task, lalu verifikasi manual via `npm run dev`.
- `erasableSyntaxOnly` aktif → **dilarang** enum, namespace, parameter properties. Gunakan union type & objek biasa.
- `noUnusedLocals` / `noUnusedParameters` aktif → tidak boleh ada variabel/params tak terpakai, atau `npm run build` gagal.
- Gunakan theme tokens (`blueprint-teal`, `blueprint-amber`, `blueprint-bg`, `blueprint-bgSec`, `blueprint-text`, `blueprint-textSec`), font mono untuk HUD, font display untuk judul. **Bukan** raw hex.
- `index.css` adalah single source of truth Tailwind v4; `tailwind.config.js` stale — jangan ubah.
- Jangan import `src/App.css` (boilerplate tak terpakai).
- Semua teks UI dalam **Bahasa Indonesia**.
- Hormati `prefers-reduced-motion` via `useReducedMotion()` di semua animasi baru.
- `src/data/portfolioData.ts` berisi `profileData.github = "https://github.com/AzhuraaaReyy"` — username diekstrak dari URL ini (jangan hardcode username terpisah).

## Struktur File

| File | Tanggung jawab |
|---|---|
| `src/data/levelingConfig.ts` (baru) | Konstanta: token GitHub, base EXP proyek, kurva level, map bobot bahasa, daftar curated programming/markup |
| `src/lib/levelingEngine.ts` (baru) | Fungsi murni: klasifikasi bahasa, bobot EXP, kurva level, progress, summary |
| `src/lib/githubApi.ts` (baru) | Fetch repositori + bahasa via GitHub REST API + fallback 401 |
| `src/hooks/useGithubStats.ts` (baru) | State loading/error/data + retry; memanggil engine |
| `src/components/ui/ExpBar.tsx` (baru) | Progress bar reusable (Navbar & Stats), respect reduced-motion |
| `src/components/Stats.tsx` (baru) | Section baru: level & EXP, language breakdown, project breakdown |
| `src/App.tsx` (ubah) | Panggil hook, pass props, sisip `<Stats/>` |
| `src/components/Navbar.tsx` (ubah) | Ganti angka hardcode dengan data nyata + fallback |

---

### Task 1: Skema Konfigurasi Leveling

**Files:**
- Create: `src/data/levelingConfig.ts`

**Interfaces:**
- Produces: `export interface LevelingConfig`, `export const LEVELING_CONFIG: LevelingConfig`

- [ ] **Step 1: Buat file `src/data/levelingConfig.ts`**

```ts
export interface LevelingConfig {
  githubToken: string;
  baseProjectExp: number;
  maxLevel: number;
  curveBase: number;
  curveMultiplier: number;
  languageExp: Record<string, number>;
  programmingLanguages: string[];
  markupDataLanguages: string[];
}

export const LEVELING_CONFIG: LevelingConfig = {
  githubToken: "",
  baseProjectExp: 200,
  maxLevel: 100,
  curveBase: 1000,
  curveMultiplier: 1.15,
  languageExp: {
    HTML: 50,
    Python: 100,
    PHP: 125,
    JavaScript: 150,
    TypeScript: 200,
    "C#": 250,
    Java: 275,
    Go: 300,
    Shell: 350,
    "C++": 500,
  },
  programmingLanguages: [
    "Lua", "Dart", "Rust", "Kotlin", "Swift", "Ruby", "Perl", "Scala",
    "Haskell", "Elixir", "Erlang", "R", "Solidity", "Zig", "Nim",
    "Objective-C", "C", "Assembly", "Julia", "Clojure",
  ],
  markupDataLanguages: [
    "CSS", "SCSS", "Sass", "Less", "Stylus", "Markdown", "JSON", "YAML",
    "XML", "HTML", "TeX", "Dockerfile", "CSV",
  ],
};

// Catatan: githubToken sengaja "" (publik). Pemilik dapat mengisi token
// Personal Access Token-nya sendiri di sini bila rate-limit publik (<60/jam) terlampaui.
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: PASS (tsc + vite build berhasil). Catatan: file baru belum di-referensikan, jadi tidak ada error.

---

### Task 2: Engine Leveling (Fungsi Murni)

**Files:**
- Create: `src/lib/levelingEngine.ts`

**Interfaces:**
- Consumes: `LEVELING_CONFIG`, `LevelingConfig` dari `../data/levelingConfig`
- Produces:
  - `export type LanguageCategory = "utama" | "programming" | "markup" | "unknown"`
  - `export interface RepoStat { name: string; languages: string[]; exp: number }`
  - `export interface LanguageStat { name: string; category: LanguageCategory; expPerProject: number; usedInRepos: number; totalExp: number }`
  - `export interface LevelingSummary { level: number; currentExp: number; requiredExp: number; progress: number; totalExp: number; totalRepos: number; languageBreakdown: LanguageStat[]; projectBreakdown: RepoStat[] }`
  - `export function classifyLanguage(name: string): LanguageCategory`
  - `export function expByLanguage(name: string): number`
  - `export function expForRepo(languages: string[]): number`
  - `export function expToNext(level: number): number`
  - `export function progressFromExp(totalExp: number): { level: number; currentExp: number; requiredExp: number; progress: number }`
  - `export function summarize(repoStats: RepoStat[]): LevelingSummary`

- [ ] **Step 1: Buat `src/lib/levelingEngine.ts`**

```ts
import { LEVELING_CONFIG } from "../data/levelingConfig";

export type LanguageCategory = "utama" | "programming" | "markup" | "unknown";

export interface RepoStat {
  name: string;
  languages: string[];
  exp: number;
}

export interface LanguageStat {
  name: string;
  category: LanguageCategory;
  expPerProject: number;
  usedInRepos: number;
  totalExp: number;
}

export interface LevelingSummary {
  level: number;
  currentExp: number;
  requiredExp: number;
  progress: number;
  totalExp: number;
  totalRepos: number;
  languageBreakdown: LanguageStat[];
  projectBreakdown: RepoStat[];
}

export function classifyLanguage(name: string): LanguageCategory {
  if (Object.prototype.hasOwnProperty.call(LEVELING_CONFIG.languageExp, name)) {
    return "utama";
  }
  if (LEVELING_CONFIG.programmingLanguages.includes(name)) {
    return "programming";
  }
  if (LEVELING_CONFIG.markupDataLanguages.includes(name)) {
    return "markup";
  }
  return "unknown";
}

export function expByLanguage(name: string): number {
  const direct = LEVELING_CONFIG.languageExp[name];
  if (typeof direct === "number") return direct;
  const category = classifyLanguage(name);
  if (category === "programming") return 75;
  if (category === "markup") return 25;
  return 0;
}

export function expForRepo(languages: string[]): number {
  const unique = [...new Set(languages)];
  const languageExp = unique.reduce((sum, lang) => sum + expByLanguage(lang), 0);
  return LEVELING_CONFIG.baseProjectExp + languageExp;
}

export function expToNext(level: number): number {
  if (level >= LEVELING_CONFIG.maxLevel) return 0;
  return Math.floor(
    LEVELING_CONFIG.curveBase *
      Math.pow(LEVELING_CONFIG.curveMultiplier, level - 1),
  );
}

export function progressFromExp(totalExp: number): {
  level: number;
  currentExp: number;
  requiredExp: number;
  progress: number;
} {
  let remaining = Math.max(0, totalExp);
  let level = 1;
  while (level < LEVELING_CONFIG.maxLevel) {
    const need = expToNext(level);
    if (remaining >= need) {
      remaining -= need;
      level += 1;
    } else {
      break;
    }
  }
  const requiredExp = expToNext(level);
  const progress = requiredExp > 0 ? remaining / requiredExp : 1;
  return { level, currentExp: remaining, requiredExp, progress };
}

export function summarize(repoStats: RepoStat[]): LevelingSummary {
  const totalExp = repoStats.reduce((sum, r) => sum + r.exp, 0);
  const { level, currentExp, requiredExp, progress } = progressFromExp(totalExp);

  const languageMap = new Map<
    string,
    { category: LanguageCategory; expPerProject: number; usedInRepos: number; totalExp: number }
  >();
  for (const repo of repoStats) {
    for (const lang of [...new Set(repo.languages)]) {
      const found = languageMap.get(lang);
      if (found) {
        found.usedInRepos += 1;
        found.totalExp += found.expPerProject;
      } else {
        languageMap.set(lang, {
          category: classifyLanguage(lang),
          expPerProject: expByLanguage(lang),
          usedInRepos: 1,
          totalExp: expByLanguage(lang),
        });
      }
    }
  }

  const languageBreakdown: LanguageStat[] = [...languageMap.entries()]
    .map(([name, stat]) => ({ name, ...stat }))
    .sort((a, b) => b.totalExp - a.totalExp);

  const projectBreakdown = [...repoStats].sort((a, b) => b.exp - a.exp);

  return {
    level,
    currentExp,
    requiredExp,
    progress,
    totalExp,
    totalRepos: repoStats.length,
    languageBreakdown,
    projectBreakdown,
  };
}
```

**Sanity check (verifikasi manual angka):**
- `classifyLanguage("TypeScript")` → `"utama"`, `expByLanguage("TypeScript")` → 200.
- `classifyLanguage("Rust")` → `"programming"`, `expByLanguage("Rust")` → 75.
- `classifyLanguage("CSS")` → `"markup"`, `expByLanguage("CSS")` → 25.
- `classifyLanguage("Fortran")` → `"unknown"`, `expByLanguage("Fortran")` → 0.
- `expForRepo(["JavaScript", "HTML"])` → 200 + 150 + 50 = 400.
- `expForRepo([])` → 200.
- `expToNext(1)` → 1000; `expToNext(2)` → 1150; `expToNext(100)` → 0.
- `progressFromExp(3000)` → level 4 (1000+1150+1323 = 3473 > 3000; level 3 → butuh 1323, 3000-2150=850 < 1323). Level 3, currentExp 850, requiredExp 1323, progress ≈ 0.642.
- `progressFromExp(0)` → level 1, currentExp 0, requiredExp 1000, progress 0.
- `summarize([{ name: "repoA", languages: ["TypeScript"], exp: 400 }])` → level 1, totalExp 400, languageBreakdown[0] = { name: "TypeScript", category: "utama", expPerProject: 200, usedInRepos: 1, totalExp: 200 }.

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: PASS. (Belum direferensikan komponen lain; hanya memastikan file valid.)

---

### Task 3: GitHub API Client

**Files:**
- Create: `src/lib/githubApi.ts`

**Interfaces:**
- Consumes: `LEVELING_CONFIG` dari `../data/levelingConfig`
- Produces:
  - `export interface GitHubRepo { name: string }`
  - `export function fetchRepos(username: string): Promise<GitHubRepo[]>`
  - `export function fetchRepoLanguages(username: string, repo: string): Promise<string[]>`

- [ ] **Step 1: Buat `src/lib/githubApi.ts`**

```ts
import { LEVELING_CONFIG } from "../data/levelingConfig";

const API_BASE = "https://api.github.com";

export interface GitHubRepo {
  name: string;
}

async function githubFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (LEVELING_CONFIG.githubToken) {
    headers.Authorization = `Bearer ${LEVELING_CONFIG.githubToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { headers });
  // Token invalid? Jatuh ke akses publik (rate-limit 60/jam).
  if (res.status === 401 && LEVELING_CONFIG.githubToken) {
    return fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
  }
  return res;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const res = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&type=all`,
  );
  if (!res.ok) {
    throw new Error(`GitHub API repos gagal (${res.status})`);
  }
  const data: Array<{ name: string; fork: boolean; archived: boolean }> =
    await res.json();
  return data.filter((repo) => !repo.fork && !repo.archived).map((repo) => ({ name: repo.name }));
}

export async function fetchRepoLanguages(
  username: string,
  repo: string,
): Promise<string[]> {
  const res = await githubFetch(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/languages`,
  );
  if (!res.ok) return [];
  const data: Record<string, number> = await res.json();
  return Object.keys(data);
}
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: PASS.

---

### Task 4: Hook `useGithubStats`

**Files:**
- Create: `src/hooks/useGithubStats.ts`

**Interfaces:**
- Consumes:
  - `profileData` dari `../data/portfolioData`
  - `fetchRepos`, `fetchRepoLanguages` dari `../lib/githubApi`
  - `expForRepo`, `summarize`, `type LevelingSummary`, `type RepoStat` dari `../lib/levelingEngine`
- Produces:
  - `export function useGithubStats(): { summary: LevelingSummary | null; loading: boolean; error: string | null; retry: () => void }`

- [ ] **Step 1: Buat `src/hooks/useGithubStats.ts`**

```ts
import { useEffect, useState } from "react";
import { profileData } from "../data/portfolioData";
import { fetchRepos, fetchRepoLanguages } from "../lib/githubApi";
import {
  expForRepo,
  summarize,
  type LevelingSummary,
  type RepoStat,
} from "../lib/levelingEngine";

interface GithubStatsState {
  summary: LevelingSummary | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useGithubStats(): GithubStatsState {
  const [summary, setSummary] = useState<LevelingSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(profileData.github);
        const username = url.pathname.replace(/^\//, "");
        const repos = await fetchRepos(username);
        const repoStats: RepoStat[] = await Promise.all(
          repos.map(async (repo): Promise<RepoStat> => {
            const languages = await fetchRepoLanguages(username, repo.name);
            return { name: repo.name, languages, exp: expForRepo(languages) };
          }),
        );
        if (cancelled) return;
        setSummary(summarize(repoStats));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data GitHub");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return {
    summary,
    loading,
    error,
    retry: () => setAttempt((a) => a + 1),
  };
}
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: PASS. (Hook belum dipakai komponen; namun file sudah tervalidasi tsc.)

---

### Task 5: Komponen `ExpBar`

**Files:**
- Create: `src/components/ui/ExpBar.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` dari `../../hooks/useReducedMotion`
- Produces:
  - `export function ExpBar(props: { progress: number; loading?: boolean; error?: boolean; className?: string }): React.JSX.Element`

- [ ] **Step 1: Buat `src/components/ui/ExpBar.tsx`**

```tsx
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ExpBarProps {
  progress: number;
  loading?: boolean;
  error?: boolean;
  className?: string;
}

export function ExpBar({
  progress,
  loading = false,
  error = false,
  className = "",
}: ExpBarProps) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <div
      className={`relative overflow-hidden h-full bg-blueprint-bg/80 border border-blueprint-teal/30 p-[1px] ${className}`}
    >
      {loading ? (
        <div className="h-full w-1/2 animate-pulse bg-blueprint-teal/30" />
      ) : error ? (
        <div className="h-full w-full bg-blueprint-amber/40" />
      ) : reducedMotion ? (
        <div
          className="h-full bg-gradient-to-r from-blueprint-teal via-blueprint-teal to-blueprint-amber shadow-[0_0_6px_rgba(94,234,212,0.8)]"
          style={{ width: `${clamped * 100}%` }}
        />
      ) : (
        <motion.div
          className="h-full bg-gradient-to-r from-blueprint-teal via-blueprint-teal to-blueprint-amber shadow-[0_0_6px_rgba(94,234,212,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: PASS.

---

### Task 6: Section `Stats`

**Files:**
- Create: `src/components/Stats.tsx`

**Interfaces:**
- Consumes:
  - `motion`, `type Variants` dari `framer-motion`
  - `BarChart3, Languages, FolderGit2, RefreshCw, ShieldOff, LoaderCircle` dari `lucide-react`
  - `AmbientBackground` dari `./ui/AmbientBackground`
  - `ExpBar` dari `./ui/ExpBar`
  - `useReducedMotion` dari `../hooks/useReducedMotion`
  - `type LevelingSummary` dari `../lib/levelingEngine`
- Produces:
  - `export function Stats(props: { summary: LevelingSummary | null; loading: boolean; error: string | null; onRetry: () => void }): React.JSX.Element`

- [ ] **Step 1: Buat `src/components/Stats.tsx`**

```tsx
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  BarChart3,
  Languages,
  FolderGit2,
  RefreshCw,
  ShieldOff,
  LoaderCircle,
  Code2,
} from "lucide-react";
import { AmbientBackground } from "./ui/AmbientBackground";
import { ExpBar } from "./ui/ExpBar";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { LevelingSummary } from "../lib/levelingEngine";

interface StatsProps {
  summary: LevelingSummary | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const DEVICON_SLUGS: Record<string, string> = {
  HTML: "html5",
  CSS: "css3",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  PHP: "php",
  "C#": "csharp",
  "C++": "cplusplus",
  Java: "java",
  Go: "go",
  Shell: "bash",
  Lua: "lua",
  Dart: "dart",
  Rust: "rust",
  Kotlin: "kotlin",
  Swift: "swift",
  Ruby: "ruby",
  SCSS: "sass",
  Sass: "sass",
  Markdown: "markdown",
};

function languageIcon(name: string) {
  const slug = DEVICON_SLUGS[name];
  if (!slug) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

export function Stats({
  summary,
  loading,
  error,
  onRetry,
}: StatsProps) {
  const reducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="stats"
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden"
    >
      <AmbientBackground glowIntensity={0.25} parallaxSpeed={0.8} circuitVariant={3} />

      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-30 pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-amber mb-4 px-4 py-1.5 bg-blueprint-amber/10 border-l-4 border-blueprint-amber skew-x-[-10deg] inline-flex items-center gap-2">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              STAT_SYSTEM // ELIGIBILITY_INDEX
            </span>
          </div>
          <div className="relative group cursor-default mb-8">
            <h2
              className="text-4xl md:text-5xl lg:text-7xl font-black font-display italic text-transparent uppercase tracking-tighter"
              style={{ WebkitTextStroke: "2px rgba(138, 147, 166, 0.15)" }}
            >
              LEVEL ARCHIVE
            </h2>
            <h2 className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-7xl font-black font-display italic text-blueprint-text uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(232,236,241,0.2)] clip-text-reveal transition-colors duration-500 hover:text-blueprint-amber">
              LEVEL ARCHIVE
            </h2>
          </div>
        </div>

        {error ? (
          /* Error state */
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="border border-blueprint-amber/40 bg-blueprint-amber/5 p-8 text-center"
          >
            <ShieldOff className="w-10 h-10 text-blueprint-amber mx-auto mb-4" />
            <p className="font-mono text-xs text-blueprint-amber mb-1 tracking-widest">
              SYNC_FAILED
            </p>
            <p className="text-blueprint-textSec text-sm mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 skew-x-[-10deg] bg-blueprint-amber text-blueprint-bg font-display font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
            >
              <RefreshCw className="w-4 h-4 skew-x-[10deg]" />
              <span className="skew-x-[10deg]">COBA LAGI</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-8"
          >
            {/* Level & EXP Card */}
            <motion.div
              variants={itemVariants}
              className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] p-6 md:p-8 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-center">
                    <div className="font-mono text-[10px] tracking-widest text-blueprint-textSec mb-1">
                      LEVEL
                    </div>
                    {loading ? (
                      <div className="w-24 h-14 animate-pulse bg-blueprint-teal/20" />
                    ) : (
                      <div className="font-display font-black text-6xl text-blueprint-teal drop-shadow-[0_0_15px_rgba(94,234,212,0.4)]">
                        {summary?.level ?? 1}
                      </div>
                    )}
                  </div>
                  <div className="h-16 w-px bg-blueprint-teal/20 hidden md:block" />
                  <div className="text-center md:text-left">
                    <div className="font-mono text-[10px] tracking-widest text-blueprint-textSec mb-1">
                      TOTAL_EXP
                    </div>
                    {loading ? (
                      <div className="w-28 h-6 animate-pulse bg-blueprint-teal/20" />
                    ) : (
                      <div className="font-display font-black text-2xl text-blueprint-text">
                        {summary?.totalExp ?? 0}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs mb-2">
                    <span className="text-blueprint-textSec">
                      {loading
                        ? "SINKRONISASI..."
                        : `${summary ? summary.currentExp : 0} / ${summary && summary.requiredExp > 0 ? summary.requiredExp : "MAX"} EXP`}
                    </span>
                    <span className="text-blueprint-teal font-bold">
                      {loading
                        ? "--%"
                        : `${Math.round((summary?.progress ?? 0) * 100)}%`}
                    </span>
                  </div>
                  <ExpBar
                    progress={summary?.progress ?? 0}
                    loading={loading}
                    className="h-4"
                  />
                  <div className="mt-2 font-mono text-[10px] text-blueprint-textSec">
                    {summary && summary.requiredExp === 0
                      ? "CAPAIAN_MAKSIMAL — LEGENDARY_STATUS"
                      : summary
                        ? `Lanjut ke LEVEL ${summary.level + 1} butuh ${summary.requiredExp} EXP`
                        : "Menunggu data..."}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Language Breakdown */}
            <motion.div
              variants={itemVariants}
              className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] p-6 md:p-8"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-blueprint-amber mb-6">
                <Languages className="w-3.5 h-3.5" />
                LANGUAGE_BREAKDOWN
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-12 animate-pulse bg-blueprint-teal/10" />
                    ))
                  : summary && summary.languageBreakdown.length > 0
                    ? summary.languageBreakdown.map((lang) => (
                        <div
                          key={lang.name}
                          className="flex items-center justify-between gap-3 border border-blueprint-teal/15 bg-blueprint-bg/60 px-4 py-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {languageIcon(lang.name) ? (
                              <img
                                src={languageIcon(lang.name) ?? ""}
                                alt={lang.name}
                                className="w-5 h-5 shrink-0"
                              />
                            ) : (
                              <Code2 className="w-5 h-5 text-blueprint-textSec shrink-0" />
                            )}
                            <span className="text-sm text-blueprint-text font-bold truncate">
                              {lang.name}
                            </span>
                            <span className="font-mono text-[9px] text-blueprint-textSec shrink-0">
                              +{lang.expPerProject}/PROYEK
                            </span>
                          </div>
                          <span className="font-mono text-xs text-blueprint-teal font-bold shrink-0">
                            {lang.totalExp} EXP
                          </span>
                        </div>
                      ))
                    : (
                      <div className="col-span-full text-sm text-blueprint-textSec py-6 text-center">
                        Belum ada data bahasa repositori.
                      </div>
                    )}
              </div>
            </motion.div>

            {/* Project Breakdown */}
            <motion.div
              variants={itemVariants}
              className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] p-6 md:p-8"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-blueprint-amber mb-6">
                <FolderGit2 className="w-3.5 h-3.5" />
                PROJECT_BREAKDOWN
              </div>
              <div className="space-y-3">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-14 animate-pulse bg-blueprint-teal/10" />
                    ))
                  : summary && summary.projectBreakdown.length > 0
                    ? summary.projectBreakdown.map((proj) => (
                        <div
                          key={proj.name}
                          className="flex items-center justify-between gap-4 border border-blueprint-teal/15 bg-blueprint-bg/60 px-4 py-3"
                        >
                          <div className="min-w-0">
                            <div className="text-sm text-blueprint-text font-bold truncate">
                              {proj.name}
                            </div>
                            <div className="font-mono text-[10px] text-blueprint-textSec truncate">
                              {proj.languages.length > 0
                                ? proj.languages.join(" · ")
                                : "Tanpa bahasa terdeteksi"}
                            </div>
                          </div>
                          <span className="font-mono text-xs text-blueprint-teal font-bold shrink-0">
                            +{proj.exp} EXP
                          </span>
                        </div>
                      ))
                    : (
                      <div className="text-sm text-blueprint-textSec py-6 text-center">
                        Belum ada data repositori.
                      </div>
                    )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

Catatan: `languageIcon` dipanggil dua kali di blok yang sama (`languageIcon(lang.name) ? <img src={languageIcon(lang.name) ?? ""} .../> : ...`). Ini valid tapi redundant call. Untuk menghindari penghitungan ganda sekaligus tetap bersih, ini sengaja disederhanakan — nilai `slug` deterministik sehingga tidak ada efek samping.

- [ ] **Step 2: Verifikasi type-check & lint**

Run: `npm run build`
Expected: PASS.
Run: `npm run lint`
Expected: PASS (tidak ada warning/report error).

---

### Task 7: Integrasikan ke `App.tsx`

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useGithubStats` dari `./hooks/useGithubStats`; `Stats` dari `./components/Stats`
- Produces: Prop baru untuk `Navbar`: `summary`, `loading`, `error`, `onRetry` (lih. Task 8)

- [ ] **Step 1: Panggil hook & sisipkan `<Stats/>`**

Ganti isi `App.tsx` dengan:

```tsx
import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Stats } from "./components/Stats";
import { Experience } from "./components/Experience";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { useGithubStats } from "./hooks/useGithubStats";

function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const { summary, loading, error, retry } = useGithubStats();

  useEffect(() => {
    const sections = document.querySelectorAll(".section-scroll");
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-blueprint-bg relative selection:bg-blueprint-teal/20 selection:text-blueprint-teal">
      <Navbar
        activeSection={activeSection}
        summary={summary}
        loading={loading}
        error={error !== null}
        onRetry={retry}
      />

      <main className="flex-grow">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Stats summary={summary} loading={loading} error={error} onRetry={retry} />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
export default App;
```

- [ ] **Step 2: Verifikasi type-check**

Run: `npm run build`
Expected: GAGAL (sementara) karena prop `summary`, `loading`, `error`, `onRetry` belum diterima di `NavbarProps` — dilanjutkan ke Task 8.

---

### Task 8: Perbarui Navbar HUD dengan Data Nyata

**Files:**
- Modify: `src/components/Navbar.tsx`

**Interfaces:**
- Consumes: `ExpBar` dari `./ui/ExpBar`; `type LevelingSummary` dari `../lib/levelingEngine`
- Modifies: `interface NavbarProps` menambah `summary?: LevelingSummary | null; loading?: boolean; error?: boolean; onRetry?: () => void`

- [ ] **Step 1: Update `NavbarProps` & import**

Ubah baris 3–7 di `Navbar.tsx`:

```tsx
import { useState, useEffect } from "react";
import { Menu, X, Gamepad2, Wifi, RefreshCw } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ExpBar } from "./ui/ExpBar";
import type { LevelingSummary } from "../lib/levelingEngine";

interface NavbarProps {
  activeSection?: string;
  summary?: LevelingSummary | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}
```

- [ ] **Step 2: Tambah nav link "STATS"**

Di array `navLinks` (baris 50–57), sisipkan entri setelah `#projects`:

```tsx
  const navLinks = [
    { label: "BERANDA", href: "#home" },
    { label: "TENTANG SAYA", href: "#about" },
    { label: "KEAHLIAN", href: "#skills" },
    { label: "PROYEK", href: "#projects" },
    { label: "STATS", href: "#stats" },
    { label: "PENGALAMAN", href: "#experience" },
    { label: "KONTAK", href: "#contact" },
  ];
```

- [ ] **Step 3: Ubah signature komponen**

Ubah baris 43 menjadi:

```tsx
export function Navbar({
  activeSection: activeSectionProp,
  summary,
  loading = false,
  error = false,
  onRetry,
}: NavbarProps) {
```

- [ ] **Step 4: Ganti block LVL / XP bar di desktop status bar**

Ganti blok LVL + progress bar (baris 143–153) dengan versi data nyata:

```tsx
                <div className="flex items-center gap-1">
                  <span className="text-blueprint-textSec">LVL</span>
                  {loading ? (
                    <span className="w-5 h-4 animate-pulse bg-blueprint-teal/20 inline-block" />
                  ) : (
                    <span className="font-display font-black text-blueprint-teal">
                      {error ? "--" : summary?.level ?? 1}
                    </span>
                  )}
                </div>

                {/* Progress Bar Level */}
                <div className="w-10 sm:w-14 h-1.5 p-[1px]">
                  <ExpBar
                    progress={summary?.progress ?? 0}
                    loading={loading}
                    error={error}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-blueprint-textSec">RANK</span>
                  <span className="font-display font-black text-blueprint-amber">
                    {error ? "OFFLINE" : "RIZAL"}
                  </span>
                </div>

                {error && onRetry && (
                  <button
                    onClick={onRetry}
                    aria-label="Coba lagi sinkronisasi level"
                    className="flex items-center gap-1 text-blueprint-amber hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
```

- [ ] **Step 5: Ganti block mobile dropdown header**

Ganti baris 228–240 (blok LVL/RANK di header mobile) menjadi:

```tsx
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-blueprint-textSec">
                LVL{" "}
                {loading ? (
                  <strong className="w-5 h-4 animate-pulse bg-blueprint-teal/20 inline-block align-middle" />
                ) : (
                  <strong className="text-blueprint-teal font-black">
                    {error ? "--" : summary?.level ?? 1}
                  </strong>
                )}
              </span>
              <span className="text-blueprint-teal/30">|</span>
              <span className="text-blueprint-textSec">
                RANK{" "}
                <strong className="text-blueprint-amber font-black">
                  {error ? "OFFLINE" : "RIZAL"}
                </strong>
              </span>
              <span className="text-blueprint-teal/30">|</span>
              <PingStatus />
            </div>
```

- [ ] **Step 6: Verifikasi type-check & lint**

Run: `npm run build`
Expected: PASS.
Run: `npm run lint`
Expected: PASS.

---

### Task 9: Verifikasi Akhir & QA Manual

**Files:**
- None (tidak ada file baru). Cakupan penuh Task 1–8.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: PASS (tsc + vite build tanpa error, tanpa warning unused).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 3: QA manual via dev server**

Run: `npm run dev`
Periksa:
1. Navbar menampilkan `LVL` angka nyata (bukan 99) saat data dimuat; XP bar berisi sesuai progress.
2. Saat pertama load (jaringan lambat), muncul skeleton shimmer di area LVL & bar (bukan angka kosong).
3. Section "LEVEL ARCHIVE" muncul di antara PROYEK dan PENGALAMAN, berisi 3 kartu: level & EXP, language breakdown, project breakdown — memakai data GitHub nyata (`AzhuraaaReyy`).
4. Navbar mobile (layar < lg): header dropdown tetap menampilkan LVL/rank nyata.
5. Klik link "STATS" menggulir halus ke section `#stats`.
6. Scroll-spy: section `#stats` ditandai aktif saat berada di viewport.
7. Simulasi error (matikan internet / blokir URL `api.github.com`) → Navbar tampil `LVL --` / `RANK OFFLINE`, section Stats tampil `SYNC_FAILED` + tombol "COBA LAGI" yang memicu refetch saat jaringan pulih. Halaman lain tetap berfungsi penuh.
8. Dengan `prefers-reduced-motion: reduce` aktif: XP bar tampil langsung tanpa animasi width (cek via DevTools rendering emulation).

- [ ] **Step 4: Periksa batas sanitasi angka**

Verifikasi manual (ubah sementara `githubToken` di `levelingConfig.ts` jangan diubah nilai; melainkan cek lewat nilai nyata dari GitHub):
- Total EXP ≥ jumlah repo × 200 (karena base). Pastikan tidak ada repo fork/archive yang ikut terhitung.
- `usedInRepos` per bahasa tidak melebihi jumlah repo.

- [ ] **Step 5: Siap untuk komit manual**

Tidak lakukan commit/branch. Laporkan ringkasan perubahan ke pemilik repo agar pemilik melakukan commit & push sendiri.
```

---

## Self-Review

### 1. Cakupan Spec

| Requirement spec | Task |
|---|---|
| Konfigurasi token, bobot, kurva | Task 1 |
| Klasifikasi & bobot bahasa (utama/programming/markup/unknown) | Task 2 |
| Kurva eksponensial level 1–100 (base 1000, ×1.15) | Task 2 (`expToNext`, `progressFromExp`) |
| +200 base per repo, skip fork/archived | Task 2 (`expForRepo`) + Task 3 (`fetchRepos` filter) |
| Bahasa unik dihitung sekali per repo | Task 2 (`Set` dedupe) |
| Fallback 401 ke token publik | Task 3 (`gitHubFetch`) |
| Fetch langsung dari GitHub API | Task 3 |
| Hook loading/error/retry | Task 4 |
| `ExpBar` reusable + reduced-motion | Task 5 |
| Navbar HUD data nyata + skeleton/offline | Task 8 |
| Section Stats: level & EXP, language & project breakdown | Task 6 |
| Sisip section antara Projects & Experience | Task 7 |
| Verifikasi build + lint | Task 9 |

### 2. Placeholder scan

Tidak ada "TBD", "TODO", "implement later". Semua langkah kode memuat konten lengkap. Satu-satunya placeholder sengaja: `githubToken: ""` yang merupakan nilai default aman (akses publik) dengan komentar untuk pemilik — tidak ada "isi nanti", melainkan default yang berfungsi.

### 3. Konsistensi tipe

- `LevelingSummary` (`level`, `currentExp`, `requiredExp`, `progress`, `totalExp`, `totalRepos`, `languageBreakdown`, `projectBreakdown`) didefinisikan di Task 2 dan dipakai persis di Task 6/7/8.
- `GitHubRepo { name }`, `fetchRepos(username): Promise<GitHubRepo[]>`, `fetchRepoLanguages(username, repo)` konsisten antara Task 3 dan Task 4.
- Prop Navbar: `summary`, `loading`, `error`, `onRetry` didefinisikan di Task 8 dan dipakai di Task 7 — sama persis.
- `RepoStat { name; languages; exp }` dibuat di Task 4 (`expForRepo`) dan dikonsumsi `summarize` di Task 2 — cocok.
- `ExpBar` props `{ progress, loading?, error?, className? }` konsisten di Task 5, 6, 8.