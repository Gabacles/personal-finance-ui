"use client";

import { type ComponentProps, useMemo } from "react";
import { DonutChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import type { CategoryBreakdownItem } from "@/modules/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type DashboardTooltipProps = ComponentProps<typeof ChartTooltip>;

const CategoryTooltip = (props: DashboardTooltipProps) => (
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
  const total = useMemo(
    () => categories.reduce((sum, category) => sum + category.totalCents, 0),
    [categories],
  );

  const chartData = useMemo(
    () =>
      categories.map((category) => ({
        name: category.categoryName,
        value: category.totalCents / 100,
      })),
    [categories],
  );

  return (
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
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
        {categories.map((category, index) => {
          const percentage = total > 0 ? (category.totalCents / total) * 100 : 0;
          const colorKey = CHART_COLORS[index % CHART_COLORS.length];
          return (
            <li
              key={category.categoryId}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn(
                    "inline-block size-2.5 rounded-full flex-shrink-0",
                    DOT_CLASSES[colorKey],
                  )}
                />
                {category.categoryName}
              </span>
              <span className="font-medium">
                {(category.totalCents / 100).toLocaleString("pt-BR", {
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
    </section>
  );
}
