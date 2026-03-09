"use client";

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
  const months = generateMonthOptions(12);

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground capitalize">
          {months.find((m) => m.value === selectedMonth)?.label ?? selectedMonth}
        </p>
      </div>

      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger size="default" className="w-48">
          <CalendarIcon className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value} className="capitalize">
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
