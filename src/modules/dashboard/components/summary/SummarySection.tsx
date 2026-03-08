import { MetricCard } from "@/components/ui/metric-card";
import {
  formatCentsToBRL,
  formatPercent,
} from "@/modules/dashboard/utils/formatters";
import type { MonthlySummary } from "@/modules/dashboard/types/dashboard.types";

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
  summary: MonthlySummary;
}

export function SummarySection({ summary }: SummarySectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard label="Receita" valueCents={summary.totalIncomeCents} />
      <SummaryCard label="Despesas" valueCents={summary.totalExpenseCents} />
      <SummaryCard label="Saldo líquido" valueCents={summary.netBalanceCents} />
      <SummaryCard
        label="Taxa de poupança"
        percentValue={summary.savingsRate}
        format="percent"
      />
    </div>
  );
}
