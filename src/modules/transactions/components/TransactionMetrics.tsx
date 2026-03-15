"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { formatCentsToBRL } from "@/modules/dashboard/utils/formatters";
import type { TransactionsSummary } from "../types/transactions.types";

interface TransactionMetricsProps {
  summary: TransactionsSummary | undefined;
  isLoading: boolean;
}

export function TransactionMetrics({ summary, isLoading }: TransactionMetricsProps) {
  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const s = summary ?? {
    totalExpenseCents: 0,
    oneTimeCents: 0,
    installmentCents: 0,
    recurringExpenseCents: 0,
    balanceCents: 0,
    byCategory: [],
    byPaymentMethod: [],
  };

  const metrics = [
    {
      label: "Total de despesas",
      value: formatCentsToBRL(s.totalExpenseCents),
      animatedValue: s.totalExpenseCents,
      accent: "rose" as const,
      className:
        "border-t-2 border-t-rose-500 finance-surface-soft",
    },
    {
      label: "Gastos avulsos",
      value: formatCentsToBRL(s.oneTimeCents),
      animatedValue: s.oneTimeCents,
      accent: "slate" as const,
      className:
        "border-t-2 border-t-slate-500 finance-surface-soft",
    },
    {
      label: "Parcelamentos",
      value: formatCentsToBRL(s.installmentCents),
      animatedValue: s.installmentCents,
      accent: "blue" as const,
      className:
        "border-t-2 border-t-blue-500 finance-surface-soft",
    },
    {
      label: "Recorrentes",
      value: formatCentsToBRL(s.recurringExpenseCents),
      animatedValue: s.recurringExpenseCents,
      accent: "violet" as const,
      className:
        "border-t-2 border-t-violet-500 finance-surface-soft",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard
          key={m.label}
          label={m.label}
          value={m.value}
          animatedValue={m.animatedValue}
          formatAnimatedValue={formatCentsToBRL}
          accent={m.accent}
          className={m.className}
        />
      ))}
    </div>
  );
}
