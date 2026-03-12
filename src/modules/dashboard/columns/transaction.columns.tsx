import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";
import type { Transaction } from "../types/dashboard.types";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transactionDate",
    header: "Data",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {formatShortDate(row.getValue<string>("transactionDate"))}
      </span>
    ),
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
    id: "paymentMethod",
    header: "Meio",
    accessorFn: (row) => row.paymentMethod?.name ?? "—",
    cell: ({ getValue }) => (
      <span className="text-muted-foreground">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "amountCents",
    header: () => <span className="block text-right pr-4">Valor</span>,
    cell: ({ row }) => {
      const entry = row.original;
      return (
        <span
          className={cn(
            "block whitespace-nowrap text-right pr-4 font-semibold tabular-nums",
            entry.type === "INCOME"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {entry.type === "INCOME" ? "+" : "−"}
          {formatCentsToBRL(row.getValue<number>("amountCents"))}
        </span>
      );
    },
  },
];
