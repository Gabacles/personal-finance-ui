import { MetricCard } from "@/components/ui/metric-card";
import {
  formatCentsToBRL,
  formatPercent,
} from "@/modules/dashboard/utils/formatters";
import type { CurrentMonthSummary } from "@/modules/dashboard/types/dashboard.types";

interface SummaryCardProps {
  label: string;
  valueCents?: number;
  percentValue?: number;
  format?: "currency" | "percent";
  className?: string;
}

export function SummaryCard({
  label,
  valueCents,
  percentValue,
  format = "currency",
  className,
}: SummaryCardProps) {
  const value =
    format === "percent" && percentValue !== undefined
      ? formatPercent(percentValue)
      : formatCentsToBRL(valueCents ?? 0);

  return <MetricCard label={label} value={value} className={className} />;
}

interface SummarySectionProps {
  summary: CurrentMonthSummary;
}

export function SummarySection({ summary }: SummarySectionProps) {
  const savingsRate =
    summary.totalNetIncomeCents > 0
      ? (summary.balanceCents / summary.totalNetIncomeCents) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Receita"
        valueCents={summary.totalNetIncomeCents}
        className="finance-surface-soft border-t-4 border-t-emerald-500"
      />
      <SummaryCard
        label="Despesas"
        valueCents={summary.totalExpenseCents}
        className="finance-surface-soft border-t-4 border-t-rose-500"
      />
      <SummaryCard
        label="Saldo líquido"
        valueCents={summary.balanceCents}
        className="finance-surface-soft border-t-4 border-t-blue-500"
      />
      <SummaryCard
        label="Taxa de poupança"
        percentValue={savingsRate}
        format="percent"
        className="finance-surface-soft border-t-4 border-t-indigo-500"
      />
    </div>
  );
}
