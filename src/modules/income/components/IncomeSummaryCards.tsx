import { MetricCard } from "@/components/ui/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCentsToBRL } from "@/modules/dashboard/utils/formatters";
import type { IncomeSummary } from "../types/income.types";

interface IncomeSummaryCardsProps {
  summary: IncomeSummary | undefined;
  isLoading: boolean;
}

export function IncomeSummaryCards({ summary, isLoading }: IncomeSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-30 rounded-2xl" />
        ))}
      </div>
    );
  }

  const totalNetIncomeCents = summary?.totalNetIncomeCents ?? 0;
  const recurringIncomeCents = summary?.recurringIncomeCents ?? 0;
  const manualIncomeCents = Math.max(0, totalNetIncomeCents - recurringIncomeCents);
  const totalDeductionCents = summary?.totalDeductionCents ?? 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Receita líquida"
        value={formatCentsToBRL(totalNetIncomeCents)}
        className="finance-surface-soft border-t-4 border-t-emerald-500"
      />
      <MetricCard
        label="Recorrente no mês"
        value={formatCentsToBRL(recurringIncomeCents)}
        className="finance-surface-soft border-t-4 border-t-blue-500"
      />
      <MetricCard
        label="Lançamentos manuais"
        value={formatCentsToBRL(manualIncomeCents)}
        className="finance-surface-soft border-t-4 border-t-amber-500"
      />
      <MetricCard
        label="Descontos totais"
        value={formatCentsToBRL(totalDeductionCents)}
        className="finance-surface-soft border-t-4 border-t-rose-500"
      />
    </div>
  );
}
