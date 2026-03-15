"use client";

import { useMemo } from "react";
import { PlusCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthPickerField } from "@/components/ui/month-picker";
import { formatMonthLabel, getMonthRangeFromNow } from "@/lib/month";

interface TransactionsHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onAddExpense: () => void;
  onAddPaymentMethod: () => void;
}

export function TransactionsHeader({
  selectedMonth,
  onMonthChange,
  onAddExpense,
  onAddPaymentMethod,
}: TransactionsHeaderProps) {
  const monthBounds = useMemo(() => getMonthRangeFromNow(12, 12), []);
  const selectedMonthLabel = formatMonthLabel(selectedMonth);

  return (
    <div className="finance-surface finance-grid-bg mb-8 flex flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border bg-background/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Gestão mensal
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Transações</h1>
        <p className="text-sm text-muted-foreground capitalize sm:text-base">
          Competência de {selectedMonthLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <div className="w-full sm:w-52">
          <MonthPickerField
            id="transactions-reference-month"
            label="Mês de referência"
            value={selectedMonth}
            onChange={onMonthChange}
            minMonth={monthBounds.minMonth}
            maxMonth={monthBounds.maxMonth}
          />
        </div>

        <Button
          variant="outline"
          size="default"
          className="h-10 border-border/70 bg-background/90 shadow-sm"
          onClick={onAddPaymentMethod}
        >
          <Wallet className="mr-1.5 size-4" />
          Método de pagamento
        </Button>

        <Button size="default" className="h-10 shadow-sm" onClick={onAddExpense}>
          <PlusCircle className="mr-1.5 size-4" />
          Nova despesa
        </Button>
      </div>
    </div>
  );
}
