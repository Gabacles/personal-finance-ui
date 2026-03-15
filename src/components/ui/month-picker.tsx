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
  /** Minimum allowed ISO month string: yyyy-MM */
  minMonth?: string;
  /** Maximum allowed ISO month string: yyyy-MM */
  maxMonth?: string;
}

function parseYearMonth(value?: string) {
  if (!value) return null;
  const [rawYear, rawMonth] = value.split("-");
  const year = parseInt(rawYear, 10);
  const month = parseInt(rawMonth, 10);

  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return null;
  }

  return { year, monthIdx: month - 1 };
}

function toMonthKey(year: number, monthIdx: number) {
  return year * 12 + monthIdx;
}

export function MonthPickerField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "Selecione um mês",
  optional,
  minMonth,
  maxMonth,
}: MonthPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => {
    const parsedValue = parseYearMonth(value);

    if (parsedValue) {
      return parsedValue.year;
    }

    return new Date().getFullYear();
  });

  const parsedValue = parseYearMonth(value);
  const selectedYear = parsedValue?.year ?? null;
  const selectedMonthIdx = parsedValue?.monthIdx ?? null;

  const parsedMin = parseYearMonth(minMonth);
  const parsedMax = parseYearMonth(maxMonth);
  const minKey = parsedMin ? toMonthKey(parsedMin.year, parsedMin.monthIdx) : null;
  const maxKey = parsedMax ? toMonthKey(parsedMax.year, parsedMax.monthIdx) : null;

  const canGoPrevYear =
    minKey === null || toMonthKey(year - 1, 11) >= minKey;
  const canGoNextYear =
    maxKey === null || toMonthKey(year + 1, 0) <= maxKey;

  const displayValue = parsedValue
    ? `${MONTHS[parsedValue.monthIdx]}/${parsedValue.year}`
    : null;

  function handleSelect(monthIdx: number) {
    const monthKey = toMonthKey(year, monthIdx);

    if ((minKey !== null && monthKey < minKey) || (maxKey !== null && monthKey > maxKey)) {
      return;
    }

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
              disabled={!canGoPrevYear}
              className="rounded p-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="text-sm font-medium">{year}</span>
            <button
              type="button"
              onClick={() => setYear((y) => y + 1)}
              disabled={!canGoNextYear}
              className="rounded p-1 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((m, idx) => {
              const monthKey = toMonthKey(year, idx);
              const isDisabled =
                (minKey !== null && monthKey < minKey) ||
                (maxKey !== null && monthKey > maxKey);

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  disabled={isDisabled}
                  className={cn(
                    "rounded px-2 py-1.5 text-sm transition-colors",
                    selectedYear === year && selectedMonthIdx === idx
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    isDisabled && "cursor-not-allowed opacity-40 hover:bg-transparent",
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
