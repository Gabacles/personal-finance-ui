"use client";

import { SectionHeader } from "@/components/ui/section-header";
import type { Transaction } from "@/modules/dashboard/types/dashboard.types";
import { formatCentsToBRL, formatShortDate } from "@/modules/dashboard/utils/formatters";
import { cn } from "@/lib/utils";

interface LedgerPreviewSectionProps {
  entries: Transaction[];
}

export function LedgerPreviewSection({ entries }: LedgerPreviewSectionProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <SectionHeader
        title="Últimas movimentações"
        description="Extrato recente de transações"
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-2 font-medium">Data</th>
              <th className="pb-2 font-medium">Descrição</th>
              <th className="pb-2 font-medium">Categoria</th>
              <th className="pb-2 font-medium">Meio</th>
              <th className="pb-2 text-right font-medium">Valor</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b last:border-0">
                <td className="py-2.5 whitespace-nowrap">
                  {formatShortDate(entry.transactionDate)}
                </td>
                <td className="py-2.5">{entry.description}</td>
                <td className="py-2.5 text-muted-foreground">
                  {entry.category?.name ?? "—"}
                </td>
                <td className="py-2.5 text-muted-foreground">
                  {entry.paymentMethod?.name ?? "—"}
                </td>
                <td
                  className={cn(
                    "py-2.5 text-right font-medium whitespace-nowrap",
                    entry.type === "INCOME"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {entry.type === "INCOME" ? "+" : "−"}
                  {formatCentsToBRL(entry.amountCents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma movimentação encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
