import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  /** Percentage value (e.g. 12.5 means +12.5%) */
  trend?: number;
  className?: string;
}

export function MetricCard({ label, value, trend, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {trend !== undefined && <TrendIndicator value={trend} />}
    </div>
  );
}

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        isPositive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
      )}
    >
      <Icon className="size-3" />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
