import { Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { SectionSkeleton } from "./SectionSkeleton";
import { useActiveSection } from "../../context/ActiveSectionContext";

interface LazySectionProps {
  id: string;
  minHeight?: string;
  children: ReactNode;
  eager?: boolean;
}

export function LazySection({
  id,
  minHeight,
  children,
  eager = false,
}: LazySectionProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(eager);
  const { setActive } = useActiveSection();

  // Muat section begitu mendekati viewport (600px di luar area lihat).
  useEffect(() => {
    if (loaded) return;
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoaded(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin: "600px 0px 600px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loaded]);

  // Laporkan section aktif ke context scroll-spy.
  useEffect(() => {
    if (!loaded) return;
    const el = wrapRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(id);
        });
      },
      { root: null, rootMargin: "-30% 0px -50% 0px", threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loaded, id, setActive]);

  return (
    <div ref={wrapRef} id={id}>
      {loaded ? (
        <Suspense fallback={<SectionSkeleton minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionSkeleton minHeight={minHeight} />
      )}
    </div>
  );
}