"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

function generateMonthOptions(count = 12) {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  });

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    options.push({
      value: `${year}-${month}`,
      label: formatter.format(date),
    });
  }

  return options;
}

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function DashboardHeader({
  selectedMonth,
  onMonthChange,
}: DashboardHeaderProps) {
  const months = useMemo(() => generateMonthOptions(12), []);
  const selectedMonthLabel =
    months.find((monthOption) => monthOption.value === selectedMonth)?.label ??
    selectedMonth;

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

      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger
          size="default"
          className="h-10 min-w-46 cursor-pointer border-border/70 bg-background/90 sm:w-52"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value} className="capitalize cursor-pointer">
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
