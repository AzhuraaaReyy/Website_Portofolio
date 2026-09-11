import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Calendar,
  BookOpen,
  Building2,
  CheckCircle2,
  Terminal,
  ChevronRight,
} from "lucide-react";
import { timelineData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

// ==================== HELPER COMPONENT: REALISTIC ELECTRIC ARC BORDER ====================
interface ElectricBorderProps {
  color: "teal" | "amber";
  isActive?: boolean;
}

function ElectricBorder({ color, isActive }: ElectricBorderProps) {
  const isAmber = color === "amber";
  const filterId = `electric-displace-${color}`;
  const glowId = `electric-glow-${color}`;

  const strokeColor = isAmber ? "#F5B754" : "#38BDF8";
  const secondaryColor = isAmber ? "#FFE082" : "#5EEAD4";
  const glowColor = isAmber
    ? "rgba(245, 183, 84, 0.45)"
    : "rgba(56, 189, 248, 0.45)";

  return (
    <div
      className={`absolute -inset-[12px] pointer-events-none transition-opacity duration-300 z-20 ${
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {/* Glow Aura di belakang Kartu */}
      <div
        className="absolute inset-[12px] rounded-xs transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: isActive
            ? `0 0 25px 2px ${glowColor}, inset 0 0 15px 1px ${glowColor}`
            : `0 0 20px 1px ${glowColor}`,
        }}
      />

      <svg
        className="w-full h-full absolute inset-0 overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Filter Dispersi Petir (Distorsi Organik) */}
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04 0.07"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="0.13s"
                values="0.04 0.07; 0.08 0.03; 0.03 0.09; 0.07 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Filter Pendaran / Glow Petir */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Busur Petir Utama */}
        <rect
          x="12"
          y="12"
          width="calc(100% - 24px)"
          height="calc(100% - 24px)"
          rx="4"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          filter={`url(#${filterId})`}
          className="opacity-95"
        />

        {/* Layer 2: Pendaran Listrik Tegangan Tinggi */}
        <rect
          x="12"
          y="12"
          width="calc(100% - 24px)"
          height="calc(100% - 24px)"
          rx="4"
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1.5"
          filter={`url(#${filterId}) url(#${glowId})`}
          className="opacity-80"
        />
      </svg>
    </div>
  );
}

export function Experience() {
  const reducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>("SEMUA");

  const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

  const filterCategories = [
    { key: "SEMUA", label: "Semua Riwayat" },
    { key: "PENGALAMAN", label: "Pengalaman Kerja" },
    { key: "PENDIDIKAN", label: "Pendidikan & Pelatihan" },
  ];

  const filteredTimeline = useMemo(() => {
    if (activeFilter === "PENGALAMAN") {
      return timelineData.filter((item) => item.type === "pengalaman");
    }
    if (activeFilter === "PENDIDIKAN") {
      return timelineData.filter((item) => item.type === "pendidikan");
    }
    return timelineData;
  }, [activeFilter]);

  const totalEntries = timelineData.length;
  const workCount = timelineData.filter((t) => t.type === "pengalaman").length;
  const eduCount = timelineData.filter((t) => t.type === "pendidikan").length;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="experience"
      className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden font-mono select-none"
    >
      <AmbientBackground
        glowIntensity={0.2}
        parallaxSpeed={0.8}
        circuitVariant={2}
      />
      <div className="absolute inset-0 z-0 bg-blueprint-bg/85 backdrop-blur-[1px] blueprint-grid bg-grid-size opacity-30 mix-blend-screen pointer-events-none" />

      <div className="absolute top-0 left-6 sm:left-12 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-6 sm:right-12 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* ==================== SECTION HEADER ==================== */}
        <div className="mb-10 flex flex-col items-start gap-3 shrink-0">
          <div className="font-bold text-xs tracking-widest text-blueprint-teal px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-blueprint-amber animate-pulse" />
            REKAPITULASI_KARIR // RIWAYAT_AKADEMIK
          </div>

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
              PENGALAMAN & PENDIDIKAN
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
              PENGALAMAN & PENDIDIKAN
            </motion.h2>

            <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10 whitespace-nowrap">
              PENGALAMAN <span className="">& PENDIDIKAN</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 w-full leading-relaxed border-l-2 border-blueprint-teal/40 pl-3 mt-1">
            Rangkuman perjalanan karier, proyek teknis, dan latar belakang
            pendidikan saya. Berfokus pada pengembangan aplikasi yang andal,
            penulisan kode yang bersih, dan penyelesaian masalah secara nyata.
          </p>
        </div>

        {/* ==================== FILTER TAB & COUNTER HUD ==================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
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

          <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0 self-end sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-teal/30 bg-blueprint-bgSec/80 backdrop-blur-md rounded-xs">
              <span className="text-blueprint-textSec text-[10px]">TOTAL:</span>
              <span className="text-blueprint-teal font-bold">
                {totalEntries}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-amber/40 bg-blueprint-amber/10 backdrop-blur-md rounded-xs">
              <span className="text-blueprint-amber text-[10px]">KERJA:</span>
              <span className="text-blueprint-amber font-bold">
                {workCount}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-teal/40 bg-blueprint-teal/10 backdrop-blur-md rounded-xs">
              <span className="text-blueprint-teal text-[10px]">EDUKASI:</span>
              <span className="text-blueprint-teal font-bold">{eduCount}</span>
            </div>
          </div>
        </div>

        {/* ==================== TIMELINE CONTENT ==================== */}
        <div className="relative border-l-2 border-blueprint-teal/20 pl-6 sm:pl-10 ml-2 sm:ml-6 space-y-12">
          <div className="absolute top-0 -left-[2px] w-[2px] h-full bg-gradient-to-b from-blueprint-amber via-blueprint-teal to-transparent opacity-60 pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-10"
          >
            <AnimatePresence mode="popLayout">
              {filteredTimeline.map((item, idx) => {
                const isWork = item.type === "pengalaman";

                const primaryTextColor = isWork
                  ? "text-blueprint-amber"
                  : "text-blueprint-teal";
                const badgeBorder = isWork
                  ? "border-blueprint-amber/40 bg-blueprint-amber/10 text-blueprint-amber"
                  : "border-blueprint-teal/40 bg-blueprint-teal/10 text-blueprint-teal";
                const nodeBorder = isWork
                  ? "border-blueprint-amber"
                  : "border-blueprint-teal";
                const cardHoverBorder = isWork
                  ? "hover:border-blueprint-amber/50"
                  : "hover:border-blueprint-teal/50";

                const isActiveNode = idx === 0 && activeFilter === "SEMUA";

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout={!reducedMotion}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="relative group"
                  >
                    {/* Waypoint Icon Node */}
                    <span
                      className={`absolute -left-[31px] sm:-left-[47px] top-2 w-7 h-7 rounded-full border-2 ${
                        isActiveNode
                          ? "border-blueprint-amber bg-blueprint-bg shadow-[0_0_15px_rgba(245,183,84,0.6)]"
                          : "border-blueprint-teal/40 bg-blueprint-bg"
                      } flex items-center justify-center transition-all duration-300 group-hover:${nodeBorder} group-hover:scale-110 z-20`}
                    >
                      {isWork ? (
                        <Briefcase
                          className={`w-3.5 h-3.5 ${primaryTextColor}`}
                        />
                      ) : (
                        <GraduationCap
                          className={`w-3.5 h-3.5 ${primaryTextColor}`}
                        />
                      )}
                    </span>

                    {isActiveNode && (
                      <span className="absolute -left-[31px] sm:-left-[47px] top-2 w-7 h-7 rounded-full bg-blueprint-amber/30 animate-ping opacity-75 pointer-events-none z-10" />
                    )}

                    <div
                      className={`absolute -left-6 sm:-left-10 top-5 w-4 sm:w-8 h-px ${
                        isActiveNode
                          ? "bg-blueprint-amber"
                          : "bg-blueprint-teal/30"
                      } group-hover:bg-blueprint-teal transition-colors pointer-events-none`}
                    />

                    {/* ==================== ITEM CARD ==================== */}
                    <div
                      className={`relative bg-blueprint-bgSec/80 backdrop-blur-md border border-blueprint-teal/20 p-6 sm:p-8 rounded-xs transition-all duration-300 ${cardHoverBorder} hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:translate-x-1 ${
                        isActiveNode
                          ? "shadow-[0_0_20px_rgba(245,183,84,0.08)] border-blueprint-amber/40"
                          : ""
                      }`}
                    >
                      {/* EFEK ELECTRIC BORDER (Hanya muncul saat hover untuk semua kartu) */}
                      <ElectricBorder color={isWork ? "amber" : "teal"} />

                      {/* Ornamen Sudut HUD */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-10" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-10" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-10" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-10" />

                      {/* Header Kartu */}
                      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6 pb-4 border-b border-blueprint-teal/15 relative">
                        <div className="absolute bottom-0 left-0 w-1/4 h-[1px] bg-gradient-to-r from-blueprint-teal to-transparent" />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-0.5 border font-bold ${badgeBorder}`}
                            >
                              {isWork
                                ? "PENGALAMAN KERJA"
                                : "PENDIDIKAN & AKADEMIK"}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black font-display text-blueprint-text group-hover:text-blueprint-amber transition-colors uppercase tracking-wide flex items-center gap-2">
                            {item.title}
                          </h3>

                          <p className="text-xs sm:text-sm font-sans font-semibold text-blueprint-textSec flex items-center gap-2 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-blueprint-teal opacity-80" />
                            <span>{item.institution}</span>
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] text-blueprint-teal border border-blueprint-teal/30 bg-blueprint-bg/90 px-3 py-1.5 shadow-[inset_0_0_10px_rgba(94,234,212,0.1)] skew-x-[-6deg] w-fit self-start">
                          <span className="skew-x-[6deg] flex items-center gap-1.5 font-bold">
                            <Calendar className="w-3 h-3 text-blueprint-amber" />
                            {item.period}
                          </span>
                        </div>
                      </div>

                      {/* Tanggung Jawab & Pencapaian Utama */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-blueprint-teal/70 uppercase tracking-widest mb-1">
                          <Terminal className="w-3 h-3 text-blueprint-teal" />
                          <span>TANGGUNG_JAWAB_DAN_PENCAPAIAN_UTAMA:</span>
                        </div>

                        {item.points.map((point, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-3 group/obj"
                          >
                            <div className="mt-0.5 w-4 h-4 rounded-xs flex items-center justify-center border border-blueprint-teal/30 bg-blueprint-bg shrink-0 group-hover/obj:border-blueprint-teal transition-colors">
                              <ChevronRight className="w-3 h-3 text-blueprint-teal group-hover/obj:text-blueprint-amber transition-colors" />
                            </div>

                            {/* Cukup ubah font-sans menjadi font-mono di sini */}
                            <p className="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed group-hover/obj:text-slate-100 transition-colors">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Footer Status Kartu */}
                      <div className="mt-6 pt-4 border-t border-blueprint-teal/10 flex justify-between items-center font-mono text-[9px] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActiveNode
                                ? "bg-blueprint-amber animate-pulse"
                                : "bg-blueprint-teal"
                            }`}
                          />
                          <span
                            className={
                              isActiveNode
                                ? "text-blueprint-amber font-bold"
                                : "text-blueprint-teal/80"
                            }
                          >
                            STATUS: {isActiveNode ? "AKTIF" : "SELESAI"}
                          </span>
                        </div>
                        <div className="text-blueprint-textSec flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blueprint-teal" />
                          <span>KONTRIBUSI_TERVERIFIKASI</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
