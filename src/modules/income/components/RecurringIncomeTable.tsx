"use client";

import { MoreVertical, PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCentsToBRL } from "@/modules/dashboard/utils/formatters";
import type { RecurringIncomeTemplate } from "../types/income.types";

function formatRange(startMonth: string, endMonth: string | null) {
  if (!startMonth) return "—";
  return endMonth ? `${startMonth} até ${endMonth}` : `${startMonth} em diante`;
}

interface RecurringIncomeTableProps {
  entries: RecurringIncomeTemplate[] | undefined;
  isLoading: boolean;
  isSubmitting: boolean;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RecurringIncomeTable({
  entries,
  isLoading,
  isSubmitting,
  onActivate,
  onDeactivate,
  onDelete,
}: RecurringIncomeTableProps) {
  const columns: ColumnDef<RecurringIncomeTemplate>[] = [
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
        <span className="finance-value-negative whitespace-nowrap tabular-nums">
          {formatCentsToBRL(row.getValue<number>("deductionCents"))}
        </span>
      ),
    },
    {
      accessorKey: "netCents",
      header: "Líquido",
      cell: ({ row }) => (
        <span className="finance-value-positive whitespace-nowrap font-semibold tabular-nums">
          +{formatCentsToBRL(row.getValue<number>("netCents"))}
        </span>
      ),
    },
    {
      id: "period",
      header: "Período",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatRange(row.original.startMonth, row.original.endMonth)}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue<boolean>("isActive");
        return (
          <span className={active ? "finance-pill-positive" : "finance-pill-neutral"}>
            {active ? "Ativa" : "Inativa"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const recurring = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {recurring.isActive ? (
                  <DropdownMenuItem
                    disabled={isSubmitting}
                    onClick={() => onDeactivate(recurring.id)}
                  >
                    <PauseCircle className="mr-2 size-4" />
                    Desativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    disabled={isSubmitting}
                    onClick={() => onActivate(recurring.id)}
                  >
                    <PlayCircle className="mr-2 size-4" />
                    Ativar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isSubmitting}
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    const confirmed = window.confirm("Deseja remover esta receita recorrente?");
                    if (confirmed) onDelete(recurring.id);
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
    <section className="finance-surface overflow-hidden">
      <div className="border-b border-border/70 px-5 py-4 sm:px-6">
        <SectionHeader
          title="Receitas recorrentes"
          description="Modelos de receita com geração mensal automática"
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
          emptyMessage="Nenhuma receita recorrente cadastrada."
        />
      )}
    </section>
  );
}
