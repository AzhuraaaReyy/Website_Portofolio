import { useState, useRef } from "react";
import {
  Cpu,
  Layers,
  Database,
  Wrench,
  Terminal,
  Code2,
  Folder,
  Cloud,
  Target,
  CheckCircle2,
} from "lucide-react";

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiThreedotjs,
  SiWebgl,
  SiLaravel,
  SiPhp,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiSupabase,
  SiDocker,
  SiGit,
  SiGithub,
  SiVercel,
  SiNetlify,
  SiLinux,
  SiGnubash,
  SiGraphql,
  SiPostman,
  SiRailway,
  SiFirebase,
  SiFlutter,
  SiDart,
} from "react-icons/si";

import {
  skillsData,
  type Skill,
  type SkillCategory,
} from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { AmbientBackground } from "./ui/AmbientBackground";

// --- IKON KATEGORI ---
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Bahasa Pemrograman":
      return <Terminal className="w-5 h-5 text-blueprint-teal" />;
    case "Frontend Development":
      return <Layers className="w-5 h-5 text-blueprint-teal" />;
    case "Backend Development":
      return <Cpu className="w-5 h-5 text-blueprint-teal" />;
    case "Database & Storage":
    case "Database Systems":
      return <Database className="w-5 h-5 text-blueprint-amber" />;
    case "DevOps & Tools":
    case "Tools & Deployment":
    default:
      return <Wrench className="w-5 h-5 text-blueprint-text" />;
  }
};

// --- MAPPING IKON TEKNOLOGI ---
const getSkillIcon = (skillName: string) => {
  const name = skillName.toLowerCase();
  const iconClass =
    "w-4 h-4 opacity-90 flex-shrink-0 transition-transform group-hover/chip:scale-110";

  if (name.includes("html")) return <SiHtml5 className={iconClass} />;
  if (name.includes("css") && !name.includes("tailwind"))
    return <SiCss className={iconClass} />;
  if (name.includes("javascript") || name === "js")
    return <SiJavascript className={iconClass} />;
  if (name.includes("typescript") || name === "ts")
    return <SiTypescript className={iconClass} />;
  if (name.includes("c++") || name.includes("cpp"))
    return <SiCplusplus className={iconClass} />;
  if (name.includes("python")) return <SiPython className={iconClass} />;

  if (name.includes("react")) return <SiReact className={iconClass} />;
  if (name.includes("next")) return <SiNextdotjs className={iconClass} />;
  if (name.includes("tailwind")) return <SiTailwindcss className={iconClass} />;
  if (name.includes("bootstrap")) return <SiBootstrap className={iconClass} />;
  if (name.includes("three")) return <SiThreedotjs className={iconClass} />;
  if (name.includes("webgl")) return <SiWebgl className={iconClass} />;
  if (name.includes("flutter")) return <SiFlutter className={iconClass} />;
  if (name.includes("dart")) return <SiDart className={iconClass} />;

  if (name.includes("laravel")) return <SiLaravel className={iconClass} />;
  if (name.includes("php")) return <SiPhp className={iconClass} />;
  if (name.includes("node")) return <SiNodedotjs className={iconClass} />;
  if (name.includes("express")) return <SiExpress className={iconClass} />;

  if (name.includes("graphql")) return <SiGraphql className={iconClass} />;
  if (name.includes("postgres")) return <SiPostgresql className={iconClass} />;
  if (name.includes("mongo")) return <SiMongodb className={iconClass} />;
  if (name.includes("mysql")) return <SiMysql className={iconClass} />;
  if (name.includes("redis")) return <SiRedis className={iconClass} />;
  if (name.includes("supabase")) return <SiSupabase className={iconClass} />;

  if (name.includes("docker")) return <SiDocker className={iconClass} />;
  if (name.includes("github")) return <SiGithub className={iconClass} />;
  if (name.includes("git")) return <SiGit className={iconClass} />;
  if (name.includes("postman")) return <SiPostman className={iconClass} />;

  if (name.includes("aws") || name.includes("cloud"))
    return <Cloud className={iconClass} />;
  if (name.includes("vercel")) return <SiVercel className={iconClass} />;
  if (name.includes("netlify")) return <SiNetlify className={iconClass} />;
  if (name.includes("railway")) return <SiRailway className={iconClass} />;
  if (name.includes("firebase")) return <SiFirebase className={iconClass} />;
  if (name.includes("linux")) return <SiLinux className={iconClass} />;
  if (name.includes("bash")) return <SiGnubash className={iconClass} />;

  return <Code2 className={iconClass} />;
};

