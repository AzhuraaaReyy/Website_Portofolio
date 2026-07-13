import { useState, useRef } from "react";
import { ExternalLink, ZoomIn, Volume2, VolumeX } from "lucide-react";
import type { Project } from "../data/portfolioData";

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project) => void;
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ProjectCard({ project, onOpenDetails }: ProjectCardProps) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div 
      className="border border-blueprint-teal/10 bg-blueprint-bgSec rounded overflow-hidden flex flex-col justify-between hover:border-blueprint-teal/35 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(94,234,212,0.05)] cursor-pointer group"
      onClick={() => onOpenDetails(project)}
    >
      {/* Media Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-blueprint-bg border-b border-blueprint-teal/10">
        {project.mediaType === "video" ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={project.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Unmute/Mute button on hover */}
            <button
              onClick={toggleMute}
              className="absolute bottom-2.5 right-2.5 z-20 p-1.5 rounded-full bg-blueprint-bg/85 border border-blueprint-teal/30 text-blueprint-teal hover:border-blueprint-teal transition-colors opacity-0 group-hover:opacity-100"
              title={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <img
            src={project.mediaUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Hover overlay with zoom icon */}
        <div className="absolute inset-0 bg-blueprint-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 bg-blueprint-teal text-blueprint-bg font-mono text-[10px] font-bold uppercase tracking-wider rounded shadow-[0_0_15px_rgba(94,234,212,0.4)]">
            <ZoomIn className="w-3.5 h-3.5" />
            Detail Proyek
          </div>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 border border-blueprint-amber/40 bg-blueprint-bg/90 rounded text-blueprint-amber font-mono text-[9px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(245,183,84,0.2)]">
            ★ FEATURED
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tech.map((techItem) => (
              <span 
                key={techItem}
                className="font-mono text-[9px] text-blueprint-teal/80 border border-blueprint-teal/10 bg-blueprint-bg/40 px-2 py-0.5 rounded"
              >
                {techItem}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-base sm:text-lg text-blueprint-text group-hover:text-blueprint-teal transition-colors mb-1.5">
            {project.title}
          </h3>

          {/* Short Desc */}
          <p className="text-xs text-blueprint-textSec leading-relaxed mb-4">
            {project.shortDesc}
          </p>
        </div>

        {/* Links & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-dashed border-blueprint-teal/5 font-mono text-[11px]">
          {/* GitHub code */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()} // prevent modal opening
            className="flex items-center gap-1.5 text-blueprint-textSec hover:text-blueprint-text transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            Source Code
          </a>

          {/* Demo Link */}
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()} // prevent modal opening
            className="flex items-center gap-1.5 text-blueprint-teal hover:text-white transition-colors"
          >
            Live Demo
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
