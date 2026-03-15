"use client";

import { useCallback, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IncomeHeader } from "./IncomeHeader";
import { IncomeSummaryCards } from "./IncomeSummaryCards";
import { IncomeTransactionsTable } from "./IncomeTransactionsTable";
import { IncomeEntriesTable } from "./IncomeEntriesTable";
import { RecurringIncomeTable } from "./RecurringIncomeTable";
import { AddIncomeSheet } from "./modals/AddIncomeSheet";
import {
  useActivateRecurringIncome,
  useDeactivateRecurringIncome,
  useDeleteIncomeEntry,
  useDeleteRecurringIncome,
  useIncomeEntries,
  useIncomeSummary,
  useIncomeTransactions,
  useRecurringIncomeTemplates,
} from "../hooks/use-income";

function currentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function IncomeView() {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const summaryQuery = useIncomeSummary(selectedMonth);
  const transactionsQuery = useIncomeTransactions(selectedMonth);
  const incomeEntriesQuery = useIncomeEntries(selectedMonth);
  const recurringQuery = useRecurringIncomeTemplates();

  const deleteIncomeEntry = useDeleteIncomeEntry(selectedMonth);
  const deleteRecurringIncome = useDeleteRecurringIncome(selectedMonth);
  const activateRecurringIncome = useActivateRecurringIncome(selectedMonth);
  const deactivateRecurringIncome = useDeactivateRecurringIncome(selectedMonth);

  const isPageLoading =
    summaryQuery.isLoading ||
    transactionsQuery.isLoading ||
    incomeEntriesQuery.isLoading ||
    recurringQuery.isLoading;

  const isPageError =
    summaryQuery.isError ||
    transactionsQuery.isError ||
    incomeEntriesQuery.isError ||
    recurringQuery.isError;

  function refetchAll() {
    summaryQuery.refetch();
    transactionsQuery.refetch();
    incomeEntriesQuery.refetch();
    recurringQuery.refetch();
  }

  const handleDeleteIncomeEntry = useCallback((id: string) => {
    deleteIncomeEntry.mutate(
      { id },
      {
        onSuccess: () => toast.success("Entrada de receita removida."),
        onError: () => toast.error("Não foi possível remover a entrada."),
      },
    );
  }, [deleteIncomeEntry]);

  const handleDeleteRecurringIncome = useCallback((id: string) => {
    deleteRecurringIncome.mutate(
      { id },
      {
        onSuccess: () => toast.success("Receita recorrente removida."),
        onError: () => toast.error("Não foi possível remover a receita recorrente."),
      },
    );
  }, [deleteRecurringIncome]);

  const handleActivateRecurringIncome = useCallback((id: string) => {
    activateRecurringIncome.mutate(
      { id },
      {
        onSuccess: () => toast.success("Receita recorrente ativada."),
        onError: () => toast.error("Não foi possível ativar a receita recorrente."),
      },
    );
  }, [activateRecurringIncome]);

  const handleDeactivateRecurringIncome = useCallback((id: string) => {
    deactivateRecurringIncome.mutate(
      { id },
      {
        onSuccess: () => toast.success("Receita recorrente desativada."),
        onError: () => toast.error("Não foi possível desativar a receita recorrente."),
      },
    );
  }, [deactivateRecurringIncome]);

  if (isPageError) {
    return (
      <div className="finance-surface flex flex-col items-center justify-center gap-4 py-24">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar a tela de receitas.
        </p>
        <Button variant="outline" size="sm" className="border-border/70 bg-background/90" onClick={refetchAll}>
          <RefreshCw className="mr-2 size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <IncomeHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onAddIncome={() => setIsAddSheetOpen(true)}
      />

      <IncomeSummaryCards summary={summaryQuery.data} isLoading={isPageLoading || summaryQuery.isLoading} />

      <IncomeTransactionsTable
        entries={transactionsQuery.data}
        isLoading={isPageLoading || transactionsQuery.isLoading}
      />

      <IncomeEntriesTable
        entries={incomeEntriesQuery.data}
        isLoading={isPageLoading || incomeEntriesQuery.isLoading}
        onDelete={handleDeleteIncomeEntry}
        isDeleting={deleteIncomeEntry.isPending}
      />

      <RecurringIncomeTable
        entries={recurringQuery.data}
        isLoading={isPageLoading || recurringQuery.isLoading}
        isSubmitting={
          deleteRecurringIncome.isPending ||
          activateRecurringIncome.isPending ||
          deactivateRecurringIncome.isPending
        }
        onDelete={handleDeleteRecurringIncome}
        onActivate={handleActivateRecurringIncome}
        onDeactivate={handleDeactivateRecurringIncome}
      />

      <AddIncomeSheet
        open={isAddSheetOpen}
        onOpenChange={setIsAddSheetOpen}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
