import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { GraduationCap, Award, FolderGit, Terminal } from "lucide-react";
import { profileData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

export function About() {
  const reducedMotion = useReducedMotion();

  // Highlight Cards data
  const highlights = [
    {
      icon: <GraduationCap className="w-5 h-5 text-blueprint-teal" />,
      title: "Pendidikan",
      detail: "Informatika (SMT 8)",
      desc: "Univ. Komputer Unggulan"
    },
    {
      icon: <FolderGit className="w-5 h-5 text-blueprint-teal" />,
      title: "Produktivitas",
      detail: "15+ Proyek Selesai",
      desc: "Web App & Microservices"
    },
    {
      icon: <Award className="w-5 h-5 text-blueprint-teal" />,
      title: "IPK Kumulatif",
      detail: "3.82 / 4.00",
      desc: "Predikat Pujian (Cum Laude)"
    }
  ];

  // Differentiation points
  const differentiators = [
    {
      label: "ENG.01 // FULL-STACK ARCHITECTURE",
      title: "Sistem End-to-End Terintegrasi",
      desc: "Mampu merancang arsitektur data relasional (Postgres), membangun REST/gRPC API berkecepatan tinggi di backend (Go/Node), hingga membangun antarmuka web responsif berkinerja tinggi (React)."
    },
    {
      label: "ENG.02 // PRODUCTION MINDSET",
      title: "DevOps & Automasi Dasar",
      desc: "Terbiasa mengemas aplikasi dengan Docker, menyusun pipeline CI/CD dasar lewat GitHub Actions, serta melakukan deployment ke VPS AWS EC2 maupun layanan cloud serverless."
    }
  ];

  // Animation variants
  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any }
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15
      }
    }
  };

  return (
    <section id="about" className="py-24 bg-blueprint-bgSec/40 relative overflow-hidden section-scroll border-t border-b border-blueprint-teal/10">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.5} parallaxSpeed={0.8} circuitVariant={1} />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Headings */}
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-2">
            SEC.02 — TENTANG
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-blueprint-text">
            Tentang Saya
          </h2>
          <div className="w-16 h-1 bg-blueprint-teal mt-4 shadow-[0_0_8px_#5EEAD4]" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Avatar Blueprint Schematic */}
          <motion.div 
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-[360px] aspect-[4/5] border border-blueprint-teal/20 bg-blueprint-bgSec rounded p-6 relative shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 font-mono text-[8px] text-blueprint-teal/30">[SYS_ACTIVE]</div>
              <div className="absolute top-2 right-2 font-mono text-[8px] text-blueprint-teal/30">REF: P_02</div>
              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-blueprint-teal/30">SCALE 1:1</div>
              <div className="absolute bottom-2 right-2 font-mono text-[8px] text-blueprint-teal/30">DEV_FRAME</div>

              {/* Avatar Blueprint Graphic */}
              <div className="w-full h-full border border-dashed border-blueprint-teal/15 rounded flex flex-col items-center justify-center relative overflow-hidden bg-blueprint-bg/40">
                {/* Horizontal blueprint line inside avatar block */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-blueprint-teal/10" />
                <div className="absolute left-1/2 top-0 w-px h-full bg-blueprint-teal/10" />

                {/* Avatar SVG Vector */}
                <svg className="w-32 h-32 text-blueprint-teal/40 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid circle */}
                  <circle cx="50" cy="45" r="28" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                  <circle cx="50" cy="45" r="22" stroke="currentColor" strokeWidth="1" />
                  
                  {/* Crosshairs */}
                  <line x1="50" y1="10" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="15" y1="45" x2="85" y2="45" stroke="currentColor" strokeWidth="0.5" />
                  
                  {/* Human shape (Schematic) */}
                  <circle cx="50" cy="40" r="12" stroke="currentColor" strokeWidth="2" fill="#0B1220" />
                  <path d="M26 78C26 66.9543 34.9543 58 46 58H54C65.0457 58 74 66.9543 74 78V82H26V78Z" stroke="currentColor" strokeWidth="2" fill="#0B1220" />
                  
                  {/* Glowing signal points */}
                  <circle cx="50" cy="40" r="2" fill="#5EEAD4" />
                  <circle cx="50" cy="58" r="1.5" fill="#5EEAD4" />
                </svg>

                {/* Live Console Text Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-blueprint-bg/85 border border-blueprint-teal/20 rounded p-2.5 font-mono text-[9px] text-blueprint-teal leading-tight z-10">
                  <div className="flex items-center gap-1.5 mb-1 text-blueprint-amber font-semibold">
                    <Terminal className="w-3 h-3" />
                    <span>SYSTEM_STATUS</span>
                  </div>
                  <div>&gt; HOST: AZHUR_PORT_V4</div>
                  <div>&gt; STATUS: OPEN_TO_WORK</div>
                  <div>&gt; REGION: INDONESIA</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Core Info */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Bio Statement */}
              <motion.p 
                variants={fadeInVariants} 
                className="text-base sm:text-lg text-blueprint-text leading-relaxed mb-6"
              >
                {profileData.bio}
              </motion.p>
              
              <motion.p 
                variants={fadeInVariants} 
                className="text-sm text-blueprint-textSec leading-relaxed mb-8"
              >
                Sebagai engineer, saya mengedepankan presisi di setiap baris kode yang ditulis. Saya yakin bahwa performa website yang prima bukan sekadar bonus, melainkan kebutuhan dasar agar aplikasi sukses di lingkungan production dan melayani pengguna secara andal.
              </motion.p>

              {/* Highlights cards */}
              <motion.div 
                variants={fadeInVariants} 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
              >
                {highlights.map((h, i) => (
                  <div key={i} className="border border-blueprint-teal/10 bg-blueprint-bg/50 p-4 rounded flex flex-col justify-between hover:border-blueprint-teal/30 transition-colors">
                    <div className="mb-3">{h.icon}</div>
                    <div>
                      <h4 className="font-mono text-[10px] text-blueprint-teal/70 uppercase tracking-wider mb-1">{h.title}</h4>
                      <div className="font-display font-bold text-sm text-blueprint-text mb-0.5">{h.detail}</div>
                      <p className="text-[10px] text-blueprint-textSec">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Differentiators */}
              <motion.div variants={fadeInVariants} className="space-y-6 border-t border-blueprint-teal/10 pt-8">
                <h3 className="font-display font-bold text-lg text-blueprint-text mb-4">
                  Mengapa Memilih Saya?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {differentiators.map((d, i) => (
                    <div key={i} className="flex flex-col gap-1.5 relative pl-4 border-l border-blueprint-teal/30">
                      <span className="font-mono text-[9px] text-blueprint-teal tracking-wider uppercase">{d.label}</span>
                      <h4 className="font-display font-semibold text-sm text-blueprint-text">{d.title}</h4>
                      <p className="text-[11px] text-blueprint-textSec leading-relaxed">{d.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
