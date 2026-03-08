"use client";

import { AreaChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import type { MonthProjection } from "@/modules/dashboard/types/dashboard.types";
import { formatMonth } from "@/modules/dashboard/utils/formatters";

interface ProjectionsSectionProps {
  projections: MonthProjection[];
}

export function ProjectionsSection({ projections }: ProjectionsSectionProps) {
  const chartData = projections.map((p) => ({
    month: formatMonth(p.month),
    Receita: p.projectedIncomeCents / 100,
    Despesas: p.projectedExpenseCents / 100,
    Saldo: p.projectedBalanceCents / 100,
  }));

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <SectionHeader
        title="Projeções"
        description="Evolução mensal de receita, despesas e saldo"
      />
      <AreaChart
        className="mt-4 h-72"
        data={chartData}
        index="month"
        categories={["Receita", "Despesas", "Saldo"]}
        colors={["emerald", "rose", "blue"]}
        valueFormatter={(v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
        yAxisWidth={80}
        showAnimation
      />
    </div>
  );
}
