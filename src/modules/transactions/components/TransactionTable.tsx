"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createTransactionColumns } from "../columns/transaction.columns";
import type { Transaction, TransactionOrigin } from "../types/transactions.types";

type TabKey = "all" | TransactionOrigin;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "ONE_TIME", label: "Avulsas" },
  { key: "INSTALLMENT", label: "Parceladas" },
  { key: "RECURRING", label: "Recorrentes" },
];

interface TransactionTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  onAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  onAddTransaction,
  onEditTransaction,
}: TransactionTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const all = useMemo(() => transactions ?? [], [transactions]);

  const columns = useMemo(
    () => createTransactionColumns(onEditTransaction),
    [onEditTransaction],
  );

  const tabCounts = useMemo(
    () => ({
      all: all.length,
      ONE_TIME: all.filter((t) => t.origin === "ONE_TIME").length,
      INSTALLMENT: all.filter((t) => t.origin === "INSTALLMENT").length,
      RECURRING: all.filter((t) => t.origin === "RECURRING").length,
      INCOME: all.filter((t) => t.origin === "INCOME").length,
    }),
    [all],
  );

  const filtered = useMemo(
    () => (activeTab === "all" ? all : all.filter((t) => t.origin === activeTab)),
    [all, activeTab],
  );

  return (
    <section className="finance-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6">
        <SectionHeader
          title="Transações do mês"
          description="Despesas, receitas e lançamentos"
          className="mb-0"
        />
        <Button size="sm" onClick={onAddTransaction} className="shadow-sm">
          <PlusCircle className="mr-1.5 size-4" />
          Nova despesa
        </Button>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        className="flex flex-wrap gap-1.5 border-b border-border/70 bg-muted/20 px-4 py-3 sm:px-6"
      >
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
                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {tabCounts[tab.key as keyof typeof tabCounts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="Nenhuma transação encontrada para este período."
            initialPageSize={20}
          />
        )}
      </div>
    </section>
  );
}
