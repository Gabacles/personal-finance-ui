import { cn } from "@/lib/utils";

interface SkeletonChartProps {
  className?: string;
}

export function SkeletonChart({ className }: SkeletonChartProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-64 w-full animate-pulse rounded bg-muted" />
    </div>
  );
}
