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

  const allEntries = useMemo(() => entries ?? [], [entries]);
  const tabCounts = useMemo(() => ({
    all: allEntries.length,
    INCOME: allEntries.filter((e) => e.origin === "INCOME").length,
    RECURRING: allEntries.filter((e) => e.origin === "RECURRING").length,
  }), [allEntries]);

  const filtered = useMemo(() => {
    return activeTab === "all" ? allEntries : allEntries.filter((entry) => entry.origin === activeTab);
  }, [allEntries, activeTab]);

  return (
    <section className="finance-surface overflow-hidden">
      <div className="border-b border-border/70 px-5 py-4 sm:px-6">
        <SectionHeader
          title="Recebidas no mês"
          description="Movimentações de receita materializadas no período"
          className="mb-0"
        />
      </div>

      <div role="tablist" className="flex flex-wrap gap-1.5 border-b border-border/70 bg-muted/20 px-4 py-3 sm:px-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.key
                ? "border-border bg-card text-foreground shadow-sm"
                : "border-transparent bg-transparent text-muted-foreground hover:border-border/60 hover:bg-card/60 hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] leading-none",
                activeTab === tab.key
                  ? "bg-primary/12 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {tabCounts[tab.key]}
            </span>
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
    </section>
  );
}
