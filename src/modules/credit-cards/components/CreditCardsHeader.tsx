"use client";

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
  const months = generateMonthOptions(12);

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
        <p className="mt-0.5 text-muted-foreground capitalize">
          {months.find((m) => m.value === selectedMonth)?.label ?? selectedMonth}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger size="default" className="w-48 cursor-pointer">
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

        <Button size="default" onClick={onAddCard}>
          <PlusCircle className="mr-1.5 size-4" />
          Novo cartão
        </Button>

        {selectedCard && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Opções do cartão">
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
