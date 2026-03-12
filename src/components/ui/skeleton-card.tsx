import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 shadow-sm",
        className,
      )}
    >
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-7 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-16 animate-pulse rounded bg-muted" />
    </div>
  );
}
