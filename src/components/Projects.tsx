import { useState, useMemo } from "react";
import {
  X,
  ExternalLink,
  ShieldAlert,
  Target,
  Layers,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Project } from "../data/portfolioData";
import { projectsData } from "../data/portfolioData";
import { ProjectCard } from "./ProjectCard";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("SEMUA_PROYEK");
  const reducedMotion = useReducedMotion();

  const filterCategories = [
    { key: "SEMUA_PROYEK", label: "Semua Proyek" },
    { key: "PROYEK_UNGGULAN", label: "Proyek Unggulan" },
    { key: "FRONTEND_OPS", label: "Frontend & UI/UX" },
    { key: "FULLSTACK_DEPLOYS", label: "Full-Stack & Backend" },
  ];

  // Logika Filter Proyek
  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "PROYEK_UNGGULAN":
        return projectsData.filter((p) => p.featured);
      case "FRONTEND_OPS":
        return projectsData.filter(
          (p) =>
            p.tech.some(
              (t) =>
                t.includes("React") ||
                t.includes("Vite") ||
                t.includes("Tailwind") ||
                t.includes("Bootstrap"),
            ) && !p.tech.includes("Laravel"),
        );
      case "FULLSTACK_DEPLOYS":
        return projectsData.filter((p) =>
          p.tech.some(
            (t) =>
              t.includes("Laravel") ||
              t.includes("MySQL") ||
              t.includes("PostgreSQL") ||
              t.includes("Supabase") ||
              t.includes("REST API"),
          ),
        );
      case "SEMUA_PROYEK":
      default:
        return projectsData;
    }
  }, [activeFilter]);

  // Statistik Real-Time HUD Counter
  const totalMissions = projectsData.length;
  const priorityCount = projectsData.filter((p) => p.featured).length;

  const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

  // Framer Motion Animation Settings
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="projects"
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden font-mono select-none"
    >
      <AmbientBackground
        glowIntensity={0.2}
        parallaxSpeed={0.8}
        circuitVariant={3}
      />

      <div className="absolute inset-0 z-0 bg-blueprint-bg/85 backdrop-blur-[1px] blueprint-grid bg-grid-size opacity-30 mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        {/* Section Header */}
        <div className="mb-8 flex flex-col items-start gap-3 shrink-0">
          {/* Tag Top Badge */}
          <div className="font-bold text-xs tracking-widest text-blueprint-teal px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-blueprint-amber animate-spin-slow" />
            REKAPITULASI_PROYEK // PORTFOLIO_SHOWCASE
          </div>

          {/* Judul Utama */}
          <div className="relative inline-block group cursor-default">
            <motion.h2
              aria-hidden="true"
              animate={{
                x: [-2, 4, -3, 2, 0],
                y: [0, -1, 1, 0],
                opacity: [0.8, 0.2, 0.9, 0.3, 0.8],
                skewX: [-5, -8, -3, -6, -5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: steps(3),
              }}
              className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-black font-display text-cyan-400 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen whitespace-nowrap"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                filter: "drop-shadow(-2px 0px 2px rgba(6,182,212,0.8))",
              }}
            >
              PORTOFOLIO PROYEK
            </motion.h2>

            <motion.h2
              aria-hidden="true"
              animate={{
                x: [3, -3, 4, -2, 0],
                y: [0, 1, -1, 0],
                opacity: [0.9, 0.3, 0.8, 0.2, 0.9],
                skewX: [-5, -2, -7, -4, -5],
              }}
              transition={{
                duration: 0.45,
                repeat: Infinity,
                repeatType: "mirror",
                ease: steps(2),
                delay: 0.05,
              }}
              className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-black font-display text-rose-500 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen whitespace-nowrap"
              style={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                filter: "drop-shadow(2px 0px 2px rgba(244,63,94,0.8))",
              }}
            >
              PORTOFOLIO PROYEK
            </motion.h2>

            <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10 whitespace-nowrap">
              PORTOFOLIO <span className="text-blueprint-teal">PROYEK</span>
            </h2>
          </div>

          {/* Deskripsi Membentang Penuh */}
          <p className="text-xs sm:text-sm text-slate-300 w-full leading-relaxed border-l-2 border-blueprint-teal/40 pl-3 mt-1">
            Kumpulan proyek rekayasa perangkat lunak nyata yang saya rancang dan
            kembangkan secara end-to-end. Berfokus pada efisiensi logika bisnis,
            integrasi RESTful API, otomatisasi alur kerja, serta optimalisasi
            performa antarmuka pengguna berbasis React dan Laravel.
          </p>
        </div>

        {/* Area Tab Filter & Counter Statistik (Sebaris) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          {/* Tab Filter (Sebelah Kiri) */}
          <div className="flex overflow-x-auto gap-2 pb-1 sm:pb-0 hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex bg-blueprint-bgSec/80 p-1 border border-blueprint-teal/20 backdrop-blur-md skew-x-[-8deg]">
              {filterCategories.map((cat) => {
                const isActive = activeFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveFilter(cat.key)}
                    className={`flex-shrink-0 text-[10px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-2.5 transition-all cursor-pointer relative overflow-hidden ${
                      isActive
                        ? "text-blueprint-teal bg-blueprint-teal/15 shadow-[inset_0_0_15px_rgba(94,234,212,0.2)]"
                        : "text-blueprint-textSec hover:text-blueprint-text hover:bg-blueprint-teal/5"
                    }`}
                  >
                    <span className="skew-x-[8deg] flex items-center gap-2 relative z-10">
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full shadow-[0_0_8px_#5EEAD4] animate-pulse" />
                      )}
                      {cat.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blueprint-teal shadow-[0_0_10px_#5EEAD4]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Counter Badge Statistik (Di Sebelah Paling Kanan) */}
          <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-teal/30 bg-blueprint-bgSec/80 backdrop-blur-md rounded-xs">
              <span className="text-blueprint-textSec">TOTAL PROYEK:</span>
              <span className="text-blueprint-teal font-bold">
                {totalMissions}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-amber/40 bg-blueprint-amber/10 backdrop-blur-md rounded-xs">
              <span className="text-blueprint-amber">UTAMA:</span>
              <span className="text-blueprint-amber font-bold">
                {priorityCount}
              </span>
            </div>
          </div>
        </div>

        {/* Grid Kartu Proyek */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          layout={!reducedMotion}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout={!reducedMotion}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
                transition={{ duration: 0.35 }}
                className="h-full"
              >
                <ProjectCard
                  project={project}
                  onOpenDetails={setSelectedProject}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal Rincian Teknis Proyek (Detail CV) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-10">
            {/* Overlay Latar Belakang */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-blueprint-bg/90 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 pointer-events-none" />
            </motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.95,
                y: reducedMotion ? 0 : 20,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.95,
                y: reducedMotion ? 0 : 20,
              }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.2 }}
              className="bg-blueprint-bgSec/95 border border-blueprint-teal/40 shadow-[0_0_50px_rgba(94,234,212,0.15)] w-full max-w-5xl rounded-xs overflow-hidden relative z-10 flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[82vh]"
            >
              {/* HUD Frame Corner Decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blueprint-teal z-20 pointer-events-none" />

              {/* Sub-Header Bar HUD */}
              <div className="absolute top-0 left-0 w-full h-8 bg-blueprint-teal/10 border-b border-blueprint-teal/30 flex items-center justify-between px-4 z-30 pointer-events-none backdrop-blur-sm">
                <span className="text-[9px] text-blueprint-teal font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blueprint-teal animate-pulse rounded-full" />
                  DOKUMEN_SPESIFIKASI_TEKNIS // ID: {selectedProject.id}
                </span>
              </div>

              {/* Tombol Tutup Modal */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-1 right-2 p-1 text-blueprint-teal hover:bg-blueprint-teal hover:text-blueprint-bg transition-colors z-40 cursor-pointer rounded-xs"
                aria-label="Tutup rincian"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 1. Media Preview Area (Kiri) */}
              <div className="w-full lg:w-7/12 bg-blueprint-bg relative flex flex-col pt-8 lg:border-r border-blueprint-teal/25">
                <div className="flex-grow relative overflow-hidden bg-black/60 flex items-center justify-center min-h-[220px] sm:min-h-[300px]">
                  {selectedProject.mediaType === "video" &&
                  selectedProject.mediaUrl ? (
                    <video
                      src={selectedProject.mediaUrl}
                      autoPlay
                      loop
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        selectedProject.mediaUrl ||
                        "/assets/images/MulyaBakery.png"
                      }
                      alt={selectedProject.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(94,234,212,0.04)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-screen opacity-50" />
                </div>

                <div className="h-8 bg-blueprint-bgSec border-t border-blueprint-teal/20 flex items-center justify-between px-4 text-[9px] text-blueprint-teal/70">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-blueprint-teal" />
                    PRATINJAU_TAMPILAN_SISTEM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    SISTEM_AKTIF
                  </span>
                </div>
              </div>

              {/* 2. Content & Specification Area (Kanan / Scrollable) */}
              <div className="w-full lg:w-5/12 flex flex-col pt-8 bg-blueprint-bgSec/60">
                <div className="overflow-y-auto flex-grow w-full p-5 lg:p-7 hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {/* Status Badge */}
                  {selectedProject.featured && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] text-blueprint-amber font-bold border border-blueprint-amber/40 bg-blueprint-amber/10 px-2.5 py-1 mb-3">
                      <ShieldAlert className="w-3 h-3" />
                      PROYEK_UTAMA
                    </div>
                  )}

                  {/* Judul Proyek */}
                  <h3 className="text-lg sm:text-xl font-black font-display text-blueprint-text mb-3 uppercase tracking-wide leading-snug">
                    {selectedProject.title}
                  </h3>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {selectedProject.tech.map((techItem) => (
                      <span
                        key={techItem}
                        className="text-[9px] text-blueprint-teal border border-blueprint-teal/30 bg-blueprint-teal/10 px-2 py-0.5 rounded-xs"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  {/* Deskripsi Rincian Teknis Ala CV */}
                  <div className="space-y-4 text-xs text-blueprint-textSec leading-relaxed">
                    <div>
                      <span className="text-[10px] text-blueprint-teal font-bold border-b border-blueprint-teal/20 block pb-1 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3 h-3" />
                        DESKRIPSI_DAN_KONTRIBUSI_TEKNIS:
                      </span>
                      <p className="text-justify text-slate-200 pl-3 border-l-2 border-blueprint-teal/30 leading-relaxed whitespace-pre-line">
                        {selectedProject.longDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-4 lg:p-5 bg-blueprint-bg border-t border-blueprint-teal/20 mt-auto shrink-0">
                  <div className="flex flex-col sm:flex-row gap-2.5 font-display font-bold text-xs uppercase tracking-widest">
                    {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg hover:bg-white transition-all py-3 px-4 shadow-[0_0_15px_rgba(94,234,212,0.3)] skew-x-[-8deg] group cursor-pointer"
                      >
                        <span className="skew-x-[8deg] flex items-center gap-2">
                          DEMO_LANGSUNG{" "}
                          <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </a>
                    )}

                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 border border-blueprint-teal/40 bg-blueprint-bgSec text-blueprint-text hover:border-blueprint-teal hover:text-blueprint-teal transition-colors py-3 px-4 skew-x-[-8deg] group cursor-pointer"
                      >
                        <span className="skew-x-[8deg] flex items-center gap-2">
                          <GithubIcon className="w-3.5 h-3.5" /> REPOSITORI
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
