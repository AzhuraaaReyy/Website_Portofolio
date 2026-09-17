import { useEffect, useState, useRef, lazy, Suspense } from "react";
import {
  Terminal,
  Code,
  ExternalLink,
  ShieldAlert,
  Crosshair,
} from "lucide-react";
import { profileData } from "../data/portfolioData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useTabVisible } from "../hooks/useTabVisible";
import { useGsapReveal } from "../hooks/useGsapReveal";
import { GithubIcon, LinkedinIcon } from "./ui/SocialIcons";
import gsap from "gsap";

const ParticleCanvas = lazy(() =>
  import("./3d/ParticleCanvas").then((m) => ({ default: m.ParticleCanvas })),
);

const HeroAnimated = lazy(() =>
  import("./HeroAnimated").then((m) => ({ default: m.HeroAnimated })),
);

export function Hero() {
  const [heroInView, setHeroInView] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const tabVisible = useTabVisible();
  const gsapRevealRef = useGsapReveal<HTMLElement>();

  // Progres scroll di-ref: dibaca langsung di useFrame partikel →
  // scroll tidak lagi memicu re-render React (sumber utama jank).
  const scrollProgressRef = useRef(0);

  // Hentikan render loop 3D saat Hero di luar layar (hemat CPU/GPU saat scroll).
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: "50px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause video saat Hero keluar layar / resume saat tampil.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "100px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    let heroHeight = 0;

    const measure = () => {
      if (!heroRef.current) return;
      heroHeight = heroRef.current.offsetHeight;
    };

    const handleScroll = () => {
      const target = Math.max(
        0,
        Math.min(1, window.scrollY / (heroHeight || 1)),
      );
      if (reducedMotion) {
        scrollProgressRef.current = target;
      } else {
        gsap.to(scrollProgressRef, {
          current: target,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [reducedMotion]);

  const handleScrollToProjects = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const projectsSection = document.querySelector("#projects");
    if (projectsSection) {
      const offset = 80;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToContact = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      const offset = 80;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      ref={(node: HTMLElement | null) => {
        heroRef.current = node as HTMLDivElement | null;
        gsapRevealRef.current = node;
      }}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden section-scroll"
    >
      <div className="absolute inset-0 w-full h-full z-0 hidden md:block" data-gsap-reveal>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Hex/Grid Overlay - Game Matchmaking Lobby Style */}
      <div className="absolute inset-0 z-0 bg-blueprint-bg/85 backdrop-blur-[3px] blueprint-grid bg-grid-size opacity-90 mix-blend-screen" data-gsap-reveal />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.1)_0%,rgba(11,18,32,0.8)_80%)] pointer-events-none" />{/* Decorative Game UI Elements (Diturunkan sejajar dengan posisi teks utama) */}
      <div className="absolute left-6 top-[42%] -translate-y-1/2 z-10 font-mono text-[10px] text-blueprint-teal/80 hidden lg:block pointer-events-none" data-gsap-reveal>
        <div className="flex items-center gap-2 mb-2 font-bold">
          <Crosshair className="w-3.5 h-3.5 text-blueprint-teal" />{" "}
          SYS.IDENTIFIED
        </div>
        <div className="tracking-widest">REGION: ASIA_SE</div>
        <div className="tracking-widest">LATENCY: 12ms</div>
      </div>

      <div className="absolute right-6 top-[42%] -translate-y-1/2 z-10 font-mono text-[10px] text-blueprint-amber/80 hidden lg:block text-right pointer-events-none" data-gsap-reveal>
        <div className="flex items-center justify-end gap-2 mb-2 font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-blueprint-amber" />{" "}
          CLEARANCE_LEVEL
        </div>
        <div className="tracking-widest">TIER: SENIOR_PROSPECT</div>
        <div className="tracking-widest">PORT: SECURE</div>
      </div>

      {/* 3D Morphing Canvas */}
      <Suspense
        fallback={
          <div
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
          />
        }
      >
        <ParticleCanvas
          scrollProgressRef={scrollProgressRef}
          frameloop={heroInView && tabVisible ? "always" : "never"}
        />
      </Suspense>

      {/* Hero Content Center */}
      <div className="w-full max-w-6xl mx-auto px-6 z-10 text-center relative flex-1 flex flex-col items-center justify-center pt-20 pb-20">
        {reducedMotion ? (
          <HeroStaticContent
            onScrollToProjects={handleScrollToProjects}
            onScrollToContact={handleScrollToContact}
          />
        ) : (
          <Suspense
            fallback={
              <HeroStaticContent
                onScrollToProjects={handleScrollToProjects}
                onScrollToContact={handleScrollToContact}
              />
            }
          >
            <HeroAnimated reducedMotion={reducedMotion} />
          </Suspense>
        )}
      </div>

      {/* HUD / Footer Status Strip */}
      <div className="absolute bottom-0 left-0 w-full z-10 border-t-2 border-blueprint-teal/30 bg-blueprint-bg/80 backdrop-blur-md" data-gsap-reveal>
        <div className="max-w-7xl mx-auto px-6 h-14 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
          {/* Col 1 */}
          <div className="hidden md:flex items-center gap-3 text-blueprint-textSec font-mono text-xs">
            <Terminal className="w-4 h-4 text-blueprint-teal animate-pulse" />
            <span>
              <span className="text-blueprint-teal font-bold">STATUS:</span>{" "}
              OPEN_FOR_OPPORTUNITIES
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex items-center justify-center gap-3 text-blueprint-textSec font-display font-bold text-xs border-x-0 md:border-x border-blueprint-teal/20 px-4">
            <Code className="w-4 h-4 text-blueprint-teal" />
            <span className="tracking-widest">REACT • LARAVEL</span>
          </div>

          {/* Col 3 */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <span className="text-blueprint-teal/50 font-mono text-[10px] mr-2">
              PROFESSIONAL_NET:
            </span>
            <a
              href={profileData.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center font-display font-bold text-[10px] uppercase bg-blueprint-bgSec/80 hover:bg-blueprint-teal text-blueprint-text hover:text-blueprint-bg border border-blueprint-teal/30 rounded px-3 py-1.5 transition-all skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center">
                <GithubIcon className="w-3.5 h-3.5 mr-1.5" /> GITHUB
              </span>
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center font-display font-bold text-[10px] uppercase bg-blueprint-bgSec/80 hover:bg-blueprint-teal text-blueprint-text hover:text-blueprint-bg border border-blueprint-teal/30 rounded px-3 py-1.5 transition-all skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] flex items-center">
                <LinkedinIcon className="w-3.5 h-3.5 mr-1.5" /> LINKEDIN
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

type ScrollHandler = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
) => void;

function HeroStaticContent({
  onScrollToProjects,
  onScrollToContact,
}: {
  onScrollToProjects: ScrollHandler;
  onScrollToContact: ScrollHandler;
}) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Status Badge (Professional Title) */}
      <div className="font-display font-black text-xs tracking-widest text-blueprint-bg bg-blueprint-amber px-6 py-1.5 skew-x-[-15deg] mb-6 shadow-[0_0_15px_rgba(245,183,84,0.4)]">
        <span className="skew-x-[15deg] block">
          [{profileData.role.toUpperCase()}]
        </span>
      </div>

      {/* Futuristic Professional Heading */}
      <div className="relative mb-6 group cursor-default">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-blueprint-teal italic leading-none tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(94,234,212,0.6)] transition-all">
          {profileData.role.split(" ")[0]}
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-display font-black text-white italic -mt-5 md:-mt-8 lg:-mt-12 leading-none tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
          {profileData.role.split(" ").slice(1).join(" ")}
        </h1>
      </div>

      {/* Subtitle / Professional Mission Statement */}
      <p className="font-sans font-medium text-sm md:text-base text-blueprint-textSec max-w-xl mx-auto mb-10 bg-blueprint-bgSec/50 p-4 border-l-4 border-blueprint-teal backdrop-blur-sm">
        "Fokus membangun solusi web fullstack end-to-end dari arsitektur backend
        yang stabil hingga antarmuka frontend yang responsif, presisi, dan
        intuitif."
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md">
        <a
          href="#projects"
          onClick={onScrollToProjects}
          className="group relative flex-1 bg-blueprint-teal text-blueprint-bg font-display font-black text-sm px-8 py-4 skew-x-[-10deg] hover:bg-white transition-all shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center"
        >
          <span className="skew-x-[10deg] flex items-center gap-2">
            LIHAT PROYEK
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </a>
        <a
          href="#contact"
          onClick={onScrollToContact}
          className="group relative flex-1 bg-blueprint-bgSec/80 backdrop-blur-sm text-blueprint-text border-2 border-blueprint-teal/40 font-display font-bold text-sm px-8 py-4 skew-x-[-10deg] hover:border-blueprint-teal hover:text-blueprint-teal hover:bg-blueprint-teal/10 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        >
          <span className="skew-x-[10deg]">HUBUNGI SAYA</span>
        </a>
      </div>
    </div>
  );
}
