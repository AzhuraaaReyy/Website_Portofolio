import { useState, useEffect } from "react";
import { Menu, X, Gamepad2, Wifi } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface NavbarProps {
  activeSection?: string;
}

function PingStatus() {
  const [ping, setPing] = useState(12);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const id = setInterval(() => {
      setPing((prev) => {
        const spike = Math.random() < 0.1;
        if (spike) {
          return Math.min(58, prev + Math.round(10 + Math.random() * 18));
        }
        const delta = Math.round((Math.random() - 0.5) * 10);
        return Math.max(9, Math.min(46, prev + delta));
      });
    }, 1600);

    return () => clearInterval(id);
  }, [reducedMotion]);

  const isHigh = ping > 35;

  return (
    <span
      className={`tabular-nums transition-colors duration-300 ${
        isHigh ? "text-blueprint-amber" : "text-blueprint-teal"
      }`}
    >
      {ping}MS
    </span>
  );
}

export function Navbar({ activeSection: activeSectionProp }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentActive, setCurrentActive] = useState(
    activeSectionProp || "home",
  );

  const navLinks = [
    { label: "HQ", href: "#home" },
    { label: "PROFILE", href: "#about" },
    { label: "LOADOUT", href: "#skills" },
    { label: "QUESTS", href: "#projects" },
    { label: "LOGS", href: "#experience" },
    { label: "CO-OP", href: "#contact" },
  ];

  // Sync prop external jika ada
  useEffect(() => {
    if (activeSectionProp) {
      setCurrentActive(activeSectionProp);
    }
  }, [activeSectionProp]);

  // Fitur ScrollSpy: Otomatis mendeteksi section mana yang sedang aktif di layar
  useEffect(() => {
    const handleScroll = () => {
      // Set background navbar jika di-scroll
      setScrolled(window.scrollY > 20);

      // Hitung posisi scroll untuk menentukan menu aktif
      const scrollPosition = window.scrollY + 120; // 80px offset navbar + buffer

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const targetId = navLinks[i].href.substring(1);
        const sectionEl = document.getElementById(targetId);

        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setCurrentActive(targetId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Panggil sekali saat mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);

    const targetId = href.substring(1);
    setCurrentActive(targetId); // Langsung ubah aktif saat diklik

    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // tinggi sticky navbar
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-blueprint-bg/90 backdrop-blur-md border-b-2 border-blueprint-teal/40 shadow-[0_4px_30px_rgba(94,234,212,0.15)]"
          : "bg-transparent border-b-2 border-transparent"
      }`}
    >
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blueprint-teal/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between relative">
        {/* Game Logo / Player Tag */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, "#home")}
          className="flex items-center gap-3 group cursor-pointer skew-x-[-10deg] px-4 py-2 hover:bg-blueprint-teal/10 transition-colors border-l-4 border-blueprint-teal"
        >
          <Gamepad2 className="w-6 h-6 text-blueprint-teal drop-shadow-[0_0_8px_#5EEAD4] group-hover:scale-110 transition-transform" />
          <span className="font-display font-black text-xl italic text-blueprint-text group-hover:text-blueprint-teal transition-colors tracking-wide">
            MUHAMMAD<span className="text-blueprint-teal/50">_</span>RIZAL
          </span>
        </a>

        {/* Desktop Menu - HUD Style */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center bg-blueprint-bgSec/60 p-1.5 rounded-lg border border-blueprint-teal/20 backdrop-blur-sm skew-x-[-10deg]">
            {navLinks.map((link) => {
              const linkId = link.href.substring(1);
              const isActive = currentActive === linkId;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`font-display font-bold text-xs uppercase tracking-widest transition-all duration-300 px-4 py-2 relative block overflow-hidden ${
                    isActive
                      ? "text-blueprint-bg bg-blueprint-teal shadow-[0_0_15px_rgba(94,234,212,0.4)] hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.65)]"
                      : "text-blueprint-textSec hover:text-blueprint-teal hover:bg-blueprint-teal/10"
                  }`}
                >
                  <span className="skew-x-[10deg] block relative z-10">
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Status Indicator (Ping/Server) */}
          <div className="font-mono font-bold text-[10px] tracking-widest border border-blueprint-teal/40 px-3 py-1.5 bg-blueprint-bgSec/80 flex items-center gap-2 shadow-[0_0_10px_rgba(94,234,212,0.1)] skew-x-[-10deg]">
            <span className="skew-x-[10deg] flex items-center gap-2">
              <Wifi className="w-3 h-3 text-blueprint-teal" />
              <span className="text-blueprint-text">PING:</span>
              <PingStatus />
            </span>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center justify-center w-12 h-10 bg-blueprint-teal/10 border-2 border-blueprint-teal/30 text-blueprint-teal hover:bg-blueprint-teal hover:text-blueprint-bg transition-colors skew-x-[-10deg]"
          aria-label="Toggle Menu"
        >
          <div className="skew-x-[10deg]">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`absolute top-20 left-0 w-full lg:hidden transition-all duration-300 transform origin-top ${
          isOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-blueprint-bg/95 backdrop-blur-lg border-b-4 border-blueprint-teal p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="font-mono text-xs text-blueprint-teal/50 mb-4 tracking-widest uppercase">
            Select Menu
          </div>
          <ul className="flex flex-col gap-3 font-display font-bold">
            {navLinks.map((link) => {
              const linkId = link.href.substring(1);
              const isActive = currentActive === linkId;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`text-lg uppercase tracking-wider block py-3 px-4 transition-all skew-x-[-5deg] ${
                      isActive
                        ? "text-blueprint-bg bg-blueprint-teal border-l-4 border-white shadow-[0_0_15px_rgba(94,234,212,0.3)]"
                        : "text-blueprint-textSec bg-blueprint-bgSec border-l-4 border-transparent hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10"
                    }`}
                  >
                    <span className="skew-x-[5deg] block flex items-center justify-between gap-3">
                      {link.label}
                      <span className="font-mono text-[10px] text-blueprint-teal/50">
                        {isActive ? "●" : "○"}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
