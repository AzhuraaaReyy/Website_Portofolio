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
      className={`tabular-nums transition-colors duration-300 font-bold ${
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
    { label: "BERANDA", href: "#home" },
    { label: "TENTANG SAYA", href: "#about" },
    { label: "KEAHLIAN", href: "#skills" },
    { label: "PROYEK", href: "#projects" },
    { label: "PENGALAMAN", href: "#experience" },
    { label: "KONTAK", href: "#contact" },
  ];

  useEffect(() => {
    if (activeSectionProp) {
      setCurrentActive(activeSectionProp);
    }
  }, [activeSectionProp]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollPosition = window.scrollY + 120;

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
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);

    const targetId = href.substring(1);
    setCurrentActive(targetId);

    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80;
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
        {/* Left Side: Game Logo + Status Bar (LVL, Bar, RANK & PING) */}
        <div className="flex items-center shrink-0">
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, "#home")}
            className="flex items-center gap-3 group cursor-pointer skew-x-[-10deg] py-1.5 transition-all duration-300 border-l-4 border-blueprint-teal bg-transparent hover:bg-blueprint-teal/10 pl-3.5 pr-2"
          >
            <Gamepad2 className="w-6 h-6 text-blueprint-teal drop-shadow-[0_0_8px_#5EEAD4] group-hover:scale-110 transition-transform shrink-0" />

            <div className="flex flex-col gap-0.5">
              {/* Teks Nama Utama */}
              <span className="font-display font-black text-lg md:text-xl italic text-blueprint-text group-hover:text-blueprint-teal transition-colors tracking-wide leading-none">
                MUHAMMAD<span className="text-blueprint-teal/50">_</span>RIZAL
              </span>

              {/* Status Bar */}
              <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] tracking-wider leading-none mt-1">
                <div className="flex items-center gap-1">
                  <span className="text-blueprint-textSec">LVL</span>
                  <span className="font-display font-black text-blueprint-teal">
                    99
                  </span>
                </div>

                {/* Progress Bar Level */}
                <div className="w-10 sm:w-14 h-1.5 bg-blueprint-bg/80 border border-blueprint-teal/30 p-[1px] relative overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blueprint-teal via-blueprint-teal to-blueprint-amber w-[85%] shadow-[0_0_6px_rgba(94,234,212,0.8)]" />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-blueprint-textSec">RANK</span>
                  <span className="font-display font-black text-blueprint-amber">
                    S+
                  </span>
                </div>

                <span className="text-blueprint-teal/30">|</span>

                {/* Indikator Ping */}
                <div className="flex items-center gap-1 font-bold">
                  <Wifi className="w-3 h-3 text-blueprint-teal" />
                  <span className="text-blueprint-textSec">PING:</span>
                  <PingStatus />
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Right Side: Desktop Menu (Mepet Kanan & Tanpa Background) */}
        <div className="hidden lg:flex items-center gap-1 ml-auto">
          {navLinks.map((link) => {
            const linkId = link.href.substring(1);
            const isActive = currentActive === linkId;

            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-display font-bold text-xs uppercase tracking-widest transition-all duration-300 px-3.5 py-2 relative block skew-x-[-10deg] ${
                  isActive
                    ? "text-blueprint-bg bg-blueprint-teal shadow-[0_0_15px_rgba(94,234,212,0.4)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.65)]"
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
          <div className="flex items-center justify-between border-b border-blueprint-teal/20 pb-3 mb-4">
            <div className="font-mono text-xs text-blueprint-teal/50 tracking-widest uppercase">
              Select Menu
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-blueprint-textSec">
                LVL{" "}
                <strong className="text-blueprint-teal font-black">99</strong>
              </span>
              <span className="text-blueprint-teal/30">|</span>
              <span className="text-blueprint-textSec">
                RANK{" "}
                <strong className="text-blueprint-amber font-black">S+</strong>
              </span>
              <span className="text-blueprint-teal/30">|</span>
              <PingStatus />
            </div>
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
