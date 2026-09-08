import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { profileData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

// Data untuk 3 Operator Specs - dengan teks lebih profesional
const operators = [
  {
    id: "fullstack",
    title: "FULLSTACK_ARCHITECT",
    classTag: "ARCHITECT",
    imagePath: profileData.avatar || "/assets/images/Foto1.jpeg",
    lore: "Membangun fondasi kuat dan antarmuka presisi. Mengerti lanskap arsitektur dari lapisan database hingga render klien.",
    bio: profileData.bio, // Menggunakan bio asli dari data
    stats: [
      { name: "SYSTEM_DESIGN", value: 95, color: "bg-blueprint-teal" },
      { name: "BACKEND_LOGIC", value: 85, color: "bg-blueprint-amber" },
      { name: "DATABASE_OPS", value: 80, color: "bg-blueprint-teal" }
    ],
    quests: [
      { year: "2023", title: "Microservices Architecture", desc: "Membangun sistem terdistribusi scalable dengan Go & Docker." },
      { year: "2024", title: "Production Deployment", desc: "Menangani rilis skala besar ke ekosistem Cloud VPS & Serverless." }
    ],
    avatarSvg: (
      <svg className="w-48 h-48 text-blueprint-teal/80 relative z-10 drop-shadow-[0_0_20px_rgba(94,234,212,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_30s_linear_infinite]" />
        <path d="M50 25L70 40V65L50 80L30 65V40L50 25Z" stroke="currentColor" strokeWidth="2" fill="rgba(94,234,212,0.15)" />
        <path d="M50 35L62 45V58L50 68L38 58V45L50 35Z" stroke="currentColor" strokeWidth="1" fill="rgba(94,234,212,0.3)" />
        <circle cx="50" cy="52" r="4" fill="#5EEAD4" className="animate-pulse" />
      </svg>
    )
  },
  {
    id: "frontend",
    title: "FRONTEND_ENGINEER",
    classTag: "CLIENT_SIDE",
    imagePath: profileData.avatar || "/assets/images/Foto1.jpeg",
    lore: "Menerjemahkan sistem kompleks menjadi interaksi visual intuitif. Berfokus pada performa render dan state management.",
    bio: "Spesialisasi mendalam pada ekosistem antarmuka klien. Terbiasa menangani manajemen state kompleks, optimasi performa rendering, dan membangun komponen UI/UX interaktif tingkat tinggi tanpa mengorbankan aksesibilitas Web.",
    stats: [
      { name: "REACT_MASTERY", value: 98, color: "bg-blueprint-teal" },
      { name: "ANIMATION_GSAP", value: 85, color: "bg-blueprint-teal" },
      { name: "3D_WEBGL", value: 70, color: "bg-blueprint-amber" }
    ],
    quests: [
      { year: "2023", title: "SPA Performance", desc: "Memangkas waktu muat halaman aplikasi TTI hingga 40%." },
      { year: "2024", title: "Interactive Canvas", desc: "Mengembangkan engine visual 3D menggunakan WebGL & React Three Fiber." }
    ],
    avatarSvg: (
      <svg className="w-48 h-48 text-blueprint-amber/80 relative z-10 drop-shadow-[0_0_20px_rgba(245,183,84,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" className="animate-[spin_20s_linear_infinite_reverse]" />
        <path d="M50 15L80 50L50 85L20 50L50 15Z" stroke="currentColor" strokeWidth="2" fill="rgba(245,183,84,0.15)" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1" fill="rgba(245,183,84,0.3)" />
        <circle cx="50" cy="50" r="4" fill="#F5B754" className="animate-ping" />
      </svg>
    )
  },
  {
    id: "uiux",
    title: "UI_UX_RESEARCHER",
    classTag: "VISIONARY",
    imagePath: profileData.avatar || "/assets/images/Foto1.jpeg",
    lore: "Merancang kerangka kerja antarmuka manusia-mesin. Menggabungkan psikologi pengguna dengan hierarki data visual.",
    bio: "Berfokus pada perancangan antarmuka yang presisi dan sistem desain yang terukur. Menggunakan riset pengguna dan wireframing canggih untuk menjembatani antara kebutuhan produk yang kompleks dengan kemudahan penggunaan (usability) bagi pengguna akhir.",
    stats: [
      { name: "WIREFRAMING", value: 90, color: "bg-blueprint-teal" },
      { name: "DESIGN_SYSTEM", value: 88, color: "bg-blueprint-teal" },
      { name: "USER_RESEARCH", value: 75, color: "bg-blueprint-amber" }
    ],
    quests: [
      { year: "2023", title: "Design System V1", desc: "Membangun sistem desain terpusat (Tokens & UI Components)." },
      { year: "2024", title: "Usability Audit", desc: "Meningkatkan metrik konversi pengguna sebesar 25% melalui redesain." }
    ],
    avatarSvg: (
      <svg className="w-48 h-48 text-blueprint-teal/80 relative z-10 drop-shadow-[0_0_20px_rgba(94,234,212,0.6)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" className="animate-pulse" />
        <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="2" fill="rgba(94,234,212,0.15)" transform="rotate(45 50 50)" />
        <rect x="35" y="35" width="30" height="30" stroke="currentColor" strokeWidth="1" fill="rgba(94,234,212,0.3)" />
        <circle cx="50" cy="50" r="4" fill="#5EEAD4" />
      </svg>
    )
  }
];

export function About() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeOp = operators[activeIndex];

  // Konfigurasi animasi transisi karakter
  const slideVariants: Variants = {
    initial: { opacity: 0, x: reducedMotion ? 0 : 40, filter: "blur(10px)" },
    animate: { 
      opacity: 1, 
      x: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0, 
      x: reducedMotion ? 0 : -40, 
      filter: "blur(10px)",
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="about" className="py-24 bg-blueprint-bg relative overflow-hidden section-scroll border-t border-blueprint-teal/20">
      <AmbientBackground glowIntensity={0.2} parallaxSpeed={0.3} circuitVariant={1} />
      
      {/* Grid HUD Overlay */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* 1. Section Header */}
        <div className="mb-10 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="font-mono text-blueprint-teal text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blueprint-teal rounded-full animate-pulse" />
            // DOSSIER_FILE_01
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-blueprint-text tracking-tight uppercase italic skew-x-[-5deg]">
            SPECIALIZATION PROFILES
          </h2>
        </div>

        {/* 2. Character Switcher Bar (Tabs) */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-12 border-b border-blueprint-teal/20 pb-4">
          {operators.map((op, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={op.id}
                onClick={() => setActiveIndex(index)}
                className={`flex-1 relative font-mono text-xs md:text-sm font-bold tracking-widest px-4 py-3 md:py-4 transition-all duration-300 skew-x-[-10deg] ${
                  isActive 
                    ? "bg-blueprint-bgSec border border-blueprint-teal text-blueprint-teal shadow-[0_0_15px_rgba(94,234,212,0.2)]" 
                    : "border border-transparent text-blueprint-textSec hover:text-blueprint-text hover:bg-blueprint-bgSec/50"
                }`}
              >
                <div className="skew-x-[10deg] flex items-center justify-center gap-2">
                  {isActive && <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full animate-pulse shadow-[0_0_8px_#5EEAD4]" />}
                  <span>{op.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Main Stage (AnimatePresence for smooth switching) */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOp.id}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
            >
              
              {/* LEFT COLUMN: Photo Visual & Quick Stats */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* HUD Photo Frame */}
                <div className="w-full aspect-[4/5] sm:aspect-square bg-blueprint-bgSec/40 backdrop-blur-md relative border border-blueprint-teal/30 p-2 sm:p-4 skew-x-[-2deg] group shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                  
                  {/* Corner ticks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blueprint-teal z-20" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blueprint-teal z-20" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blueprint-teal z-20" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blueprint-teal z-20" />
                  
                  {/* Image Container with Sci-Fi Overlays */}
                  <div className="relative w-full h-full border border-blueprint-teal/15 overflow-hidden group-hover:border-blueprint-teal/40 transition-colors">
                    
                    {/* The Profile Photo */}
                    <img 
                      src={activeOp.imagePath} 
                      alt={profileData.name} 
                      className="w-full h-full object-cover object-center grayscale-[20%] contrast-[1.1] saturate-[1.1] brightness-[0.9] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />

                    {/* Colored overlay tint (gives the blueprint/cyber feel) */}
                    <div className="absolute inset-0 bg-blueprint-teal/10 mix-blend-screen pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Scanline pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(94,234,212,0.08)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-overlay opacity-60" />
                    
                    {/* Inner glowing vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(11,18,32,0.8)_100%)] pointer-events-none" />
                    
                    {/* Animated vertical scan bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blueprint-teal/50 shadow-[0_0_15px_#5EEAD4] opacity-40 animate-[scan_4s_ease-in-out_infinite]" />
                  </div>
                  
                  <div className="absolute bottom-4 left-6 font-mono text-[9px] text-blueprint-teal/70 bg-blueprint-bg/60 backdrop-blur-xs px-2 py-1 border border-blueprint-teal/20 z-20">
                    ID_MATCH: {activeOp.id.toUpperCase()}_77X
                  </div>
                </div>

                {/* Character Badge Box */}
                <motion.div variants={itemVariants} className="bg-blueprint-bgSec/80 border-l-4 border-blueprint-teal p-5 backdrop-blur-sm font-mono text-xs text-blueprint-textSec flex flex-col gap-3 shadow-lg">
                  <div className="flex justify-between border-b border-blueprint-teal/10 pb-2">
                    <span className="text-blueprint-teal/60">SENIORITY:</span>
                    <span className="text-blueprint-text font-bold">PROFESSIONAL</span>
                  </div>
                  <div className="flex justify-between border-b border-blueprint-teal/10 pb-2">
                    <span className="text-blueprint-teal/60">CLASS:</span>
                    <span className="text-blueprint-teal font-bold">{activeOp.classTag}</span>
                  </div>
                  <div className="flex justify-between border-b border-blueprint-teal/10 pb-2">
                    <span className="text-blueprint-teal/60">LOCATION:</span>
                    <span className="text-blueprint-text">Indonesia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blueprint-teal/60">STATUS:</span>
                    <span className="text-blueprint-amber animate-pulse">AVAILABLE_FOR_HIRE</span>
                  </div>
                </motion.div>

              </div>

              {/* RIGHT COLUMN: About Me Data & Skill Tree */}
              <div className="lg:col-span-7 flex flex-col gap-8 lg:mt-2">
                
                {/* OPERATOR BIO */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-display font-bold text-xl text-blueprint-text italic uppercase">
                      PROFESSIONAL_BIO
                    </h3>
                    <div className="flex-1 h-px bg-blueprint-teal/20" />
                  </div>
                  <p className="text-base font-sans text-blueprint-textSec leading-relaxed bg-blueprint-bgSec/20 p-5 border border-blueprint-teal/10 rounded-sm">
                    {activeOp.bio}
                  </p>
                  <p className="text-sm font-mono text-blueprint-teal/80 mt-4 pl-4 border-l-2 border-blueprint-teal italic">
                    "{activeOp.lore}"
                  </p>
                </motion.div>

                {/* ATTRIBUTES (Skill Bars) */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="font-display font-bold text-xl text-blueprint-text italic uppercase">
                      TECHNICAL_CAPABILITIES
                    </h3>
                    <div className="flex-1 h-px bg-blueprint-teal/20" />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {activeOp.stats.map((stat, idx) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-mono text-xs font-bold text-blueprint-text">
                          <span>{stat.name}</span>
                          <span className={stat.color === 'bg-blueprint-teal' ? 'text-blueprint-teal' : 'text-blueprint-amber'}>
                            {stat.value} / 100
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-blueprint-bgSec rounded-sm overflow-hidden border border-blueprint-teal/20">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                            className={`h-full ${stat.color} shadow-[0_0_10px_currentColor]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* QUEST LOG */}
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-5">
                    <h3 className="font-display font-bold text-xl text-blueprint-text italic uppercase">
                      ACHIEVEMENT_LOG
                    </h3>
                    <div className="flex-1 h-px bg-blueprint-teal/20" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {activeOp.quests.map((quest, idx) => (
                      <div key={idx} className="bg-blueprint-bgSec/40 border border-blueprint-teal/20 p-4 flex flex-col sm:flex-row sm:items-center gap-4 group hover:border-blueprint-teal/50 transition-colors">
                        <div className="font-mono font-bold text-blueprint-teal bg-blueprint-teal/10 px-3 py-1 rounded text-sm w-fit border border-blueprint-teal/20">
                          {quest.year}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-blueprint-text uppercase tracking-wide group-hover:text-blueprint-teal transition-colors">
                            {quest.title}
                          </h4>
                          <p className="font-sans text-sm text-blueprint-textSec">
                            {quest.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
              
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
