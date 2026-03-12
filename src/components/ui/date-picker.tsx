"use client";

import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { Locale } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerFieldProps {
  id: string;
  label: string;
  /** ISO date string: yyyy-MM-dd */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  locale?: Locale;
  optional?: boolean;
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "Selecione uma data",
  locale = ptBR,
  optional,
}: DatePickerFieldProps) {
  const date = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const selected = date && isValid(date) ? date : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="text-xs text-muted-foreground"> (opcional)</span>
        )}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {selected ? format(selected, "dd/MM/yyyy", { locale }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            locale={locale}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
