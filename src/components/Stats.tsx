import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  BarChart3,
  Languages,
  FolderGit2,
  RefreshCw,
  ShieldOff,
  Code2,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Award,
  Terminal,
  Activity,
} from "lucide-react";
import { AmbientBackground } from "./ui/AmbientBackground";
import { ExpBar } from "./ui/ExpBar";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { LevelingSummary } from "../lib/levelingEngine";

interface StatsProps {
  summary: LevelingSummary | null;
  loading: boolean;
  error: string | null;
  hasStaleData: boolean;
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

const ITEMS_PER_PAGE = 10;

export function Stats({
  summary,
  loading,
  error,
  hasStaleData,
  onRetry,
}: StatsProps) {
  const reducedMotion = useReducedMotion();
  const [langPage, setLangPage] = useState(0);
  const [projPage, setProjPage] = useState(0);

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

  return (
    <section
      id="stats"
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/30 overflow-hidden font-sans"
    >
      <AmbientBackground
        glowIntensity={0.3}
        parallaxSpeed={0.8}
        circuitVariant={3}
      />

      {/* Grid Overlay & FPS Tactical Crosshairs */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-25 pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-8 w-px h-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-8 w-px h-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />
      <div className="absolute top-8 left-0 h-px w-full bg-blueprint-teal/15 pointer-events-none hidden md:block" />

      {/* HUD Frame Elements */}
      <div className="absolute top-4 left-4 text-blueprint-teal/40 hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-widest">
        <Crosshair className="w-3.5 h-3.5 animate-spin-slow" /> HUD_SYSTEM //
        VER_4.0
      </div>
      <div className="absolute top-4 right-4 text-blueprint-teal/40 hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-widest">
        STATUS: ONLINE <Activity className="w-3.5 h-3.5 text-blueprint-teal" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Heading */}
        <div className="mb-14">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-amber mb-3 px-3 py-1 bg-blueprint-amber/10 border-l-4 border-blueprint-amber skew-x-[-10deg] inline-flex items-center gap-2">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              MATRIKS REKAPITULASI KOMPETENSI TEKNIS
            </span>
          </div>

          <div className="relative group cursor-default mb-4">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display italic text-transparent uppercase tracking-tight"
              style={{ WebkitTextStroke: "2px rgba(138, 147, 166, 0.2)" }}
            >
              PORTFOLIO STATS & REKOR PENGALAMAN
            </h2>
            <h2 className="absolute top-0 left-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display italic text-blueprint-text uppercase tracking-tight drop-shadow-[0_0_25px_rgba(94,234,212,0.25)] transition-colors duration-500 hover:text-blueprint-teal">
              PORTFOLIO STATS & REKOR PENGALAMAN
            </h2>
          </div>

          <p className="text-blueprint-textSec text-xs md:text-sm font-mono max-w-3xl flex items-center gap-2 border-l-2 border-blueprint-teal/40 pl-3 py-0.5">
            <Terminal className="w-4 h-4 text-blueprint-teal shrink-0" />
            <span>
              Catatan Rekruter: Kalkulasi EXP dan Level diukur berdasarkan
              akumulasi kontribusi kode, kompleksitas proyek, serta keberagaman
              stack teknologi yang diimplementasikan.
            </span>
          </p>
        </div>

        {error && !hasStaleData ? (
          /* Error State - FPS Critical Alert Style */
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="border-2 border-red-500/60 bg-red-950/20 p-8 text-center relative overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-black font-mono font-black text-[10px] px-3 py-0.5 uppercase tracking-widest">
              [ KONEKSI TERPUTUS ]
            </div>
            <ShieldOff className="w-12 h-12 text-red-400 mx-auto mb-3 animate-pulse" />
            <p className="font-mono text-xs text-red-400 mb-1 tracking-widest font-bold">
              GAGAL MENGAMBIL DATA REKAPITULASI
            </p>
            <p className="text-blueprint-textSec text-sm mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={onRetry}
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
            className="space-y-8"
          >
            {hasStaleData ? (
              <motion.div
                variants={itemVariants}
                className="border border-blueprint-amber/50 bg-blueprint-amber/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 relative"
              >
                <ShieldOff className="w-5 h-5 text-blueprint-amber shrink-0" />
                <p className="font-mono text-xs text-blueprint-amber tracking-wider flex-1">
                  Peringatan Sistem: Data yang ditampilkan adalah versi cache
                  terkini ({error}).
                </p>
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-3 py-1.5 skew-x-[-10deg] bg-blueprint-amber text-blueprint-bg font-display font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 skew-x-[10deg]" />
                  <span className="skew-x-[10deg]">SINKRONISASI ULANG</span>
                </button>
              </motion.div>
            ) : null}

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
                      <Award className="w-3 h-3" /> TINGKAT EXP
                    </div>
                    {loading ? (
                      <div className="w-24 h-16 animate-pulse bg-blueprint-teal/20 rounded" />
                    ) : (
                      <div className="font-display font-black text-6xl md:text-7xl text-blueprint-teal drop-shadow-[0_0_15px_rgba(94,234,212,0.5)] leading-none">
                        {summary?.level ?? 1}
                      </div>
                    )}
                    <span className="font-mono text-[9px] bg-blueprint-teal/10 text-blueprint-teal border border-blueprint-teal/30 px-2 py-0.5 mt-2 inline-block font-bold">
                      RANK: DEV_ELITE
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <div className="font-mono text-[10px] tracking-widest text-blueprint-textSec">
                      AKUMULASI POIN (EXP)
                    </div>
                    {loading ? (
                      <div className="w-28 h-7 animate-pulse bg-blueprint-teal/20" />
                    ) : (
                      <div className="font-display font-black text-3xl text-blueprint-text tracking-wide">
                        {summary?.totalExp.toLocaleString() ?? 0}{" "}
                        <span className="text-xs text-blueprint-teal font-mono">
                          PTS
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
                        PROGRES MENUJU LEVEL{" "}
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
                        ? "MEMPROSES SINKRONISASI..."
                        : summary && summary.requiredExp > 0
                          ? `${summary.currentExp} / ${summary.requiredExp} EXP`
                          : "STATUS PENGALAMAN MAKSIMAL"}
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
                        <Award className="w-3.5 h-3.5" /> STATUS LEGENDARIS —
                        SELURUH TINGKAT PENGALAMAN TERCAPAI
                      </span>
                    ) : summary ? (
                      <>
                        <span>
                          Dibutuhkan tambahan{" "}
                          <span className="text-blueprint-teal font-bold">
                            {summary.requiredExp - summary.currentExp} EXP
                          </span>{" "}
                          untuk mencapai LEVEL {summary.level + 1}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] text-blueprint-teal">
                          <span className="inline-block w-2 h-2 rotate-45 bg-blueprint-amber animate-ping" />
                          <span>INDIKATOR LOKASI SAAT INI</span>
                        </span>
                      </>
                    ) : (
                      <span>Menunggu pembaruan data...</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Language Breakdown - Paginated Tactical Card Carousel */}
            <motion.div
              variants={itemVariants}
              className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] p-6 md:p-8 relative"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-blueprint-teal/20">
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold">
                  <Languages className="w-4 h-4 text-blueprint-amber" />
                  PROFISIENSI BAHASA PEMROGRAMAN & STACK
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
                        onClick={() => setLangPage((p) => Math.max(0, p - 1))}
                        disabled={langPage === 0}
                        className="p-1.5 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                        aria-label="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4 text-blueprint-teal" />
                      </button>
                      <button
                        onClick={() =>
                          setLangPage((p) =>
                            Math.min(totalLangPages - 1, p + 1),
                          )
                        }
                        disabled={langPage === totalLangPages - 1}
                        className="p-1.5 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                        aria-label="Halaman Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4 text-blueprint-teal" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid Content with Framer Motion Animation */}
              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={langPage}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-14 animate-pulse bg-blueprint-teal/10 border border-blueprint-teal/10"
                        />
                      ))
                    ) : currentLanguages && currentLanguages.length > 0 ? (
                      currentLanguages.map((lang) => {
                        const icon = languageIcon(lang.name);
                        return (
                          <div
                            key={lang.name}
                            className="group flex items-center justify-between gap-3 border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-4 py-3 transition-all relative overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-blueprint-teal/30 group-hover:bg-blueprint-teal transition-colors" />
                            <div className="flex items-center gap-3 min-w-0 pl-1">
                              {icon ? (
                                <img
                                  src={icon}
                                  alt={lang.name}
                                  className="w-5 h-5 shrink-0 filter drop-shadow"
                                />
                              ) : (
                                <Code2 className="w-5 h-5 text-blueprint-teal shrink-0" />
                              )}
                              <div className="truncate">
                                <span className="text-sm text-blueprint-text font-bold block truncate group-hover:text-blueprint-teal transition-colors">
                                  {lang.name}
                                </span>
                                <span className="font-mono text-[9px] text-blueprint-textSec block">
                                  +{lang.expPerProject} EXP / PROYEK
                                </span>
                              </div>
                            </div>
                            <span className="font-mono text-xs text-blueprint-teal font-bold shrink-0 bg-blueprint-teal/10 border border-blueprint-teal/20 px-2.5 py-1">
                              {lang.totalExp} EXP
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-sm text-blueprint-textSec py-12 text-center font-mono">
                        Belum ada rekam data bahasa pemrograman terdeteksi.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicator Footer */}
              <div className="mt-4 pt-3 border-t border-blueprint-teal/10 text-[10px] font-mono text-blueprint-textSec flex items-center justify-between">
                <span>TOTAL TEKNOLOGI: {totalLangItems}</span>
                <span>
                  MENAMPILKAN {currentLanguages?.length || 0} DATA PER SLIDE
                </span>
              </div>
            </motion.div>

            {/* Project Breakdown - Paginated Tactical Card Carousel */}
            <motion.div
              variants={itemVariants}
              className="border border-blueprint-teal/30 bg-blueprint-bgSec shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] p-6 md:p-8 relative"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-blueprint-teal/20">
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-blueprint-amber font-bold">
                  <FolderGit2 className="w-4 h-4 text-blueprint-amber" />
                  RIWAYAT IMPLEMETASI & INTEGRASI PROYEK
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
                        onClick={() => setProjPage((p) => Math.max(0, p - 1))}
                        disabled={projPage === 0}
                        className="p-1.5 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                        aria-label="Halaman Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4 text-blueprint-teal" />
                      </button>
                      <button
                        onClick={() =>
                          setProjPage((p) =>
                            Math.min(totalProjPages - 1, p + 1),
                          )
                        }
                        disabled={projPage === totalProjPages - 1}
                        className="p-1.5 border border-blueprint-teal/30 bg-blueprint-bg hover:bg-blueprint-teal/20 disabled:opacity-30 disabled:hover:bg-blueprint-bg transition-colors"
                        aria-label="Halaman Berikutnya"
                      >
                        <ChevronRight className="w-4 h-4 text-blueprint-teal" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content List with Framer Motion Animation */}
              <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={projPage}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-2.5"
                  >
                    {loading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-14 animate-pulse bg-blueprint-teal/10 border border-blueprint-teal/10"
                        />
                      ))
                    ) : currentProjects && currentProjects.length > 0 ? (
                      currentProjects.map((proj) => (
                        <div
                          key={proj.name}
                          className="group flex items-center justify-between gap-4 border border-blueprint-teal/20 bg-blueprint-bg/70 hover:border-blueprint-teal/60 hover:bg-blueprint-teal/10 px-4 py-3 transition-all relative"
                        >
                          <div className="min-w-0">
                            <div className="text-sm text-blueprint-text font-bold truncate group-hover:text-blueprint-teal transition-colors flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full shrink-0" />
                              <span className="truncate">{proj.name}</span>
                            </div>
                            <div className="font-mono text-[10px] text-blueprint-textSec truncate pl-3.5 mt-0.5">
                              {proj.languages.length > 0 ? (
                                <span className="text-blueprint-teal/80">
                                  {proj.languages.join(" · ")}
                                </span>
                              ) : (
                                "Tanpa spesifikasi bahasa utama"
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-xs text-blueprint-teal font-bold shrink-0 bg-blueprint-teal/10 border border-blueprint-teal/20 px-3 py-1">
                            +{proj.exp} EXP
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-blueprint-textSec py-12 text-center font-mono">
                        Belum ada rekam data repositori proyek.
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Indicator Footer */}
              <div className="mt-4 pt-3 border-t border-blueprint-teal/10 text-[10px] font-mono text-blueprint-textSec flex items-center justify-between">
                <span>TOTAL REPOSITORI PROYEK: {totalProjItems}</span>
                <span>
                  MENAMPILKAN {currentProjects?.length || 0} DATA PER SLIDE
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
