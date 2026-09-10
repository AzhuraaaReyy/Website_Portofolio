import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Lanyard from "./Lanyard";
import {
  Crosshair,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Rocket,
  UserPlus,
  GraduationCap,
  Briefcase,
  Cpu,
  Database,
  Cloud,
  Code2,
  Award,
  Target,
  Mail,
  MapPin,
  Server,
  Smartphone,
  Wrench,
} from "lucide-react";
import {
  profileData,
  timelineData,
  aboutOverviewData,
  arsenalData,
  type ArsenalGroupData,
} from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

/* ============================================================
   Interfaces & Types
   ============================================================ */
interface HighlightItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface ArsenalGroup {
  category: string;
  icon: React.ReactNode;
  items: { name: string; tier: string; icon: string }[];
}

interface MissionEntry {
  role: string;
  org: string;
  period: string;
  summary: string;
  tags: string[];
}

interface AcademyEntry {
  type: string;
  title: string;
  org: string;
  period: string;
  note: string;
  tag?: string[];
}

interface ContactChannel {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  primary?: boolean;
}

type AboutSlide = {
  id: string;
  key: string;
  label: string;
  icon: React.ReactNode;
  accent: "teal" | "amber" | "violet";
  headline: string;
  description: string;
  image?: string;
  bio?: string;
  callouts?: string[];
  highlights?: HighlightItem[];
  arsenal?: ArsenalGroup[];
  missions?: MissionEntry[];
  education?: AcademyEntry[];
  channels?: ContactChannel[];
  deploy?: { label: string; href: string };
};

/* ============================================================
   Helper Builders
   ============================================================ */
