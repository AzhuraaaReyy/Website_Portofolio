import { Gamepad2, ArrowUp } from "lucide-react";
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
    <footer className="bg-blueprint-bg border-t-[3px] border-blueprint-teal/30 relative overflow-hidden py-8">
      {/* Decorative vertical blueprint lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/10 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 relative flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Summary & Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5 cursor-default skew-x-[-5deg]">
          <div className="skew-x-[5deg] flex items-center gap-2 mb-1">
            <Gamepad2 className="w-5 h-5 text-blueprint-teal drop-shadow-[0_0_8px_#5EEAD4]" />
            <span className="font-display font-black text-lg italic tracking-wider text-blueprint-text">
              MUHAMMAD<span className="text-blueprint-teal">_</span>RIZAL
            </span>
          </div>
          <p className="skew-x-[5deg] text-[9px] text-blueprint-textSec font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} // CAMPAIGN DATA SAVED. NO RIGHTS REVERSED.
          </p>
        </div>

        {/* Center: System log details */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[9px] text-blueprint-teal/50 text-center uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-blueprint-teal rounded-full animate-pulse shadow-[0_0_5px_#5EEAD4]" />
          GAME_ENGINE: ACTIVE // PING: 12MS // SERVER: ONLINE
        </div>

        {/* Right Side: Back to Top & Social Shortcuts */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Socials */}
          <div className="flex items-center gap-3">
            <a 
              href={profileData.github} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blueprint-textSec hover:text-blueprint-teal hover:drop-shadow-[0_0_8px_#5EEAD4] transition-all skew-x-[-10deg] px-2 py-1 bg-blueprint-bgSec/50 border border-blueprint-teal/20"
              aria-label="GitHub"
            >
              <div className="skew-x-[10deg]"><GithubIcon className="w-3.5 h-3.5" /></div>
            </a>
            <a 
              href={profileData.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blueprint-textSec hover:text-blueprint-teal hover:drop-shadow-[0_0_8px_#5EEAD4] transition-all skew-x-[-10deg] px-2 py-1 bg-blueprint-bgSec/50 border border-blueprint-teal/20"
              aria-label="LinkedIn"
            >
              <div className="skew-x-[10deg]"><LinkedinIcon className="w-3.5 h-3.5" /></div>
            </a>
          </div>

          <div className="h-6 w-px bg-blueprint-teal/30 skew-x-[-15deg]" />

          {/* Scroll to top */}
          <button
            onClick={handleScrollToTop}
            className="group flex items-center gap-1.5 font-display font-black text-[10px] uppercase tracking-wider text-blueprint-bg bg-blueprint-teal transition-all shadow-[0_0_10px_rgba(94,234,212,0.3)] hover:shadow-[0_0_20px_rgba(94,234,212,0.6)] px-4 py-2 skew-x-[-10deg]"
            title="Back to Top"
          >
            <span className="skew-x-[10deg] flex items-center gap-1.5">
              BACK_TO_LOBBY
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
        </div>

      </div>
    </footer>
  );
}
