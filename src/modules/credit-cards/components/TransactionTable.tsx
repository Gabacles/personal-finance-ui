"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  formatCentsToBRL,
  formatShortDate,
} from "@/modules/dashboard/utils/formatters";
import type { StatementEntry, StatementEntryType } from "../types/credit-cards.types";

type TabKey = "all" | StatementEntryType;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "ONE_TIME", label: "À Vista" },
  { key: "INSTALLMENT", label: "Parceladas" },
  { key: "RECURRING", label: "Assinaturas" },
];

const TYPE_BADGE: Record<
  StatementEntryType,
  { label: (e: StatementEntry) => string; className: string }
> = {
  ONE_TIME: {
    label: () => "À Vista",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  INSTALLMENT: {
    label: (e) =>
      e.installmentNumber && e.totalInstallments
        ? `${e.installmentNumber}/${e.totalInstallments}x`
        : "Parcelado",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  RECURRING: {
    label: () => "Mensal",
    className:
      "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};

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

  const filtered =
    activeTab === "all"
      ? entries ?? []
      : (entries ?? []).filter((e) => e.type === activeTab);

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

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-6 pb-2 pt-4 font-medium">Data</th>
                <th className="px-2 pb-2 pt-4 font-medium">Descrição</th>
                <th className="px-2 pb-2 pt-4 font-medium">Categoria</th>
                <th className="px-2 pb-2 pt-4 font-medium">Tipo</th>
                <th className="px-6 pb-2 pt-4 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const badge = TYPE_BADGE[entry.type];
                return (
                  <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="whitespace-nowrap px-6 py-3">
                      {entry.referenceDate
                        ? formatShortDate(entry.referenceDate)
                        : "—"}
                    </td>
                    <td className="px-2 py-3 font-medium">{entry.description}</td>
                    <td className="px-2 py-3 text-muted-foreground">
                      {entry.category?.name ?? "—"}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                          badge.className,
                        )}
                      >
                        {badge.label(entry)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-semibold tabular-nums text-foreground">
                      {formatCentsToBRL(entry.amountCents)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma transação encontrada para este período.
          </p>
        )}
      </div>
    </div>
  );
}
