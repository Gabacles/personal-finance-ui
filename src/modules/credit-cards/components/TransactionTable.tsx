"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PlusCircle } from "lucide-react";
import type { StatementEntry, StatementEntryType } from "../types/credit-cards.types";
import { transactionColumns } from "../columns/transaction.columns";

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
}

export function TransactionTable({
  entries,
  isLoading,
  onAddTransaction,
}: TransactionTableProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = useMemo(() => {
    const all = entries ?? [];
    return activeTab === "all" ? all : all.filter((e) => e.type === activeTab);
  }, [entries, activeTab]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <SectionHeader
          title="Transações do mês"
          description="Compras, parcelamentos e assinaturas"
          className="mb-0"
        />
        <Button size="sm" onClick={onAddTransaction}>
          <PlusCircle className="mr-1.5 size-4" />
          Adicionar
        </Button>
      </div>

      {/* Tabs */}
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
                ? "border border-b-transparent bg-card text-foreground border-border"
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
          columns={transactionColumns}
          data={filtered}
          emptyMessage="Nenhuma transação encontrada para este período."
        />
      )}
    </div>
  );
}
