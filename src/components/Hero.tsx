import { useEffect, useState, useRef } from "react";
import { ArrowRight, Download, Mail, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { profileData } from "../data/portfolioData";
import { ParticleCanvas } from "./3d/ParticleCanvas";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
      // Calculate scroll progress from 0 (top of page) to 1 (scrolled past hero)
      const progress = Math.max(0, Math.min(1, scrolled / heroHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const projectsSection = document.querySelector("#projects");
    if (projectsSection) {
      const offset = 80;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Varian animasi adaptif berdasarkan prefers-reduced-motion
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: reducedMotion ? 0 : 25
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Custom ease-out
      }
    }
  };

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden section-scroll"
    >
      {/* Blueprint Grid and coordinate markings */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size pointer-events-none opacity-40" />
      
      {/* Accent Blueprint lines */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-blueprint-teal/5 pointer-events-none" />
      <div className="absolute top-3/4 left-0 w-full h-px bg-blueprint-teal/5 pointer-events-none" />
      <div className="absolute left-1/4 top-0 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute right-1/4 top-0 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      {/* Decorative Blueprint coordinate labels */}
      <div className="absolute top-24 left-6 font-mono text-[9px] text-blueprint-teal/30 pointer-events-none select-none hidden sm:block">
        GRID_REF: [52.190 // 4.887]
      </div>
      <div className="absolute bottom-24 right-6 font-mono text-[9px] text-blueprint-teal/30 pointer-events-none select-none hidden sm:block">
        LOC: W_NODE_01 // SEC.01
      </div>

      {/* 3D Morphing Canvas */}
      <ParticleCanvas scrollProgress={scrollProgress} />

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-6 z-10 text-center relative flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Eyebrow Label Bergaya Blueprint */}
          <motion.span 
            variants={itemVariants}
            className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-4 px-3 py-1 border border-blueprint-teal/20 rounded-full bg-blueprint-bgSec/60 backdrop-blur-sm"
          >
            SEC.01 — BERANDA
          </motion.span>

          {/* Code tag style */}
          <motion.div 
            variants={itemVariants}
            className="font-mono text-xs text-blueprint-teal/60 mb-2"
          >
            &lt;engineer-profile&gt;
          </motion.div>

          {/* Name */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 text-blueprint-text"
          >
            {profileData.name}
          </motion.h1>

          {/* Role & Tagline */}
          <motion.h2 
            variants={itemVariants}
            className="text-lg sm:text-2xl md:text-3xl font-display font-medium text-blueprint-teal mb-6 max-w-2xl"
          >
            {profileData.role}
          </motion.h2>

          {/* Subtitle/Value proposition */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-blueprint-textSec mb-10 max-w-xl leading-relaxed"
          >
            {profileData.tagline}. Mahasiswa Teknik Informatika spesialisasi rekayasa sistem terdistribusi & arsitektur web modern.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="font-mono text-xs text-blueprint-teal/60 mb-8"
          >
            &lt;/engineer-profile&gt;
          </motion.div>

          {/* CTA Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={handleScrollToProjects}
              className="group flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg hover:bg-white transition-all duration-300 font-mono text-xs uppercase tracking-wider px-6 py-4 rounded font-bold w-full sm:w-auto shadow-[0_0_20px_rgba(94,234,212,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            >
              Lihat Proyek
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={profileData.cvUrl}
              download
              className="flex items-center justify-center gap-2 border border-blueprint-amber/40 hover:border-blueprint-amber bg-blueprint-bgSec/60 backdrop-blur-sm text-blueprint-amber hover:bg-blueprint-amber/5 transition-all duration-300 font-mono text-xs uppercase tracking-wider px-6 py-4 rounded font-bold w-full sm:w-auto"
            >
              <Download className="w-4 h-4 animate-pulse" />
              Unduh CV
            </a>

            <a
              href="#contact"
              className="flex items-center justify-center gap-2 border border-blueprint-teal/20 hover:border-blueprint-teal/80 bg-blueprint-bgSec/30 backdrop-blur-sm text-blueprint-teal hover:bg-blueprint-teal/5 transition-all duration-300 font-mono text-xs uppercase tracking-wider px-6 py-4 rounded w-full sm:w-auto"
            >
              <Mail className="w-4 h-4" />
              Hubungi Saya
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 pointer-events-none">
        <span className="font-mono text-[9px] text-blueprint-teal/40 tracking-widest uppercase">SCROLL</span>
        <ArrowDown className="w-4 h-4 text-blueprint-teal/40 animate-bounce" />
      </div>
    </section>
  );
}
