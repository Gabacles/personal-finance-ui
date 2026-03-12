"use client";

import { useState } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

interface MonthPickerFieldProps {
  id: string;
  label: string;
  /** ISO month string: yyyy-MM */
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  optional?: boolean;
}

export function MonthPickerField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "Selecione um mês",
  optional,
}: MonthPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => {
    if (value) {
      const y = parseInt(value.split("-")[0]);
      if (!isNaN(y)) return y;
    }
    return new Date().getFullYear();
  });

  const selectedYear = value ? parseInt(value.split("-")[0]) : null;
  const selectedMonthIdx = value ? parseInt(value.split("-")[1]) - 1 : null;

  const displayValue = value
    ? `${MONTHS[parseInt(value.split("-")[1]) - 1]}/${value.split("-")[0]}`
    : null;

  function handleSelect(monthIdx: number) {
    onChange(`${year}-${String(monthIdx + 1).padStart(2, "0")}`);
    setOpen(false);
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="text-xs text-muted-foreground"> (opcional)</span>
        )}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayValue && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {displayValue ?? placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-52 p-3" align="start">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setYear((y) => y - 1)}
              className="rounded p-1 hover:bg-muted"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="text-sm font-medium">{year}</span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              className="rounded p-1 hover:bg-muted"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m, idx) => (
              <button
                key={m}
                type="button"
                onClick={() => handleSelect(idx)}
                className={cn(
                  "rounded px-2 py-1.5 text-sm transition-colors",
                  selectedYear === year && selectedMonthIdx === idx
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