function renderHighlightIcon(key: string) {
  switch (key) {
    case "target":
      return <Target className="w-4 h-4" />;
    case "award":
      return <Award className="w-4 h-4" />;
    case "cpu":
      return <Cpu className="w-4 h-4" />;
    case "rocket":
      return <Rocket className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
}

function renderCategoryIcon(key: string) {
  switch (key) {
    case "code":
      return <Code2 className="w-4 h-4" />;
    case "server":
      return <Server className="w-4 h-4" />;
    case "smartphone":
      return <Smartphone className="w-4 h-4" />;
    case "database":
      return <Database className="w-4 h-4" />;
    case "wrench":
      return <Wrench className="w-4 h-4" />;
    default:
      return <Code2 className="w-4 h-4" />;
  }
}

function formatLevelToTier(level: "Mahir" | "Menengah" | "Dasar"): string {
  if (level === "Mahir") return "★★★★★";
  if (level === "Menengah") return "★★★";
  return "★★";
}

function buildArsenalFromData(data: ArsenalGroupData[]): ArsenalGroup[] {
  return data.map((g) => ({
    category: g.category,
    icon: renderCategoryIcon(g.iconKey),
    items: g.items.map((it) => ({
      name: it.name,
      tier: formatLevelToTier(it.level),
      icon: it.icon,
    })),
  }));
}

/* ============================================================
   Penyusunan Data Slide Dinamis
   ============================================================ */
const AboutData: AboutSlide[] = [
  {
    id: "01",
    key: "overview",
    label: "Tentang Saya",
    icon: <Target className="w-3.5 h-3.5" />,
    accent: "teal",
    headline: "Profil Ringkas",
    description:
      "Halaman profil personal yang memuat ringkasan latar belakang profesional, filosofi kerja, dan gambaran umum keahlian saya sebagai pengembang web.",
    image: profileData.avatar,
    bio: profileData.bio,
    callouts: aboutOverviewData.callouts,
    highlights: aboutOverviewData.highlights.map((h) => ({
      icon: renderHighlightIcon(h.iconKey),
      label: h.label,
      value: h.value,
    })),
  },
  {
    id: "02",
    key: "skill_tree",
    label: "Keahlian Saya",
    icon: <Crosshair className="w-3.5 h-3.5" />,
    accent: "amber",
    headline: "Penguasaan Teknologi",
    description:
      "Eksplorasi ekosistem alat pengembang dan teknologi yang biasa saya pergunakan dalam membangun aplikasi modern dari sisi frontend maupun backend.",
    image: "",
    arsenal: buildArsenalFromData(arsenalData),
  },
  {
    id: "03",
    key: "field_ops",
    label: "Pengalaman Saya",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    accent: "teal",
    headline: "Riwayat Proyek & Peran",
    description:
      "Rekapitulasi pengalaman teknis, peran profesional, dan proyek-proyek penting yang telah saya kerjakan secara nyata.",
    missions: timelineData
      .filter((t) => t.type === "pengalaman")
      .map((t) => ({
        role: t.title,
        org: t.institution,
        period: t.period,
        summary: t.points[0] ?? "",
        tags: t.points.slice(1),
      })),
  },
  {
    id: "04",
    key: "academy",
    label: "Pendidikan Saya",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    accent: "violet",
    headline: "Latar Belakang Akademis",
    description:
      "Ringkasan jejak pendidikan formal serta program pelatihan/sertifikasi teknis yang menjadi fondasi kompetensi saya.",
    education: timelineData
      .filter((t) => t.type === "pendidikan")
      .map((t) => ({
        type: "education",
        title: t.title,
        org: t.institution,
        period: t.period,
        note: t.points[0] ?? "",
        tag: t.points.slice(1),
      })),
  },
  {
    id: "05",
    key: "contact",
    label: "Kontak Saya",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    accent: "amber",
    headline: "Hubungi Saya",
    description:
      "Daftar saluran komunikasi resmi untuk berdiskusi, berkolaborasi, atau mengajukan tawaran proyek bersama saya.",
    channels: [
      {
        icon: <Mail className="w-4 h-4" />,
        label: "EMAIL",
        value: profileData.email,
        href: `mailto:${profileData.email}`,
        primary: true,
      },
      {
        icon: <GithubIcon className="w-4 h-4" />,
        label: "GITHUB",
        value: "GitHub Profile",
        href: profileData.github,
      },
      {
        icon: <LinkedinIcon className="w-4 h-4" />,
        label: "LINKEDIN",
        value: "LinkedIn Profile",
        href: profileData.linkedin,
      },
      {
        icon: <MapPin className="w-4 h-4" />,
        label: "LOKASI",
        value: aboutOverviewData.location,
        href: "#",
      },
    ],
    deploy: { label: "Kirim Pesan / Diskusi Proyek", href: "#contact" },
  },
];

/* ============================================================
   Warna Aksen Visual
   ============================================================ */
const ACCENT = {
  teal: {
    text: "text-blueprint-teal",
    border: "border-blueprint-teal/40",
    glow: "shadow-[0_0_22px_rgba(94,234,212,0.30)]",
    bgSoft: "bg-blueprint-teal/10",
    bar: "bg-blueprint-teal",
    chip: "bg-blueprint-teal/20 border-blueprint-teal/50 text-blueprint-teal font-semibold font-mono",
    dot: "bg-blueprint-teal",
    hoverBd: "hover:border-blueprint-teal/70",
  },
  amber: {
    text: "text-blueprint-amber",
    border: "border-blueprint-amber/40",
    glow: "shadow-[0_0_22px_rgba(245,183,84,0.28)]",
    bgSoft: "bg-blueprint-amber/10",
    bar: "bg-blueprint-amber",
    chip: "bg-blueprint-amber/20 border-blueprint-amber/50 text-blueprint-amber font-semibold font-mono",
    dot: "bg-blueprint-amber",
    hoverBd: "hover:border-blueprint-amber/70",
  },
  violet: {
    text: "text-[#A78BFA]",
    border: "border-[#A78BFA]/40",
    glow: "shadow-[0_0_22px_rgba(167,139,250,0.28)]",
    bgSoft: "bg-[#A78BFA]/10",
    bar: "bg-[#A78BFA]",
    chip: "bg-[#A78BFA]/20 border-[#A78BFA]/50 text-[#A78BFA] font-semibold font-mono",
    dot: "bg-[#A78BFA]",
    hoverBd: "hover:border-[#A78BFA]/70",
  },
} as const;

type AccentKey = (typeof AboutData)[number]["accent"];

function GithubIcon({ className }: { className?: string }) {
  return (
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
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function HudOverlay() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(94,234,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-60 mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,18,32,0.72)_100%)] pointer-events-none" />
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute w-4 h-4 border-blueprint-teal/50 z-10 ${pos}`}
        />
      ))}
    </>
  );
}

function Silhouette({
  accent,
  reduced,
}: {
  accent: AccentKey;
  reduced: boolean;
}) {
  const c = ACCENT[accent];
  return (
    <svg
      className={`w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 ${c.text} relative z-10 drop-shadow-[0_0_25px_currentColor]`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeDasharray="5 10"
        className={reduced ? "" : "animate-[spin_24s_linear_infinite]"}
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 12"
        className={reduced ? "" : "animate-[spin_18s_linear_infinite_reverse]"}
      />
      <path
        d="M50 14L82 34V66L50 86L18 66V34L50 14Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <circle
        cx="50"
        cy="50"
        r="16"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="currentColor"
        className={reduced ? "" : "animate-pulse"}
      />
      {["M14 28 v-8 h8", "M78 14 h8 v8", "M86 72 v8 h-8", "M22 86 h-8 v-8"].map(
        (d, i) => (
          <path
            key={i}
            d={d}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ),
      )}
    </svg>
  );
}

interface BlockHeaderProps {
  accent: AccentKey;
  title: string;
}

function BlockHeader({ accent, title }: BlockHeaderProps) {
  const c = ACCENT[accent];
  return (
    <div className="flex items-center gap-2.5 mb-4 font-mono">
      <span className={`w-1 h-4 ${c.bar} shadow-[0_0_8px_currentColor]`} />
      <h4 className="font-bold text-[11px] sm:text-xs tracking-[0.2em] uppercase text-blueprint-text">
        {title}
      </h4>
      <div className="flex-1 h-px bg-gradient-to-r from-blueprint-teal/25 to-transparent" />
      <span className={`text-[9px] ${c.text}`}>▮▮▮</span>
    </div>
  );
}

function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-blueprint-bgSec/60 backdrop-blur-md border border-blueprint-teal/20 p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reducedMotion = useReducedMotion();
  const active = AboutData[activeIndex];
  const accent = ACCENT[active.accent];
  const total = AboutData.length;
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;

  const go = (dir: number) => {
    setActiveIndex((i) => Math.min(total - 1, Math.max(0, i + dir)));
  };

  const stageVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : dir * 70,
      filter: reducedMotion ? "blur(0px)" : "blur(8px)",
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reducedMotion ? 0 : -dir * 70,
      filter: reducedMotion ? "blur(0px)" : "blur(8px)",
      transition: { duration: 0.25, ease: "easeIn" },
    }),
  };

  const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.07 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const prevIndex = useRef(activeIndex);
  const slideDir = (): number => {
    const dir = activeIndex >= prevIndex.current ? 1 : -1;
    prevIndex.current = activeIndex;
    return dir;
  };
  const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

  return (
    <section
      id="about"
      className="relative min-h-screen h-auto flex flex-col justify-between border-t border-blueprint-teal/20 bg-blueprint-bg font-mono"
    >
      <AmbientBackground
        glowIntensity={0.18}
        parallaxSpeed={0.3}
        circuitVariant={2}
      />
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 pointer-events-none mix-blend-screen" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-between pt-20 pb-12">
        {/* ================= SECTION HEADER ================= */}
        {/* ================= SECTION HEADER ================= */}
        <div className="mb-6 flex flex-col items-start gap-3 shrink-0">
          {/* 1. Tag Ringkasan Portofolio (Selalu di paling atas) */}
          <div className="font-bold text-xs tracking-widest text-blueprint-teal px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
            <Target className="w-3.5 h-3.5 text-blueprint-amber animate-spin-slow" />
            RINGKASAN_PORTOFOLIO // OVERVIEW
          </div>

          {/* 2. Judul Utama (PROFILE TENTANG SAYA) */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full gap-4">
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
                PROFILE <span>{active.label.toUpperCase()}</span>
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
                PROFILE <span>{active.label.toUpperCase()}</span>
              </motion.h2>

              {/* TEKS UTAMA */}
              <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10">
                PROFILE{" "}
                <span className={accent.text}>
                  {active.label.toUpperCase()}
                </span>
              </h2>
            </div>

            {/* Counter Display (Misal: 01/05) */}
            <div className="flex items-center gap-2 text-[10px] text-slate-300 self-start md:self-end">
              <span>SLIDE</span>
              <span
                className={`px-2 py-0.5 border ${accent.border} ${accent.text} font-bold`}
              >
                {active.id}/{String(total).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* 3. Teks Keterangan / Deskripsi */}
          <p className="text-xs sm:text-sm text-slate-300 w-full text-justify leading-relaxed border-l-2 border-blueprint-teal/40 pl-3">
            {active.description}
          </p>
        </div>

        {/* ================= STAGE (AnimatePresence) ================= */}
        <AnimatePresence mode="wait" custom={slideDir()}>
          <motion.div
            key={active.key}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start my-auto w-full"
          >
            {/* ---------- LEFT: Character / Visual Panel ---------- */}
            <div className="lg:col-span-5 flex flex-col justify-start gap-4">
              <div
                className={`relative h-[380px] sm:h-[440px] lg:h-[480px] bg-blueprint-bgSec/40 backdrop-blur-md border ${accent.border} ${accent.glow} overflow-hidden flex items-center justify-center transition-shadow duration-500`}
              >
                <HudOverlay />

                {active.key === "overview" ? (
                  <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
                    <Lanyard
                      position={[0, 0, 16]}
                      gravity={[0, -40, 0]}
                      frontImage={active.image || profileData.avatar}
                      backImage={active.image || profileData.avatar}
                      imageFit="cover"
                      lanyardWidth={1.5}
                    />
                  </div>
                ) : active.image ? (
                  <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                    <img
                      src={active.image}
                      alt={active.label}
                      className="w-auto h-full max-h-full object-contain object-center grayscale-[30%] contrast-[1.1] brightness-[0.85] saturate-[0.9]"
                    />
                  </div>
                ) : (
                  <Silhouette accent={active.accent} reduced={reducedMotion} />
                )}

                <div className="absolute bottom-3 left-3 z-20 text-[9px] text-blueprint-teal/80 bg-blueprint-bg/70 backdrop-blur-sm border border-blueprint-teal/20 px-2 py-1 pointer-events-none">
                  SLIDE: {active.id}-{active.label.toUpperCase()}
                </div>
                <div className="absolute top-3 right-3 z-20 text-[9px] text-slate-300 pointer-events-none">
                  {active.headline}
                </div>
              </div>

              {/* Navigasi panah slide */}
              <div className="flex items-center justify-between gap-3 shrink-0">
                <NavArrow
                  dir="prev"
                  disabled={!canPrev}
                  onClick={() => go(-1)}
                />
                <div className="flex gap-1.5">
                  {AboutData.map((s, i) => (
                    <button
                      key={s.key}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Go to ${s.label}`}
                      className={`h-1.5 transition-all duration-300 cursor-pointer ${
                        i === activeIndex
                          ? `w-8 ${accent.bar}`
                          : "w-4 bg-blueprint-bgSec border border-blueprint-teal/20 hover:border-blueprint-teal/50"
                      }`}
                    />
                  ))}
                </div>
                <NavArrow
                  dir="next"
                  disabled={!canNext}
                  onClick={() => go(1)}
                />
              </div>
            </div>

            {/* ---------- RIGHT: Context-Specific Panel ---------- */}
            <motion.div
              key={`content-${active.key}`}
              variants={listVariants}
              initial="hidden"
              animate="show"
              /*
                Batas tinggi disamakan presisi dengan panel visual kiri (480px di desktop)
                serta ditambahkan kelas overflow-y-auto hide-scrollbar agar bisa di-scroll rapi tanpa scrollbar bawaan
              */
              className="lg:col-span-7 flex flex-col justify-start h-auto lg:h-[532px] max-h-[532px] overflow-y-auto hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full pr-1"
            >
              {/* Slide 01 · OVERVIEW */}
              {active.bio && (
                <div className="flex flex-col justify-start gap-4">
                  <Panel className="shrink-0">
                    <BlockHeader
                      accent={active.accent}
                      title="Ringkasan Profile"
                    />
                    <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {active.bio}
                    </p>
                  </Panel>
                  {active.callouts && (
                    <div className="flex flex-col gap-2 shrink-0">
                      {active.callouts.map((c, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className={`flex items-start gap-2 text-xs sm:text-sm ${
                            i === 0 ? "text-blueprint-teal" : "text-slate-300"
                          } border-l-2 border-blueprint-teal/30 pl-3`}
                        >
                          <span className="mt-px">▸</span>
                          <span className="italic">“{c}”</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {active.highlights && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0">
                      {active.highlights.map((h, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className={`bg-blueprint-bgSec/50 backdrop-blur-sm border ${accent.border} ${accent.hoverBd} p-3 sm:p-4 transition-colors`}
                        >
                          <div className={`${accent.text} mb-1.5`}>
                            {h.icon}
                          </div>
                          <div className="text-[9px] text-slate-300 uppercase tracking-widest mb-1">
                            {h.label}
                          </div>
                          <div className="font-display font-bold text-blueprint-text text-xs sm:text-sm">
                            {h.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Slide 02 · SKILL_TREE */}
              {active.arsenal && (
                <div className="flex flex-col justify-start gap-3.5">
                  <Panel className="shrink-0">
                    <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Daftar teknologi dan alat pengembang yang biasa saya
                      gunakan dalam membangun aplikasi web modern, baik dari
                      sisi antarmuka maupun logika server.
                    </p>
                  </Panel>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {active.arsenal.map((g) => (
                      <motion.div key={g.category} variants={itemVariants}>
                        <Panel className="h-full flex flex-col justify-start">
                          <div className="flex items-center gap-2 mb-3 border-b border-blueprint-teal/15 pb-2">
                            <span className={accent.text}>{g.icon}</span>
                            <h4 className="font-display font-bold text-[11px] sm:text-xs uppercase tracking-widest text-blueprint-text truncate">
                              {g.category.replace("_", " ")}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {g.items.map((it) => (
                              <div
                                key={it.name}
                                className="group flex items-center justify-between gap-2 p-1.5 rounded bg-blueprint-bg/50 border border-blueprint-teal/10 hover:border-blueprint-teal/40 transition-all"
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <img
                                    src={it.icon}
                                    alt={it.name}
                                    className="w-3.5 h-3.5 object-contain shrink-0 filter drop-shadow-sm group-hover:scale-110 transition-transform"
                                    loading="lazy"
                                  />
                                  <span className="text-[10px] sm:text-[11px] text-blueprint-text group-hover:text-blueprint-teal transition-colors truncate">
                                    {it.name}
                                  </span>
                                </div>
                                <span
                                  className={`text-[8px] sm:text-[9px] ${accent.text} shrink-0`}
                                >
                                  {it.tier}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Panel>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 03 · FIELD_OPS */}
              {active.missions && (
                <div className="relative flex flex-col justify-start gap-3.5 pl-6 border-l-2 border-blueprint-teal/30">
                  {active.missions.slice(0, 2).map((m, i) => {
                    const isSecond = i === 1;

                    if (isSecond) {
                      return (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="relative group overflow-hidden shrink-0"
                        >
                          <div className="relative max-h-[250px] sm:max-h-[270px] overflow-hidden opacity-75 select-none pointer-events-none">
                            <span
                              className={`absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full ${accent.dot} shadow-[0_0_8px_currentColor]`}
                            />
                            <Panel>
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <h4 className="font-display font-bold text-white text-sm sm:text-base uppercase tracking-wide min-w-0 flex-1">
                                  {m.role}
                                </h4>
                                <span
                                  className={`text-xs ${accent.chip} px-2.5 py-0.5 shrink-0 whitespace-nowrap ml-auto`}
                                >
                                  {m.period}
                                </span>
                              </div>
                              <div className="text-xs text-blueprint-teal font-medium mb-2">
                                {m.org}
                              </div>
                              <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                                {m.summary}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {m.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="text-xs text-slate-100 bg-blueprint-bg/80 border border-blueprint-teal/30 px-2.5 py-1 rounded-xs"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </Panel>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blueprint-bg/80 to-blueprint-bg flex items-end justify-center">
                            <button
                              onClick={() => {
                                const el =
                                  document.getElementById("experience");
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blueprint-bgSec/95 hover:bg-blueprint-teal/20 border border-blueprint-teal/60 hover:border-blueprint-teal text-blueprint-teal text-xs uppercase tracking-widest backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(94,234,212,0.25)] hover:shadow-[0_0_30px_rgba(94,234,212,0.5)]"
                            >
                              <span>Lihat Semua Pengalaman</span>
                              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="relative shrink-0"
                      >
                        <span
                          className={`absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full ${accent.dot} shadow-[0_0_8px_currentColor]`}
                        />
                        <Panel className="hover:border-blueprint-teal/50 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h4 className="font-display font-bold text-white text-sm sm:text-base uppercase tracking-wide min-w-0 flex-1">
                              {m.role}
                            </h4>
                            <span
                              className={`text-xs ${accent.chip} px-2.5 py-0.5 shrink-0 whitespace-nowrap ml-auto`}
                            >
                              {m.period}
                            </span>
                          </div>
                          <div className="text-xs text-blueprint-teal font-medium mb-2">
                            {m.org}
                          </div>
                          <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                            {m.summary}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.tags.map((t) => (
                              <span
                                key={t}
                                className="text-xs text-slate-100 bg-blueprint-bg/80 border border-blueprint-teal/30 px-2.5 py-1 rounded-xs"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </Panel>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Slide 04 · ACADEMY */}
              {active.education && (
                <div className="flex flex-col justify-start gap-3.5">
                  {active.education.slice(0, 2).map((e, i) => {
                    const isSecond = i === 1;

                    if (isSecond) {
                      return (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className="relative group overflow-hidden shrink-0"
                        >
                          <div className="relative max-h-[250px] sm:max-h-[270px] overflow-hidden opacity-75 select-none pointer-events-none">
                            <Panel className={`border-l-4 ${accent.border}`}>
                              <div className="pl-2.5 sm:pl-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                  <h4 className="font-display font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                                    {e.title}
                                  </h4>
                                  <span
                                    className={`text-xs ${accent.chip} px-2.5 py-0.5`}
                                  >
                                    {e.period}
                                  </span>
                                </div>
                                <div className="text-xs text-blueprint-teal font-medium mb-2">
                                  {e.org}
                                </div>
                                <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                                  {e.note}
                                </p>
                                {e.tag && e.tag.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {e.tag.map((t) => (
                                      <span
                                        key={t}
                                        className="text-xs text-slate-100 bg-blueprint-bg/80 border border-blueprint-teal/30 px-2.5 py-1 rounded-xs"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Panel>
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blueprint-bg/80 to-blueprint-bg flex items-end justify-center">
                            <button
                              onClick={() => {
                                const el =
                                  document.getElementById("experience");
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="group w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blueprint-bgSec/95 hover:bg-[#A78BFA]/20 border border-[#A78BFA]/60 hover:border-[#A78BFA] text-[#A78BFA] text-xs uppercase tracking-widest backdrop-blur-md transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(167,139,250,0.25)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]"
                            >
                              <span>Lihat Semua Pendidikan & Sertifikasi</span>
                              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="shrink-0"
                      >
                        <Panel className={`border-l-4 ${accent.border}`}>
                          <div className="pl-2.5 sm:pl-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-display font-bold text-white text-sm sm:text-base uppercase tracking-wide">
                                {e.title}
                              </h4>
                              <span
                                className={`text-xs ${accent.chip} px-2.5 py-0.5`}
                              >
                                {e.period}
                              </span>
                            </div>
                            <div className="text-xs text-blueprint-teal font-medium mb-2">
                              {e.org}
                            </div>
                            <p className="text-justify text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                              {e.note}
                            </p>
                            {e.tag && e.tag.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {e.tag.map((t) => (
                                  <span
                                    key={t}
                                    className="text-xs text-slate-100 bg-blueprint-bg/80 border border-blueprint-teal/30 px-2.5 py-1 rounded-xs"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Panel>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Slide 05 · CONTACT_HQ */}
              {active.channels && (
                <div className="flex flex-col justify-start gap-3.5">
                  <Panel className="shrink-0">
                    <BlockHeader
                      accent={active.accent}
                      title="Saluran Komunikasi"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {active.channels.map((ch, i) => (
                        <a
                          key={ch.label + i}
                          href={ch.href}
                          target={
                            ch.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel="noreferrer"
                          className={`flex items-center gap-3 border px-3.5 py-2.5 transition-all cursor-pointer ${
                            ch.primary
                              ? `border-blueprint-teal ${accent.bgSoft} ${accent.text} ${accent.hoverBd}`
                              : "border-blueprint-teal/15 text-slate-300 hover:border-blueprint-teal/40 hover:text-white"
                          }`}
                        >
                          <span className="shrink-0">{ch.icon}</span>
                          <div className="min-w-0">
                            <div className="text-[9px] uppercase tracking-widest opacity-70">
                              {ch.label}
                            </div>
                            <div className="font-display font-bold text-xs truncate">
                              {ch.value}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Panel>

                  {active.deploy && (
                    <a
                      href={active.deploy.href}
                      className="group relative flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg font-display font-black text-xs sm:text-sm px-5 py-3.5 skew-x-[-8deg] hover:bg-white transition-all shadow-[0_0_22px_rgba(94,234,212,0.45)] hover:shadow-[0_0_34px_rgba(94,234,212,0.8)] cursor-pointer shrink-0"
                    >
                      <span className="skew-x-[8deg] flex items-center gap-2">
                        <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        {active.deploy.label}
                      </span>
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ================= SINGLE BOTTOM SELECTOR ================= */}
        <div className="mt-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 border-t border-blueprint-teal/20 pt-4 shrink-0">
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1 hide-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {AboutData.map((s, i) => {
              const isActive = i === activeIndex;
              const sc = ACCENT[s.accent];
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveIndex(i)}
                  className={`group relative flex items-center gap-1.5 shrink-0 px-3 sm:px-4 py-2 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${sc.border} ${sc.text} bg-blueprint-bgSec/70`
                      : "border-blueprint-teal/15 text-slate-300 bg-blueprint-bgSec/30 hover:border-blueprint-teal/40 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] opacity-70">{s.id}</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest">
                    {s.icon}
                    {s.label}
                  </span>
                  {isActive && (
                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-current" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 lg:ml-3">
            <NavArrow
              dir="prev"
              disabled={!canPrev}
              onClick={() => go(-1)}
              compact
            />
            <NavArrow
              dir="next"
              disabled={!canNext}
              onClick={() => go(1)}
              compact
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Nav Arrow Button Component
   ============================================================ */
function NavArrow({
  dir,
  disabled,
  onClick,
  compact = false,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous slide" : "Next slide"}
      className={`group flex items-center gap-2 border text-xs uppercase tracking-widest transition-all cursor-pointer ${
        compact ? "px-3 py-2" : "px-4 py-2"
      } ${
        disabled
          ? "border-blueprint-teal/10 text-slate-600 cursor-not-allowed"
          : "border-blueprint-teal/30 bg-blueprint-bgSec/50 text-slate-200 hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10"
      }`}
    >
      {dir === "prev" ? (
        <Icon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      ) : (
        <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      )}
      {!compact && (
        <span className="hidden sm:inline">
          {dir === "prev" ? "Prev" : "Next"}
        </span>
      )}
    </button>
  );
}
