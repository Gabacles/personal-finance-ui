"use client";

import { CalendarClock } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCentsToBRL } from "@/modules/dashboard/utils/formatters";
import type { CreditCard, CardStatement } from "../types/credit-cards.types";

interface CardMetricsProps {
  card: CreditCard;
  statement: CardStatement | undefined;
  isLoading: boolean;
  selectedMonth: string;
}

function getEffectiveDueDate(dueDay: number, month: string): Date {
  const [year, mon] = month.split("-").map(Number);
  const dueDate = new Date(year, mon - 1, dueDay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // If the due date for the selected month has already passed,
  // the bill is actually due the following month.
  if (dueDate < today) {
    return new Date(year, mon, dueDay);
  }
  return dueDate;
}

function getDueDate(dueDay: number, month: string): string {
  return getEffectiveDueDate(dueDay, month).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysUntilDue(dueDay: number, month: string): number {
  const dueDate = getEffectiveDueDate(dueDay, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function CardMetrics({
  card,
  statement,
  isLoading,
  selectedMonth,
}: CardMetricsProps) {
  const creditLimitCents =
    statement?.creditLimitCents ?? card.creditCard?.creditLimitCents ?? null;
  const totalSpentCents = statement?.totalSpentCents ?? 0;
  const availableCents =
    creditLimitCents !== null ? creditLimitCents - totalSpentCents : null;
  const usagePercent =
    creditLimitCents && creditLimitCents > 0
      ? Math.min(100, (totalSpentCents / creditLimitCents) * 100)
      : 0;

  const dueDay = card.creditCard?.dueDay;
  const dueDate = dueDay ? getDueDate(dueDay, selectedMonth) : null;
  const daysUntilDue = dueDay ? getDaysUntilDue(dueDay, selectedMonth) : null;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-30 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Gasto no mês"
          value={formatCentsToBRL(totalSpentCents)}
          className="finance-surface-soft border-t-4 border-t-indigo-500"
        />

        {availableCents !== null ? (
          <MetricCard
            label="Disponível"
            value={formatCentsToBRL(availableCents)}
            className={
              availableCents < 0
                ? "finance-surface-soft border-t-4 border-t-rose-500"
                : "finance-surface-soft border-t-4 border-t-emerald-500"
            }
          />
        ) : (
          <div className="finance-surface-soft p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Disponível
            </p>
            <p className="mt-2 text-lg font-bold text-muted-foreground">
              Sem limite cadastrado
            </p>
          </div>
        )}

        <div className="finance-surface-soft p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Vencimento
          </p>
          {dueDate ? (
            <>
              <p className="mt-2 text-2xl font-bold tracking-tight">{dueDate}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="size-3" />
                {daysUntilDue !== null &&
                  (daysUntilDue === 0
                    ? "vence hoje"
                    : `em ${daysUntilDue} dia${daysUntilDue !== 1 ? "s" : ""}`)
                }
              </div>
            </>
          ) : (
            <p className="mt-2 text-lg font-bold text-muted-foreground">-</p>
          )}
        </div>
      </div>

      {creditLimitCents !== null && creditLimitCents > 0 && (
        <div className="finance-surface-soft p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Uso do limite</span>
            <span className="font-semibold">
              {formatCentsToBRL(totalSpentCents)} /{" "}
              {formatCentsToBRL(creditLimitCents)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercent > 80
                  ? "bg-rose-500"
                  : usagePercent > 50
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% utilizado
          </p>
        </div>
      )}
    </div>
  );
}
