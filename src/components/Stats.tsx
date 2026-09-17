import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { GlitchHeading } from "./ui/GlitchHeading";
import {
  BarChart3,
  Languages,
  FolderGit2,
  RefreshCw,
  ShieldOff,
  Code2,
  ChevronLeft,
  ChevronRight,
  Award,
  Terminal,
  Rocket,
  Layers,
} from "lucide-react";
import { AmbientBackground } from "./ui/AmbientBackground";
import { ExpBar } from "./ui/ExpBar";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { useGithubStatsContext } from "../context/GithubStatsContext";

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
  Blade: "laravel",
  Jinja: "python",
  Hack: "php",
  PLpgSQL: "postgresql",
  Procfile: "heroku",
  Dockerfile: "docker",
};

const TECH_DEVICON_SLUGS: Record<string, string> = {
  React: "react",
  "Vue.js": "vuejs",
  "Tailwind CSS": "tailwindcss",
  "Next.js": "nextjs",
  "Nuxt.js": "nuxtjs",
  Laravel: "laravel",
  Flutter: "flutter",
  "Express.js": "express",
  FastAPI: "fastapi",
  Django: "django",
  Flask: "flask",
  Svelte: "svelte",
  Angular: "angularjs",
  Astro: "astro",
  Vite: "vite",
  Bootstrap: "bootstrap",
  "Socket.IO": "socketio",
  Docker: "docker",
};

