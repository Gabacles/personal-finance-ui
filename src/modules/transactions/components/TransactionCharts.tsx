"use client";

import { useMemo } from "react";
import { DonutChart, BarChart } from "@tremor/react";
import { SectionHeader } from "@/components/ui/section-header";
import { SkeletonChart } from "@/components/ui/skeleton-chart";
import { cn } from "@/lib/utils";
import type { TransactionsSummary } from "../types/transactions.types";

const brlFormatter = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CHART_COLORS = [
  "rose",
  "violet",
  "blue",
  "amber",
  "emerald",
  "indigo",
  "cyan",
  "orange",
] as const;

const DOT_CLASSES: Record<string, string> = {
  rose: "bg-rose-500",
  violet: "bg-violet-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  indigo: "bg-indigo-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

interface TransactionChartsProps {
  summary: TransactionsSummary | undefined;
  isLoading: boolean;
}

export function TransactionCharts({ summary, isLoading }: TransactionChartsProps) {
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    );
  }

  const byCategory = summary?.byCategory ?? [];
  const byPaymentMethod = summary?.byPaymentMethod ?? [];

  if (byCategory.length === 0 && byPaymentMethod.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <CategoryChart categories={byCategory} />
      <PaymentMethodChart paymentMethods={byPaymentMethod} />
    </div>
  );
}

// ─── Category Donut ───────────────────────────────────────────────────────────

interface CategoryChartProps {
  categories: TransactionsSummary["byCategory"];
}

function CategoryChart({ categories }: CategoryChartProps) {
  const total = useMemo(
    () => categories.reduce((sum, c) => sum + c.totalCents, 0),
    [categories],
  );

  const chartData = useMemo(
    () => categories.map((c) => ({ name: c.categoryName, value: c.totalCents / 100 })),
    [categories],
  );

  if (categories.length === 0) {
    return (
      <section className="finance-surface flex items-center justify-center p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Sem dados por categoria</p>
      </section>
    );
  }

  return (
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
      <SectionHeader
        title="Despesas por categoria"
        description="Distribuição dos gastos do mês"
      />
      <DonutChart
        className="mt-4 h-52"
        data={chartData}
        index="name"
        category="value"
        colors={[...CHART_COLORS]}
        valueFormatter={brlFormatter}
        showAnimation
      />
      <ul className="mt-4 space-y-2">
        {categories.map((cat, i) => {
          const pct = total > 0 ? (cat.totalCents / total) * 100 : 0;
          const colorKey = CHART_COLORS[i % CHART_COLORS.length];
          return (
            <li key={cat.categoryId} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn(
                    "inline-block size-2.5 shrink-0 rounded-full",
                    DOT_CLASSES[colorKey],
                  )}
                />
                {cat.categoryName}
              </span>
              <span className="font-medium tabular-nums">
                {brlFormatter(cat.totalCents / 100)}{" "}
                <span className="text-xs text-muted-foreground">({pct.toFixed(1)}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ─── Payment Method Bar ───────────────────────────────────────────────────────

interface PaymentMethodChartProps {
  paymentMethods: TransactionsSummary["byPaymentMethod"];
}

function PaymentMethodChart({ paymentMethods }: PaymentMethodChartProps) {
  const chartData = useMemo(
    () =>
      paymentMethods.map((pm) => ({
        name: pm.paymentMethodName,
        Total: pm.totalCents / 100,
      })),
    [paymentMethods],
  );

  if (paymentMethods.length === 0) {
    return (
      <section className="finance-surface flex items-center justify-center p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">Sem dados por método de pagamento</p>
      </section>
    );
  }

  return (
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
      <SectionHeader
        title="Método de pagamento"
        description="Volume gasto por meio de pagamento"
      />
      <BarChart
        className="mt-4 h-52"
        data={chartData}
        index="name"
        categories={["Total"]}
        colors={["rose"]}
        valueFormatter={brlFormatter}
        yAxisWidth={100}
        showAnimation
      />
    </section>
  );
}
