import { useRef, useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapRevealOptions {
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
}

export function useGsapReveal<T extends HTMLElement>(
  opts: GsapRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = el.querySelectorAll<HTMLElement>("[data-gsap-reveal]");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: opts.y ?? 24,
        duration: opts.duration ?? 0.6,
        ease: "power2.out",
        stagger: opts.stagger ?? 0.08,
        scrollTrigger: {
          trigger: el,
          start: opts.start ?? "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [opts.y, opts.duration, opts.stagger, opts.start]);

  return ref;
}
