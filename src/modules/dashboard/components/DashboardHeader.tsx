"use client";

import { useMemo } from "react";
import { MonthPickerField } from "@/components/ui/month-picker";
import { formatMonthLabel, getMonthRangeFromNow } from "@/lib/month";

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function DashboardHeader({
  selectedMonth,
  onMonthChange,
}: DashboardHeaderProps) {
  const monthBounds = useMemo(() => getMonthRangeFromNow(12, 12), []);

  const selectedMonthLabel = formatMonthLabel(selectedMonth);

  return (
    <div className="finance-surface finance-grid-bg mb-8 flex flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border bg-background/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Panorama financeiro
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground capitalize sm:text-base">
          Visão consolidada de {selectedMonthLabel}
        </p>
      </div>

      <div className="w-full sm:w-52">
        <MonthPickerField
          id="dashboard-reference-month"
          label="Mês de referência"
          value={selectedMonth}
          onChange={onMonthChange}
          minMonth={monthBounds.minMonth}
          maxMonth={monthBounds.maxMonth}
        />
      </div>
    </div>
  );
}
