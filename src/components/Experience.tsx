import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, BookOpen, Target, ChevronRight } from "lucide-react";
import { timelineData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

export function Experience() {
  const reducedMotion = useReducedMotion();

  // Hitung stats untuk HUD
  const totalEntries = timelineData.length;
  const workCount = timelineData.filter((t) => t.type === "pengalaman").length;
  const eduCount = timelineData.filter((t) => t.type === "pendidikan").length;

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
      x: reducedMotion ? 0 : -30 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="experience" className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.2} parallaxSpeed={0.9} circuitVariant={2} />

      {/* Grid HUD Overlay */}
      <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-30 pointer-events-none mix-blend-screen" />
      
      {/* Vertical Blueprint layout marks */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Headings (Guild Codex Header) */}
        <div className="mb-16 md:mb-20">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-amber mb-4 px-4 py-1.5 bg-blueprint-amber/10 border-l-4 border-blueprint-amber skew-x-[-10deg] inline-flex items-center gap-2">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              GUILD_CODEX // CAMPAIGN_JOURNAL
            </span>
          </div>
          <div className="relative group cursor-default mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black font-display italic text-transparent uppercase tracking-tighter" style={{ WebkitTextStroke: '2px rgba(138, 147, 166, 0.15)' }}>
              QUEST CHRONICLES
            </h2>
            <h2 className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-7xl font-black font-display italic text-blueprint-text uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(232,236,241,0.2)] clip-text-reveal transition-colors duration-500 hover:text-blueprint-amber">
              QUEST CHRONICLES
            </h2>
          </div>

          {/* Stats HUD Bar (Dynamic Counters) */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] sm:text-xs">
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-teal/20 bg-blueprint-bgSec shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <span className="text-blueprint-textSec">COMPLETED_CAMPAIGNS:</span>
              <span className="text-blueprint-text font-bold">{totalEntries}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-amber/40 bg-blueprint-amber/10 shadow-[inset_0_0_10px_rgba(245,183,84,0.1)]">
              <span className="w-1.5 h-1.5 bg-blueprint-amber rounded-sm animate-pulse" />
              <span className="text-blueprint-amber font-bold">MAIN_QUESTS: {workCount}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border border-blueprint-teal/40 bg-blueprint-teal/10 shadow-[inset_0_0_10px_rgba(94,234,212,0.1)]">
              <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-sm" />
              <span className="text-blueprint-teal font-bold">ACADEMY_TRAINING: {eduCount}</span>
            </div>
          </div>
        </div>

        {/* Vertical Timeline container (Quest Pathway) */}
        <div className="relative border-l-2 border-blueprint-teal/20 pl-6 sm:pl-10 ml-4 sm:ml-6 space-y-16">
          
          {/* Animated line drawing indicator (Quest Route) */}
          <div className="absolute top-0 -left-[2px] w-[2px] h-full bg-gradient-to-b from-blueprint-amber via-blueprint-teal to-transparent opacity-50" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {timelineData.map((item, idx) => {
              const isWork = item.type === "pengalaman";
              
              // Styling colors based on entry type
              const primaryColor = isWork ? "text-blueprint-amber" : "text-blueprint-teal";
              const borderColor = isWork ? "border-blueprint-amber" : "border-blueprint-teal";
              const bgColor = isWork ? "bg-blueprint-amber/10" : "bg-blueprint-teal/10";
              const badgeText = isWork ? "MAIN_QUEST" : "ACADEMY_ARC";
              
              // Identify current/active node (just the most recent one for RPG effect)
              const isActiveNode = idx === 0;

              return (
                <motion.div 
                  key={item.id}
                  variants={itemVariants}
                  className="relative group"
                >
                  {/* Waypoint Icon Node */}
                  <span className={`absolute -left-[35px] sm:-left-[51px] top-0 w-6 h-6 rounded-full border-2 ${isActiveNode ? borderColor : 'border-blueprint-teal/30'} bg-blueprint-bg flex items-center justify-center transition-all duration-300 group-hover:${borderColor} shadow-[0_0_10px_rgba(0,0,0,0.8)] z-20`}>
                    {isWork ? (
                      <Briefcase className={`w-3 h-3 ${isActiveNode ? primaryColor : 'text-blueprint-teal/50'} group-hover:${primaryColor}`} />
                    ) : (
                      <GraduationCap className={`w-3.5 h-3.5 ${isActiveNode ? primaryColor : 'text-blueprint-teal/50'} group-hover:${primaryColor}`} />
                    )}
                  </span>
                  
                  {/* Active glowing pulse on node */}
                  {isActiveNode && (
                    <span className={`absolute -left-[35px] sm:-left-[51px] top-0 w-6 h-6 rounded-full ${bgColor} animate-ping opacity-75 pointer-events-none z-10`} />
                  )}

                  {/* Horizontal connection line to card */}
                  <div className={`absolute -left-6 sm:-left-10 top-3 w-4 sm:w-8 h-px ${isActiveNode ? borderColor : 'bg-blueprint-teal/20'} pointer-events-none`} />

                  {/* Quest Dossier Card */}
                  <div className={`relative bg-blueprint-bgSec/70 backdrop-blur-md border border-blueprint-teal/20 p-6 md:p-8 hover:bg-blueprint-bgSec/90 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:border-blueprint-teal/50 ${isActiveNode ? 'shadow-[0_0_20px_rgba(245,183,84,0.1)]' : ''}`}>
                    
                    {/* Holographic Corner Glyphs */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blueprint-teal/30 group-hover:border-blueprint-teal/80 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blueprint-teal/30 group-hover:border-blueprint-teal/80 transition-colors" />
                    
                    {/* Header: Title, institution & date */}
                    <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6 pb-4 border-b border-blueprint-teal/10 relative">
                      <div className="absolute bottom-0 left-0 w-1/4 h-[1px] bg-gradient-to-r from-blueprint-teal to-transparent" />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border ${borderColor} ${bgColor} ${primaryColor}`}>
                            {badgeText}
                          </span>
                          <span className="font-mono text-[10px] text-blueprint-teal/50 tracking-wider">
                            [QUEST // 0{timelineData.length - idx}]
                          </span>
                        </div>
                        
                        <h3 className={`text-xl md:text-2xl font-black font-display text-blueprint-text group-hover:${primaryColor} transition-colors uppercase tracking-wide drop-shadow-sm`}>
                          {item.title}
                        </h3>
                        <p className="text-sm font-sans font-semibold text-blueprint-textSec flex items-center gap-1.5 mt-1">
                          <Target className="w-3.5 h-3.5 opacity-70" />
                          {item.institution}
                        </p>
                      </div>
                      
                      {/* Quest Era / Date Pill */}
                      <div className="flex shrink-0 items-center gap-2 font-mono text-[10px] text-blueprint-teal border border-blueprint-teal/30 bg-blueprint-bg/80 px-3 py-1.5 shadow-[inset_0_0_8px_rgba(94,234,212,0.1)] skew-x-[-5deg] w-fit">
                        <span className="skew-x-[5deg] flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-blueprint-teal" />
                          {item.period}
                        </span>
                      </div>
                    </div>

                    {/* Quest Objectives (Points) */}
                    <div className="space-y-3">
                      {item.points.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-3 group/obj">
                          {/* Checked Rune Icon */}
                          <div className={`mt-0.5 w-4 h-4 rounded-sm flex items-center justify-center border border-blueprint-teal/30 bg-blueprint-bg shrink-0 group-hover/obj:${borderColor} transition-colors`}>
                            <ChevronRight className={`w-3 h-3 ${primaryColor} opacity-70 group-hover/obj:opacity-100`} />
                          </div>
                          
                          <div className="flex-1">
                            <span className="font-mono text-[8px] text-blueprint-teal/40 block mb-0.5 uppercase tracking-widest">
                              [✓ OBJECTIVE_CLEARED]
                            </span>
                            <p className="text-sm font-sans text-blueprint-textSec leading-relaxed group-hover/obj:text-blueprint-text transition-colors">
                              {point}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quest Card Footer Status */}
                    <div className="mt-8 pt-4 border-t border-blueprint-teal/5 flex justify-between items-center font-mono text-[9px] uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActiveNode ? 'bg-blueprint-amber animate-pulse' : 'bg-blueprint-teal'}`} />
                        <span className={isActiveNode ? 'text-blueprint-amber' : 'text-blueprint-teal'}>
                          STATUS: {isActiveNode ? 'IN_PROGRESS' : 'CAMPAIGN_CLEARED'}
                        </span>
                      </div>
                      <div className="text-blueprint-textSec">
                        <span className="text-blueprint-text">+5000 XP</span> // MASTERY_UP
                      </div>
                    </div>

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
