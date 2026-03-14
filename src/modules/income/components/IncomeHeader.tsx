"use client";

import { CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    options.push({ value: `${year}-${month}`, label: formatter.format(date) });
  }

  return options;
}

interface IncomeHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onAddIncome: () => void;
}

export function IncomeHeader({
  selectedMonth,
  onMonthChange,
  onAddIncome,
}: IncomeHeaderProps) {
  const months = generateMonthOptions(12);

  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
        <p className="mt-0.5 text-muted-foreground capitalize">
          {months.find((m) => m.value === selectedMonth)?.label ?? selectedMonth}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger size="default" className="flex-1 cursor-pointer sm:w-48 sm:flex-none">
            <CalendarIcon className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value} className="cursor-pointer capitalize">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="default" onClick={onAddIncome}>
          <PlusCircle className="mr-1.5 size-4" />
          Nova receita
        </Button>
      </div>
    </div>
  );
}
