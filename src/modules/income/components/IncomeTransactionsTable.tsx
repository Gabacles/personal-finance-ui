"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { IncomeTransaction } from "../types/income.types";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";

type TabKey = "all" | "INCOME" | "RECURRING";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "INCOME", label: "Manuais" },
  { key: "RECURRING", label: "Recorrentes" },
];

const columns: ColumnDef<IncomeTransaction>[] = [
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
    accessorKey: "categoryName",
    header: "Categoria",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue<string>("categoryName") || "—"}</span>
    ),
  },
  {
    accessorKey: "origin",
    header: "Origem",
    cell: ({ row }) => {
      const origin = row.getValue<IncomeTransaction["origin"]>("origin");
      const label = origin === "RECURRING" ? "Recorrente" : origin === "INCOME" ? "Manual" : "Outro";

      return (
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "amountCents",
    header: () => <span className="block text-right pr-4">Valor</span>,
    cell: ({ row }) => (
      <span className="block whitespace-nowrap text-right pr-4 font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
        +{formatCentsToBRL(row.getValue<number>("amountCents"))}
      </span>
    ),
  },
];

interface IncomeTransactionsTableProps {
  entries: IncomeTransaction[] | undefined;
  isLoading: boolean;
}

export function IncomeTransactionsTable({ entries, isLoading }: IncomeTransactionsTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    const all = entries ?? [];
    return activeTab === "all" ? all : all.filter((entry) => entry.origin === activeTab);
  }, [entries, activeTab]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="border-b px-6 py-4">
        <SectionHeader
          title="Recebidas no mês"
          description="Movimentações de receita materializadas no período"
          className="mb-0"
        />
      </div>

      <div role="tablist" className="flex gap-1 border-b px-6 pt-3 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "-mb-px cursor-pointer rounded-t-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.key
                ? "border border-b-transparent border-border bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
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
          data={filtered}
          emptyMessage="Nenhuma receita encontrada para este período."
        />
      )}
    </div>
  );
}
