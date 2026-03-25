"use client";

import { useMemo } from "react";
import { AreaChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import type { MonthProjection } from "@/modules/dashboard/types/dashboard.types";
import { formatMonth } from "@/modules/dashboard/utils/formatters";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProjectionsTooltip = (props: any) => {
  const { active, payload, label } = props;

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2.5 shadow-lg text-sm text-card-foreground">
      {label && <p className="mb-2 font-semibold capitalize">{label}</p>}
      <div className="space-y-1">
        {payload.map((item: any) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}:</span>
            <span className="ml-auto pl-6 font-medium tabular-nums">
              {brlFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


interface ProjectionsSectionProps {
  projections: MonthProjection[];
}

export function ProjectionsSection({ projections }: ProjectionsSectionProps) {
  const chartData = useMemo(
    () =>
      projections.map((projection) => ({
        month: formatMonth(projection.month),
        Receita: projection.projectedIncomeCents / 100,
        Despesas: projection.projectedExpenseCents / 100,
        Saldo: projection.projectedBalanceCents / 100,
      })),
    [projections],
  );

  return (
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
      <SectionHeader
        title="Projeções"
        description="Evolução mensal de receita, despesas e saldo"
      />
      <AreaChart
        className="finance-chart-themed mt-4 h-72"
        data={chartData}
        index="month"
        categories={["Receita", "Despesas", "Saldo"]}
        colors={["emerald", "rose", "blue"]}
        valueFormatter={(v) =>
          v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
        yAxisWidth={96}
        customTooltip={ProjectionsTooltip}
        showAnimation
      />
    </section>
  );
}
