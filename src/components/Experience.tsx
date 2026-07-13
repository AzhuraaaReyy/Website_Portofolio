import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { timelineData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

export function Experience() {
  const reducedMotion = useReducedMotion();

  // Animation variants
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: reducedMotion ? 0 : -20 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" as any }
    }
  };

  return (
    <section id="experience" className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/10 overflow-hidden">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.3} parallaxSpeed={0.9} circuitVariant={2} />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Section Headings */}
        <div className="mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-2">
            SEC.05 — PENGALAMAN & PENDIDIKAN
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-blueprint-text">
            Riwayat & Kontribusi
          </h2>
          <div className="w-16 h-1 bg-blueprint-teal mt-4 shadow-[0_0_8px_#5EEAD4]" />
        </div>

        {/* Vertical Timeline container */}
        <div className="relative border-l border-blueprint-teal/20 pl-6 sm:pl-8 ml-4 sm:ml-6 space-y-12">
          {/* Animated line drawing indicator (optional/subtle) */}
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-blueprint-teal via-blueprint-teal/40 to-transparent pointer-events-none" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {timelineData.map((item, idx) => {
              const isWork = item.type === "pengalaman";
              
              return (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Timeline bullet node */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border border-blueprint-teal/30 bg-blueprint-bg flex items-center justify-center group-hover:border-blueprint-teal transition-colors">
                    {isWork ? (
                      <Briefcase className="w-2 h-2 text-blueprint-teal" />
                    ) : (
                      <GraduationCap className="w-2.5 h-2.5 text-blueprint-teal" />
                    )}
                  </span>
                  
                  {/* Active glowing pulse on node */}
                  <span className="absolute -left-[30px] sm:-left-[38px] top-[7.5px] w-1.5 h-1.5 rounded-full bg-blueprint-teal animate-ping opacity-25 group-hover:opacity-75" />

                  {/* Timeline block */}
                  <div className="border border-blueprint-teal/10 bg-blueprint-bgSec/60 backdrop-blur-sm p-6 rounded hover:border-blueprint-teal/20 transition-all hover:shadow-[0_4px_20px_rgba(94,234,212,0.02)]">
                    
                    {/* Header: Title, institution & date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-blueprint-teal/5">
                      <div>
                        <span className="font-mono text-[9px] text-blueprint-teal tracking-wider uppercase mb-1 block">
                          {isWork ? "WORK_RECORD //" : "EDU_RECORD //"} SEC.05_ITM.0{idx+1}
                        </span>
                        <h3 className="text-lg font-bold font-display text-blueprint-text group-hover:text-blueprint-teal transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-blueprint-textSec font-semibold">
                          {item.institution}
                        </p>
                      </div>
                      
                      {/* Period Badge */}
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-blueprint-teal border border-blueprint-teal/10 bg-blueprint-bg/85 px-3 py-1 rounded w-fit h-fit">
                        <Calendar className="w-3.5 h-3.5 text-blueprint-teal/70" />
                        {item.period}
                      </div>
                    </div>

                    {/* Content bullet points */}
                    <ul className="list-none space-y-2.5">
                      {item.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-blueprint-textSec leading-relaxed">
                          <span className="font-mono text-blueprint-teal text-[10px] mt-0.5 select-none">&gt;&gt;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
