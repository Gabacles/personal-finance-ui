"use client";

import { useCallback, useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionsHeader } from "./TransactionsHeader";
import { TransactionMetrics } from "./TransactionMetrics";
import { TransactionCharts } from "./TransactionCharts";
import { TransactionTable } from "./TransactionTable";
import { AddExpenseSheet } from "./modals/AddExpenseSheet";
import { AddPaymentMethodSheet } from "./modals/AddPaymentMethodSheet";
import { EditTransactionSheet } from "./modals/EditTransactionSheet";
import { useTransactions, useTransactionsSummary } from "../hooks/use-transactions";
import type { Transaction } from "../types/transactions.types";

function currentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function TransactionsView() {
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddPaymentMethodOpen, setIsAddPaymentMethodOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const transactionsQuery = useTransactions(selectedMonth);
  const summaryQuery = useTransactionsSummary(selectedMonth);

  const isPageError = transactionsQuery.isError && summaryQuery.isError;

  function refetchAll() {
    transactionsQuery.refetch();
    summaryQuery.refetch();
  }

  const handleEditTransaction = useCallback((tx: Transaction) => {
    setEditingTransaction(tx);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditingTransaction(null);
  }, []);

  if (isPageError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="size-10 text-destructive/70" />
        <div className="space-y-1">
          <p className="font-semibold">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground">
            Não foi possível buscar as transações. Verifique sua conexão e tente novamente.
          </p>
        </div>
        <Button variant="outline" onClick={refetchAll}>
          <RefreshCw className="mr-2 size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <>
      <TransactionsHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onAddExpense={() => setIsAddExpenseOpen(true)}
        onAddPaymentMethod={() => setIsAddPaymentMethodOpen(true)}
      />

      <TransactionMetrics
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
      />

      <TransactionCharts
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
      />

      <TransactionTable
        transactions={transactionsQuery.data}
        isLoading={transactionsQuery.isLoading}
        onAddTransaction={() => setIsAddExpenseOpen(true)}
        onEditTransaction={handleEditTransaction}
      />

      <AddExpenseSheet
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        selectedMonth={selectedMonth}
      />

      <AddPaymentMethodSheet
        open={isAddPaymentMethodOpen}
        onOpenChange={setIsAddPaymentMethodOpen}
      />

      <EditTransactionSheet
        open={editingTransaction !== null}
        onOpenChange={(open) => { if (!open) handleCloseEdit(); }}
        transaction={editingTransaction}
        selectedMonth={selectedMonth}
      />
    </>
  );
}
