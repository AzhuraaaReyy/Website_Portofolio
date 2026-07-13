import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../../hooks/useReducedMotion";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

interface AmbientBackgroundProps {
  glowIntensity?: number; // 0.1 to 1
  parallaxSpeed?: number; // Speed multiplier for parallax layers
  circuitVariant?: 1 | 2 | 3; // Different PCB patterns
}

export function AmbientBackground({
  glowIntensity = 0.4,
  parallaxSpeed = 1,
  circuitVariant = 1
}: AmbientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const grid1Ref = useRef<HTMLDivElement>(null);
  const grid2Ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Return early if user prefers reduced motion (avoid heavy scroll calculations)
    if (reducedMotion) return;

    const container = containerRef.current;
    const grid1 = grid1Ref.current;
    const grid2 = grid2Ref.current;
    const glow = glowRef.current;
    const path = pathRef.current;
    const path2 = pathRef2.current;

    if (!container) return;

    // Create a GSAP Context to scoped animations and clean them up automatically
    const ctx = gsap.context(() => {
      // 1. Parallax Grid Layer Animations
      if (grid1) {
        gsap.to(grid1, {
          y: -40 * parallaxSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      if (grid2) {
        gsap.to(grid2, {
          y: 40 * parallaxSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // 2. Depth Glow Parallax Shift
      if (glow) {
        gsap.to(glow, {
          y: -80,
          scale: 1.1,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // smooth scrubbing
          }
        });
      }

      // 3. Circuit path trace line drawing on enter viewport
      if (path) {
        const length = path.getTotalLength();
        // Setup initial stroke-dash properties
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 75%",
            once: true // Trigger once when entering
          }
        });
      }

      if (path2) {
        const length = path2.getTotalLength();
        gsap.set(path2, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(path2, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            once: true
          }
        });
      }
    }, container);

    return () => {
      // Clear out triggers and bindings on unmount
      ctx.revert();
    };
  }, [parallaxSpeed, reducedMotion, circuitVariant]);

  // Different schematic PCB paths
  const getCircuitPath = () => {
    switch (circuitVariant) {
      case 2:
        return {
          d1: "M 10 20 L 80 20 L 120 70 L 120 150 L 180 210",
          d2: "M 30 180 L 100 180 L 150 130 L 250 130 L 290 80"
        };
      case 3:
        return {
          d1: "M 90% 10 L 90% 120 L 80% 180 L 50% 180 L 30% 250",
          d2: "M 95% 40 L 95% 100 L 85% 160 L 75% 160"
        };
      case 1:
      default:
        return {
          d1: "M 20,50 L 120,50 L 160,90 L 160,180 L 220,240 L 400,240",
          d2: "M 50,220 L 130,220 L 180,170 L 280,170 L 320,130"
        };
    }
  };

  const paths = getCircuitPath();

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      style={{ contentVisibility: "auto" }} // optimize rendering for off-screen layers
    >
      {/* 1. Depth Gradient Glow Layer */}
      <div 
        ref={glowRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(94, 234, 212, ${0.08 * glowIntensity}) 0%, rgba(19, 34, 56, 0.1) 50%, rgba(11, 18, 32, 0.5) 100%)`,
          transform: reducedMotion ? "none" : "scale(1.0)",
          transition: "opacity 0.5s ease-in-out"
        }}
      />

      {/* 2. Parallax Grid Layer (Split grids moving at different speeds) */}
      {!reducedMotion ? (
        <>
          <div 
            ref={grid1Ref} 
            className="absolute inset-0 w-full h-[120%] bg-blueprint-grid bg-grid-size opacity-[0.06] -top-[10%]" 
          />
          <div 
            ref={grid2Ref} 
            className="absolute inset-0 w-full h-[120%] bg-blueprint-grid bg-grid-size opacity-[0.03] -top-[10%]"
            style={{ backgroundPosition: "20px 20px" }} // offset grid pattern
          />
        </>
      ) : (
        // Simple static fallback grid
        <div className="absolute inset-0 w-full h-full bg-blueprint-grid bg-grid-size opacity-[0.08]" />
      )}

      {/* 3. Scan-line sweep radar animation */}
      {!reducedMotion && (
        <div 
          className="absolute left-0 w-full h-[1.5px] bg-blueprint-teal/15 shadow-[0_0_8px_#5EEAD4] opacity-30 pointer-events-none"
          style={{
            animation: "scan-line 8s linear infinite",
            top: 0
          }}
        />
      )}

      {/* 4. Circuit Trace PCB SVG paths */}
      <svg 
        className="absolute top-12 left-0 w-full h-full text-blueprint-teal/10 pointer-events-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: reducedMotion ? 0.3 : 1 }}
      >
        {/* Circle trace node headers */}
        <circle cx="20" cy="50" r="3" className="fill-blueprint-teal/20 stroke-blueprint-teal/40 stroke-1" />
        <circle cx="50" cy="220" r="3" className="fill-blueprint-teal/20 stroke-blueprint-teal/40 stroke-1" />

        {/* Trace path 1 */}
        <path
          ref={pathRef}
          d={paths.d1}
          fill="none"
          stroke="#5EEAD4"
          strokeWidth="0.75"
          strokeOpacity={reducedMotion ? 0.15 : 0.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Trace path 2 */}
        <path
          ref={pathRef2}
          d={paths.d2}
          fill="none"
          stroke="#5EEAD4"
          strokeWidth="0.75"
          strokeOpacity={reducedMotion ? 0.1 : 0.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Small detail indicator dots */}
        <circle cx="160" cy="180" r="1.5" fill="#5EEAD4" className="opacity-30" />
        <circle cx="280" cy="170" r="1.5" fill="#5EEAD4" className="opacity-30" />
      </svg>

      {/* Internal stylesheet injection for scan-line keyframes */}
      <style>{`
        @keyframes scan-line {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.35;
          }
          90% {
            opacity: 0.35;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
