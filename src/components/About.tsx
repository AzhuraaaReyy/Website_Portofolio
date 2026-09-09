import { useState, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Crosshair,
  Wifi,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";
import { profileData, skillsData, timelineData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

/* ============================================================
   DATA LAYER — `ABOUT_DATA`
   Ganti isi array ini dengan data kamu. Ini SATU-SATUNYA tempat
   merubah seluruh konten halaman About. Struktur tiap slide:
     - id       : kode taktis singkat (misal "01")
     - key      : label unik untuk React key / transisi
     - label    : nama tab (muncul di bottom selector)
     - icon     : ikon untuk tab selector
     - accent   : "teal" | "amber" | "violet" (warna fokus slide)

   Field detail setiap slide berbeda sesuai kategori — ikuti kontrak
   tipe di bawah (AboutData) supaya bersih & reusable.
   ============================================================ */

interface HighlightItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface ArsenalGroup {
  category: string;
  icon: React.ReactNode;
  items: { name: string; tier: string; icon?: string }[];
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
  // 01 OVERVIEW
  image?: string;
  bio?: string;
  callouts?: string[];
  highlights?: HighlightItem[];
  // 02 SKILL_TREE
  arsenal?: ArsenalGroup[];
  // 03 FIELD_OPS
  missions?: MissionEntry[];
  // 04 ACADEMY
  education?: AcademyEntry[];
  // 05 CONTACT
  channels?: ContactChannel[];
  deploy?: { label: string; href: string };
};

const AboutData: AboutSlide[] = [
  /* ================= 01 · OVERVIEW ================= */
  {
    id: "01",
    key: "overview",
    label: "Tentang Saya",
    icon: <Target className="w-3.5 h-3.5" />,
    accent: "teal",
    headline: "Profil Ringkas",
    image: profileData.avatar,
    bio: profileData.bio,
    callouts: [
      profileData.tagline,
      "Fokus membangun aplikasi web modern yang cepat, responsif, dan nyaman digunakan dari sisi antarmuka hingga basis data.",
    ],
    highlights: [
      {
        icon: <Target className="w-4 h-4" />,
        label: "Peran Utama",
        value: "Fullstack Developer",
      },
      {
        icon: <Award className="w-4 h-4" />,
        label: "Latar Belakang",
        value: "Fresh Graduate",
      },
      {
        icon: <Cpu className="w-4 h-4" />,
        label: "Stack Utama",
        value: "React · Node · Laravel",
      },
      {
        icon: <Rocket className="w-4 h-4" />,
        label: "Status",
        value: "Siap Bekerja / Freelance",
      },
    ],
  },

  /* ================= 02 · SKILL_TREE ================= */
  {
    id: "02",
    key: "skill_tree",
    label: "Keahlian",
    icon: <Crosshair className="w-3.5 h-3.5" />,
    accent: "amber",
    headline: "Penguasaan Teknologi",
    arsenal: buildArsenal(),
  },

  /* ================= 03 · FIELD_OPS ================= */
  {
    id: "03",
    key: "field_ops",
    label: "Pengalaman",
    icon: <Briefcase className="w-3.5 h-3.5" />,
    accent: "teal",
    headline: "Riwayat Proyek & Peran",
    missions: timelineData
      .filter((t) => t.type === "pengalaman")
      .map((t) => ({
        role: t.title,
        org: t.institution,
        period: t.period,
        summary: t.points[0] ?? "",
        tags: t.points.slice(1, 3),
      })),
  },

  /* ================= 04 · ACADEMY ================= */
  {
    id: "04",
    key: "academy",
    label: "Pendidikan",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    accent: "violet",
    headline: "Latar Belakang Akademis",
    education: timelineData
      .filter((t) => t.type === "pendidikan")
      .map((t) => ({
        type: "education",
        title: t.title,
        org: t.institution,
        period: t.period,
        note: t.points[0] ?? "",
      })),
  },

  /* ================= 05 · CONTACT_HQ ================= */
  {
    id: "05",
    key: "contact",
    label: "Kontak",
    icon: <UserPlus className="w-3.5 h-3.5" />,
    accent: "amber",
    headline: "Hubungi Saya",
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
        value: "Indonesia",
        href: "#",
      },
    ],
    deploy: { label: "Kirim Pesan / Diskusi Proyek", href: "#contact" },
  },
];

