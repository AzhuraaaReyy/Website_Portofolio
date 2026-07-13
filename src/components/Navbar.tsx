import { useState, useEffect } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { profileData } from "../data/portfolioData";

interface NavbarProps {
  activeSection: string;
}

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

export function Navbar({ activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#home" },
    { label: "Tentang", href: "#about" },
    { label: "Skill", href: "#skills" },
    { label: "Proyek", href: "#projects" },
    { label: "Pengalaman", href: "#experience" },
    { label: "Kontak", href: "#contact" }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // height of sticky navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-blueprint-bg/85 backdrop-blur-md border-b border-blueprint-teal/15 shadow-[0_4px_30px_rgba(11,18,32,0.5)]" 
        : "bg-transparent border-b border-transparent"
    }`}>
      {/* Blueprint Grid alignment accent lines */}
      <div className="absolute top-0 left-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />
      <div className="absolute top-0 right-10 w-px h-full bg-blueprint-teal/5 pointer-events-none hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Logo / Tag */}
        <a 
          href="#home" 
          onClick={(e) => handleLinkClick(e, "#home")}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded border border-blueprint-teal/30 flex items-center justify-center bg-blueprint-bgSec/50 transition-colors group-hover:border-blueprint-teal/80">
            <Terminal className="w-4 h-4 text-blueprint-teal group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-widest text-blueprint-text group-hover:text-blueprint-teal transition-colors">
              {profileData.name.toUpperCase()}
            </span>
            <span className="font-mono text-[10px] text-blueprint-teal tracking-wider">
              SYS.LOG // ENG_V4.0
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`font-mono text-xs uppercase tracking-widest transition-all duration-300 relative py-2 ${
                      isActive 
                        ? "text-blueprint-teal font-medium" 
                        : "text-blueprint-textSec hover:text-blueprint-text"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blueprint-teal shadow-[0_0_8px_#5EEAD4] transition-all" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Socials Divider & Icons */}
          <div className="h-4 w-px bg-blueprint-teal/20" />
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
        </div>

        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-blueprint-text hover:text-blueprint-teal transition-colors p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer menu */}
      <div className={`fixed inset-0 top-20 bg-blueprint-bg/95 backdrop-blur-lg border-b border-blueprint-teal/15 z-40 transition-transform duration-300 md:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <ul className="flex flex-col gap-6 p-8 font-mono text-center">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm uppercase tracking-widest block py-2 transition-all ${
                    isActive ? "text-blueprint-teal font-medium" : "text-blueprint-textSec hover:text-blueprint-text"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
          <li className="pt-4 border-t border-blueprint-teal/10 flex justify-center gap-6">
            <a href={profileData.github} target="_blank" rel="noreferrer" className="text-blueprint-textSec hover:text-blueprint-teal">
              <GithubIcon className="w-6 h-6" />
            </a>
            <a href={profileData.linkedin} target="_blank" rel="noreferrer" className="text-blueprint-textSec hover:text-blueprint-teal">
              <LinkedinIcon className="w-6 h-6" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
