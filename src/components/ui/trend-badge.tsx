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
        isPositive ? "finance-pill-positive" : "finance-pill-negative",
        className,
      )}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
