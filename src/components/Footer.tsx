import { Terminal, ArrowUp } from "lucide-react";
import { profileData } from "../data/portfolioData";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-blueprint-bg border-t border-blueprint-teal/10 relative overflow-hidden py-12">
      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 relative flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Summary & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blueprint-teal" />
            <span className="font-display font-bold text-sm tracking-wider text-blueprint-text">
              {profileData.name.toUpperCase()}
            </span>
          </div>
          <p className="text-[10px] text-blueprint-textSec font-mono">
            © {new Date().getFullYear()} // ALL SCHEMATICS COPYRIGHT RESERVED.
          </p>
        </div>

        {/* Center: System log details */}
        <div className="hidden lg:block font-mono text-[9px] text-blueprint-teal/40 text-center uppercase tracking-widest">
          PROJECT_BUILD: ACTIVE // SYS_LOG: 200_OK // R3F_MORPHING: STABLE
        </div>

        {/* Right Side: Back to Top & Social Shortcuts */}
        <div className="flex items-center gap-6">
          {/* Socials */}
          <div className="flex items-center gap-4">
            <a 
              href={profileData.github} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blueprint-textSec hover:text-blueprint-teal transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a 
              href={profileData.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blueprint-textSec hover:text-blueprint-teal transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="h-4 w-px bg-blueprint-teal/20" />

          {/* Scroll to top */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-blueprint-textSec hover:text-blueprint-teal transition-colors border border-blueprint-teal/15 bg-blueprint-bgSec/40 px-3 py-1.5 rounded"
            title="Back to Top"
          >
            Top
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
