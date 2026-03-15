"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import type { StatementEntry, StatementEntryType } from "../types/credit-cards.types";
import { createTransactionColumns } from "../columns/transaction.columns";

type TabKey = "all" | StatementEntryType;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "ONE_TIME", label: "À Vista" },
  { key: "INSTALLMENT", label: "Parceladas" },
  { key: "RECURRING", label: "Assinaturas" },
];

interface TransactionTableProps {
  entries: StatementEntry[] | undefined;
  isLoading: boolean;
  onAddTransaction: () => void;
  onEditEntry: (entry: StatementEntry) => void;
}

export function TransactionTable({
  entries,
  isLoading,
  onAddTransaction,
  onEditEntry,
}: TransactionTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const allEntries = useMemo(() => entries ?? [], [entries]);

  const columns = useMemo(() => createTransactionColumns(onEditEntry), [onEditEntry]);
  const tabCounts = useMemo(() => {
    return {
      all: allEntries.length,
      ONE_TIME: allEntries.filter((entry) => entry.type === "ONE_TIME").length,
      INSTALLMENT: allEntries.filter((entry) => entry.type === "INSTALLMENT").length,
      RECURRING: allEntries.filter((entry) => entry.type === "RECURRING").length,
    };
  }, [allEntries]);

  const filtered = useMemo(() => {
    return activeTab === "all"
      ? allEntries
      : allEntries.filter((entry) => entry.type === activeTab);
  }, [allEntries, activeTab]);

  return (
    <section className="finance-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
        <SectionHeader
          title="Transações do mês"
          description="Compras, parcelamentos e assinaturas"
          className="mb-0"
        />
        <Button size="sm" onClick={onAddTransaction} className="shadow-sm">
          <PlusCircle className="mr-1.5 size-4" />
          Adicionar
        </Button>
      </div>

      {/* Tabs */}
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
          emptyMessage="Nenhuma transação encontrada para este período."
        />
      )}
    </section>
  );
}
