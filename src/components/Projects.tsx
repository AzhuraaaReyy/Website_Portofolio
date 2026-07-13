import { useState, useMemo } from "react";
import { X, ExternalLink } from "lucide-react";
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
  const [activeFilter, setActiveFilter] = useState<string>("Semua");
  const reducedMotion = useReducedMotion();

  const filterCategories = ["Semua", "Unggulan", "Frontend & 3D", "Backend & System"];

  // Filter projects logic
  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case "Unggulan":
        return projectsData.filter((p) => p.featured);
      case "Frontend & 3D":
        return projectsData.filter((p) => 
          p.tech.includes("React.js") || 
          p.tech.includes("Next.js") || 
          p.tech.includes("React Three Fiber") || 
          p.tech.includes("Three.js")
        );
      case "Backend & System":
        return projectsData.filter((p) => 
          p.tech.includes("Go") || 
          p.tech.includes("NestJS") || 
          p.tech.includes("Node.js") || 
          p.tech.includes("PostgreSQL") || 
          p.tech.includes("Docker") || 
          p.tech.includes("Redis")
        );
      case "Semua":
      default:
        return projectsData;
    }
  }, [activeFilter]);

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
    hidden: { opacity: 0, y: reducedMotion ? 0 : 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-blueprint-bgSec/20 relative section-scroll border-t border-blueprint-teal/10 overflow-hidden">
      {/* Ambient background animations */}
      <AmbientBackground glowIntensity={0.45} parallaxSpeed={1.2} circuitVariant={3} />

      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section Headings */}
        <div className="mb-8 sm:mb-12">
          <div className="font-mono text-xs uppercase tracking-widest text-blueprint-teal mb-2">
            SEC.04 — PROYEK
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-blueprint-text">
            Galeri Proyek
          </h2>
          <div className="w-16 h-1 bg-blueprint-teal mt-4 shadow-[0_0_8px_#5EEAD4]" />
        </div>

        {/* Filter Navigation */}
        <div className="flex overflow-x-auto gap-2.5 mb-8 sm:mb-12 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:pb-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-wider px-4 py-2 border transition-all cursor-pointer ${
                activeFilter === category
                  ? "bg-blueprint-teal text-blueprint-bg border-blueprint-teal font-bold shadow-[0_0_15px_rgba(94,234,212,0.25)]"
                  : "bg-blueprint-bgSec/60 text-blueprint-textSec border-blueprint-teal/10 hover:border-blueprint-teal/30 hover:text-blueprint-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          layout={!reducedMotion}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout={!reducedMotion}
                exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.9 }}
                transition={{ duration: 0.4 }}
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

      {/* Lightbox / Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-blueprint-bg/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.9, y: reducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.9, y: reducedMotion ? 0 : 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-blueprint-bgSec border border-blueprint-teal/20 w-full max-w-3xl rounded-lg overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
            >
              {/* Corner markings (floating fixed) */}
              <div className="absolute top-3 left-4 font-mono text-[8px] text-blueprint-teal/40 pointer-events-none z-20 bg-blueprint-bgSec/60 backdrop-blur-xs px-1 rounded">[PROJECT_VIEW]</div>
              
              {/* Close Button (floating fixed) */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full border border-blueprint-teal/15 bg-blueprint-bg/80 text-blueprint-textSec hover:text-blueprint-teal hover:border-blueprint-teal/50 transition-colors z-30 backdrop-blur-xs cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container for Modal Contents */}
              <div className="overflow-y-auto flex-grow w-full scrollbar-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-blueprint-teal/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* Large Media Display */}
                <div className="aspect-video w-full bg-blueprint-bg relative border-b border-blueprint-teal/15">
                  {selectedProject.mediaType === "video" ? (
                    <video
                      src={selectedProject.mediaUrl}
                      autoPlay
                      loop
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedProject.mediaUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content Panel */}
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {selectedProject.tech.map((techItem) => (
                      <span 
                        key={techItem}
                        className="font-mono text-[9px] text-blueprint-teal border border-blueprint-teal/20 bg-blueprint-bg/60 px-2 py-0.5 rounded"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-blueprint-text mb-4">
                    {selectedProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-blueprint-textSec leading-relaxed mb-6 whitespace-pre-line">
                    {selectedProject.longDesc}
                  </p>

                  {/* Footer Buttons inside modal */}
                  <div className="grid grid-cols-2 gap-3 pt-5 border-t border-blueprint-teal/10 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-blueprint-teal text-blueprint-bg hover:bg-white transition-colors py-2.5 sm:py-3 px-4 sm:px-6 rounded font-bold shadow-[0_0_15px_rgba(94,234,212,0.2)] text-center"
                    >
                      <span className="truncate">
                        <span className="hidden sm:inline">Kunjungi </span>Demo
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    </a>

                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 border border-blueprint-teal/20 hover:border-blueprint-teal/65 text-blueprint-teal hover:bg-blueprint-teal/5 transition-colors py-2.5 sm:py-3 px-4 sm:px-6 rounded text-center"
                    >
                      <GithubIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        <span className="hidden sm:inline">Lihat Repository</span>
                        <span className="sm:hidden">GitHub</span>
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
