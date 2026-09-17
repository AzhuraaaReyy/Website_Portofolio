"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type Transition } from "framer-motion";

const SIZE: Record<"md" | "lg", string> = {
  md: "text-3xl sm:text-4xl md:text-5xl",
  lg: "text-4xl md:text-5xl lg:text-6xl",
};

/** CSS steps() easing — framer-motion ESM build tidak export ini. */
const steps =
  (n: number): ((t: number) => number) =>
  (t) =>
    Math.min(1, Math.floor(t * n) / n);

interface GlitchHeadingProps {
  text: string;
  size?: "md" | "lg";
  nowrap?: boolean;
  className?: string;
  children: ReactNode;
}

const CYAN_ANIM = {
  x: [-2, 4, -3, 2, 0],
  y: [0, -1, 1, 0],
  opacity: [0.8, 0.2, 0.9, 0.3, 0.8],
  skewX: [-5, -8, -3, -6, -5],
};

const ROSE_ANIM = {
  x: [3, -3, 4, -2, 0],
  y: [0, 1, -1, 0],
  opacity: [0.9, 0.3, 0.8, 0.2, 0.9],
  skewX: [-5, -2, -7, -4, -5],
};

const CYAN_TRANSITION: Transition = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: "mirror",
  ease: steps(3),
};

const ROSE_TRANSITION: Transition = {
  duration: 0.45,
  repeat: Infinity,
  repeatType: "mirror",
  ease: steps(2),
  delay: 0.05,
};

const BASE_REST = { x: 0, y: 0, skewX: 0 };
const CYAN_REST = { ...BASE_REST, opacity: 0.8 };
const ROSE_REST = { ...BASE_REST, opacity: 0.9 };

const layerBase =
  "absolute inset-0 font-black font-display tracking-tighter pointer-events-none uppercase italic z-0 mix-blend-screen";

export function GlitchHeading({
  text,
  size = "lg",
  nowrap = false,
  className = "",
  children,
}: GlitchHeadingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setRunning(entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ns = nowrap ? " whitespace-nowrap" : "";
  const sizeClass = SIZE[size];

  return (
    <div
      ref={wrapRef}
      className={`relative inline-block select-none${className ? ` ${className}` : ""}`}
    >
      {/* LAYER GLITCH 1: CYAN / TEAL */}
      <motion.h2
        aria-hidden="true"
        animate={running ? CYAN_ANIM : CYAN_REST}
        transition={running ? CYAN_TRANSITION : { duration: 0 }}
        className={`${layerBase} ${sizeClass} text-cyan-400${ns}`}
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
          filter: "drop-shadow(-2px 0px 2px rgba(6,182,212,0.8))",
        }}
      >
        {text}
      </motion.h2>

      {/* LAYER GLITCH 2: ROSE / MAGENTA */}
      <motion.h2
        aria-hidden="true"
        animate={running ? ROSE_ANIM : ROSE_REST}
        transition={running ? ROSE_TRANSITION : { duration: 0 }}
        className={`${layerBase} ${sizeClass} text-rose-500${ns}`}
        style={{
          clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          filter: "drop-shadow(2px 0px 2px rgba(244,63,94,0.8))",
        }}
      >
        {text}
      </motion.h2>

      {/* TEKS UTAMA */}
      <h2
        className={`relative ${sizeClass} font-black font-display text-blueprint-text tracking-tighter drop-shadow-[0_0_20px_rgba(94,234,212,0.4)] hover:text-blueprint-teal transition-colors duration-300 uppercase italic skew-x-[-5deg] z-10${ns}`}
      >
        {children}
      </h2>
    </div>
  );
}
