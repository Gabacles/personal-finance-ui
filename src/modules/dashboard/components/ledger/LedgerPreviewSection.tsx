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
    <section className="finance-surface overflow-hidden p-5 sm:p-6">
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
    </section>
  );
}
