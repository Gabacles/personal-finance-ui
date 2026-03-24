"use client";

import { type ComponentProps, useMemo } from "react";
import { AreaChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ChartTooltip } from "@/components/ui/chart-tooltip";
import type { MonthProjection } from "@/modules/dashboard/types/dashboard.types";
import { formatMonth } from "@/modules/dashboard/utils/formatters";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type DashboardTooltipProps = ComponentProps<typeof ChartTooltip>;

const ProjectionsTooltip = (props: DashboardTooltipProps) => (
  <ChartTooltip {...props} valueFormatter={brlFormatter} />
);


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
