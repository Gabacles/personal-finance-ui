import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TrendBadgeProps {
  /** Percentage value (e.g. 12.5 means +12.5%) */
  value: number;
  className?: string;
}

export function TrendBadge({ value, className }: TrendBadgeProps) {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        isPositive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        className,
      )}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
