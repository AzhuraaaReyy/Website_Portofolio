import { useState, useRef } from "react";
import { ExternalLink, ZoomIn, Volume2, VolumeX, ShieldAlert } from "lucide-react";
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
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-blueprint-bgSec/60 backdrop-blur-sm border border-blueprint-teal/20 group hover:border-blueprint-teal/60 hover:bg-blueprint-bgSec/90 transition-all duration-500 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(94,234,212,0.15)]">
      
      {/* Decorative Border Corner Ticks */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blueprint-teal/40 group-hover:border-blueprint-teal transition-colors z-20 pointer-events-none" />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blueprint-teal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

      {/* Tactical Media Viewport */}
      <div 
        className="relative aspect-video w-full overflow-hidden bg-blueprint-bg border-b border-blueprint-teal/20 cursor-pointer"
        onClick={() => onOpenDetails(project)}
      >
        {/* Animated Scanline over media */}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(94,234,212,0.05)_50%)] bg-[length:100%_4px] pointer-events-none mix-blend-screen opacity-50" />

        {/* Tactical Crosshair Overlays */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-blueprint-teal/20 pointer-events-none z-10" />
        <div className="absolute left-1/2 top-0 w-px h-full bg-blueprint-teal/20 pointer-events-none z-10" />
        
        {/* Tactical Status Overlay */}
        <div className="absolute top-2 right-2 z-20 font-mono text-[8px] tracking-widest text-blueprint-teal/70 flex items-center gap-1.5 bg-blueprint-bgSec/60 px-1.5 py-0.5 rounded-sm backdrop-blur-sm">
          <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
          {project.mediaType === "video" ? "FEED: LIVE_DRONE_STREAM" : "INTEL_RECORDING"}
        </div>

        {project.mediaType === "video" ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={project.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
            />
            {/* Unmute/Mute button on hover */}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 z-30 p-2 rounded-sm bg-blueprint-bgSec/90 border border-blueprint-teal/40 text-blueprint-teal hover:border-blueprint-teal hover:bg-blueprint-teal/20 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md cursor-pointer"
              title={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
        ) : (
          <img
            src={project.mediaUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
            loading="lazy"
          />
        )}

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-blueprint-bgSec/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-blueprint-teal/50 flex items-center justify-center shadow-[0_0_20px_rgba(94,234,212,0.4)]">
              <ZoomIn className="w-5 h-5 text-blueprint-teal" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-blueprint-teal drop-shadow-md">
              FULL_INTEL
            </span>
          </div>
        </div>

        {/* Priority Tag Box */}
        {project.featured && (
          <div className="absolute top-0 left-0 z-20 bg-blueprint-amber/90 text-blueprint-bg font-display font-black italic text-[9px] uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(245,183,84,0.4)] clip-path-polygon-[0_0,100%_0,90%_100%,0_100%] pr-6 border-b border-r border-blueprint-amber">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3" />
              PRIORITY_ONE
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between flex-grow relative z-10">
        <div>
          {/* Top Bar: Mission ID & Tag */}
          <div className="flex justify-between items-center font-mono text-[9px] text-blueprint-teal/50 tracking-widest uppercase mb-3">
            <span>ID: M_0{project.id.slice(-1)}</span>
            <span className={`flex items-center gap-1.5 ${project.featured ? 'text-blueprint-amber font-bold' : ''}`}>
              <span className={`w-1.5 h-1.5 rounded-sm ${project.featured ? 'bg-blueprint-amber animate-pulse' : 'bg-blueprint-teal/60'}`} />
              {project.featured ? 'PRIORITY_ONE' : 'STANDARD_OP'}
            </span>
          </div>

          {/* Title */}
          <h3 
            className="font-display font-black text-xl md:text-2xl text-blueprint-text group-hover:text-blueprint-teal transition-colors mb-2 uppercase tracking-wide cursor-pointer"
            onClick={() => onOpenDetails(project)}
          >
            {project.title}
          </h3>

          {/* Intel Summary */}
          <p className="text-sm text-blueprint-textSec leading-relaxed font-sans mb-5 line-clamp-3">
            {project.shortDesc}
          </p>
          
          {/* Tech Payload Chips (Ammo/Equipment slots style) */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((techItem) => (
              <span 
                key={techItem}
                className="font-mono text-[10px] text-blueprint-teal border border-blueprint-teal/20 bg-blueprint-bg px-2 py-0.5 rounded-sm shadow-[inset_0_0_5px_rgba(94,234,212,0.1)]"
              >
                {techItem}
              </span>
            ))}
          </div>
        </div>

        {/* Tactical Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-blueprint-teal/15 mt-auto">
          
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-blueprint-teal/30 hover:border-blueprint-teal text-blueprint-textSec hover:text-blueprint-teal transition-colors py-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest skew-x-[-10deg] group/btn"
          >
            <span className="skew-x-[10deg] flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5" /> SOURCE_CODE
            </span>
          </a>

          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-blueprint-teal text-blueprint-bg hover:bg-white transition-all py-2 px-3 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(94,234,212,0.3)] skew-x-[-10deg] group/btn"
          >
            <span className="skew-x-[10deg] flex items-center gap-1.5">
              LAUNCH_DEMO <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </span>
          </a>

        </div>
      </div>
    </div>
  );
}
