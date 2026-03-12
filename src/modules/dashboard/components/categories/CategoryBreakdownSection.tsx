"use client";

import { DonutChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import type { CategoryBreakdownItem } from "@/modules/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CategoryTooltip = (props: any) => (
  <ChartTooltip {...props} valueFormatter={brlFormatter} />
);

const CHART_COLORS = [
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "indigo",
  "cyan",
  "orange",
] as const;

const DOT_CLASSES: Record<string, string> = {
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

interface CategoryBreakdownSectionProps {
  categories: CategoryBreakdownItem[];
}

export function CategoryBreakdownSection({
  categories,
}: CategoryBreakdownSectionProps) {
  const total = categories.reduce((sum, c) => sum + c.totalCents, 0);

  const chartData = categories.map((c) => ({
    name: c.categoryName,
    value: c.totalCents / 100,
  }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <SectionHeader
        title="Despesas por categoria"
        description="Distribuição das despesas do mês"
      />
      <DonutChart
        className="mt-4 h-60"
        data={chartData}
        index="name"
        category="value"
        colors={[...CHART_COLORS]}
        valueFormatter={brlFormatter}
        customTooltip={CategoryTooltip}
        showAnimation
      />
      {/* Category list */}
      <ul className="mt-4 space-y-2">
        {categories.map((c, index) => {
          const percentage = total > 0 ? (c.totalCents / total) * 100 : 0;
          const colorKey = CHART_COLORS[index % CHART_COLORS.length];
          return (
            <li
              key={c.categoryId}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn(
                    "inline-block size-2.5 rounded-full flex-shrink-0",
                    DOT_CLASSES[colorKey],
                  )}
                />
                {c.categoryName}
              </span>
              <span className="font-medium">
                {(c.totalCents / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                <span className="text-xs text-muted-foreground">
                  ({percentage.toFixed(1)}%)
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
