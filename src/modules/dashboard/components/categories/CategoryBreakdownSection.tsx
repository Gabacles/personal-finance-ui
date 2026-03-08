"use client";

import { DonutChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import type { CategoryBreakdownItem } from "@/modules/dashboard/types/dashboard.types";

interface CategoryBreakdownSectionProps {
  categories: CategoryBreakdownItem[];
}

export function CategoryBreakdownSection({
  categories,
}: CategoryBreakdownSectionProps) {
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
        valueFormatter={(v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
        showAnimation
      />
      {/* Category list */}
      <ul className="mt-4 space-y-2">
        {categories.map((c) => (
          <li
            key={c.categoryId}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{c.categoryName}</span>
            <span className="font-medium">
              {(c.totalCents / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              <span className="text-xs text-muted-foreground">
                ({c.percentage.toFixed(1)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
