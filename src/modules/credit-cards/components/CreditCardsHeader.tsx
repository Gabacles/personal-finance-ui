"use client";

import { useMemo } from "react";
import { CalendarIcon, PlusCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CreditCard } from "../types/credit-cards.types";

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

interface CreditCardsHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onAddCard: () => void;
  selectedCard: CreditCard | null;
  onEditCard: () => void;
  onDeleteCard: () => void;
}

export function CreditCardsHeader({
  selectedMonth,
  onMonthChange,
  onAddCard,
  selectedCard,
  onEditCard,
  onDeleteCard,
}: CreditCardsHeaderProps) {
  const months = useMemo(() => generateMonthOptions(12), []);
  const selectedMonthLabel =
    months.find((monthOption) => monthOption.value === selectedMonth)?.label ??
    selectedMonth;

  return (
    <div className="finance-surface finance-grid-bg mb-8 flex flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
      <div className="space-y-2">
        <p className="inline-flex rounded-full border bg-background/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Gestão mensal
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Cartões de Crédito
        </h1>
        <p className="text-sm text-muted-foreground capitalize sm:text-base">
          Fatura de {selectedMonthLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger
            size="default"
            className="h-10 min-w-46 flex-1 cursor-pointer border-border/70 bg-background/90 sm:flex-none"
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {months.map((m) => (
              <SelectItem
                key={m.value}
                value={m.value}
                className="cursor-pointer capitalize"
              >
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="default" className="h-10 shadow-sm" onClick={onAddCard}>
          <PlusCircle className="mr-1.5 size-4" />
          Novo cartão
        </Button>

        {selectedCard && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Opções do cartão"
                className="h-10 w-10 border-border/70 bg-background/90"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditCard}>
                <Pencil className="mr-2 size-4" />
                Editar cartão
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDeleteCard}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Remover cartão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
