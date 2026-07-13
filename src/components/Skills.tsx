import { Cpu, Layers, Database, Wrench, Terminal } from "lucide-react";
import { skillsData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { AmbientBackground } from "./ui/AmbientBackground";

export function Skills() {
  const reducedMotion = useReducedMotion();

  // Map category titles to icons
  const getIcon = (category: string) => {
    switch (category) {
      case "Bahasa Pemrograman":
        return <Terminal className="w-5 h-5 text-blueprint-teal" />;
      case "Frontend Development":
        return <Layers className="w-5 h-5 text-blueprint-teal" />;
      case "Backend Development":
        return <Cpu className="w-5 h-5 text-blueprint-teal" />;
      case "Database Systems":
        return <Database className="w-5 h-5 text-blueprint-teal" />;
      case "Tools & Deployment":
      default:
        return <Wrench className="w-5 h-5 text-blueprint-teal" />;
    }
  };

  // Familiarity Level dot color helper
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Mahir":
        return "bg-blueprint-teal"; // Green/Teal
      case "Menengah":
        return "bg-blueprint-amber"; // Orange/Amber
      case "Dasar":
      default:
        return "bg-blueprint-textSec"; // Neutral gray
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  };

  const chipVariants: Variants = {
    hidden: { opacity: 0, scale: reducedMotion ? 1 : 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section id="skills" className="py-24 bg-blueprint-bg relative section-scroll overflow-hidden">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.35} parallaxSpeed={1.0} circuitVariant={2} />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section Headings */}
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-2">
            SEC.03 — SKILL
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-blueprint-text">
            Keahlian Teknis
          </h2>
          <div className="w-16 h-1 bg-blueprint-teal mt-4 shadow-[0_0_8px_#5EEAD4]" />
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillsData.map((category, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="border border-blueprint-teal/10 bg-blueprint-bgSec p-6 rounded flex flex-col justify-between hover:border-blueprint-teal/20 transition-all hover:shadow-[0_4px_20px_rgba(94,234,212,0.03)] group"
            >
              <div>
                {/* Card Title & Icon */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-blueprint-teal/10">
                  <h3 className="font-display font-bold text-sm text-blueprint-text uppercase tracking-wider group-hover:text-blueprint-teal transition-colors">
                    {category.title}
                  </h3>
                  <div className="p-2 border border-blueprint-teal/10 bg-blueprint-bg/40 rounded">
                    {getIcon(category.title)}
                  </div>
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill, sIdx) => (
                    <motion.div
                      key={sIdx}
                      variants={chipVariants}
                      className="flex items-center gap-2 border border-blueprint-teal/5 bg-blueprint-bg/60 px-3 py-1.5 rounded hover:border-blueprint-teal/20 transition-colors"
                    >
                      {/* Monospace font for skill name */}
                      <span className="font-mono text-xs text-blueprint-text">
                        {skill.name}
                      </span>
                      
                      {/* Familiarity indicator tag */}
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${getLevelColor(skill.level)}`} />
                        <span className="text-[8px] font-mono text-blueprint-textSec uppercase tracking-wider hidden sm:inline">
                          {skill.level}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Decorative Blueprint layout mark */}
              <div className="mt-8 pt-4 border-t border-dashed border-blueprint-teal/5 flex justify-between font-mono text-[8px] text-blueprint-teal/25">
                <span>NODE_REF: CAT_0{idx + 1}</span>
                <span>STATUS: STABLE</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
