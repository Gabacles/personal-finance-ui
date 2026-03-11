import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  formatCentsToBRL,
  formatShortDate,
} from "@/modules/dashboard/utils/formatters";
import type { StatementEntry, StatementEntryType } from "../types/credit-cards.types";

const TYPE_BADGE: Record<
  StatementEntryType,
  { label: (e: StatementEntry) => string; className: string }
> = {
  ONE_TIME: {
    label: () => "À Vista",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  INSTALLMENT: {
    label: (e) =>
      e.installmentNumber && e.totalInstallments
        ? `${e.installmentNumber}/${e.totalInstallments}x`
        : "Parcelado",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  RECURRING: {
    label: () => "Mensal",
    className: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};

export function createTransactionColumns(
  onEdit: (entry: StatementEntry) => void,
): ColumnDef<StatementEntry>[] {
  return [
    {
      accessorKey: "referenceDate",
      header: "Data",
      cell: ({ row }) => {
        const date = row.getValue<string>("referenceDate");
        return (
          <span className="whitespace-nowrap">
            {date ? formatShortDate(date) : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue<string>("description")}</span>
      ),
    },
    {
      id: "category",
      header: "Categoria",
      accessorFn: (row) => row.category?.name ?? "—",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const entry = row.original;
        const badge = TYPE_BADGE[entry.type];
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              badge.className,
            )}
          >
            {badge.label(entry)}
          </span>
        );
      },
    },
    {
      accessorKey: "amountCents",
      header: () => <span className="block text-right pr-4">Valor</span>,
      cell: ({ row }) => (
        <span className="block whitespace-nowrap text-right pr-4 font-semibold tabular-nums text-foreground">
          {formatCentsToBRL(row.getValue<number>("amountCents"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Editar</span>
          </Button>
        </div>
      ),
    },
  ];
}
