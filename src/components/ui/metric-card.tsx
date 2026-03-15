"use client";

import { useEffect, useState, type ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  /** Percentage value (e.g. 12.5 means +12.5%) */
  trend?: number;
  className?: string;
  valueClassName?: string;
  footer?: ReactNode;
  animatedValue?: number;
  formatAnimatedValue?: (value: number) => string;
  accent?: "sky" | "emerald" | "rose" | "amber" | "blue" | "indigo" | "violet" | "slate";
}

const ACCENT_STYLES: Record<
  NonNullable<MetricCardProps["accent"]>,
  {
    hoverBorder: string;
    topGlow: string;
    hoverGlow: string;
  }
> = {
  sky: {
    hoverBorder: "hover:border-sky-300/60",
    topGlow: "from-sky-100/35 via-cyan-100/15 to-transparent",
    hoverGlow: "to-sky-100/12",
  },
  emerald: {
    hoverBorder: "hover:border-emerald-300/60",
    topGlow: "from-emerald-100/35 via-teal-100/15 to-transparent",
    hoverGlow: "to-emerald-100/12",
  },
  rose: {
    hoverBorder: "hover:border-rose-300/60",
    topGlow: "from-rose-100/35 via-pink-100/15 to-transparent",
    hoverGlow: "to-rose-100/12",
  },
  amber: {
    hoverBorder: "hover:border-amber-300/60",
    topGlow: "from-amber-100/35 via-orange-100/15 to-transparent",
    hoverGlow: "to-amber-100/12",
  },
  blue: {
    hoverBorder: "hover:border-blue-300/60",
    topGlow: "from-blue-100/35 via-cyan-100/15 to-transparent",
    hoverGlow: "to-blue-100/12",
  },
  indigo: {
    hoverBorder: "hover:border-indigo-300/60",
    topGlow: "from-indigo-100/35 via-violet-100/15 to-transparent",
    hoverGlow: "to-indigo-100/12",
  },
  violet: {
    hoverBorder: "hover:border-violet-300/60",
    topGlow: "from-violet-100/35 via-fuchsia-100/15 to-transparent",
    hoverGlow: "to-violet-100/12",
  },
  slate: {
    hoverBorder: "hover:border-slate-300/60",
    topGlow: "from-slate-100/35 via-zinc-100/15 to-transparent",
    hoverGlow: "to-slate-100/12",
  },
};

export function MetricCard({
  label,
  value,
  trend,
  className,
  valueClassName,
  footer,
  animatedValue,
  formatAnimatedValue,
  accent = "sky",
}: MetricCardProps) {
  const accentStyle = ACCENT_STYLES[accent];

  const [displayValue, setDisplayValue] = useState(() => {
    if (animatedValue !== undefined && formatAnimatedValue) {
      return formatAnimatedValue(0);
    }

    return value;
  });

  useEffect(() => {
    if (animatedValue === undefined || !formatAnimatedValue) {
      setDisplayValue(value);
      return;
    }

    if (typeof window === "undefined") {
      setDisplayValue(formatAnimatedValue(animatedValue));
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(formatAnimatedValue(animatedValue));
      return;
    }

    const durationMs = 700;
    let frameId = 0;
    const startedAt = performance.now();

    setDisplayValue(formatAnimatedValue(0));

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const currentValue = animatedValue * easedProgress;

      setDisplayValue(formatAnimatedValue(currentValue));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [animatedValue, formatAnimatedValue, value]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/70 bg-card p-6 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500",
        accentStyle.hoverBorder,
        className,
      )}
    >
      <div className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-18 bg-linear-to-r opacity-45 transition-opacity duration-300 group-hover:opacity-95",
        accentStyle.topGlow,
      )} />
      <div className={cn(
        "pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        accentStyle.hoverGlow,
      )} />

      <div className="relative">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("mt-2 text-2xl font-bold tracking-tight sm:text-[1.75rem]", valueClassName)}>
          {displayValue}
        </p>
      </div>
      {trend !== undefined && <TrendIndicator value={trend} />}
      {footer ? <div className="relative mt-2">{footer}</div> : null}
    </div>
  );
}

function TrendIndicator({ value }: { value: number }) {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "relative mt-3 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-transform duration-300 group-hover:translate-x-0.5",
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
