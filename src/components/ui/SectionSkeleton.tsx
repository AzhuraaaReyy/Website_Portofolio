interface SectionSkeletonProps {
  minHeight?: string;
}

export function SectionSkeleton({
  minHeight = "min-h-[70vh]",
}: SectionSkeletonProps) {
  return (
    <div
      className={`relative w-full ${minHeight} bg-blueprint-bg border-t border-blueprint-teal/20 overflow-hidden`}
      style={{ contentVisibility: "auto" }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 blueprint-grid grid-size opacity-60" />
      <div className="relative flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="h-3 w-44 bg-blueprint-teal/20" />
        <div className="h-9 w-72 max-w-[80%] bg-blueprint-teal/15" />
        <div className="h-3 w-60 max-w-[70%] bg-blueprint-teal/10" />
        <div className="h-3 w-72 max-w-[80%] bg-blueprint-teal/10" />
      </div>
    </div>
  );
}