/* ============================================================
   Builder data dari portfolioData.ts (tetap terpusat, tidak duplikat)
   ============================================================ */
function buildArsenal(): ArsenalGroup[] {
  const star = (n: number) => "★★★★★".slice(0, n);
  const findTier = (name: string): string => {
    const found = skillsData
      .flatMap((c) => c.skills)
      .find((s) => s.name === name);
    if (!found) return "★★★★☆";
    return found.level === "Mahir"
      ? star(5)
      : found.level === "Menengah"
        ? star(4)
        : star(3);
  };

  return [
    {
      category: "Frontend_Dev",
      icon: <Code2 className="w-4 h-4" />,
      items: [
        {
          name: "React.js",
          tier: findTier("React.js"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        },
        {
          name: "Next.js",
          tier: findTier("Next.js"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
        },
        {
          name: "TypeScript",
          tier: findTier("TypeScript"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
        },
        {
          name: "Tailwind CSS",
          tier: findTier("Tailwind CSS"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
        },
      ],
    },
    {
      category: "Backend_Dev",
      icon: <Cpu className="w-4 h-4" />,
      items: [
        {
          name: "Laravel",
          tier: findTier("Laravel"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
        },
        {
          name: "Node.js",
          tier: findTier("Node.js"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        },
        {
          name: "Express.js",
          tier: findTier("Express.js"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
        },
        {
          name: "RESTful API",
          tier: findTier("RESTful API"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
        },
      ],
    },
    {
      category: "Cloud_Database",
      icon: <Cloud className="w-4 h-4" />,
      items: [
        {
          name: "PostgreSQL",
          tier: findTier("PostgreSQL"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
        },
        {
          name: "MySQL",
          tier: findTier("MySQL"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        },
        {
          name: "MongoDB",
          tier: findTier("MongoDB"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        },
        {
          name: "Docker",
          tier: findTier("Docker"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
        },
      ],
    },
    {
      category: "Deploy_Ops",
      icon: <Database className="w-4 h-4" />,
      items: [
        {
          name: "Git / GitHub",
          tier: findTier("Git / GitHub"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        },
        {
          name: "Vercel",
          tier: findTier("Vercel"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
        },
        {
          name: "Supabase",
          tier: findTier("Supabase"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
        },
        {
          name: "Linux / Bash",
          tier: findTier("Linux / Bash"),
          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
        },
      ],
    },
  ];
}

/* ============================================================
   Warna aksen per slide (dipetakan ke theme tokens yang ada)
   ============================================================ */
const ACCENT = {
  teal: {
    text: "text-blueprint-teal",
    border: "border-blueprint-teal/40",
    glow: "shadow-[0_0_22px_rgba(94,234,212,0.30)]",
    bgSoft: "bg-blueprint-teal/10",
    bar: "bg-blueprint-teal",
    chip: "bg-blueprint-teal/10 border-blueprint-teal/30 text-blueprint-teal",
    dot: "bg-blueprint-teal",
    hoverBd: "hover:border-blueprint-teal/70",
  },
  amber: {
    text: "text-blueprint-amber",
    border: "border-blueprint-amber/40",
    glow: "shadow-[0_0_22px_rgba(245,183,84,0.28)]",
    bgSoft: "bg-blueprint-amber/10",
    bar: "bg-blueprint-amber",
    chip: "bg-blueprint-amber/10 border-blueprint-amber/30 text-blueprint-amber",
    dot: "bg-blueprint-amber",
    hoverBd: "hover:border-blueprint-amber/70",
  },
  violet: {
    text: "text-[#A78BFA]",
    border: "border-[#A78BFA]/40",
    glow: "shadow-[0_0_22px_rgba(167,139,250,0.28)]",
    bgSoft: "bg-[#A78BFA]/10",
    bar: "bg-[#A78BFA]",
    chip: "bg-[#A78BFA]/10 border-[#A78BFA]/30 text-[#A78BFA]",
    dot: "bg-[#A78BFA]",
    hoverBd: "hover:border-[#A78BFA]/70",
  },
} as const;

type AccentKey = (typeof AboutData)[number]["accent"];

/* Brand icons (lucide-react version doesn't ship Github/Linkedin) */
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

/* ============================================================
   Reusable HUD building blocks
   ============================================================ */
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
      className={`w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 ${c.text} relative z-10 drop-shadow-[0_0_25px_currentColor]`}
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
    <div className="flex items-center gap-2.5 mb-4">
      <span className={`w-1 h-4 ${c.bar} shadow-[0_0_8px_currentColor]`} />
      <h4 className="font-mono font-bold text-[11px] sm:text-xs tracking-[0.2em] uppercase text-blueprint-text">
        {title}
      </h4>
      <div className="flex-1 h-px bg-gradient-to-r from-blueprint-teal/25 to-transparent" />
      <span className={`font-mono text-[9px] ${c.text}`}>▮▮▮</span>
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
      className={`bg-blueprint-bgSec/40 backdrop-blur-md border border-blueprint-teal/10 p-4 sm:p-5 ${className}`}
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

  return (
    <section
      id="about"
      className="relative py-16 md:py-24 bg-blueprint-bg overflow-hidden section-scroll border-t border-blueprint-teal/20"
    >
      <AmbientBackground
        glowIntensity={0.18}
        parallaxSpeed={0.3}
        circuitVariant={2}
      />
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= SECTION HEADER ================= */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-blueprint-teal mb-2">
              <span className="bg-blueprint-teal/10 border border-blueprint-teal/30 px-2 py-0.5">
                Ringkasan Portofolio
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-blueprint-text tracking-tight uppercase italic">
              Operator <span className={accent.text}>{active.label}</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-blueprint-textSec">
            <span>SLIDE</span>
            <span
              className={`px-2 py-0.5 border ${accent.border} ${accent.text} font-bold`}
            >
              {active.id}/{String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ================= STAGE (AnimatePresence) ================= */}
        <AnimatePresence mode="wait" custom={slideDir()}>
          <motion.div
            key={active.key}
            variants={stageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
          >
            {/* ---------- LEFT: Character / Visual Panel ---------- */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div
                className={`relative flex-1 aspect-[4/5] sm:aspect-[5/6] bg-blueprint-bgSec/40 backdrop-blur-md border ${accent.border} ${accent.glow} overflow-hidden flex items-center justify-center transition-shadow duration-500`}
              >
                <HudOverlay />
                {active.image ? (
                  <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                    <img
                      src={active.image}
                      alt={profileData.name}
                      className="w-auto h-full max-h-full object-contain object-center grayscale-[30%] contrast-[1.1] brightness-[0.85] saturate-[0.9]"
                    />
                  </div>
                ) : (
                  <Silhouette accent={active.accent} reduced={reducedMotion} />
                )}
                <div className="absolute bottom-3 left-3 z-20 font-mono text-[9px] text-blueprint-teal/80 bg-blueprint-bg/70 backdrop-blur-sm border border-blueprint-teal/20 px-2 py-1">
                  SLIDE: {active.id}-{active.label.toUpperCase()}
                </div>
                <div className="absolute top-3 right-3 z-20 font-mono text-[9px] text-blueprint-textSec">
                  {active.headline}
                </div>
              </div>

              {/* Arrow controls (desktop-side quick nav) */}
              <div className="flex items-center justify-between gap-3">
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
                      className={`h-1.5 transition-all duration-300 cursor-pointer ${i === activeIndex ? `w-8 ${accent.bar}` : "w-4 bg-blueprint-bgSec border border-blueprint-teal/20 hover:border-blueprint-teal/50"}`}
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
              className="lg:col-span-7 flex flex-col"
            >
              {/* Slide 01 · OVERVIEW */}
              {active.bio && (
                <>
                  <Panel className="mb-5">
                    <BlockHeader
                      accent={active.accent}
                      title="Professional_Summary"
                    />
                    <p className="text-sm sm:text-[15px] text-blueprint-textSec leading-relaxed">
                      {active.bio}
                    </p>
                  </Panel>
                  {active.callouts && (
                    <div className="flex flex-col gap-2 mb-5">
                      {active.callouts.map((c, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className={`flex items-start gap-2 text-[13px] font-mono ${i === 0 ? "text-blueprint-teal" : "text-blueprint-textSec"} border-l-2 border-blueprint-teal/30 pl-3`}
                        >
                          <span className="mt-px">▸</span>
                          <span className="italic">“{c}”</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {active.highlights && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {active.highlights.map((h, i) => (
                        <motion.div
                          key={i}
                          variants={itemVariants}
                          className={`bg-blueprint-bgSec/50 backdrop-blur-sm border ${accent.border} ${accent.hoverBd} p-4 transition-colors`}
                        >
                          <div className={`${accent.text} mb-2`}>{h.icon}</div>
                          <div className="font-mono text-[9px] text-blueprint-textSec uppercase tracking-widest mb-1">
                            {h.label}
                          </div>
                          <div className="font-display font-bold text-blueprint-text text-sm">
                            {h.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Slide 02 · SKILL_TREE */}
              {/* Slide 02 · SKILL_TREE */}
              {active.arsenal && (
                <div className="flex flex-col gap-4">
                  <Panel>
                    <p className="text-sm text-blueprint-textSec leading-relaxed">
                      Daftar teknologi dan alat pengembang yang biasa saya
                      gunakan dalam membangun aplikasi web modern, baik dari
                      sisi antarmuka maupun logika server.
                    </p>
                  </Panel>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {active.arsenal.map((g) => (
                      <motion.div key={g.category} variants={itemVariants}>
                        <Panel className="h-full">
                          <div className="flex items-center gap-2 mb-4 border-b border-blueprint-teal/15 pb-2">
                            <span className={accent.text}>{g.icon}</span>
                            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-blueprint-text">
                              {g.category.replace("_", " ")}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 gap-2.5">
                            {g.items.map((it) => (
                              <div
                                key={it.name}
                                className="group flex items-center justify-between gap-3 p-2 rounded bg-blueprint-bg/50 border border-blueprint-teal/10 hover:border-blueprint-teal/40 transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={it.icon}
                                    alt={it.name}
                                    className="w-5 h-5 object-contain shrink-0 filter drop-shadow-sm group-hover:scale-110 transition-transform"
                                    loading="lazy"
                                  />
                                  <span className="font-mono text-xs text-blueprint-text group-hover:text-blueprint-teal transition-colors truncate">
                                    {it.name}
                                  </span>
                                </div>
                                <span
                                  className={`font-mono text-[10px] ${accent.text} shrink-0`}
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
                <div className="relative flex flex-col gap-4 pl-6 border-l-2 border-blueprint-teal/20">
                  {active.missions.map((m, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="relative"
                    >
                      <span
                        className={`absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full ${accent.dot} shadow-[0_0_8px_currentColor]`}
                      />
                      <Panel className="hover:border-blueprint-teal/40 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h4 className="font-display font-bold text-blueprint-text text-sm uppercase tracking-wide">
                            {m.role}
                          </h4>
                          <span
                            className={`font-mono text-[10px] ${accent.chip} px-2 py-0.5`}
                          >
                            {m.period}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-blueprint-teal/70 mb-2">
                          {m.org}
                        </div>
                        <p className="text-[13px] text-blueprint-textSec leading-relaxed mb-2">
                          {m.summary}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.tags.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-[9px] text-blueprint-textSec bg-blueprint-bg/60 border border-blueprint-teal/10 px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </Panel>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Slide 04 · ACADEMY */}
              {active.education && (
                <div className="flex flex-col gap-4">
                  {active.education.map((e, i) => (
                    <motion.div key={i} variants={itemVariants}>
                      <Panel className={`border-l-4 ${accent.border}`}>
                        <div className="pl-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="font-display font-bold text-blueprint-text text-sm uppercase tracking-wide">
                              {e.title}
                            </h4>
                            <span
                              className={`font-mono text-[10px] ${accent.chip} px-2 py-0.5`}
                            >
                              {e.period}
                            </span>
                          </div>
                          <div className="font-mono text-[10px] text-blueprint-teal/70 mb-2">
                            {e.org}
                          </div>
                          <p className="text-[13px] text-blueprint-textSec leading-relaxed">
                            {e.note}
                          </p>
                        </div>
                      </Panel>
                    </motion.div>
                  ))}
                  <motion.div variants={itemVariants}>
                    <div
                      className={`border ${accent.border} p-4 flex items-start gap-3`}
                    >
                      <Award
                        className={`w-5 h-5 ${accent.text} shrink-0 mt-0.5`}
                      />
                      <div>
                        <div className="font-mono text-[10px] text-blueprint-text uppercase tracking-widest mb-1">
                          Pelatihan & Sertifikasi Teknis
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "Dicoding",
                            "IDCamp",
                            "React Advanced",
                            "UI/UX Path",
                          ].map((c) => (
                            <span
                              key={c}
                              className="font-mono text-[9px] text-blueprint-textSec bg-blueprint-bg/60 border border-blueprint-teal/10 px-2 py-0.5"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Slide 05 · CONTACT_HQ */}
              {active.channels && (
                <div className="flex flex-col gap-4">
                  <Panel>
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
                          className={`flex items-center gap-3 border px-4 py-3 transition-all cursor-pointer ${
                            ch.primary
                              ? `border-blueprint-teal ${accent.bgSoft} ${accent.text} ${accent.hoverBd}`
                              : "border-blueprint-teal/15 text-blueprint-textSec hover:border-blueprint-teal/40 hover:text-blueprint-text"
                          }`}
                        >
                          <span className="shrink-0">{ch.icon}</span>
                          <div className="min-w-0">
                            <div className="font-mono text-[9px] uppercase tracking-widest opacity-70">
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
                      className="group relative flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg font-display font-black text-sm px-6 py-4 skew-x-[-8deg] hover:bg-white transition-all shadow-[0_0_22px_rgba(94,234,212,0.45)] hover:shadow-[0_0_34px_rgba(94,234,212,0.8)] cursor-pointer"
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
        <div className="mt-8 md:mt-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-3 border-t border-blueprint-teal/20 pt-5">
          {/* Tab selector */}
          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {AboutData.map((s, i) => {
              const isActive = i === activeIndex;
              const sc = ACCENT[s.accent];
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveIndex(i)}
                  className={`group relative flex items-center gap-1.5 shrink-0 px-3 sm:px-4 py-2.5 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `${sc.border} ${sc.text} bg-blueprint-bgSec/70`
                      : "border-blueprint-teal/15 text-blueprint-textSec bg-blueprint-bgSec/30 hover:border-blueprint-teal/40 hover:text-blueprint-text"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">
                    {s.id}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest">
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

          {/* Prev / Next arrows integrated */}
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
   Nav arrow button (reusable)
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
      className={`group flex items-center gap-2 border font-mono text-xs uppercase tracking-widest transition-all cursor-pointer ${
        compact ? "px-3 py-2.5" : "px-4 py-2"
      } ${
        disabled
          ? "border-blueprint-teal/10 text-blueprint-textSec/40 cursor-not-allowed"
          : "border-blueprint-teal/30 bg-blueprint-bgSec/50 text-blueprint-text hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10"
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
