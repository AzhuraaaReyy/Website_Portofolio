import { useEffect, useState, useRef } from "react";
import {
  Terminal,
  Code,
  ExternalLink,
  ShieldAlert,
  Crosshair,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { profileData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ParticleCanvas } from "./3d/ParticleCanvas";

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

const LinkedinIcon = ({ className }: { className?: string }) => (
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

export function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const heroHeight = rect.height;
      const scrolled = window.scrollY;
      const progress = Math.max(0, Math.min(1, scrolled / heroHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToProjects = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const projectsSection = document.querySelector("#projects");
    if (projectsSection) {
      const offset = 80;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToContact = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      const offset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden section-scroll"
    >
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Hex/Grid Overlay - Game Matchmaking Lobby Style */}
      <div className="absolute inset-0 z-0 bg-blueprint-bg/85 backdrop-blur-[3px] blueprint-grid bg-grid-size opacity-90 mix-blend-screen" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.1)_0%,rgba(11,18,32,0.8)_80%)] pointer-events-none" />

      {/* Decorative Game UI Elements */}
      <div className="absolute left-6 top-24 font-mono text-[10px] text-blueprint-teal/40 hidden md:block">
        <div className="flex items-center gap-2 mb-2">
          <Crosshair className="w-3 h-3" /> SYS.IDENTIFIED
        </div>
        <div>REGION: ASIA_SE</div>
        <div>LATENCY: 12ms</div>
      </div>

      <div className="absolute right-6 top-24 font-mono text-[10px] text-blueprint-amber/40 hidden md:block text-right">
        <div className="flex items-center justify-end gap-2 mb-2">
          <ShieldAlert className="w-3 h-3" /> CLEARANCE_LEVEL
        </div>
        <div>TIER: SENIOR_PROSPECT</div>
        <div>PORT: SECURE</div>
      </div>

      {/* 3D Morphing Canvas */}
      <ParticleCanvas scrollProgress={scrollProgress} />

      {/* Hero Content Center */}
      <div className="w-full max-w-6xl mx-auto px-6 z-10 text-center relative flex-1 flex flex-col items-center justify-center pt-20 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full"
        >
          {/* Top Status Badge (Professional Title) */}
          <motion.div
            variants={itemVariants}
            className="font-display font-black text-xs tracking-widest text-blueprint-bg bg-blueprint-amber px-6 py-1.5 skew-x-[-15deg] mb-6 shadow-[0_0_15px_rgba(245,183,84,0.4)]"
          >
            <span className="skew-x-[15deg] block">
              [{profileData.role.toUpperCase()}]
            </span>
          </motion.div>

          {/* Futuristic Professional Heading */}
          <motion.div
            variants={itemVariants}
            className="relative mb-6 group cursor-default"
          >
            {/* Solid Glow Text (First word) */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-blueprint-teal italic leading-none tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(94,234,212,0.6)] transition-all">
              {profileData.role.split(" ")[0]}
            </h1>
            {/* Solid Glow Text (Second word) */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white italic -mt-5 md:-mt-8 lg:-mt-12 leading-none tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
              {profileData.role.split(" ").slice(1).join(" ")}
            </h1>
          </motion.div>

          {/* Subtitle / Professional Mission Statement */}
          <motion.p
            variants={itemVariants}
            className="font-sans font-medium text-sm md:text-base text-blueprint-textSec max-w-xl mx-auto mb-10 bg-blueprint-bgSec/50 p-4 border-l-4 border-blueprint-teal backdrop-blur-sm"
          >
            "Fokus membangun solusi web fullstack end-to-end dari arsitektur
            backend yang stabil hingga antarmuka frontend yang responsif,
            presisi, dan intuitif."
          </motion.p>

          {/* CTA Buttons (Professional but styled tactically) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md"
          >
            <a
              href="#projects"
              onClick={handleScrollToProjects}
              className="group relative flex-1 bg-blueprint-teal text-blueprint-bg font-display font-black text-sm px-8 py-4 skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center"
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                LIHAT PROYEK
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="group relative flex-1 bg-blueprint-bgSec/80 backdrop-blur-sm text-blueprint-text border-2 border-blueprint-teal/40 font-display font-bold text-sm px-8 py-4 skew-x-[-10deg] hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <span className="skew-x-[10deg]">HUBUNGI SAYA</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* HUD / Footer Status Strip */}
      <div className="absolute bottom-0 left-0 w-full z-10 border-t-2 border-blueprint-teal/30 bg-blueprint-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
          {/* Col 1 */}
          <div className="hidden md:flex items-center gap-3 text-blueprint-textSec font-mono text-xs">
            <Terminal className="w-4 h-4 text-blueprint-teal animate-pulse" />
            <span>
              <span className="text-blueprint-teal font-bold">STATUS:</span>{" "}
              OPEN_FOR_OPPORTUNITIES
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex items-center justify-center gap-3 text-blueprint-textSec font-display font-bold text-xs border-x-0 md:border-x border-blueprint-teal/20 px-4">
            <Code className="w-4 h-4 text-blueprint-teal" />
            <span className="tracking-widest">REACT • TAILWIND • NODE</span>
          </div>

          {/* Col 3 */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <span className="text-blueprint-teal/50 font-mono text-[10px] mr-2">
              PROFESSIONAL_NET:
            </span>
            <a
              href={profileData.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center font-display font-bold text-[10px] uppercase bg-blueprint-bgSec/80 hover:bg-blueprint-teal text-blueprint-text hover:text-blueprint-bg border border-blueprint-teal/30 rounded px-3 py-1.5 transition-all skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center">
                <GithubIcon className="w-3.5 h-3.5 mr-1.5" /> GITHUB
              </span>
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center font-display font-bold text-[10px] uppercase bg-blueprint-bgSec/80 hover:bg-blueprint-teal text-blueprint-text hover:text-blueprint-bg border border-blueprint-teal/30 rounded px-3 py-1.5 transition-all skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center">
                <LinkedinIcon className="w-3.5 h-3.5 mr-1.5" /> LINKEDIN
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