// --- PALET WARNA TINGKAT KEMAHIRAN & INDICATOR DOT ---
const getProficiencyStyle = (level: string) => {
  switch (level) {
    case "Mahir":
      return {
        color: "text-blueprint-amber",
        bg: "bg-blueprint-amber/10",
        border: "border-blueprint-amber/30 hover:border-blueprint-amber/70",
        glow: "shadow-[0_0_12px_rgba(245,183,84,0.15)]",
        dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]",
      };
    case "Menengah":
      return {
        color: "text-blueprint-teal",
        bg: "bg-blueprint-teal/10",
        border: "border-blueprint-teal/30 hover:border-blueprint-teal/70",
        glow: "shadow-[0_0_12px_rgba(94,234,212,0.15)]",
        dot: "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.9)]",
      };
    case "Dasar":
    default:
      return {
        color: "text-blueprint-textSec",
        bg: "bg-blueprint-bgSec/80",
        border: "border-blueprint-teal/15 hover:border-blueprint-teal/40",
        glow: "shadow-[0_0_6px_rgba(148,163,184,0.1)]",
        dot: "bg-slate-400/50 shadow-[0_0_6px_rgba(148,163,184,0.4)]",
      };
  }
};

/** Reusable Item Skill Chip */
const SkillItem = ({
  skill,
  variants,
}: {
  skill: Skill;
  variants: Variants;
}) => {
  const style = getProficiencyStyle(skill.level);
  const [isHit, setIsHit] = useState(false);

  const triggerHitmarker = () => {
    setIsHit(true);
    setTimeout(() => setIsHit(false), 200);
  };

  return (
    <motion.div
      variants={variants}
      whileHover={{
        x: [0, -3, 3, 0],
        transition: { duration: 0.15 },
      }}
      onClick={triggerHitmarker}
      className={`relative overflow-hidden flex items-center justify-between gap-3 px-3.5 py-2.5 border rounded-xs transition-all duration-150 w-full group/chip cursor-crosshair ${style.bg} ${style.border} ${style.glow}`}
    >
      <AnimatePresence>
        {isHit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 z-20 bg-blueprint-teal/20 backdrop-invert-20 flex items-center justify-center pointer-events-none"
          >
            <div className="w-4 h-4 border border-red-500 rotate-45 flex items-center justify-center">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover/chip:bg-blueprint-teal transition-colors" />

      <div className="flex items-center gap-2.5 min-w-0 z-10 font-mono">
        <div
          className={`p-1.5 rounded-xs bg-blueprint-bg border border-blueprint-teal/20 transition-transform ${style.color}`}
        >
          {getSkillIcon(skill.name)}
        </div>
        <span className="text-xs font-semibold text-blueprint-text group-hover/chip:text-white transition-colors truncate tracking-wide">
          {skill.name}
        </span>
      </div>

      <span
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 z-10 ${style.dot}`}
      />
    </motion.div>
  );
};

/** Reusable Card Kategori Skill dengan Glare Hover Terintegrasi */
const SkillCategoryCard = ({
  category,
  index,
  cardVariants,
  chipVariants,
}: {
  category: SkillCategory;
  index: number;
  cardVariants: Variants;
  chipVariants: Variants;
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%";
    el.style.transition = "650ms ease";
    el.style.backgroundPosition = "100% 100%";
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "650ms ease";
    el.style.backgroundPosition = "-100% -100%";
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4 }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      className="flex flex-col h-full bg-blueprint-bgSec/70 backdrop-blur-md border border-blueprint-teal/25 rounded-xs p-6 transition-all duration-300 shadow-md hover:shadow-blueprint-teal/10 hover:border-blueprint-teal/60 relative group overflow-hidden cursor-pointer font-mono"
    >
      {/* GLARE HOVER OVERLAY LAYER */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `linear-gradient(-45deg, rgba(0,0,0,0) 60%, rgba(94, 234, 212, 0.25) 70%, rgba(0,0,0,0) 100%)`,
          backgroundSize: "250% 250%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "-100% -100%",
        }}
      />

      {/* HEADER CARD */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-blueprint-teal/20 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-blueprint-teal tracking-widest uppercase">
            <Target className="w-3 h-3 text-blueprint-amber animate-pulse" />
            <span>MODUL KEAHLIAN // 0{index + 1}</span>
          </div>
          <h3 className="font-display font-black text-lg text-blueprint-text tracking-wider uppercase group-hover:text-blueprint-teal transition-colors">
            {category.title}
          </h3>
        </div>
        <div className="p-2.5 bg-blueprint-bg border border-blueprint-teal/30 rounded-xs shadow-inner group-hover:border-blueprint-teal/80 transition-colors">
          {getCategoryIcon(category.title)}
        </div>
      </div>

      {/* LIST CHIPS SKILL */}
      <div className="flex flex-col gap-2.5 flex-grow relative z-10">
        {category.skills.map((skill, sIdx) => (
          <SkillItem key={sIdx} skill={skill} variants={chipVariants} />
        ))}
      </div>

      {/* FOOTER CARD */}
      <div className="mt-5 pt-3.5 border-t border-blueprint-teal/15 flex justify-between items-center text-[11px] text-blueprint-textSec relative z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full animate-ping" />
          STATUS MODUL
        </span>
        <span className="font-bold text-blueprint-teal tracking-wider">
          {category.skills.length} TEKNOLOGI / AKTIF
        </span>
      </div>
    </motion.div>
  );
};

// --- KOMPONEN UTAMA ---
export function Skills() {
  const reducedMotion = useReducedMotion();

  const allSkills = skillsData.flatMap((category) => category.skills);
  const totalSkills = allSkills.length;
  const mahirCount = allSkills.filter((s) => s.level === "Mahir").length;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 22,
      },
    },
  };

  const chipVariants: Variants = {
    hidden: { opacity: 0, x: reducedMotion ? 0 : -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

  return (
    <section
      id="skills"
      className="py-24 bg-blueprint-bg relative section-scroll overflow-hidden border-t border-blueprint-teal/20 select-none font-mono"
    >
      <AmbientBackground
        glowIntensity={0.15}
        parallaxSpeed={0.8}
        circuitVariant={2}
      />

      <motion.div
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blueprint-teal/40 to-transparent pointer-events-none z-10"
      />

      <div className="absolute inset-0 z-0 bg-blueprint-bg/90 backdrop-blur-[1px] blueprint-grid bg-grid-size opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12 flex flex-col items-start gap-5 text-left">
          <div className="font-bold text-xs tracking-widest text-blueprint-teal px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-blueprint-amber animate-spin-slow" />
            PROFIL_TEKNIS // TECHNICAL_STACK
          </div>

          <div className="relative inline-block group cursor-default select-none">
            {/* LAYER GLITCH 1: CYAN / TEAL */}
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
              className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-black font-display text-cyan-400 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                filter: "drop-shadow(-2px 0px 2px rgba(6,182,212,0.8))",
              }}
            >
              KAPABILITAS TEKNIS
            </motion.h2>

            {/* LAYER GLITCH 2: ROSE / MAGENTA */}
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
              className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-black font-display text-rose-500 tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen"
              style={{
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                filter: "drop-shadow(2px 0px 2px rgba(244,63,94,0.8))",
              }}
            >
              KAPABILITAS TEKNIS
            </motion.h2>

            {/* TEKS UTAMA */}
            <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10">
              KAPABILITAS TEKNIS
            </h2>
          </div>

          <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-6 pt-4 border-t border-blueprint-teal/15">
            <p className="flex-1 text-justify text-xs sm:text-sm text-slate-300 w-full text-justify leading-relaxed border-l-2 border-blueprint-teal/40 pl-3 mt-2">
              Saya berfokus pada pengembangan aplikasi web dengan pengalaman
              mengerjakan frontend, backend, API, dan basis data. Dalam
              pengembangan frontend, saya menggunakan{" "}
              <span className="text-blueprint-teal font-semibold">
                React dan Tailwind CSS
              </span>{" "}
              untuk membangun antarmuka yang responsif dan terstruktur,
              sementara{" "}
              <span className="text-blueprint-teal font-semibold">Laravel</span>{" "}
              saya gunakan untuk pengembangan backend dan layanan API. Saya juga
              memiliki pengalaman menggunakan{" "}
              <span className="text-blueprint-teal font-semibold">Flutter</span>{" "}
              dalam pengembangan aplikasi mobile. Teknologi di bawah ini
              mencerminkan tools yang pernah saya gunakan dalam proyek dan
              dikelompokkan berdasarkan area pengembangannya.
            </p>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 text-xs text-blueprint-textSec flex-shrink-0 w-full sm:w-auto lg:min-w-[230px]">
              <div className="flex items-center justify-between gap-3 bg-blueprint-bgSec/60 border border-blueprint-teal/20 px-3.5 py-2.5 rounded-xs">
                <span className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-blueprint-teal" />
                  <span>KATEGORI:</span>
                </span>
                <strong className="text-blueprint-teal">
                  {skillsData.length} AREA
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 bg-blueprint-bgSec/60 border border-blueprint-teal/20 px-3.5 py-2.5 rounded-xs">
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blueprint-amber" />
                  <span>TOTAL STACK:</span>
                </span>
                <strong className="text-blueprint-amber">
                  {totalSkills} TEKNOLOGI
                </strong>
              </div>

              <div className="flex items-center justify-between gap-3 bg-blueprint-bgSec/60 border border-blueprint-teal/20 px-3.5 py-2.5 rounded-xs">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DIGUNAKAN:</span>
                </span>
                <strong className="text-emerald-400">
                  {mahirCount} TEKNOLOGI
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Modul Kategori Skill */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {skillsData.map((category, idx) => (
            <SkillCategoryCard
              key={idx}
              category={category}
              index={idx}
              cardVariants={cardVariants}
              chipVariants={chipVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}