function languageIcon(name: string) {
  const slug = DEVICON_SLUGS[name];
  if (!slug) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

function techIcon(name: string) {
  const slug = TECH_DEVICON_SLUGS[name];
  if (!slug) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`;
}

const ITEMS_PER_PAGE = 5;

export function Stats() {
  const { summary, loading, error, retry } = useGithubStatsContext();
  const reducedMotion = useReducedMotion();
  const gsapRevealRef = useGsapReveal<HTMLElement>();
  const [langPage, setLangPage] = useState(0);
  const [projPage, setProjPage] = useState(0);
  const [techPage, setTechPage] = useState(0);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Pagination calculation for Languages
  const totalLangItems = summary?.languageBreakdown.length || 0;
  const totalLangPages = Math.ceil(totalLangItems / ITEMS_PER_PAGE) || 1;
  const currentLanguages = summary?.languageBreakdown.slice(
    langPage * ITEMS_PER_PAGE,
    (langPage + 1) * ITEMS_PER_PAGE,
  );

  // Pagination calculation for Projects
  const totalProjItems = summary?.projectBreakdown.length || 0;
  const totalProjPages = Math.ceil(totalProjItems / ITEMS_PER_PAGE) || 1;
  const currentProjects = summary?.projectBreakdown.slice(
    projPage * ITEMS_PER_PAGE,
    (projPage + 1) * ITEMS_PER_PAGE,
  );

  // Pagination calculation for Technologies
  const totalTechItems = summary?.technologyBreakdown.length || 0;
  const totalTechPages = Math.ceil(totalTechItems / ITEMS_PER_PAGE) || 1;
  const currentTechnologies = summary?.technologyBreakdown.slice(
    techPage * ITEMS_PER_PAGE,
    (techPage + 1) * ITEMS_PER_PAGE,
  );
  const maxTechRepos = Math.max(
    1,
    ...(summary?.technologyBreakdown.map((t) => t.usedInRepos) ?? [1]),
  );

  return (
    <section
      id="stats"
      ref={gsapRevealRef}
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/30 overflow-hidden font-sans"
    >
      <AmbientBackground
        glowIntensity={0.18}
        parallaxSpeed={0.3}
        circuitVariant={2}
      />

      {/* Grid Overlay & FPS Tactical Crosshairs */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-25 pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-8 w-px h-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-8 w-px h-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />
      <div className="absolute top-8 left-0 h-px w-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="mb-10" data-gsap-reveal>
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-amber mb-3 px-3 py-1 bg-blueprint-amber/10 border-l-4 border-blueprint-amber skew-x-[-10deg] inline-flex items-center gap-2">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              RINGKASAN KAPABILITAS TEKNIS
            </span>
          </div>

          <GlitchHeading
            text="PERKEMBANGAN & PENGALAMAN TEKNIS"
            className="group cursor-default mb-4"
          >
            PERKEMBANGAN & PENGALAMAN{" "}
            <span className="text-blueprint-amber"> TEKNIS</span>
          </GlitchHeading>

          <p className="text-blueprint-textSec text-xs md:text-sm font-mono max-w-full flex items-center gap-2 border-l-2 border-blueprint-teal/40 pl-3 py-0.5 text-justify">
            <Terminal className="w-4 h-4 text-blueprint-teal shrink-0" />
            <span>
              Bagian ini merangkum rekam jejak pengembangan perangkat lunak yang
              telah saya jalani. Melalui integrasi data repositori, setiap
              proyek, stack teknologi, dan pengalaman teknis terkuantifikasi
              secara transparan untuk memberikan gambaran terukur mengenai
              peningkatan kompetensi saya dari waktu ke waktu.
            </span>
          </p>
        </div>

        {error ? (
          /* Error State - FPS Critical Alert Style */
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="border-2 border-red-500/60 bg-red-950/20 p-8 text-center relative overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-black font-mono font-black text-[10px] px-3 py-0.5 uppercase tracking-widest">
              [ TERJADI KENDALA SINKRONISASI ]
            </div>
            <ShieldOff className="w-12 h-12 text-red-400 mx-auto mb-3 animate-pulse" />
            <p className="font-mono text-xs text-red-400 mb-1 tracking-widest font-bold">
              GAGAL MEMUAT DATA STATISTIK
            </p>
            <p className="text-blueprint-textSec text-sm mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2.5 skew-x-[-10deg] bg-red-500 text-black font-display font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-red-500/50"
            >
              <RefreshCw className="w-4 h-4 skew-x-[10deg]" />
              <span className="skew-x-[10deg]">SINKRONISASI ULANG</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="space-y-6"
          >
            {/* Level & EXP Card - FPS HUD Command Center */}
            <motion.div
              variants={itemVariants}
              className="border-2 border-blueprint-teal/40 bg-blueprint-bgSec/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 md:p-8 relative overflow-hidden"
            >
              {/* Corner Bracket Accents (Tactical Frame) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blueprint-teal" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blueprint-teal" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blueprint-teal" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blueprint-teal" />

              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                {/* Left Side: Level Badge */}
                <div className="flex items-center gap-6 shrink-0 border-b lg:border-b-0 lg:border-r border-blueprint-teal/20 pb-6 lg:pb-0 lg:pr-8">
                  <div className="text-center relative">
                    <div className="font-mono text-[10px] tracking-widest text-blueprint-teal/80 mb-1 flex items-center justify-center gap-1">
                      <Award className="w-3 h-3" /> LEVEL KOMPETENSI
                    </div>
                    {loading ? (
                      <div className="w-24 h-16 animate-pulse bg-blueprint-teal/20 rounded" />
                    ) : (
                      <div className="font-display font-black text-6xl md:text-7xl text-blueprint-teal drop-shadow-[0_0_15px_rgba(94,234,212,0.5)] leading-none">
                        {summary?.level ?? 1}
                      </div>
                    )}
                    <span className="font-mono text-[9px] bg-blueprint-teal/10 text-blueprint-teal border border-blueprint-teal/30 px-2 py-0.5 mt-2 inline-block font-bold uppercase truncate max-w-[15rem] sm:max-w-[17rem]">
                      TINGKAT:{" "}
                      {summary?.tier.title ??
                        (loading ? "MEMPROSES DATA" : "OFFLINE")}
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="font-mono text-[10px] tracking-widest text-blueprint-textSec">
                      TOTAL POIN PENGALAMAN
                    </div>
                    {loading ? (
                      <div className="w-28 h-7 animate-pulse bg-blueprint-teal/20" />
                    ) : (
                      <div className="font-display font-black text-3xl text-blueprint-text tracking-wide">
                        {summary?.totalExp.toLocaleString() ?? 0}{" "}
                        <span className="text-xs text-blueprint-teal font-mono">
                          EXP
                        </span>
                      </div>
                    )}
                    <div className="font-mono text-[10px] text-blueprint-amber flex items-center gap-1.5 font-semibold">
                      {summary
                        ? `${summary.totalRepos} REPOSITORI TERKONEKSI`
                        : "MEMUAT DATA..."}
                    </div>
                  </div>
                </div>

                {/* Right Side: Progress Gauge */}
                <div className="flex-1">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="font-mono text-[10px] tracking-widest text-blueprint-textSec mb-1">
                        PROGRESS MENUJU LEVEL{" "}
                        {loading || !summary
                          ? "--"
                          : summary.requiredExp === 0
                            ? summary.level
                            : summary.level + 1}
                      </div>
                      <div className="font-display font-black text-3xl text-blueprint-amber tabular-nums">
                        {loading ? (
                          <div className="w-20 h-8 animate-pulse bg-blueprint-teal/20" />
                        ) : (
                          `${Math.round((summary?.progress ?? 0) * 100)}%`
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-blueprint-textSec text-right bg-blueprint-bg/80 px-3 py-1 border border-blueprint-teal/20">
                      {loading
                        ? "MEMAKSIMALKAN DATA..."
                        : summary && summary.requiredExp > 0
                          ? `${summary.currentExp} / ${summary.requiredExp} EXP`
                          : "TINGKAT MAKSIMAL TERCAPAI"}
                    </div>
                  </div>

                  <ExpBar
                    progress={summary?.progress ?? 0}
                    loading={loading}
                    className="mt-2 h-3"
                  />

                  <div className="mt-3 font-mono text-[11px] text-blueprint-textSec flex flex-wrap items-center justify-between gap-2">
                    {summary && summary.requiredExp === 0 ? (
                      <span className="text-blueprint-amber font-bold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> PENCAPAIAN TERTINGGI —
                        SELURUH POIN EXP TAHAP INI TELAH TERKUMPUL
                      </span>
                    ) : summary ? (
                      <>
                        <span>
                          Dibutuhkan tambahan{" "}
                          <span className="text-blueprint-teal font-bold">
                            {summary.requiredExp - summary.currentExp} EXP
                          </span>{" "}
                          untuk naik ke LEVEL {summary.level + 1}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-blueprint-teal">
                          <span className="inline-block w-2 h-2 rotate-45 bg-blueprint-amber animate-ping" />
                          <span>STATUS PROGRES SAAT INI</span>
                        </span>
                      </>
                    ) : (
                      <span>Memuat data progres...</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* COMBINED GRID SECTION: Rekam Pengalaman & Arsenal Teknologi */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Rekam Pengalaman (Mission Log Counters) */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-4 border-2 border-blueprint-teal/40 bg-blueprint-bgSec/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.6)] p-6 relative flex flex-col justify-between"
              >
                {/* Corner Bracket Accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blueprint-teal" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blueprint-teal" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blueprint-teal" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blueprint-teal" />

                <div>
                  <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold mb-4 pb-3 border-b border-blueprint-teal/20">
                    <Rocket className="w-4 h-4 text-blueprint-amber" />
                    RINGKASAN METRIK // PENGALAMAN TEKNIS
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: Rocket,
                        label: "PROYEK SELESAI",
                        value: summary?.completedRepos,
                      },
                      {
                        icon: FolderGit2,
                        label: "REPOSITORI",
                        value: summary?.totalRepos,
                      },
                      {
                        icon: Layers,
                        label: "TECH STACK",
                        value: summary?.technologyCount,
                      },
                      {
                        icon: Languages,
                        label: "BAHASA",
                        value: summary?.languageCount,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-3 py-3 transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-blueprint-teal/30" />
                        <stat.icon className="w-3.5 h-3.5 text-blueprint-teal mb-1.5" />
                        {loading ? (
                          <div className="w-10 h-6 animate-pulse bg-blueprint-teal/20 rounded mb-1" />
                        ) : (
                          <div className="font-display font-black text-2xl md:text-3xl text-blueprint-amber tabular-nums leading-none mb-1">
                            {stat.value ?? 0}
                          </div>
                        )}
                        <div className="font-mono text-[9px] tracking-widest text-blueprint-textSec truncate">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-blueprint-teal/10 text-[9px] font-mono text-blueprint-textSec leading-tight">
                  DATA TERSINKRONISASI OTOMATIS DARI REPOSITORI GITHUB TERKAIT
                </div>
              </motion.div>

              {/* Right Column: Tech/Technology Breakdown */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-8 border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-blueprint-teal/20">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold">
                      <Layers className="w-4 h-4 text-blueprint-amber" />
                      EKOSISTEM TEKNOLOGI // TECH STACK
                    </div>

                    {/* Pagination Controls */}
                    {totalTechPages > 1 && (
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-blueprint-textSec text-[11px]">
                          HALAMAN{" "}
                          <span className="text-blueprint-teal font-bold">
                            {techPage + 1}
                          </span>{" "}
                          / {totalTechPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setTechPage((p) => Math.max(0, p - 1))
                            }
                            disabled={techPage === 0}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                          <button
                            onClick={() =>
                              setTechPage((p) =>
                                Math.min(totalTechPages - 1, p + 1),
                              )
                            }
                            disabled={techPage === totalTechPages - 1}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Berikutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tech List with Progress Bars */}
                  <div className="min-h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={techPage}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        {loading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 animate-pulse bg-blueprint-teal/10 border border-blueprint-teal/10"
                            />
                          ))
                        ) : currentTechnologies &&
                          currentTechnologies.length > 0 ? (
                          currentTechnologies.map((tech) => {
                            const icon = techIcon(tech.name);
                            const barWidth = Math.min(
                              100,
                              Math.round(
                                (tech.usedInRepos / maxTechRepos) * 100,
                              ),
                            );
                            return (
                              <div
                                key={tech.name}
                                className="group border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-3 py-2 transition-all relative overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blueprint-teal/30 group-hover:bg-blueprint-teal transition-colors" />
                                <div className="flex items-center gap-3 pl-1">
                                  {icon ? (
                                    <img
                                      src={icon}
                                      alt={tech.name}
                                      loading="lazy"
                                      className="w-5 h-5 shrink-0 filter drop-shadow"
                                    />
                                  ) : (
                                    <Code2 className="w-4 h-4 text-blueprint-teal shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs text-blueprint-text font-bold truncate group-hover:text-blueprint-teal transition-colors">
                                        {tech.name}
                                      </span>
                                      <span className="font-mono text-[10px] text-blueprint-teal font-bold shrink-0 bg-blueprint-teal/10 border border-blueprint-teal/20 px-2 py-0.5">
                                        {tech.totalExp.toLocaleString()} EXP
                                      </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                      <div className="h-1.5 flex-1 bg-blueprint-bg border border-blueprint-teal/20 overflow-hidden">
                                        <div
                                          className="h-full bg-blueprint-teal/70 transition-all duration-500"
                                          style={{ width: `${barWidth}%` }}
                                        />
                                      </div>
                                      <span className="font-mono text-[9px] text-blueprint-textSec shrink-0">
                                        {tech.usedInRepos} PROYEK
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-blueprint-textSec py-8 text-center font-mono">
                            Belum ada rekam data teknologi terdeteksi.
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Indicator Footer */}
                <div className="mt-3 pt-2 border-t border-blueprint-teal/10 text-[9px] font-mono text-blueprint-textSec flex items-center justify-between">
                  <span>TOTAL TEKNOLOGI: {totalTechItems}</span>
                  <span>
                    MENAMPILKAN {currentTechnologies?.length || 0} ITEM PER
                    SLIDE
                  </span>
                </div>
              </motion.div>
            </div>

            {/* LOWER GRID SECTION: Profisiensi Bahasa & Riwayat Proyek */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Language Breakdown */}
              <motion.div
                variants={itemVariants}
                className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-blueprint-teal/20">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold">
                      <Languages className="w-4 h-4 text-blueprint-amber" />
                      BAHASA PEMROGRAMAN & FRAMEWORK
                    </div>

                    {/* Pagination Controls */}
                    {totalLangPages > 1 && (
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-blueprint-textSec text-[11px]">
                          HALAMAN{" "}
                          <span className="text-blueprint-teal font-bold">
                            {langPage + 1}
                          </span>{" "}
                          / {totalLangPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setLangPage((p) => Math.max(0, p - 1))
                            }
                            disabled={langPage === 0}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                          <button
                            onClick={() =>
                              setLangPage((p) =>
                                Math.min(totalLangPages - 1, p + 1),
                              )
                            }
                            disabled={langPage === totalLangPages - 1}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Berikutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Grid Content with Framer Motion Animation */}
                  <div className="min-h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={langPage}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        {loading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 animate-pulse bg-blueprint-teal/10 border border-blueprint-teal/10"
                            />
                          ))
                        ) : currentLanguages && currentLanguages.length > 0 ? (
                          currentLanguages.map((lang) => {
                            const icon = languageIcon(lang.name);
                            return (
                              <div
                                key={lang.name}
                                className="group flex items-center justify-between gap-3 border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-3 py-2 transition-all relative overflow-hidden"
                              >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blueprint-teal/30 group-hover:bg-blueprint-teal transition-colors" />
                                <div className="flex items-center gap-2.5 min-w-0 pl-1">
                                  {icon ? (
                                    <img
                                      src={icon}
                                      alt={lang.name}
                                      loading="lazy"
                                      className="w-4 h-4 shrink-0 filter drop-shadow"
                                    />
                                  ) : (
                                    <Code2 className="w-4 h-4 text-blueprint-teal shrink-0" />
                                  )}
                                  <div className="truncate">
                                    <span className="text-xs text-blueprint-text font-bold block truncate group-hover:text-blueprint-teal transition-colors">
                                      {lang.name}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-mono text-[10px] text-blueprint-teal font-bold shrink-0 bg-blueprint-teal/10 border border-blueprint-teal/20 px-2 py-0.5">
                                  {lang.totalExp} EXP
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-xs text-blueprint-textSec py-8 text-center font-mono">
                            Belum ada rekam data bahasa pemrograman terdeteksi.
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Indicator Footer */}
                <div className="mt-3 pt-2 border-t border-blueprint-teal/10 text-[9px] font-mono text-blueprint-textSec flex items-center justify-between">
                  <span>TOTAL BAHASA: {totalLangItems}</span>
                  <span>
                    MENAMPILKAN {currentLanguages?.length || 0} ITEM PER SLIDE
                  </span>
                </div>
              </motion.div>

              {/* Project Breakdown */}
              <motion.div
                variants={itemVariants}
                className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-blueprint-teal/20">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold">
                      <FolderGit2 className="w-4 h-4 text-blueprint-amber" />
                      RIWAYAT PROYEK & PORTFOLIO
                    </div>

                    {/* Pagination Controls */}
                    {totalProjPages > 1 && (
                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="text-blueprint-textSec text-[11px]">
                          HALAMAN{" "}
                          <span className="text-blueprint-teal font-bold">
                            {projPage + 1}
                          </span>{" "}
                          / {totalProjPages}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setProjPage((p) => Math.max(0, p - 1))
                            }
                            disabled={projPage === 0}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Sebelumnya"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                          <button
                            onClick={() =>
                              setProjPage((p) =>
                                Math.min(totalProjPages - 1, p + 1),
                              )
                            }
                            disabled={projPage === totalProjPages - 1}
                            className="p-1 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                            aria-label="Halaman Berikutnya"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-blueprint-teal" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content List with Framer Motion Animation */}
                  <div className="min-h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={projPage}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2"
                      >
                        {loading ? (
                          Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-10 animate-pulse bg-blueprint-teal/10 border border-blueprint-teal/10"
                            />
                          ))
                        ) : currentProjects && currentProjects.length > 0 ? (
                          currentProjects.map((proj) => (
                            <div
                              key={proj.name}
                              className="group flex items-center justify-between gap-3 border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-3 py-2 transition-all relative"
                            >
                              <div className="min-w-0">
                                <div className="text-xs text-blueprint-text font-bold truncate group-hover:text-blueprint-teal transition-colors flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full shrink-0" />
                                  <span className="truncate">{proj.name}</span>
                                </div>
                                <div className="font-mono text-[9px] text-blueprint-textSec truncate pl-3 mt-0.5">
                                  {proj.languages.length > 0 ? (
                                    <span className="text-blueprint-teal/80">
                                      {proj.languages.join(" · ")}
                                    </span>
                                  ) : (
                                    "Stack utama belum ditentukan"
                                  )}
                                </div>
                              </div>
                              <span className="font-mono text-[10px] text-blueprint-teal font-bold shrink-0 bg-blueprint-teal/10 border border-blueprint-teal/20 px-2 py-0.5">
                                +{proj.exp} EXP
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-blueprint-textSec py-8 text-center font-mono">
                            Belum ada rekam data repositori proyek.
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Indicator Footer */}
                <div className="mt-3 pt-2 border-t border-blueprint-teal/10 text-[9px] font-mono text-blueprint-textSec flex items-center justify-between">
                  <span>TOTAL REPOSITORI: {totalProjItems}</span>
                  <span>
                    MENAMPILKAN {currentProjects?.length || 0} ITEM PER SLIDE
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
