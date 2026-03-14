"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";
import type { IncomeEntry } from "../types/income.types";

interface IncomeEntriesTableProps {
  entries: IncomeEntry[] | undefined;
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function IncomeEntriesTable({
  entries,
  isLoading,
  onDelete,
  isDeleting,
}: IncomeEntriesTableProps) {
  const columns: ColumnDef<IncomeEntry>[] = [
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatShortDate(row.getValue<string>("createdAt"))}
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
      accessorKey: "grossCents",
      header: "Bruto",
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums">
          {formatCentsToBRL(row.getValue<number>("grossCents"))}
        </span>
      ),
    },
    {
      accessorKey: "deductionCents",
      header: "Descontos",
      cell: ({ row }) => (
        <span className="whitespace-nowrap tabular-nums text-rose-600 dark:text-rose-400">
          {formatCentsToBRL(row.getValue<number>("deductionCents"))}
        </span>
      ),
    },
    {
      accessorKey: "netCents",
      header: "Líquido",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
          {formatCentsToBRL(row.getValue<number>("netCents"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    const confirmed = window.confirm("Deseja remover esta entrada de receita?");
                    if (confirmed) onDelete(entry.id);
                  }}
                >
                  <Trash2 className="mr-2 size-4" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <SectionHeader
          title="Entradas manuais no mês"
          description="Receitas lançadas diretamente via módulo de Income"
          className="mb-0"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3 p-6">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={entries ?? []}
          emptyMessage="Nenhuma entrada manual encontrada neste mês."
        />
      )}
    </div>
  );
}
