import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface ExpBarProps {
  progress: number;
  loading?: boolean;
  error?: boolean;
  className?: string;
}

const TICKS = [0, 25, 50, 75, 100];

export function ExpBar({
  progress,
  loading = false,
  error = false,
  className = "",
}: ExpBarProps) {
  const reducedMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(1, progress));
  const pct = Math.round(clamped * 100);

  if (loading) {
    return (
      <div className={className}>
        <div className="flex justify-between mb-1 font-mono text-[9px] text-blueprint-textSec/70">
          {TICKS.map((t) => (
            <span key={t}>{t}%</span>
          ))}
        </div>
        <div className="h-5 w-full animate-pulse bg-blueprint-teal/15 border border-blueprint-teal/20" />
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between mb-1 font-mono text-[9px] text-blueprint-textSec/80">
        {TICKS.map((t) => (
          <span key={t}>{t}%</span>
        ))}
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={error ? 0 : pct}
        className="relative h-5 bg-blueprint-bg/90 border border-blueprint-teal/40 p-[2px]"
      >
        {/* Garis tick vertikal */}
        {TICKS.map((t) => (
          <div
            key={t}
            className="absolute inset-y-0 w-px bg-blueprint-text/15"
            style={{ left: `${t}%` }}
          />
        ))}

        {/* Fill progress */}
        {error ? (
          <div className="h-full w-full bg-blueprint-amber/40" />
        ) : reducedMotion ? (
          <div
            className="h-full bg-gradient-to-r from-blueprint-teal via-blueprint-teal to-blueprint-amber drop-shadow-[0_0_6px_rgba(94,234,212,0.7)]"
            style={{ width: `${clamped * 100}%` }}
          />
        ) : (
          <motion.div
            className="h-full bg-gradient-to-r from-blueprint-teal via-blueprint-teal to-blueprint-amber drop-shadow-[0_0_6px_rgba(94,234,212,0.7)]"
            initial={{ width: 0 }}
            animate={{ width: `${clamped * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}

        {/* Indikator posisi (belah ketupat) */}
        {!error && (
          <motion.div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-blueprint-amber border border-blueprint-bg shadow-[0_0_12px_rgba(245,183,84,0.9)]"
            initial={{ left: reducedMotion ? `${clamped * 100}%` : "0%" }}
            animate={{ left: `${clamped * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </div>
    </div>
  );
}