"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";
import type { Transaction, TransactionOrigin, TransactionType } from "../types/transactions.types";
import { ORIGIN_LABELS } from "../types/transactions.types";

const ORIGIN_STYLES: Record<TransactionOrigin, { pill: string; label: string }> = {
  ONE_TIME: { pill: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", label: ORIGIN_LABELS.ONE_TIME },
  INSTALLMENT: { pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", label: ORIGIN_LABELS.INSTALLMENT },
  RECURRING: { pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", label: ORIGIN_LABELS.RECURRING },
  INCOME: { pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", label: ORIGIN_LABELS.INCOME },
};

const TYPE_STYLES: Record<TransactionType, string> = {
  EXPENSE: "text-rose-600 dark:text-rose-400",
  INCOME: "text-emerald-600 dark:text-emerald-400",
};

export function createTransactionColumns(
  onEdit: (tx: Transaction) => void,
): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "transactionDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 size-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatShortDate(row.original.transactionDate)}
        </span>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium leading-snug">{row.original.description}</span>
          {row.original.paymentMethod && (
            <span className="text-xs text-muted-foreground">
              {row.original.paymentMethod.name}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Categoria",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.category?.name ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "origin",
      header: "Tipo",
      cell: ({ row }) => {
        const style = ORIGIN_STYLES[row.original.origin];
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              style.pill,
            )}
          >
            {style.label}
          </span>
        );
      },
    },
    {
      accessorKey: "amountCents",
      header: () => <div className="text-right">Valor</div>,
      cell: ({ row }) => {
        const { amountCents, type } = row.original;
        const prefix = type === "INCOME" ? "+" : "−";
        return (
          <div className={cn("text-right font-semibold tabular-nums", TYPE_STYLES[type])}>
            {prefix} {formatCentsToBRL(amountCents)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const isEditable = row.original.origin === "ONE_TIME" && row.original.type === "EXPENSE";
        if (!isEditable) return null;
        return (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(row.original)}
              aria-label="Editar transação"
            >
              <Pencil className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
