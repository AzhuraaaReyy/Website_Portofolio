import { useState, useMemo } from "react";
import { X, ExternalLink, ShieldAlert, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Project } from "../data/portfolioData";
import { projectsData } from "../data/portfolioData";
import { ProjectCard } from "./ProjectCard";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AmbientBackground } from "./ui/AmbientBackground";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("ALL_MISSIONS");
  const reducedMotion = useReducedMotion();

  const filterCategories = ["ALL_MISSIONS", "PRIORITY_ONE", "FRONTEND_OPS", "FULLSTACK_DEPLOYS"];

  // Filter projects logic
  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "PRIORITY_ONE":
        return projectsData.filter((p) => p.featured);
      case "FRONTEND_OPS":
        // Filter proyek yang dominan frontend atau 3D berdasarkan array tech di portfolioData.ts
        return projectsData.filter((p) => 
          p.tech.some(t => 
            t === "React.js" || 
            t === "Next.js" || 
            t === "React Three Fiber" ||
            t === "Three.js"
          ) && !p.tech.includes("Go") && !p.tech.includes("NestJS") // Kecualikan yang terlalu backend
        );
      case "FULLSTACK_DEPLOYS":
        // Filter proyek yang memiliki stack backend / fullstack
        return projectsData.filter((p) => 
          p.tech.some(t => 
            t === "Go" || 
            t === "Node.js" || 
            t === "NestJS" || 
            t === "PostgreSQL" || 
            t === "MongoDB" ||
            t === "MQTT Broker"
          )
        );
      case "ALL_MISSIONS":
      default:
        return projectsData;
    }
  }, [activeFilter]);

  // Statistik Real-Time HUD Counter
  const totalMissions = projectsData.length;
  const priorityCount = projectsData.filter((p) => p.featured).length;

  // Framer Motion Animation Settings
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section id="projects" className="py-24 bg-blueprint-bg relative section-scroll border-t border-blueprint-teal/20 overflow-hidden">
      <AmbientBackground glowIntensity={0.3} parallaxSpeed={1.2} circuitVariant={3} />

      <div className="absolute inset-0 z-0 bg-blueprint-bg/85 backdrop-blur-[1px] blueprint-grid bg-grid-size opacity-40 mix-blend-screen pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Tactical FPS Header (Mission Briefing Area) */}
        <div className="mb-10 md:mb-16 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="font-mono font-bold text-xs tracking-widest text-blueprint-teal mb-4 px-3 py-1 bg-blueprint-teal/10 border-l-4 border-blueprint-teal inline-flex items-center gap-2">
            <Target className="w-3.5 h-3.5" />
            TACTICAL_OPERATIONS
          </div>
          
          <div className="relative group cursor-default mb-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-transparent tracking-tighter uppercase italic skew-x-[-5deg]" style={{ WebkitTextStroke: '2px rgba(138, 147, 166, 0.15)' }}>
              COMBAT DEPLOYMENTS
            </h2>
            <h2 className="absolute top-0 left-0 text-4xl md:text-5xl lg:text-6xl font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(232,236,241,0.2)] hover:text-blueprint-teal transition-colors duration-500 uppercase italic skew-x-[-5deg] clip-text-reveal">
              COMBAT DEPLOYMENTS
            </h2>
          </div>

          {/* Subtitle / Counter Real-time mission stats HUD */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-blueprint-teal/20 bg-blueprint-bgSec rounded-sm">
              <span className="text-blueprint-textSec">DEPLOYED:</span>
              <span className="text-blueprint-teal font-bold">{totalMissions}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-blueprint-amber/40 bg-blueprint-amber/10 rounded-sm">
              <span className="text-blueprint-amber">PRIORITY_ONE:</span>
              <span className="text-blueprint-amber font-bold">{priorityCount}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-blueprint-teal/40 bg-blueprint-teal/10 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blueprint-teal animate-pulse" />
              <span className="text-blueprint-teal font-bold">STATUS: ALL_SYSTEMS_GO</span>
            </div>
          </div>
        </div>

        {/* Mission Filter Switcher (Filter Tabs) */}
        <div className="flex overflow-x-auto gap-2 mb-10 pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex bg-blueprint-bgSec p-1 border border-blueprint-teal/20 backdrop-blur-sm skew-x-[-10deg]">
            {filterCategories.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`flex-shrink-0 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "text-blueprint-teal bg-blueprint-teal/10 shadow-[inset_0_0_15px_rgba(94,234,212,0.2)]"
                      : "text-blueprint-textSec hover:text-blueprint-text hover:bg-blueprint-teal/5"
                  }`}
                >
                  <span className="skew-x-[10deg] flex items-center gap-2 relative z-10">
                    {isActive && <span className="w-1 h-1 bg-blueprint-teal rounded-full shadow-[0_0_5px_#5EEAD4] animate-pulse" />}
                    {category}
                  </span>
                  {isActive && (
                    <>
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blueprint-teal shadow-[0_0_10px_#5EEAD4]" />
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full animate-[shimmer_2s_infinite]" />
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Area - Operations Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          layout={!reducedMotion}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout={!reducedMotion}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.95 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <ProjectCard 
                  project={project}
                  onOpenDetails={setSelectedProject}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox / Tactical Intel Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-12">
            
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-blueprint-bg/95 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-blueprint-grid bg-grid-size opacity-20 pointer-events-none" />
            </motion.div>

            {/* Modal Body - Sci-Fi Briefing Window */}
            <motion.div
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.95, y: reducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.95, y: reducedMotion ? 0 : 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-blueprint-bg border-2 border-blueprint-teal shadow-[0_0_50px_rgba(94,234,212,0.15)] w-full max-w-5xl rounded-sm overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              
              {/* Corner Targets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blueprint-teal z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blueprint-teal z-20 pointer-events-none" />

              {/* Holographic Header Bar */}
              <div className="absolute top-0 left-0 w-full h-8 bg-blueprint-teal/10 border-b border-blueprint-teal/30 flex items-center justify-between px-4 z-30 pointer-events-none backdrop-blur-sm">
                <span className="font-mono text-[9px] text-blueprint-teal font-bold tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blueprint-teal animate-pulse" />
                  SYS.INTEL_DECRYPTED // ID: {selectedProject.id}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-1 right-2 p-1 text-blueprint-teal hover:bg-blueprint-teal hover:text-blueprint-bg transition-colors z-40 cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Layout Split: Media (Left/Top) & Content (Right/Bottom) */}
              
              {/* 1. Tactical Media Viewport */}
              <div className="w-full md:w-1/2 lg:w-3/5 bg-blueprint-bgSec relative flex flex-col pt-8 md:border-r border-blueprint-teal/30">
                <div className="flex-grow relative overflow-hidden bg-black flex items-center justify-center">
                  {selectedProject.mediaType === "video" ? (
                    <video
                      src={selectedProject.mediaUrl}
                      autoPlay
                      loop
                      controls
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={selectedProject.mediaUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-contain"
                    />
                  )}
                  {/* Scanline overlay over media */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(94,234,212,0.05)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-screen opacity-50" />
                </div>
                
                {/* Media Footer Coordinates */}
                <div className="h-8 bg-blueprint-bg border-t border-blueprint-teal/20 flex items-center justify-between px-4 font-mono text-[8px] text-blueprint-teal/50">
                  <span>RES: 1920x1080</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/> LIVE_FEED_ONLINE</span>
                </div>
              </div>

              {/* 2. Content Area (Scrollable) */}
              <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col pt-8 bg-blueprint-bg">
                <div className="overflow-y-auto flex-grow w-full p-6 lg:p-8 scrollbar-none [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-blueprint-teal/30">
                  
                  {/* Priority Tag */}
                  {selectedProject.featured && (
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] text-blueprint-amber font-bold border border-blueprint-amber/40 bg-blueprint-amber/10 px-2 py-1 mb-4 shadow-[0_0_10px_rgba(245,183,84,0.2)]">
                      <ShieldAlert className="w-3 h-3" />
                      PRIORITY_ONE
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-black font-display italic text-blueprint-text mb-4 uppercase drop-shadow-md">
                    {selectedProject.title}
                  </h3>

                  {/* Tech stack badges (Payload) */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {selectedProject.tech.map((techItem) => (
                      <span 
                        key={techItem}
                        className="font-mono text-[9px] text-blueprint-teal border border-blueprint-teal/30 bg-blueprint-teal/10 px-2 py-0.5 rounded-sm"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  {/* Mission Brief */}
                  <div className="mb-2">
                    <span className="font-mono text-[10px] text-blueprint-teal/60 border-b border-blueprint-teal/20 block pb-1 mb-3">MISSION_OBJECTIVES:</span>
                    <p className="text-sm text-blueprint-textSec font-sans leading-relaxed whitespace-pre-line pl-3 border-l-2 border-blueprint-teal/30">
                      {selectedProject.longDesc}
                    </p>
                  </div>
                </div>

                {/* Footer Buttons Action (Sticky Bottom) */}
                <div className="p-6 bg-blueprint-bg border-t border-blueprint-teal/20 mt-auto">
                  <div className="flex flex-col sm:flex-row gap-3 font-display font-bold text-xs uppercase tracking-widest">
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg hover:bg-white transition-all py-3 px-4 shadow-[0_0_15px_rgba(94,234,212,0.3)] skew-x-[-10deg] group"
                    >
                      <span className="skew-x-[10deg] flex items-center gap-2">
                        LAUNCH_DEMO <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </a>

                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 border border-blueprint-teal/40 bg-blueprint-bgSec text-blueprint-text hover:border-blueprint-teal hover:text-blueprint-teal transition-colors py-3 px-4 skew-x-[-10deg] group"
                    >
                      <span className="skew-x-[10deg] flex items-center gap-2">
                        <GithubIcon className="w-4 h-4" /> SOURCE_CODE
                      </span>
                    </a>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
