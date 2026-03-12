"use client";

import { SectionHeader } from "@/components/ui/section-header";
import { DataTable } from "@/components/ui/data-table";
import type { Transaction } from "@/modules/dashboard/types/dashboard.types";
import { transactionColumns } from "@/modules/dashboard/columns/transaction.columns";

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
      <DataTable
        columns={transactionColumns}
        data={entries}
        emptyMessage="Nenhuma movimentação encontrada."
        className="mt-4"
      />
    </div>
  );
}
